"use client";

import { Spinner } from "./spinner";

const STEP_MESSAGES: Record<number, string> = {
  2: "Detecting elements in your space…",
  3: "Preparing your empty room…",
  4: "Creating your design…",
};

interface StepLoaderProps {
  step: 2 | 3 | 4;
}

export function StepLoader({ step }: StepLoaderProps) {
  const message = STEP_MESSAGES[step] ?? "Working…";

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16">
     <Spinner />
      <p
        className="text-[15px] text-foreground/90 max-w-[220px] text-center"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          letterSpacing: "0.02em",
          lineHeight: 1.5,
        }}
      >
        {message}
      </p>
    </div>
  );
}
