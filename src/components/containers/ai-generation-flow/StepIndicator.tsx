import type { Dispatch, SetStateAction } from "react";
import type { Step, StepMeta } from "./types";

interface StepIndicatorProps {
  steps: StepMeta[];
  currentStep: Step;
  setCurrentStep: Dispatch<SetStateAction<Step>>;
}

export function StepIndicator({
  steps,
  currentStep,
  setCurrentStep,
}: StepIndicatorProps) {
  return (
    <>
      <div className="hidden xl:flex absolute right-0 top-1/2 -translate-y-1/2 flex-col gap-6 z-10">
        {steps.map((step) => (
          <button
            type="button"
            key={step.number}
            onClick={() => step.number <= currentStep && setCurrentStep(step.number)}
            className="flex flex-col items-center gap-1.5 group"
            disabled={step.number > currentStep}
          >
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors duration-300 ${
                currentStep === step.number
                  ? "bg-foreground text-background"
                  : currentStep > step.number
                    ? "bg-[#E8E6E3] text-textSecondary"
                    : "bg-transparent border border-[#E8E6E3] text-[#c5c5c5]"
              }`}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "10px",
                fontWeight: 300,
              }}
            >
              {step.number}
            </div>
            <span
              className={`text-[9px] tracking-wider uppercase transition-colors duration-300 text-center break-words ${
                currentStep === step.number ? "text-foreground" : "text-textSecondary"
              }`}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                letterSpacing: "0.12em",
                width: "70px",
                lineHeight: 1.4,
              }}
            >
              {step.title}
            </span>
          </button>
        ))}
      </div>

      <div className="flex xl:hidden items-center justify-center gap-4 mb-4 overflow-x-auto pb-1">
        {steps.map((step) => (
          <button
            type="button"
            key={step.number}
            onClick={() => step.number <= currentStep && setCurrentStep(step.number)}
            className="flex items-center gap-2 flex-shrink-0 group"
            disabled={step.number > currentStep}
          >
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors duration-300 ${
                currentStep === step.number
                  ? "bg-foreground text-background"
                  : currentStep > step.number
                    ? "bg-[#E8E6E3] text-textSecondary"
                    : "bg-transparent border border-[#E8E6E3] text-[#c5c5c5]"
              }`}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "10px",
                fontWeight: 300,
              }}
            >
              {step.number}
            </div>
            <span
              className={`text-[10px] tracking-wider uppercase transition-colors duration-300 ${
                currentStep === step.number ? "text-foreground" : "text-textSecondary"
              }`}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                letterSpacing: "0.12em",
              }}
            >
              {step.title}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
