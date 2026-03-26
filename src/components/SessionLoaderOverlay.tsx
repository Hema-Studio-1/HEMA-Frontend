"use client";

import { useAuthFailure } from "@/contexts/AuthFailureContext";
import { useSessionAuthDisplay } from "@/contexts/SessionAuthDisplayContext";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 4000;

export function SessionLoaderOverlay() {
  const { status, update } = useSession();
  const { openAuthFailureWithDeploymentCheck } = useAuthFailure();
  const { authStabilizing } = useSessionAuthDisplay();
  const [retryCount, setRetryCount] = useState(0);
  const [showError, setShowError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const diagnosticsOpenedRef = useRef(false);

  const attemptRefetch = useCallback(async () => {
    diagnosticsOpenedRef.current = false;
    setIsRetrying(true);
    setShowError(false);
    try {
      await update();
    } finally {
      setIsRetrying(false);
    }
  }, [update]);

  useEffect(() => {
    if (status !== "loading") {
      setRetryCount(0);
      setShowError(false);
      diagnosticsOpenedRef.current = false;
      return;
    }

    const timer = setTimeout(async () => {
      if (retryCount < MAX_RETRIES) {
        setRetryCount((c) => c + 1);
        await update();
      } else {
        setShowError(true);
      }
    }, RETRY_DELAY_MS);

    return () => clearTimeout(timer);
  }, [status, retryCount, update]);

  useEffect(() => {
    if (!showError || diagnosticsOpenedRef.current) return;
    diagnosticsOpenedRef.current = true;

    let cancelled = false;
    void (async () => {
      let sessionLine = "";
      try {
        const r = await fetch("/api/auth/session", {
          credentials: "include",
        });
        sessionLine = `NextAuth session route: HTTP ${r.status} ${r.statusText}.`;
      } catch (e) {
        sessionLine = `NextAuth session route: request failed — ${e instanceof Error ? e.message : String(e)}`;
      }
      if (cancelled) return;
      await openAuthFailureWithDeploymentCheck({
        title: "Session could not be established",
        message:
          "Sign-in state never finished loading. On Vercel/Netlify this is often a bad API_URL, blocked backend, or missing NEXTAUTH_SECRET / NEXTAUTH_URL.",
        prefixDetail: sessionLine,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [showError, openAuthFailureWithDeploymentCheck]);

  const showBlockingOverlay =
    status === "loading" || showError || authStabilizing;

  if (!showBlockingOverlay) return null;

  if (showError) {
    return (
      <div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        role="alert"
      >
        <p
          className="text-[18px] text-foreground mb-2"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 300,
            letterSpacing: "-0.01em",
          }}
        >
          Can&apos;t verify your session
        </p>
        <p
          className="text-[14px] text-textSecondary mb-8 max-w-sm text-center"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            letterSpacing: "0.02em",
          }}
        >
          A dialog should list the likely cause (API unreachable, env vars, or
          auth route errors). Close it to read details again from your host logs
          if needed.
        </p>
        <button
          type="button"
          onClick={() => {
            setRetryCount(0);
            void attemptRefetch();
          }}
          disabled={isRetrying}
          className="px-8 py-3 bg-foreground text-background text-[13px] hover:bg-[#3d3d3d] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            letterSpacing: "0.03em",
          }}
        >
          {isRetrying ? "Connecting…" : "Try again"}
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-1000 flex flex-col items-center justify-center bg-background"
      aria-hidden="false"
    >
      <div
        className="h-8 w-8 rounded-full border-2 border-foreground/30 border-t-foreground animate-spin mb-6"
        style={{ animationDuration: "0.8s" }}
      />
      <p
        className="text-[22px] text-foreground"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 300,
          letterSpacing: "-0.01em",
        }}
      >
        Hema
      </p>
    </div>
  );
}
