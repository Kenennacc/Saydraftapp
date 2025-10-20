"use client";

import celebrationAnimation from "@/lotties/celebration.json";
import emailAnimation from "@/lotties/email.json";
import { formatApiError } from "@/misc/errors";
import {
  logout,
  resendVerificationLink,
  ResendVerificationLink,
  verifyEmail,
} from "@/services/auth";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import EmailLink from "./EmailLink";

export default function Verify() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const { isLoading, isSuccess, error } = useQuery({
    queryKey: ["verification"],
    retry: 0,
    enabled: !!token,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retryOnMount: false,
    queryFn: () => {
      if (!token) return;
      return verifyEmail(token);
    },
  });

  const email = "d3w71s226f@vwhins.com";

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ResendVerificationLink) => {
      return resendVerificationLink(data.email);
    },
    onSuccess() {
      addToast({
        description: "Verification link sent",
        color: "success",
      });
    },
    onError(err) {
      const message = formatApiError(err as Error);

      addToast({
        description: message,
        color: "danger",
      });
      if (/has already been verified/.test(message)) router.replace("/");
    },
  });

  const { mutate: logoutMutation, isPending: isLoggingOut } = useMutation({
    mutationFn: () => logout(),
    onSuccess() {
      addToast({
        description: "Logged out successfully",
        color: "success",
      });
      router.push("/auth/login");
    },
    onError(err) {
      const message = formatApiError(err as Error);
      addToast({
        description: message,
        color: "danger",
      });
    },
  });

  const isVerified = !!token && isSuccess;

  const resendEmail = () => {
    if (!email) return;
    mutate({ email });
  };

  const handleLogout = () => {
    logoutMutation();
  };

  useEffect(() => {
    if (error) {
      const message = formatApiError(error);
      addToast({
        description: message,
        color: "danger",
      });
      if (/has already been verified/.test(message)) router.replace("/");
    }
  }, [error]);

  if (isLoading)
    return (
      <div className="w-full h-full min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );

  return (
    <EmailLink
      title={isVerified ? "Your Email Has Been Verified" : "Verify your email"}
      description={
        isVerified
          ? "Thank you for confirming your email address. Your account is now fully activated and ready to use."
          : "We've sent an email to your inbox. Continue account creation using the link via email."
      }
      onButtonPress={
        isVerified
          ? () => {
              router.push("/chat");
            }
          : resendEmail
      }
      isButtonLoading={isPending}
      buttonText={isVerified ? "Go home" : "Resend email"}
      lottie={isVerified ? celebrationAnimation : emailAnimation}
      secondaryButtonText="Logout"
      isSecondaryButtonLoading={isLoggingOut}
      onSecondaryButtonPress={handleLogout}
    />
  );
}
