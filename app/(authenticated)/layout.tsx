"use client";

import UserProvider from "@/providers/User";
import { ReactNode } from "react";

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <UserProvider>{children}</UserProvider>;
}
