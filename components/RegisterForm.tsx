"use client";
import { formatApiError } from "@/misc/errors";
import { Register, register } from "@/services/auth";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Link } from "@heroui/link";
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

export const registerSchema = yup.object({
  firstname: yup
    .string()
    .trim()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters"),

  lastname: yup
    .string()
    .trim()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters"),

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

  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: Register) => {
      return register(data);
    },
    onSuccess() {
      router.replace("/auth/login");
    },
    onError(err) {
      const message = formatApiError(err);
      addToast({
        description: message,
        color: "danger",
      });
    },
  });

  const router = useRouter();

  return (
    <BaseForm
      title={"Create An Account"}
      description={"Let's draft contracts"}
      footer={
        <>
          <p className="text-center">Have an account?</p>
          <Link href="/auth/login" as={NextLink}>
            Login
          </Link>
        </>
      }
    >
      <Formik
        onSubmit={(values) => {
          mutate(values);
        }}
        validationSchema={registerSchema}
        validateOnMount={false}
        validateOnChange={true}
        initialValues={{
          firstname: "",
          lastname: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
      >
        {({ errors, touched, getFieldProps, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <div className="flex  flex-col w-full gap-4">
              <FormInput
                isRequired
                errorMessage={errors.firstname}
                label="Firstname"
                isInvalid={touched.firstname && !!errors.firstname}
                labelPlacement="inside"
                placeholder="John"
                {...getFieldProps("firstname")}
              />
              <FormInput
                isRequired
                errorMessage={errors.lastname}
                label="Lastname"
                isInvalid={touched.lastname && !!errors.lastname}
                labelPlacement="inside"
                placeholder="Doe"
                {...getFieldProps("lastname")}
              />
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
                errorMessage={errors.password}
                isInvalid={touched.password && !!errors.password}
                label="Password"
                labelPlacement="inside"
                placeholder="********"
                type={showPassword ? "text" : "password"}
                {...getFieldProps("password")}
                endContent={
                  <Button
                    variant="light"
                    size="sm"
                    type="button"
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
              <FormInput
                isRequired
                errorMessage={errors.confirmPassword}
                isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                label="Confirm Password"
                labelPlacement="inside"
                placeholder="********"
                type={showPassword ? "text" : "password"}
                {...getFieldProps("confirmPassword")}
              />
            </div>
            <Button
              type="submit"
              isLoading={isPending}
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
  );
}
