"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAdminAccess from "@/hooks/useAdminAccess";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, isVerified, isLoading } = useAdminAccess();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we have user data and they don't have admin access
    if (!isLoading && user && (!isAdmin || !isVerified)) {
      router.push("/chat");
    }
  }, [user, isAdmin, isVerified, isLoading, router]);

  // Show loading state while checking admin access
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading...</p>
        </div>
      </div>
    );
  }

  // If user doesn't have admin access, don't render anything (redirect will happen)
  if (!isAdmin || !isVerified) {
    return null;
  }

  // User has admin access - render the admin content
  return <>{children}</>;
}
