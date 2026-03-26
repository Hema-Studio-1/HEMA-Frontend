"use client";

import { AuthErrorParamsListener } from "@/components/AuthErrorParamsListener";
import { SessionLoaderOverlay } from "@/components/SessionLoaderOverlay";
import { UnauthenticatedAuthHint } from "@/components/UnauthenticatedAuthHint";
import { AuthFailureProvider } from "@/contexts/AuthFailureContext";
import { SessionAuthDisplayProvider } from "@/contexts/SessionAuthDisplayContext";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { Suspense } from "react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <AuthFailureProvider>
        <SessionAuthDisplayProvider>
          <Suspense fallback={null}>
            <AuthErrorParamsListener />
          </Suspense>
          <UnauthenticatedAuthHint />
          <SessionLoaderOverlay />
          {children}
        </SessionAuthDisplayProvider>
      </AuthFailureProvider>
    </NextAuthSessionProvider>
  );
}
