"use client";

import { Button } from "@/components/ui/button";
import {
  STEPS,
  VERSION_HISTORY,
} from "@/containers/ai-generation-flow/constants";
import { StepCanvasPanel } from "@/containers/ai-generation-flow/StepCanvasPanel";
import { StepControlsPanel } from "@/containers/ai-generation-flow/StepControlsPanel";
import { StepIndicator } from "@/containers/ai-generation-flow/StepIndicator";
import { useAIGenerationFlowContext } from "@/contexts/AIGenerationFlowContext";
// API calls commented out — using fake promises for flow to run without backend
// import {
//   detectFurniture,
//   removeFurniture,
//   updateSpaceDetails,
// } from "@/services/api/spaces";
import {
  ArrowLeft,
  Maximize2,
  MessageSquare,
  Minimize2,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CommentsPanel } from "./CommentsPanel";

interface AIGenerationFlowProps {
  onBack: () => void;
  onFullViewChange?: (isFullView: boolean) => void;
}

export function AIGenerationFlow({
  onBack,
  onFullViewChange,
}: AIGenerationFlowProps) {
  const [showRegenerateTooltip, setShowRegenerateTooltip] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    currentStep,
    setCurrentStep,
    step1,
    step2,
    isFullView,
    setIsFullView,
    isCommentsPanelOpen,
    setIsCommentsPanelOpen,
    isVersionHistoryOpen,
    setIsVersionHistoryOpen,
    isRestoreConfirmOpen,
    setIsRestoreConfirmOpen,
    versionToRestore,
    setVersionToRestore,
    currentVersion,
    setCurrentVersion,
    handleClearDraft,
  } = useAIGenerationFlowContext();

  useEffect(() => {
    if (onFullViewChange) {
      onFullViewChange(isFullView);
    }
  }, [isFullView, onFullViewChange]);

  const normalizeRoomType = (roomType: string): string => {
    const mapping: Record<string, string> = {
      "living-room": "living_room",
      "dining-room": "dining_room",
      bedroom: "bedroom",
      kitchen: "kitchen",
      bathroom: "bathroom",
      office: "office",
    };
    return mapping[roomType] || roomType;
  };

  const handleStep1Submit = async () => {
    const baseImage = step1.uploadedImageUrl ?? step1.uploadedImage;
    if (!baseImage) {
      toast.error("Please upload an image first.");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Fake API – comment out real calls when ready
      // const updateResult = await updateSpaceDetails(step1.space!.id, updatePayload);
      // const detectResult = await detectFurniture(step1.space!.id, { imageId });
      await new Promise((r) => setTimeout(r, 600));

      // Mock detected items with bounding boxes for testing
      // In production, uncomment above and use:
      // const detectedItems = detectResult.data.output.detections.map(
      //   (detection, index) => ({
      //     id: `${detection.detected}-${index}`,
      //     label: detection.detected,
      //     maskUrl: detection.maskUrl,
      //     objectUrl: detection.objectUrl,
      //     boundingBox: detection.boundingBox ?? null, // Use boundingBox if available
      //   }),
      // );
      const mockDetectedItems = [
        {
          id: "sofa-0",
          label: "Grey sofa",
          maskUrl: "",
          objectUrl: baseImage,
          boundingBox: { x: 100, y: 200, width: 400, height: 300 },
        },
        {
          id: "table-1",
          label: "Coffee table",
          maskUrl: "",
          objectUrl: baseImage,
          boundingBox: { x: 300, y: 450, width: 200, height: 150 },
        },
        {
          id: "chair-2",
          label: "Armchair",
          maskUrl: "",
          objectUrl: baseImage,
          boundingBox: { x: 600, y: 250, width: 180, height: 200 },
        },
      ];
      step2.setDetectedFurniture(mockDetectedItems);
      step1.setUploadedImageUrl(baseImage);
      setCurrentStep(2);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to process step 1",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep2Submit = async () => {
    const baseImage = step1.uploadedImageUrl ?? step1.uploadedImage;
    if (!baseImage) {
      toast.error("Image not found. Please upload an image first.");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Fake API – comment out real call when ready
      // const removeResult = await removeFurniture(step1.space!.id, { imageId, maskUrls });
      await new Promise((r) => setTimeout(r, 600));

      step2.setCleanedImageUrl(baseImage);
      setCurrentStep(3);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to process step 2",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      void handleStep1Submit();
      return;
    }
    if (currentStep === 2) {
      void handleStep2Submit();
      return;
    }
    if (currentStep < 6) {
      setCurrentStep((currentStep + 1) as 1 | 2 | 3 | 4 | 5 | 6);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as 1 | 2 | 3 | 4 | 5 | 6);
    }
  };

  const handleRegenerate = () => {
    console.log(`Regenerating step ${currentStep}`);
  };

  const handleRestoreClick = (version: number) => {
    setVersionToRestore(version);
    setIsRestoreConfirmOpen(true);
  };

  const handleRestoreConfirm = () => {
    if (versionToRestore !== null) {
      setCurrentVersion(versionToRestore);
      setIsRestoreConfirmOpen(false);
      setIsVersionHistoryOpen(false);
      setVersionToRestore(null);
    }
  };

  return (
    <div className="flex flex-col lg:h-full">
      <div className="relative mb-6 flex items-center justify-between shrink-0">
        <Button onClick={onBack} variant="link">
          <ArrowLeft size={16} strokeWidth={1.5} />
          Back
        </Button>

        {step1.spaceName ? (
          <div
            className="absolute left-1/2 -translate-x-1/2 text-[13px] text-textSecondary"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              letterSpacing: "0.02em",
            }}
          >
            {step1.spaceName}
          </div>
        ) : null}

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={handleRegenerate}
              onMouseEnter={() => setShowRegenerateTooltip(true)}
              onMouseLeave={() => setShowRegenerateTooltip(false)}
              className="text-textSecondary hover:text-[#626262] transition-colors duration-300"
              aria-label="Regenerate"
            >
              <RefreshCw size={16} strokeWidth={1.5} />
            </button>
            {showRegenerateTooltip ? (
              <div
                className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-foreground text-background text-[11px] rounded-sm whitespace-nowrap pointer-events-none z-50"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  letterSpacing: "0.02em",
                }}
              >
                Regenerate
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setIsVersionHistoryOpen(true)}
            className="px-2.5 py-1 rounded-full bg-[#E8E6E3]/40 hover:bg-[#E8E6E3]/60 transition-all duration-300"
          >
            <span
              className="text-[10px] text-textSecondary tracking-wide uppercase"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                letterSpacing: "0.08em",
              }}
            >
              v{currentVersion}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsCommentsPanelOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-textSecondary hover:text-[#626262] hover:bg-[#E8E6E3]/50 transition-colors duration-300"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              letterSpacing: "0.02em",
            }}
          >
            <MessageSquare size={16} strokeWidth={1.5} />
            <span className="text-[12px]">Comments</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullView(!isFullView)}
            className="text-textSecondary hover:text-[#626262] transition-colors duration-300"
            style={{ marginTop: "-10px" }}
            aria-label={isFullView ? "Exit full view" : "Enter full view"}
          >
            {isFullView ? (
              <Minimize2 size={20} strokeWidth={1.5} />
            ) : (
              <Maximize2 size={20} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      <div className="relative flex-1 flex items-center min-h-0">
        <div className="relative w-full max-w-[1640px] mx-auto">
          <StepIndicator
            steps={STEPS}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />

          <div className="grid gap-x-8 gap-y-4 xl:pr-24 lg:grid-cols-[1fr_minmax(290px,300px)] xl:grid-cols-[1fr_minmax(320px,380px)]">
            <div className="flex flex-col gap-1.5 min-h-0">
              <div className="min-h-0">
                <StepCanvasPanel />
              </div>

              <div className="hidden lg:flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <Button onClick={() => handleClearDraft()} variant="link">
                    Clear draft
                  </Button>
                  <Button
                    onClick={handlePreviousStep}
                    variant="link"
                    disabled={currentStep === 1}
                  >
                    Go back
                  </Button>
                </div>

                <Button
                  onClick={handleNextStep}
                  disabled={
                    (currentStep === 1 &&
                      !(step1.uploadedImageUrl ?? step1.uploadedImage)) ||
                    isSubmitting
                  }
                >
                  {isSubmitting
                    ? "Processing..."
                    : currentStep === 6
                      ? "Complete"
                      : currentStep === 3
                        ? "Generate design"
                        : "Next step"}
                </Button>
              </div>
            </div>

            <div className="min-h-0 lg:h-[550px] lg:flex lg:flex-col">
              <StepControlsPanel />
            </div>
          </div>

          <div className="flex lg:hidden items-center justify-between mt-4">
            <div className="flex items-center gap-8">
              <button
                type="button"
                onClick={() => handleClearDraft()}
                className="text-[13px] text-textSecondary hover:text-[#626262] transition-colors duration-300"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  letterSpacing: "0.02em",
                }}
              >
                Clear draft
              </button>

              <button
                type="button"
                onClick={handlePreviousStep}
                disabled={currentStep === 1}
                className="text-[13px] text-textSecondary hover:text-foreground transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                }}
              >
                Go back
              </button>
            </div>
            <Button
              onClick={handleNextStep}
              disabled={
                (currentStep === 1 &&
                  !(step1.uploadedImageUrl ?? step1.uploadedImage)) ||
                isSubmitting
              }
            >
              {isSubmitting
                ? "Processing..."
                : currentStep === 6
                  ? "Complete"
                  : currentStep === 3
                    ? "Generate design"
                    : "Next step"}
            </Button>
          </div>
        </div>
      </div>
      <CommentsPanel
        isOpen={isCommentsPanelOpen}
        onClose={() => setIsCommentsPanelOpen(false)}
        spaceName={step1.spaceName || "this space"}
      />

      {isVersionHistoryOpen ? (
        <div className="fixed inset-0 bg-foreground/20 flex items-center justify-center z-50">
          <div
            className="bg-background rounded-sm p-8 max-w-md w-full mx-4"
            style={{ boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)" }}
          >
            <h3
              className="text-[16px] text-foreground mb-6"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                letterSpacing: "0.01em",
              }}
            >
              Version history
            </h3>

            <div className="space-y-3">
              {VERSION_HISTORY.map((item) => (
                <div
                  key={item.version}
                  className="flex items-center justify-between py-3 border-b border-[#E8E6E3]/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[13px] text-foreground"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight:
                            item.version === currentVersion ? 400 : 300,
                          letterSpacing: "0.01em",
                        }}
                      >
                        v{item.version}
                      </span>
                      <span
                        className="text-[13px] text-textSecondary"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 300,
                          letterSpacing: "0.01em",
                        }}
                      >
                        {item.label}
                      </span>
                      {item.version === currentVersion ? (
                        <span
                          className="text-[10px] text-textSecondary ml-1"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 300,
                            letterSpacing: "0.02em",
                          }}
                        >
                          (current)
                        </span>
                      ) : null}
                    </div>
                    <p
                      className="text-[11px] text-[#c5c5c5]"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 300,
                        letterSpacing: "0.01em",
                      }}
                    >
                      {item.timestamp}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="text-[12px] text-textSecondary hover:text-foreground transition-colors duration-300"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 300,
                        letterSpacing: "0.01em",
                      }}
                    >
                      View
                    </button>
                    {item.version !== currentVersion ? (
                      <button
                        type="button"
                        onClick={() => handleRestoreClick(item.version)}
                        className="text-[12px] text-textSecondary hover:text-foreground transition-colors duration-300"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 300,
                          letterSpacing: "0.01em",
                        }}
                      >
                        Restore
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsVersionHistoryOpen(false)}
              className="mt-6 w-full text-[12px] text-textSecondary hover:text-foreground transition-colors duration-300"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                letterSpacing: "0.02em",
              }}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      {isRestoreConfirmOpen && versionToRestore !== null ? (
        <div className="fixed inset-0 bg-foreground/20 flex items-center justify-center z-50">
          <div
            className="bg-background rounded-sm p-8 max-w-sm w-full mx-4"
            style={{ boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)" }}
          >
            <p
              className="text-[14px] text-foreground mb-6"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                letterSpacing: "0.01em",
                lineHeight: 1.6,
              }}
            >
              This will make v{versionToRestore} your current version.
            </p>
            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsRestoreConfirmOpen(false)}
                className="text-[12px] text-textSecondary hover:text-foreground transition-colors duration-300"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  letterSpacing: "0.02em",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRestoreConfirm}
                className="text-[12px] text-foreground hover:text-[#626262] transition-colors duration-300"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                }}
              >
                Restore version
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
