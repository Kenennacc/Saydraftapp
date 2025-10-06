"use client";
import { formatApiError } from "@/misc/errors";
import { ForgotPassword, forgotPassword, login, Login } from "@/services/auth";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Link } from "@heroui/link";
import { Modal, ModalContent, ModalHeader } from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import { Eye, EyeClosed } from "lucide-react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as yup from "yup";
import BaseForm from "./BaseForm";
import FormInput from "./FormInput";

const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Must be a valid email address"),
});

const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Must be a valid email address"),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at most 32 characters")
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/, {
      message: "Password must include uppercase, lowercase, and a number",
    }),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [openForgotPasswordModal, setOpenForgotPasswordModal] = useState(false);
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: Login) => {
      return login(data);
    },
    onSuccess() {
      router.push("/chat");
    },
    onError(err) {
      const message = formatApiError(err as Error);
      addToast({
        description: message,
        color: "danger",
      });
    },
  });

  const {
    mutateAsync: forgotPasswordMutateAsync,
    isPending: isForgotPasswordPending,
  } = useMutation({
    mutationFn: (data: ForgotPassword) => {
      return forgotPassword(data.email);
    },
  });

  return (
    <BaseForm
      title={"Welcome Back"}
      description={"Let's draft contracts"}
      footer={
        <>
          <p className="text-center">Don't have an account?</p>
          <Link href="/auth/register" as={NextLink}>
            Register
          </Link>
        </>
      }
    >
      <Formik
        onSubmit={async (values) => {
          mutate(values);
        }}
        validateOnMount={false}
        validateOnChange={true}
        validationSchema={loginSchema}
        initialValues={{ email: "", password: "" }}
      >
        {({ errors, handleSubmit, touched, getFieldProps }) => (
          <Form onSubmit={handleSubmit}>
            <div className="flex flex-col w-full gap-3">
              <FormInput
                isRequired
                errorMessage={errors.email}
                isInvalid={touched.email && !!errors.email}
                label="Email"
                labelPlacement="inside"
                placeholder="johndoe@example.com"
                type="email"
                {...getFieldProps("email")}
              />
              <FormInput
                isRequired
                errorMessage={errors.email}
                label="Password"
                labelPlacement="inside"
                placeholder="********"
                isInvalid={touched.password && !!errors.password}
                type={showPassword ? "text" : "password"}
                {...getFieldProps("password")}
                endContent={
                  <Button
                    variant="light"
                    size="sm"
                    className="p-0 w-0"
                    onPress={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <Eye width={16} height={16} />
                    ) : (
                      <EyeClosed width={16} height={16} />
                    )}
                  </Button>
                }
              />
            </div>
            <div className="w-full text-right">
              <Button
                type="button"
                variant="light"
                disableAnimation
                disableRipple
                onPress={() => {
                  setOpenForgotPasswordModal(true);
                }}
                className="text-primary text-right"
              >
                Forgot password
              </Button>
            </div>
            <Button
              isLoading={isPending}
              type="submit"
              size="lg"
              fullWidth
              className="bg-primary mt-3"
            >
              Continue
            </Button>
          </Form>
        )}
      </Formik>
      <Modal
        backdrop="blur"
        placement="bottom-center"
        onClose={() => setOpenForgotPasswordModal(false)}
        isOpen={openForgotPasswordModal}
      >
        <ModalContent>
          <ModalHeader>
            <div className="py-2"></div>
          </ModalHeader>
          <BaseForm
            title={"Forgot your password?"}
            description={
              "Enter your account email to receive a password reset link"
            }
            hideLogo
          >
            <Formik
              onSubmit={async (values) => {
                try {
                  await forgotPasswordMutateAsync(values);
                  router.push(`/auth/forgot-password?email=${values.email}`);
                } catch (err) {
                  const message = formatApiError(err as Error);
                  addToast({
                    description: message,
                    color: "danger",
                  });
                }
              }}
              validateOnMount={false}
              validateOnChange={true}
              validationSchema={forgotPasswordSchema}
              initialValues={{ email: "" }}
            >
              {({ errors, handleSubmit, touched, getFieldProps }) => (
                <Form onSubmit={handleSubmit}>
                  <div className="flex flex-col w-full gap-3">
                    <FormInput
                      isRequired
                      errorMessage={errors.email}
                      isInvalid={touched.email && !!errors.email}
                      label="Email"
                      labelPlacement="inside"
                      placeholder="johndoe@example.com"
                      type="email"
                      {...getFieldProps("email")}
                    />
                  </div>
                  <Button
                    isLoading={isForgotPasswordPending}
                    type="submit"
                    size="lg"
                    fullWidth
                    className="bg-primary mt-3"
                  >
                    Continue
                  </Button>
                </Form>
              )}
            </Formik>
          </BaseForm>
          <div className="py-2"></div>
        </ModalContent>
      </Modal>
    </BaseForm>
  );
}
