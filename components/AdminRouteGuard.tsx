"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAdminAccess from "@/hooks/useAdminAccess";

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

/**
 * AdminRouteGuard - Protects admin routes at the component level
 * This component should be used to wrap admin pages/routes
 * It will redirect non-admin users away from admin areas
 */
export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { canAccessAdmin, isLoading } = useAdminAccess();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're not loading and user doesn't have admin access
    if (!isLoading && !canAccessAdmin) {
      router.replace("/chat");
    }
  }, [canAccessAdmin, isLoading, router]);

  // Don't render anything while checking permissions
  if (isLoading) {
    return null;
  }

  // Don't render admin content if user doesn't have access
  if (!canAccessAdmin) {
    return null;
  }

  return <>{children}</>;
}
