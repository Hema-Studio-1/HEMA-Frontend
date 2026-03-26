"use client";

import { useAuthFailure } from "@/contexts/AuthFailureContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const NEXT_AUTH_URL_ERRORS: Record<string, { title: string; message: string }> = {
  Configuration: {
    title: "NextAuth configuration error",
    message:
      "Verify NEXTAUTH_SECRET is set on your host, and NEXTAUTH_URL matches the exact origin users use (including https). Mismatches often break production while local `.env` still works.",
  },
  AccessDenied: {
    title: "Access denied",
    message: "The provider or callback denied access to this account.",
  },
  Verification: {
    title: "Verification failed",
    message: "The sign-in token or link could not be verified.",
  },
  OAuthSignin: {
    title: "OAuth error",
    message: "OAuth sign-in could not be started.",
  },
  OAuthCallback: {
    title: "OAuth callback error",
    message: "Handling the OAuth callback failed.",
  },
  OAuthCreateAccount: {
    title: "OAuth account error",
    message: "Could not create the OAuth account.",
  },
  EmailCreateAccount: {
    title: "Email account error",
    message: "Could not create the email account.",
  },
  Callback: {
    title: "Callback error",
    message: "The authentication callback failed.",
  },
  OAuthAccountNotLinked: {
    title: "Account not linked",
    message: "This email is already associated with another sign-in method.",
  },
  EmailSignin: {
    title: "Email sign-in error",
    message: "The email sign-in message could not be sent.",
  },
  CredentialsSignin: {
    title: "Credentials sign-in failed",
    message:
      "Invalid credentials, or the backend auth API failed / returned an unexpected response from the production server. Technical details include a reachability check from your host to API_URL.",
  },
  SessionRequired: {
    title: "Session required",
    message: "You need to be signed in to access this content.",
  },
};

/**
 * Picks up `?error=` from NextAuth redirects so production users see cause instead of a silent failure.
 */
export function AuthErrorParamsListener() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openAuthFailureWithDeploymentCheck } = useAuthFailure();
  const ranForKey = useRef<string | null>(null);

  useEffect(() => {
    const error = searchParams.get("error");
    if (!error) {
      ranForKey.current = null;
      return;
    }

    const key = `${error}:${searchParams.toString()}`;
    if (ranForKey.current === key) return;
    ranForKey.current = key;

    const mapped =
      NEXT_AUTH_URL_ERRORS[error] ?? {
        title: "Sign-in error",
        message: `NextAuth reported error code: ${error}.`,
      };

    void openAuthFailureWithDeploymentCheck({
      title: mapped.title,
      message: mapped.message,
    });

    const params = new URLSearchParams(searchParams.toString());
    params.delete("error");
    const qs = params.toString();
    router.replace(qs ? `/?${qs}` : "/", { scroll: false });
  }, [searchParams, router, openAuthFailureWithDeploymentCheck]);

  return null;
}
