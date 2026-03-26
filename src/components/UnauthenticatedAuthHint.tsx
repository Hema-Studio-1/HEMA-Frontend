"use client";

import {
  AUTH_DIAG_AUTO_STORAGE_KEY,
  clearAuthDiagAutoHandled,
  useAuthFailure,
} from "@/contexts/AuthFailureContext";
import { useSessionAuthDisplay } from "@/contexts/SessionAuthDisplayContext";
import { ENV_VARIABLES } from "@/lib/env-variables";
import { getSession, useSession } from "next-auth/react";
import { useEffect } from "react";

const DELAY_MS = 4500;

/**
 * "Auth Failed" in the header only means `unauthenticated` — no dialog was tied to that.
 * After a short delay (so demo sign-in retries can finish), if still no session, open
 * deployment diagnostics once per tab until the user signs in successfully.
 */
export function UnauthenticatedAuthHint() {
  const { status } = useSession();
  const { openAuthFailureWithDeploymentCheck } = useAuthFailure();
  const { authStabilizing } = useSessionAuthDisplay();

  useEffect(() => {
    if (status === "authenticated") {
      clearAuthDiagAutoHandled();
    }
  }, [status]);

  useEffect(() => {
    if (status !== "unauthenticated" || authStabilizing) return;

    const timer = window.setTimeout(() => {
      void (async () => {
        const session = await getSession();
        if (session) return;
        try {
          if (sessionStorage.getItem(AUTH_DIAG_AUTO_STORAGE_KEY)) return;
        } catch {
          return;
        }

        const hasDemo =
          Boolean(ENV_VARIABLES.DEMO_EMAIL) &&
          Boolean(ENV_VARIABLES.DEMO_PASSWORD);

        if (!hasDemo) {
          await openAuthFailureWithDeploymentCheck({
            title: "Not signed in (no demo session)",
            message:
              "The header shows “Auth Failed” because NextAuth has no session. Demo auto-login is disabled: NEXT_PUBLIC_DEMO_EMAIL and/or NEXT_PUBLIC_DEMO_PASSWORD are not set in this environment. Add them in Vercel/Netlify, or sign in another way once you add a login UI.",
          });
          return;
        }

        await openAuthFailureWithDeploymentCheck({
          title: "Not signed in after login attempt",
          message:
            "Demo credentials are configured but there is still no session. Usually the server cannot reach your API from the host (API_URL), or NEXTAUTH_SECRET / NEXTAUTH_URL are wrong for production. Technical details include a live probe from this deployment to your API.",
        });
      })();
    }, DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [status, authStabilizing, openAuthFailureWithDeploymentCheck]);

  return null;
}
