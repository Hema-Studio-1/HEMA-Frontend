"use client";

import { uploadImages } from "@/actions/upload-files";
import { Spinner } from "@/components/spinner";
import { StepErrorBanner } from "@/components/StepErrorBanner";
import { StepLoader } from "@/components/StepLoader";
import { Step2Canvas } from "@/containers/ai-generation-flow/Step2Canvas";
import { useAIGenerationFlowContext } from "@/contexts/AIGenerationFlowContext";
import { extractDimensionsFromMeasureRoom } from "@/lib/dimensions";
import { createImage } from "@/services/api/images";
import { measureRoom } from "@/services/api/spaces";
import { ImageType } from "@/types/image";
import { AlertCircle, RefreshCw, Upload, X } from "lucide-react";
import type React from "react";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

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

function getImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

function Step1Canvas() {
  const {
    step1,
  } = useAIGenerationFlowContext();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const baseImage = step1.uploadedImageUrl ?? step1.uploadedImage;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      const [uploadResult] = await uploadImages(file, "hema");
      if (!uploadResult.success || !uploadResult.path || !uploadResult.url) {
        setUploadError(uploadResult.error ?? "Upload failed");
        return;
      }

      const dims = await getImageDimensions(file).catch(() => ({
        width: 0,
        height: 0,
      }));

      // storagePath: path after bucket name (e.g. hema/filename.png)
      const createResult = await createImage({
        type: ImageType.ORIGINAL,
        storagePath: uploadResult.path,
        width: dims.width || undefined,
        height: dims.height || undefined,
      });

      if (createResult.error || !createResult.data) {
        setUploadError(createResult.error ?? "Failed to create image record");
        return;
      }

      const imageId = createResult.data.id;
      const measureResult = await measureRoom({ imageId });

      step1.setUploadedImageUrl(uploadResult.url);
      step1.setUploadedImage(null);
      step1.setImageId(imageId);
      step1.setImageDimensions(dims.width && dims.height ? dims : null);

      if (!measureResult.error && measureResult.data) {
        const dimensions = extractDimensionsFromMeasureRoom(measureResult.data);
        step1.setDimensions(dimensions);
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
    e.target.value = "";
  };

  const handleRemoveImage = () => {
    step1.setUploadedImageUrl(null);
    step1.setUploadedImage(null);
    step1.setImageId(null);
    step1.setImageDimensions(null);
    setUploadError(null);
  };

  return (
    <>
      <label htmlFor="image-upload" className={isUploading ? "pointer-events-none opacity-70" : ""}>
        <BaseCanvas>
          {baseImage ? (
            <>
              <CanvasImage src={baseImage} alt="Uploaded space" />
              {!isUploading && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-sm hover:opacity-60 transition-opacity duration-300"
                >
                  <X size={16} className="text-[#626262]" strokeWidth={1.5} />
                </button>
              )}
              {uploadError && (
                <p
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[12px] text-red-600 bg-background/90 px-4 py-2 rounded-sm"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                >
                  {uploadError}
                </p>
              )}
            </>
          ) : (
            <>
              {isUploading ? (
                <div className="flex flex-col items-center gap-6 w-full max-w-[280px]">
                  <div className="relative flex items-center justify-center">
                    <div
                      className="h-14 w-14 rounded-full border-2 border-foreground/10 border-t-foreground animate-spin"
                      style={{ animationDuration: "1s" }}
                    />
                    <div
                      className="absolute h-10 w-10 rounded-full border-2 border-transparent border-b-foreground/25 animate-spin"
                      style={{
                        animationDuration: "1.6s",
                        animationDirection: "reverse",
                      }}
                    />
                  </div>
                  <div className="text-center space-y-1">
                    <p
                      className="text-[16px] text-foreground"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 400,
                      }}
                    >
                      Uploading your image…
                    </p>
                  </div>
                  <div className="w-full h-1 bg-[#E8E6E3] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-foreground/40 rounded-full animate-pulse"
                      style={{
                        width: "60%",
                        animationDuration: "1.2s",
                      }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <Upload size={32} className="mb-6" strokeWidth={1.5} />
                  <p className="text-[18px] mb-2 font-primary">
                    Upload your space
                  </p>
                  <p className="text-[12px] text-textSecondary">
                    Drag & drop or click to browse
                  </p>
                </>
              )}
              {uploadError && !isUploading && (
                <p
                  className="mt-2 text-[12px] text-red-600"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                >
                  {uploadError}
                </p>
              )}
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
        disabled={isUploading}
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

function Step2ErrorCanvas({
  message,
  onRetry,
  onDismiss,
}: {
  message: string;
  onRetry: () => void;
  onDismiss: () => void;
}) {
  return (
    <BaseCanvas>
      <div className="flex flex-col items-center justify-center gap-6 px-6 max-w-[320px]">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50">
          <AlertCircle size={24} className="text-red-600" strokeWidth={1.5} />
        </div>
        <div className="text-center space-y-2">
          <p
            className="text-[15px] text-foreground"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              letterSpacing: "0.01em",
            }}
          >
            Couldn&apos;t detect elements
          </p>
          <p
            className="text-[13px] text-textSecondary"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              letterSpacing: "0.01em",
              lineHeight: 1.5,
            }}
          >
            {message}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-sm hover:opacity-90 transition-opacity"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: "13px",
              letterSpacing: "0.02em",
            }}
          >
            <RefreshCw size={14} strokeWidth={2} />
            Try again
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="px-4 py-2.5 border border-[#E8E6E3] rounded-sm hover:bg-[#E8E6E3]/50 transition-colors text-foreground"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: "13px",
              letterSpacing: "0.02em",
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </BaseCanvas>
  );
}

