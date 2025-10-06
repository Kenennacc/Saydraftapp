"use client";

import useUser from "@/hooks/useUser";
import { Spinner } from "@heroui/spinner";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function UnauthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { data, error, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    console.log("Data: ", data, !error);
    if (data && !!!error) {
      router.replace("/chat");
    }
  }, [data]);

  if (isLoading)
    return (
      <section className="w-full h-full min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </section>
    );

  if (!data || error) return children;
}
