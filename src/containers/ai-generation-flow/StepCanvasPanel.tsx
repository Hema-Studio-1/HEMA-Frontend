"use client";

import { Step2Canvas } from "@/containers/ai-generation-flow/Step2Canvas";
import { useAIGenerationFlowContext } from "@/contexts/AIGenerationFlowContext";
import { Upload, X } from "lucide-react";
import type React from "react";
import type { Dispatch, SetStateAction } from "react";

function BaseCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#FDFCFB] rounded-sm flex flex-col items-center justify-center text-center relative shadow-sm overflow-hidden h-[400px] lg:h-[550px]">
      {children}
    </div>
  );
}

function NoImageFallback() {
  return (
    <p
      className="text-[14px] text-[#c5c5c5]"
      style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 300,
      }}
    >
      No image uploaded
    </p>
  );
}

function CanvasImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="rounded-sm"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center",
      }}
    />
  );
}

function Step1Canvas({
  uploadedImage,
  setUploadedImage,
}: {
  uploadedImage: string | null;
  setUploadedImage: Dispatch<SetStateAction<string | null>>;
}) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setUploadedImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <>
      <label htmlFor="image-upload">
        <BaseCanvas>
          {uploadedImage ? (
            <>
              <CanvasImage src={uploadedImage} alt="Uploaded space" />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setUploadedImage(null);
                }}
                className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-sm hover:opacity-60 transition-opacity duration-300"
              >
                <X size={16} className="text-[#626262]" strokeWidth={1.5} />
              </button>
            </>
          ) : (
            <>
              <Upload
                size={32}
                className="mb-6"
                strokeWidth={1.5}
              />
              <p className="text-[18px] mb-2 font-primary">Upload your space</p>
              <p
                className="text-[12px] text-textSecondary"
              >
                Drag & drop or click to browse
              </p>
            </>
          )}
        </BaseCanvas>
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </>
  );
}

function StaticImageCanvas({
  uploadedImage,
  alt,
  caption,
}: {
  uploadedImage: string | null;
  alt: string;
  caption?: string;
}) {
  return (
    <BaseCanvas>
      {uploadedImage ? (
        <>
          <CanvasImage src={uploadedImage} alt={alt} />
          {caption ? (
            <p
              className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[12px] text-textSecondary bg-background/90 backdrop-blur-sm px-4 py-2 rounded-sm"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                letterSpacing: "0.02em",
              }}
            >
              {caption}
            </p>
          ) : null}
        </>
      ) : (
        <NoImageFallback />
      )}
    </BaseCanvas>
  );
}

function BeforeAfterCanvas({
  uploadedImage,
  showBeforeAfter,
  setShowBeforeAfter,
  afterLabel,
  showHint,
}: {
  uploadedImage: string | null;
  showBeforeAfter: boolean;
  setShowBeforeAfter: Dispatch<SetStateAction<boolean>>;
  afterLabel: string;
  showHint?: boolean;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowBeforeAfter(!showBeforeAfter)}
        className="absolute top-4 left-4 z-10 px-3 py-2 bg-background/90 backdrop-blur-sm rounded-sm text-[11px] text-foreground hover:opacity-60 transition-opacity duration-300"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          letterSpacing: "0.01em",
        }}
      >
        {showBeforeAfter ? "Before" : "After"}
      </button>

      <BaseCanvas>
        {uploadedImage ? (
          <>
            <CanvasImage
              src={uploadedImage}
              alt={showBeforeAfter ? "Before" : afterLabel}
            />
            {showHint && !showBeforeAfter ? (
              <p
                className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] text-textSecondary bg-background/90 backdrop-blur-sm px-3 py-2 rounded-sm"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  letterSpacing: "0.01em",
                }}
              >
                Hover to highlight • Click to amend
              </p>
            ) : null}
          </>
        ) : (
          <NoImageFallback />
        )}
      </BaseCanvas>
    </div>
  );
}

export function StepCanvasPanel() {
  const { currentStep, step1, step2, step5 } = useAIGenerationFlowContext();
  const baseImage = step1.uploadedImageUrl ?? step1.uploadedImage;
  const cleanedImage = step2.cleanedImageUrl;
  const uploadedImage = cleanedImage ?? baseImage;

  if (currentStep === 1) {
    return (
      <Step1Canvas
        uploadedImage={baseImage}
        setUploadedImage={step1.setUploadedImage}
      />
    );
  }

  if (currentStep === 2) {
    return (
      <Step2Canvas
        imageUrl={baseImage}
        detectedItems={step2.detectedFurniture}
        selectedItemIds={step2.selectedFurniture}
        onItemToggle={(itemId) => {
          if (step2.selectedFurniture.includes(itemId)) {
            step2.setSelectedFurniture(
              step2.selectedFurniture.filter((id) => id !== itemId),
            );
          } else {
            step2.setSelectedFurniture([...step2.selectedFurniture, itemId]);
          }
        }}
      />
    );
  }

  if (currentStep === 3) {
    return <StaticImageCanvas uploadedImage={uploadedImage} alt="Your space" />;
  }

  if (currentStep === 4) {
    return (
      <StaticImageCanvas uploadedImage={uploadedImage} alt="Room reference" />
    );
  }

  if (currentStep === 5) {
    return (
      <BeforeAfterCanvas
        uploadedImage={uploadedImage}
        showBeforeAfter={step5.showBeforeAfter}
        setShowBeforeAfter={step5.setShowBeforeAfter}
        afterLabel="After"
        showHint
      />
    );
  }

  return (
    <BeforeAfterCanvas
      uploadedImage={uploadedImage}
      showBeforeAfter={step5.showBeforeAfter}
      setShowBeforeAfter={step5.setShowBeforeAfter}
      afterLabel="Final design"
    />
  );
}
