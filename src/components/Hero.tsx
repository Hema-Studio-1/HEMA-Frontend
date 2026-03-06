import { Sparkles } from "lucide-react";
import React from "react";

interface HeroProps {
  onStartAIFlow?: () => void;
  onCreateSpace?: () => void;
}

export function Hero({ onStartAIFlow, onCreateSpace }: HeroProps) {
  return (
    <div className="max-w-5xl">
      {/* Headline - Reduced size, tighter spacing */}
      <h1 className="text-[56px] leading-[1.05] mb-4 text-foreground tracking-tight">
        Design interiors with AI
      </h1>

      {/* Subtitle - Closer to headline */}
      <p className="text-base text-textSecondary mb-8 leading-relaxed max-w-xl">
        Generate architectural spaces. Explore materials, light, and atmosphere.
      </p>

      {/* Unified Generation Strip - Full Width */}
      <div className="max-w-3xl">
        <div
          className="w-full rounded-sm px-8 py-6 flex items-center justify-between"
          style={{
            background:
              "linear-gradient(to right, rgba(164, 172, 150, 0.04), rgba(164, 172, 150, 0.06))",
            border: "1px solid rgba(164, 172, 150, 0.12)",
          }}
        >
          {/* Left Side - Text */}
          <div className="flex-1">
            <p className="text-xl font-semibold tracking-tight font-primary text-foreground mb-1">
              Ready to generate your space
            </p>
            <p className="text-sm text-textSecondary">
              Name your space and optionally upload a floor plan or reference
            </p>
          </div>

          {/* Right Side - Action Button */}
          <button
            onClick={onCreateSpace}
            className="flex items-center gap-2 px-8 py-3 bg-foreground text-background text-[13px] hover:bg-[#3d3d3d] transition-colors duration-300 flex-shrink-0 ml-8"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              letterSpacing: "0.03em",
            }}
          >
            <Sparkles size={16} strokeWidth={1.5} />
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}
