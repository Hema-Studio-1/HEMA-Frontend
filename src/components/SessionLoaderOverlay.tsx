"use client";

import { ENV_VARIABLES } from "@/lib/env-variables";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 4000;

export function SessionLoaderOverlay() {
  const { status, update } = useSession();
  const hasForcedToken = Boolean('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3OTMzMzAxNy00MzRkLTRhYzgtYWJhNS02NjQxOWVjODg5ZDQiLCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImF1ZCI6ImF1dGhlbnRpY2F0ZWQiLCJpYXQiOjE3NzQwMjUyOTMsImV4cCI6MTc3NDE1NDg5M30._0sF8OqctLf9TdFLOARGzUk6Ffd7P47OsVrJzYDCVA8';
  const [retryCount, setRetryCount] = useState(0);
  const [showError, setShowError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const attemptRefetch = useCallback(async () => {
    setIsRetrying(true);
    setShowError(false);
    try {
      await update();
    } finally {
      setIsRetrying(false);
    }
  }, [update]);

  useEffect(() => {
    if (hasForcedToken) {
      setRetryCount(0);
      setShowError(false);
      return;
    }
    if (status !== "loading") {
      setRetryCount(0);
      setShowError(false);
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
  }, [status, retryCount, update, hasForcedToken]);

  if (hasForcedToken) return null;

  if (status !== "loading" && !showError) return null;

  if (showError) {
    return (
      <div
        className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-background"
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
          Connection issue
        </p>
        <p
          className="text-[14px] text-textSecondary mb-8 max-w-sm text-center"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            letterSpacing: "0.02em",
          }}
        >
          We couldn&apos;t establish a connection. Please check your network and
          try again.
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
