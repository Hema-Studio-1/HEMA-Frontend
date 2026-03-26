"use client";

import { AuthFailureDialog } from "@/components/AuthFailureDialog";
import {
  type DeploymentCheckResult,
  summarizeDeploymentCheck,
} from "@/lib/auth-connection-errors";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type AuthFailurePayload = {
  title: string;
  message: string;
  /** True while deployment diagnostics are still running */
  isLoading?: boolean;
  /** Longer text / bullet list */
  detail?: string;
  /** Raw deployment-check JSON for power users */
  diagnostics?: DeploymentCheckResult | null;
};

type AuthFailureContextValue = {
  failure: AuthFailurePayload | null;
  openAuthFailure: (payload: AuthFailurePayload) => void;
  closeAuthFailure: () => void;
  openAuthFailureWithDeploymentCheck: (partial?: {
    title?: string;
    message?: string;
    prefixDetail?: string;
  }) => Promise<void>;
};

const AuthFailureContext = createContext<AuthFailureContextValue | null>(null);

/** Prevents the delayed “still unauthenticated” hint from opening a second dialog. */
export const AUTH_DIAG_AUTO_STORAGE_KEY = "hema_auth_diag_auto_v1";

function markAuthDiagAutoHandled() {
  try {
    sessionStorage.setItem(AUTH_DIAG_AUTO_STORAGE_KEY, "1");
  } catch {
    /* private mode / SSR */
  }
}

export function clearAuthDiagAutoHandled() {
  try {
    sessionStorage.removeItem(AUTH_DIAG_AUTO_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function AuthFailureProvider({ children }: { children: ReactNode }) {
  const [failure, setFailure] = useState<AuthFailurePayload | null>(null);

  const closeAuthFailure = useCallback(() => setFailure(null), []);

  const openAuthFailure = useCallback((payload: AuthFailurePayload) => {
    markAuthDiagAutoHandled();
    setFailure(payload);
  }, []);

  const openAuthFailureWithDeploymentCheck = useCallback(
    async (partial?: {
      title?: string;
      message?: string;
      prefixDetail?: string;
    }) => {
      // Open dialog immediately so users see progress while diagnostics run.
      markAuthDiagAutoHandled();
      setFailure({
        title: partial?.title ?? "Why connection failed",
        message: partial?.message ?? "Diagnosing the failure...",
        detail: partial?.prefixDetail,
        diagnostics: null,
        isLoading: true,
      });

      let diagnostics: DeploymentCheckResult | null = null;
      try {
        const res = await fetch("/api/auth/deployment-check", {
          cache: "no-store",
        });
        if (res.ok) {
          diagnostics = (await res.json()) as DeploymentCheckResult;
        }
      } catch {
        diagnostics = null;
      }

      const summary = diagnostics
        ? summarizeDeploymentCheck(diagnostics)
        : {
            title: "Could not load diagnostics",
            message:
              partial?.message ??
              "The deployment check request failed. Your browser could not reach /api/auth/deployment-check.",
            detail: partial?.prefixDetail ?? "",
          };

      const detailParts = [
        partial?.prefixDetail,
        diagnostics ? summary.detail : summary.message,
      ].filter(Boolean);

      markAuthDiagAutoHandled();
      setFailure({
        title: partial?.title ?? "Why connection failed",
        message: partial?.message ?? summary.message,
        detail: detailParts.join("\n\n"),
        diagnostics,
        isLoading: false,
      });
    },
    [],
  );

  const value = useMemo(
    () => ({
      failure,
      openAuthFailure,
      closeAuthFailure,
      openAuthFailureWithDeploymentCheck,
    }),
    [
      failure,
      openAuthFailure,
      closeAuthFailure,
      openAuthFailureWithDeploymentCheck,
    ],
  );

  return (
    <AuthFailureContext.Provider value={value}>
      {children}
      <AuthFailureDialog />
    </AuthFailureContext.Provider>
  );
}

export function useAuthFailure(): AuthFailureContextValue {
  const ctx = useContext(AuthFailureContext);
  if (!ctx) {
    throw new Error("useAuthFailure must be used within AuthFailureProvider");
  }
  return ctx;
}
