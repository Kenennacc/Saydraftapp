"use client";
import PageSpinner from "@/components/PageSpinner";
import useUser from "@/hooks/useUser";
import { User } from "@/services/auth";
import { usePathname, useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect } from "react";

const UserContext = createContext<User | null>(null);

type Props = {
  children: ReactNode;
};

export default function UserProvider({ children }: Props) {
  const { data, error, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (error || (!isLoading && !data)) router.replace("/auth/login");
    if (data?.isVerified && pathname === "/auth/verification")
      return router.replace("/chat");
    if (data && !data.isVerified && pathname !== "/auth/verification")
      return router.replace("/auth/verification");
  }, [data, isLoading, error]);

  if (isLoading)
    return (
      <section className="w-full h-screen">
        <PageSpinner />
      </section>
    );

  if (
    error ||
    (data?.isVerified && pathname === "/auth/verification") ||
    (!data?.isVerified && pathname !== "/auth/verification")
  )
    return null;

  return (
    <UserContext.Provider value={data ?? null}>{children}</UserContext.Provider>
  );
}

export const useUserInContext = () => {
  const user = useContext(UserContext);
  return user!;
};
