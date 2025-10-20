"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { ShieldXIcon, ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { useUserInContext } from "@/providers/User";

interface NonAdminGuardProps {
  children: ReactNode;
}

export default function NonAdminGuard({ children }: NonAdminGuardProps) {
  const user = useUserInContext();
  const router = useRouter();

  // If user is admin, show access denied message
  if (user?.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md">
          <CardBody className="text-center space-y-4">
            <ShieldXIcon className="w-16 h-16 text-warning mx-auto" />
            <h2 className="text-2xl font-bold text-warning">Admin Access</h2>
            <p className="text-foreground/70">
              Subscription features are not available for admin users. 
              You have unlimited access to all features.
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

  // User is not admin, show the protected content
  return <>{children}</>;
}
