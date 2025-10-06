"use client";
import EmailLink from "@/components/EmailLink";
import lockAnimation from "@/lotties/lock.json";
import { formatApiError } from "@/misc/errors";
import {
  forgotPassword,
  ForgotPassword as IForgotPassword,
} from "@/services/auth";
import { addToast } from "@heroui/toast";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export default function ForgotPassword() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: IForgotPassword) => {
      return forgotPassword(data.email);
    },
  });

  return (
    <main className="flex w-full min-h-screen items-start justify-center">
      <EmailLink
        title="Forgot your password?"
        description={
          <p className="mt-4 opacity-75 text-center md:max-w-lg">
            We’ve sent a password reset link to your email. Please check your
            inbox and click the link to reset your password.
          </p>
        }
        onButtonPress={async () => {
          if (!email) return;
          try {
            await mutateAsync({ email });
            addToast({
              description: "Verification link sent",
              color: "success",
            });
          } catch (err) {
            const message = formatApiError(err as Error);
            addToast({
              description: message,
              color: "danger",
            });
          }
        }}
        isButtonLoading={isPending}
        buttonText="Resend email"
        lottie={lockAnimation}
      />
    </main>
  );
}