export function StepCanvasPanel({
  onRetryStep2,
}: {
  onRetryStep2?: () => void;
} = {}) {
  const {
    currentStep,
    step1,
    step2,
    step4,
    step5,
    stepLoadingFor,
    stepErrorMessage,
    setStepErrorMessage,
  } = useAIGenerationFlowContext();
  const baseImage = step1.uploadedImageUrl ?? step1.uploadedImage;
  const cleanedImage = step2.cleanedImageUrl;
  const uploadedImage = cleanedImage ?? baseImage;
  const finalImage = step4.finalImageUrl;

  const showLoader = stepLoadingFor === currentStep && stepLoadingFor !== null;
  const showError =
    stepErrorMessage && [2, 3, 4].includes(currentStep) && !showLoader;

  if (currentStep === 1) {
    return <Step1Canvas />;
  }

  if (currentStep === 2) {
    if (showLoader) {
      return (
        <BaseCanvas>
          <Spinner />
        </BaseCanvas>
      );
    }
    if (showError && onRetryStep2) {
      return (
        <Step2ErrorCanvas
          message={stepErrorMessage ?? "Something went wrong."}
          onRetry={onRetryStep2}
          onDismiss={() => setStepErrorMessage(null)}
        />
      );
    }
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
    if (showLoader) {
      return (
        <BaseCanvas>
          <Spinner />
        </BaseCanvas>
      );
    }
    return (
      <div className="flex flex-col gap-4">
        {showError && (
          <StepErrorBanner
            message={stepErrorMessage}
            onDismiss={() => setStepErrorMessage(null)}
          />
        )}
        <StaticImageCanvas uploadedImage={uploadedImage} alt="Your space" />
      </div>
    );
  }

  if (currentStep === 4) {
    if (showLoader) {
      return (
        <BaseCanvas>
          <Spinner />
        </BaseCanvas>
      );
    }
    return (
      <div className="flex flex-col gap-4">
        {showError && (
          <StepErrorBanner
            message={stepErrorMessage}
            onDismiss={() => setStepErrorMessage(null)}
          />
        )}
        <StaticImageCanvas
          uploadedImage={finalImage ?? uploadedImage}
          alt="Final design"
        />
      </div>
    );
  }

  if (currentStep === 5) {
    return (
      <BeforeAfterCanvas
        uploadedImage={finalImage ?? uploadedImage}
        showBeforeAfter={step5.showBeforeAfter}
        setShowBeforeAfter={step5.setShowBeforeAfter}
        afterLabel="After"
        showHint
      />
    );
  }

  return (
    <BeforeAfterCanvas
      uploadedImage={finalImage ?? uploadedImage}
      showBeforeAfter={step5.showBeforeAfter}
      setShowBeforeAfter={step5.setShowBeforeAfter}
      afterLabel="Final design"
    />
  );
}
