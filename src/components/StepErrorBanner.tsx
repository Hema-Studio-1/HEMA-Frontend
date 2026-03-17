"use client";

import { AlertCircle, X } from "lucide-react";

interface StepErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

export function StepErrorBanner({ message, onDismiss }: StepErrorBannerProps) {
  return (
    <div
      className="flex items-start gap-3 rounded-sm border border-red-200 bg-red-50/80 px-4 py-3"
      role="alert"
    >
      <AlertCircle
        size={18}
        className="text-red-600 shrink-0 mt-0.5"
        strokeWidth={1.5}
      />
      <p
        className="flex-1 text-[13px] text-red-800"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 400,
          letterSpacing: "0.01em",
          lineHeight: 1.5,
        }}
      >
        {message}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100/50 rounded transition-colors"
        aria-label="Dismiss error"
      >
        <X size={16} strokeWidth={1.5} />
      </button>
    </div>
  );
}
