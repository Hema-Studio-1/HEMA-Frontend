"use client";

import { useAIGenerationFlowContext } from "@/contexts/AIGenerationFlowContext";
import dynamic from "next/dynamic";
import { useState } from "react";

import "yet-another-react-lightbox/styles.css";

const Lightbox = dynamic(
  () => import("yet-another-react-lightbox").then((mod) => mod.default),
  { ssr: false }
);

interface PhaseItem {
  label: string;
  src: string;
}

export function ImagePhaseGrid() {
  const { step1, step2, step3, step4 } = useAIGenerationFlowContext();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const originalImage = step1.uploadedImageUrl ?? step1.uploadedImage;
  const cleanedImage = step2.cleanedImageUrl;
  const inspirationImage = step3.inspirationImageUrl;
  const finalImage = step4.finalImageUrl;

  const phases: PhaseItem[] = [
    ...(originalImage ? [{ label: "Original", src: originalImage }] : []),
    ...(cleanedImage ? [{ label: "Remove furniture", src: cleanedImage }] : []),
    ...(inspirationImage ? [{ label: "Inspiration", src: inspirationImage }] : []),
    ...(finalImage ? [{ label: "Final design", src: finalImage }] : []),
  ];

  if (phases.length === 0) return null;

  const handleThumbClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
        <div className="flex gap-3">
          {phases.map((phase, index) => (
            <button
              key={`${phase.label}-${index}`}
              type="button"
              onClick={() => handleThumbClick(index)}
              className="group relative aspect-video rounded-sm overflow-hidden bg-[#FDFCFB] border border-[#E8E6E3]/60 hover:border-[#A4AC96]/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:ring-offset-1 max-w-[100px]"
            >
              <img
                src={phase.src}
                alt={phase.label}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
              <div
                className="absolute inset-0 bg-linear-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-hidden
              />
              <span
                className="absolute bottom-0 left-0 right-0 px- py-1 text-background font-medium bg-foreground/80 backdrop-blur-sm text-center text-[8px]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.02em",
                }}
              >
                {phase.label}
              </span>
            </button>
          ))}
        </div>
      

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={phases.map((p) => ({ src: p.src, alt: p.label }))}
        on={{
          view: ({ index }) => setLightboxIndex(index),
        }}
      />
    </>
  );
}
