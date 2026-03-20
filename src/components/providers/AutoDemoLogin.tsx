"use client";

import { ENV_VARIABLES } from "@/lib/env-variables";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

/**
 * MVP helper: perform one silent demo login attempt.
 * Uses NextAuth session flow with redirect disabled to avoid callbackUrl loops.
 */
export function AutoDemoLogin() {
  const attemptedRef = useRef(false);
  const { status } = useSession();
  const hasForcedToken = Boolean(ENV_VARIABLES.FORCE_ACCESS_TOKEN);

  useEffect(() => {
    if (hasForcedToken) return;
    if (attemptedRef.current) return;
    if (status !== "unauthenticated") return;

    const email = ENV_VARIABLES.DEMO_EMAIL;
    const password = ENV_VARIABLES.DEMO_PASSWORD;
    if (!email || !password) return;

    attemptedRef.current = true;
    void signIn("credentials", {
      redirect: false,
      email,
      password,
    });
  }, [status, hasForcedToken]);

  return null;
}

