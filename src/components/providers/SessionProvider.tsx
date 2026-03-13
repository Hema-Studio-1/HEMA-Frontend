"use client";

import { AutoDemoLogin } from "@/components/providers/AutoDemoLogin";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <AutoDemoLogin />
      {children}
    </NextAuthSessionProvider>
  );
}
