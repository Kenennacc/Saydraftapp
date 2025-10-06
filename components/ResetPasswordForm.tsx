"use client";
import { formatApiError } from "@/misc/errors";
import { ResetPassword, resetPassword } from "@/services/auth";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { addToast } from "@heroui/toast";
import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as yup from "yup";
import BaseForm from "./BaseForm";
import FormInput from "./FormInput";

export const passwordResetSchema = yup.object({
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

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const { isPending, mutate } = useMutation({
    mutationFn: (data: ResetPassword) => {
      return resetPassword(data.token, data.password);
    },
    onSuccess() {
      router.replace("/auth/login");
    },
    onError(err) {
      const message = formatApiError(err as Error);
      addToast({
        description: message,
        color: "danger",
      });
    },
  });

  useEffect(() => {
    if (!token) router.replace("/auth/login");
  }, [token]);

  return (
    <BaseForm
      title={"Reset your password"}
      description={
        "Enter your new password below to complete the password reset process"
      }
    >
      <Formik
        onSubmit={(values) => {
          if (!token) return;
          mutate({ token, password: values.password });
        }}
        validationSchema={passwordResetSchema}
        validateOnMount={false}
        validateOnChange={true}
        initialValues={{
          password: "",
          confirmPassword: "",
        }}
      >
        {({ errors, touched, getFieldProps, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <div className="flex  flex-col w-full gap-4">
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
                    type="submit"
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
