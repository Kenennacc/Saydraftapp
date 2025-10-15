"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { ShieldXIcon, LockIcon, ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import useAdminAccess from "@/hooks/useAdminAccess";

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, isAdmin, isVerified, canAccessAdmin, isLoading } = useAdminAccess();
  const router = useRouter();

  // Show loading state while user data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is verified
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md">
          <CardBody className="text-center space-y-4">
            <LockIcon className="w-16 h-16 text-warning mx-auto" />
            <h2 className="text-2xl font-bold text-warning">Email Verification Required</h2>
            <p className="text-foreground/70">
              Please verify your email address before accessing the admin dashboard.
            </p>
            <Button
              color="primary"
              onPress={() => router.push("/auth/verification")}
            >
              Verify Email
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Check if user has admin role
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md">
          <CardBody className="text-center space-y-4">
            <ShieldXIcon className="w-16 h-16 text-danger mx-auto" />
            <h2 className="text-2xl font-bold text-danger">Access Denied</h2>
            <p className="text-foreground/70">
              You don't have permission to access the admin dashboard. 
              Admin privileges are required.
            </p>
            <div className="flex flex-col gap-2">
              <Button
                color="primary"
                onPress={() => router.push("/chat")}
                startContent={<ArrowLeftIcon className="w-4 h-4" />}
              >
                Go to Chat
              </Button>
              <Button
                variant="light"
                onPress={() => router.back()}
              >
                Go Back
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // User is verified and has admin role - allow access
  return <>{children}</>;
}
