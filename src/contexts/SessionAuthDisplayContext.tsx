"use client";

import { useAuthFailure } from "@/contexts/AuthFailureContext";
import { ENV_VARIABLES } from "@/lib/env-variables";
import { getSession, signIn, useSession } from "next-auth/react";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const MAX_SIGNIN_ATTEMPTS = 3;
const RETRY_DELAY_MS = 2000;

type SessionAuthDisplayValue = {
  /**
   * While true, the navbar and overlay should show “connecting”, not “Auth Failed”,
   * while demo sign-in retries after flaky API / first-attempt failures.
   */
  authStabilizing: boolean;
};

const SessionAuthDisplayContext = createContext<SessionAuthDisplayValue>({
  authStabilizing: false,
});

/**
 * Wraps demo auto-login with multiple sign-in attempts so transient API failures
 * do not flash “Auth Failed” before a later successful attempt.
 */
export function SessionAuthDisplayProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [authStabilizing, setAuthStabilizing] = useState(false);
  const { status } = useSession();
  const { openAuthFailureWithDeploymentCheck } = useAuthFailure();
  const runIdRef = useRef(0);

  useEffect(() => {
    if (status === "authenticated") {
      setAuthStabilizing(false);
    }
  }, [status]);

  useEffect(() => {
    const email = ENV_VARIABLES.DEMO_EMAIL;
    const password = ENV_VARIABLES.DEMO_PASSWORD;
    if (!email || !password) {
      return;
    }
    if (status !== "unauthenticated") {
      return;
    }

    const runId = ++runIdRef.current;
    let cancelled = false;

    setAuthStabilizing(true);

    void (async () => {
      let lastError: string | undefined;

      for (let i = 0; i < MAX_SIGNIN_ATTEMPTS; i++) {
        if (cancelled || runId !== runIdRef.current) {
          return;
        }

        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });
        lastError = result?.error ?? undefined;

        if (!result?.error) {
          const session = await getSession();
          if (session) {
            setAuthStabilizing(false);
            return;
          }
        }

        if (i < MAX_SIGNIN_ATTEMPTS - 1) {
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        }
      }

      if (cancelled || runId !== runIdRef.current) {
        return;
      }

      setAuthStabilizing(false);

      const finalSession = await getSession();
      if (!finalSession) {
        await openAuthFailureWithDeploymentCheck({
          title: "Demo sign-in failed",
          message: lastError
            ? `NextAuth returned “${lastError}” after ${MAX_SIGNIN_ATTEMPTS} attempts. If the API is intermittently failing, confirm API_URL and hosting egress; otherwise check credentials and server logs.`
            : `No session was created after ${MAX_SIGNIN_ATTEMPTS} login attempts. The auth API may be failing silently or returning an unexpected response.`,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status, openAuthFailureWithDeploymentCheck]);

  const value = useMemo(() => ({ authStabilizing }), [authStabilizing]);

  return (
    <SessionAuthDisplayContext.Provider value={value}>
      {children}
    </SessionAuthDisplayContext.Provider>
  );
}

export function useSessionAuthDisplay(): SessionAuthDisplayValue {
  return useContext(SessionAuthDisplayContext);
}
