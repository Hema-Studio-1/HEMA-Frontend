"use client";

import { getSignedUrlForPath } from "@/actions/upload-files";
import { Button } from "@/components/ui/button";
import {
  STEPS,
  VERSION_HISTORY,
} from "@/containers/ai-generation-flow/constants";
import { StepCanvasPanel } from "@/containers/ai-generation-flow/StepCanvasPanel";
import { StepControlsPanel } from "@/containers/ai-generation-flow/StepControlsPanel";
import { StepIndicator } from "@/containers/ai-generation-flow/StepIndicator";
import type {
  DetectedFurnitureGroup,
  DetectedFurnitureItem,
} from "@/containers/ai-generation-flow/types";
import { useAIGenerationFlowContext } from "@/contexts/AIGenerationFlowContext";
import { createSpaceApiResp } from "@/mock/create-space-api";
import { detectApiResp } from "@/mock/mock-detect-api-resp";
import {
  createSpace,
  detectFurniture,
  emptyCompleteRoom,
  fillRoomFromInspirationFurniture,
  removeFurniture,
} from "@/services/api/spaces";
import type {
  DetectFurnitureResponse,
  DetectFurnitureResult,
  SpaceWithRelations,
} from "@/types/space";
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
import { ImagePhaseGrid } from "./ImagePhaseGrid";

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
    maxStepReached,
    step1,
    step2,
    step3,
    step4,
    stepLoadingFor,
    stepErrorMessage,
    setStepLoadingFor,
    setStepErrorMessage,
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

  function mapDetectResponseToGroupedItems(
    res: DetectFurnitureResponse,
    baseImageUrl: string,
    imgWidth: number,
    imgHeight: number,
  ): DetectedFurnitureGroup[] {
    const groups: DetectedFurnitureGroup[] = [];
    let globalIndex = 0;

    const raw = res as Record<string, Array<{ label: string; boundingBox?: { x: number; y: number; width: number; height: number } }>>;
    let data: DetectFurnitureResult | undefined;
    let segmentedObjects: unknown[] | undefined;

    if (Array.isArray(res)) {
      data = res[0] as DetectFurnitureResult;
      segmentedObjects = data?.segmentedObjects;
    } else if (raw?.parsed != null) {
      const parsedVal = raw.parsed;
      const resolved =
        typeof parsedVal === "string"
          ? (() => {
              try {
                return JSON.parse(parsedVal) as DetectFurnitureResult;
              } catch {
                return undefined;
              }
            })()
          : Array.isArray(parsedVal) && parsedVal.length > 0
            ? (parsedVal[0] as DetectFurnitureResult)
            : (parsedVal as DetectFurnitureResult);
      data = resolved;
      segmentedObjects = Array.isArray(raw.segmentedObjects)
        ? raw.segmentedObjects
        : data?.segmentedObjects;
    } else if (raw?.data != null && typeof raw.data === "object") {
      const inner = raw.data as unknown as Record<string, unknown>;
      if (inner.parsed != null && typeof inner.parsed === "object") {
        const parsedVal = inner.parsed;
        data = Array.isArray(parsedVal) && parsedVal.length > 0
          ? (parsedVal[0] as unknown as DetectFurnitureResult)
          : (parsedVal as unknown as DetectFurnitureResult);
        segmentedObjects = Array.isArray(inner.segmentedObjects)
          ? inner.segmentedObjects
          : Array.isArray(raw.segmentedObjects)
            ? raw.segmentedObjects
            : data?.segmentedObjects;
      } else {
        data = inner as DetectFurnitureResult;
        segmentedObjects = data?.segmentedObjects;
      }
    } else {
      data = res as DetectFurnitureResult;
      segmentedObjects = data?.segmentedObjects;
    }

    const detections =
      data?.detections ??
      (Array.isArray((raw as { detections?: unknown }).detections)
        ? (raw as { detections: unknown[] }).detections
        : undefined);

    if (detections && Array.isArray(detections)) {
      for (const categoryObj of detections) {
        const obj = categoryObj as Record<string, unknown>;
        for (const [categoryName, itemsArr] of Object.entries(obj)) {
          if (!Array.isArray(itemsArr)) continue;
          const items: DetectedFurnitureItem[] = [];
          for (const item of itemsArr) {
            const label = item?.label ?? "item";
            const bbox = item?.boundingBox;
            const id = `${label}-${globalIndex}`;
            globalIndex += 1;
            const isNormalized =
              bbox &&
              bbox.x <= 1 &&
              bbox.y <= 1 &&
              bbox.width <= 1 &&
              bbox.height <= 1 &&
              bbox.x >= 0 &&
              bbox.y >= 0;
            if (bbox && isNormalized && imgWidth && imgHeight) {
              items.push({
                id,
                label,
                maskUrl: "",
                objectUrl: baseImageUrl,
                boundingBox: {
                  x: bbox.x * imgWidth,
                  y: bbox.y * imgHeight,
                  width: bbox.width * imgWidth,
                  height: bbox.height * imgHeight,
                },
              });
            } else if (bbox) {
              items.push({
                id,
                label,
                maskUrl: "",
                objectUrl: baseImageUrl,
                boundingBox: {
                  x: bbox.x,
                  y: bbox.y,
                  width: bbox.width,
                  height: bbox.height,
                },
              });
            } else {
              items.push({
                id,
                label,
                maskUrl: "",
                objectUrl: baseImageUrl,
                boundingBox: null,
              });
            }
          }
          if (items.length > 0) {
            groups.push({
              category: categoryName,
              items,
            });
          }
        }
      }
    }

    if (segmentedObjects && Array.isArray(segmentedObjects)) {
      const items: DetectedFurnitureItem[] = [];
      for (const obj of segmentedObjects) {
        const seg = obj as { label: string; boundingBox?: { x: number; y: number; width: number; height: number } | null };
        const id = `${seg.label}-${globalIndex}`;
        globalIndex += 1;
        items.push({
          id,
          label: seg.label,
          maskUrl: "",
          objectUrl: baseImageUrl,
          boundingBox: seg.boundingBox ?? null,
        });
      }
      if (items.length > 0) {
        groups.push({ category: "other", items });
      }
    }

    return groups;
  }

  const handleStep1Submit = async () => {
    const baseImage = step1.uploadedImageUrl ?? step1.uploadedImage;
    const imageId = step1.imageId;
    if (!baseImage || !imageId) {
      toast.error("Please upload an image first.");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    setStepErrorMessage(null);

    // Advance to step 2 first, then call APIs (loader shows in step 2)
    setCurrentStep(2);
    setStepLoadingFor(2);

    try {
      const roomType =
        normalizeRoomType(step1.roomTypes[0] ?? step1.roomType) || "living_room";
      const createPayload = {
        name: step1.spaceName.trim() || "New Space",
        description: "",
        type: roomType,
        status: "DRAFT" as const,
        imageId,
        widthM: step1.dimensions.width ?? undefined,
        depthM: step1.dimensions.depth ?? undefined,
        heightM: step1.dimensions.height ?? undefined,
        budget: step1.budget ?? undefined,
      };

      // comment out the api call and use promise with resolved after 3 sec, with createSpaceApiResp as the result
      // const createResult = await Promise.resolve(createSpaceApiResp);
      const createResult = await createSpace(createPayload);
      if (createResult.error || !createResult.data) {
        setStepLoadingFor(null);
        setStepErrorMessage(createResult.error ?? "Failed to create space");
        return;
      }

      const space = createResult.data.space;
      step1.setSpace(space);

      // comment out the api call and use promise with resolved after 3 sec, with detectApiResp as the result
      // const detectResult = await Promise.resolve(detectApiResp);
      const detectResult = await detectFurniture(space.id, { imageId });
      if (detectResult.error) {
        setStepLoadingFor(null);
        setStepErrorMessage(
          detectResult.error ?? "Failed to detect furniture",
        );
        return;
      }
      

      const imgDims = step1.imageDimensions;
      const imgWidth = imgDims?.width ?? 1920;
      const imgHeight = imgDims?.height ?? 1080;

      const groupedItems = mapDetectResponseToGroupedItems(
        detectResult.data ?? {},
        baseImage,
        imgWidth,
        imgHeight,
      );
      console.log('groupedItems', groupedItems);
      const flatItems = groupedItems.flatMap((g) => g.items);
      console.log('flatItems', flatItems);
      step2.setDetectedFurnitureGrouped(groupedItems);
      step2.setDetectedFurniture(flatItems);
      step2.setSelectedFurniture([]);
      setStepLoadingFor(null);
    } catch (error) {
      setStepLoadingFor(null);
      setStepErrorMessage(
        error instanceof Error ? error.message : "Failed to process step 1",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep2Submit = async () => {
    const space = step1.space;
    const imageId = step1.imageId;
    if (!space || !imageId) {
      toast.error("Space or image not found. Please complete step 1 first.");
      return;
    }

    const allSelected =
      step2.detectedFurniture.length === 0 ||
      step2.selectedFurniture.length === step2.detectedFurniture.length;

    if (!allSelected) {
      const selectedItems = step2.detectedFurniture.filter((item) =>
        step2.selectedFurniture.includes(item.id),
      );
      if (selectedItems.length === 0) {
        toast.error("Please select at least one element to remove.");
        return;
      }
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    setStepErrorMessage(null);

    // Advance to step 3 first, then call API (loader shows in step 3)
    setCurrentStep(3);
    setStepLoadingFor(3);

    try {
      let result: { path?: string; image?: { id?: string; storagePath?: string } } | null = null;

      if (allSelected) {
        const res = await emptyCompleteRoom(space.id, { imageId });
        if (res.error) {
          setStepLoadingFor(null);
          setStepErrorMessage(res.error ?? "Failed to empty room");
          return;
        }
        result = res.data;
      } else {
        const selectedItems = step2.detectedFurniture.filter((item) =>
          step2.selectedFurniture.includes(item.id),
        );
        const items = selectedItems.map((item) => ({
          label: item.label,
          boudingBox: item.boundingBox
            ? {
                x: item.boundingBox.x,
                y: item.boundingBox.y,
                width: item.boundingBox.width,
                height: item.boundingBox.height,
              }
            : { x: 0, y: 0, width: 0, height: 0 },
        }));
        const res = await removeFurniture(space.id, { imageId, items });
        if (res.error) {
          setStepLoadingFor(null);
          setStepErrorMessage(res.error ?? "Failed to remove furniture");
          return;
        }
        result = res.data;
      }

      const path = result?.path ?? result?.image?.storagePath;
      const cleanedUrl = path
        ? await getSignedUrlForPath(path)
        : step1.uploadedImageUrl;
      if (cleanedUrl) {
        step2.setCleanedImageUrl(cleanedUrl);
      }
      const intermediateId = result?.image?.id;
      if (intermediateId) {
        step2.setIntermediateImageId(intermediateId);
      }
      setStepLoadingFor(null);
    } catch (error) {
      setStepLoadingFor(null);
      setStepErrorMessage(
        error instanceof Error ? error.message : "Failed to process step 2",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep3Submit = async () => {
    const space = step1.space;
    const intermediateImageId = step2.intermediateImageId;
    const inspirationImageId = step3.inspirationImageId;
    if (!space || !intermediateImageId) {
      toast.error("Empty room image not found. Please complete step 2 first.");
      return;
    }
    if (!inspirationImageId) {
      toast.error("Please upload an inspiration image first.");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    setStepErrorMessage(null);

    // Advance to step 4 first, then call API (loader shows in step 4)
    setCurrentStep(4);
    setStepLoadingFor(4);

    try {
      const res = await fillRoomFromInspirationFurniture(space.id, {
        imageId: intermediateImageId,
        inpirationFurnitureImageId: inspirationImageId,
        aiContext: {
          style_keywords: step3.styleKeywords,
          mood: step3.mood,
          materials: step3.materials,
        },
      });

      if (res.error) {
        setStepLoadingFor(null);
        setStepErrorMessage(res.error ?? "Failed to generate design");
        return;
      }

      const path = res.data?.path ?? res.data?.image?.storagePath;
      const finalUrl = path ? await getSignedUrlForPath(path) : null;
      if (finalUrl) {
        step4.setFinalImageUrl(finalUrl);
      }
      setStepLoadingFor(null);
    } catch (error) {
      setStepLoadingFor(null);
      setStepErrorMessage(
        error instanceof Error ? error.message : "Failed to generate design",
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
    if (currentStep === 3) {
      void handleStep3Submit();
      return;
    }
    if (currentStep < 6) {
      setCurrentStep((currentStep + 1) as 1 | 2 | 3 | 4 | 5 | 6);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setStepErrorMessage(null);
      setCurrentStep((currentStep - 1) as 1 | 2 | 3 | 4 | 5 | 6);
    }
  };

  const handleRetryStep2 = async () => {
    const baseImage = step1.uploadedImageUrl ?? step1.uploadedImage;
    const imageId = step1.imageId;
    const space = step1.space;
    if (!baseImage || !imageId) {
      toast.error("Please upload an image first.");
      return;
    }
    if (isSubmitting) return;

    setStepErrorMessage(null);
    setIsSubmitting(true);
    setStepLoadingFor(2);

    try {
      if (space) {
        const detectResult = await detectFurniture(space.id, { imageId });
        if (detectResult.error) {
          setStepLoadingFor(null);
          setStepErrorMessage(
            detectResult.error ?? "Failed to detect furniture",
          );
          return;
        }
        const imgDims = step1.imageDimensions;
        const imgWidth = imgDims?.width ?? 1920;
        const imgHeight = imgDims?.height ?? 1080;
        const groupedItems = mapDetectResponseToGroupedItems(
          detectResult.data ?? {},
          baseImage,
          imgWidth,
          imgHeight,
        );
        const flatItems = groupedItems.flatMap((g) => g.items);
        step2.setDetectedFurnitureGrouped(groupedItems);
        step2.setDetectedFurniture(flatItems);
        step2.setSelectedFurniture([]);
      } else {
        void handleStep1Submit();
        return;
      }
      setStepLoadingFor(null);
    } catch (error) {
      setStepLoadingFor(null);
      setStepErrorMessage(
        error instanceof Error ? error.message : "Failed to detect furniture",
      );
    } finally {
      setIsSubmitting(false);
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
            maxStepReached={maxStepReached}
          />

          <div className="grid gap-x-8 gap-y-4 xl:pr-24 lg:grid-cols-[1fr_minmax(290px,300px)] xl:grid-cols-[1fr_minmax(320px,380px)]">
            <div className="flex flex-col gap-1.5 min-h-0">
              <div className="min-h-0">
                <StepCanvasPanel onRetryStep2={handleRetryStep2} />
              </div>

              <ImagePhaseGrid />

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
                (currentStep === 2 &&
                  step2.detectedFurniture.length > 0 &&
                  step2.selectedFurniture.length === 0) ||
                (currentStep === 3 && !step3.inspirationImageId) ||
                isSubmitting ||
                stepLoadingFor !== null ||
                stepErrorMessage !== null
                  }
                >
                  {isSubmitting || stepLoadingFor !== null
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
                (currentStep === 2 &&
                  step2.detectedFurniture.length > 0 &&
                  step2.selectedFurniture.length === 0) ||
                (currentStep === 3 && !step3.inspirationImageId) ||
                isSubmitting ||
                stepLoadingFor !== null ||
                stepErrorMessage !== null
              }
            >
              {isSubmitting || stepLoadingFor !== null
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
