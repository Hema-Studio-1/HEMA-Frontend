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
import {
  createSpace,
  detectFurniture,
  emptyCompleteRoom,
  fillRoomFromInspirationFurniture,
  fillRoomFromInspirationFurnitureWithActualImage,
  fillRoomFromSurprise,
  removeFurniture,
} from "@/services/api/spaces";
import type {
  DetectedObject,
  DetectFurnitureResponse,
  DetectFurnitureResult,
  DetectionBoundingBox,
  FlatDetectedItem,
  GroupedDetectedItems,
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
    step4FloorPlanLoading,
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
    const groupsByCategory = new Map<string, DetectedFurnitureItem[]>();
    let globalIndex = 0;

    const raw = res as Record<string, unknown>;
    let data: DetectFurnitureResult | undefined;
    let segmentedObjects: unknown[] | undefined;

    const toDetectedFurnitureItem = (
      label: string,
      boundingBox?: DetectionBoundingBox | null,
    ): DetectedFurnitureItem => {
      const id = `${label}-${globalIndex}`;
      globalIndex += 1;
      const isNormalized =
        boundingBox != null &&
        boundingBox.x <= 1 &&
        boundingBox.y <= 1 &&
        boundingBox.width <= 1 &&
        boundingBox.height <= 1 &&
        boundingBox.x >= 0 &&
        boundingBox.y >= 0;

      if (boundingBox && isNormalized && imgWidth && imgHeight) {
        return {
          id,
          label,
          maskUrl: "",
          objectUrl: baseImageUrl,
          boundingBox: {
            x: boundingBox.x * imgWidth,
            y: boundingBox.y * imgHeight,
            width: boundingBox.width * imgWidth,
            height: boundingBox.height * imgHeight,
          },
        };
      }

      return {
        id,
        label,
        maskUrl: "",
        objectUrl: baseImageUrl,
        boundingBox:
          boundingBox == null
            ? null
            : {
                x: boundingBox.x,
                y: boundingBox.y,
                width: boundingBox.width,
                height: boundingBox.height,
              },
      };
    };

    const addItemToGroup = (
      category: string,
      item: DetectedFurnitureItem,
    ): void => {
      const normalizedCategory = category || "other";
      const group = groupsByCategory.get(normalizedCategory);
      if (group) {
        group.push(item);
        return;
      }

      groupsByCategory.set(normalizedCategory, [item]);
    };

    type FlatLikeDetection = FlatDetectedItem | DetectedObject;

    const isFlatDetection = (value: unknown): value is FlatLikeDetection => {
      if (value == null || typeof value !== "object") {
        return false;
      }

      const detection = value as {
        detected?: unknown;
        label?: unknown;
      };

      return (
        typeof detection.label === "string" ||
        typeof detection.detected === "string"
      );
    };

    const isGroupedDetection = (
      value: unknown,
    ): value is GroupedDetectedItems =>
      value != null && typeof value === "object" && !isFlatDetection(value);

    const getDetectionLabel = (detection: FlatLikeDetection): string => {
      if (typeof (detection as FlatDetectedItem).label === "string") {
        return (detection as FlatDetectedItem).label;
      }

      if (typeof (detection as DetectedObject).detected === "string") {
        return (detection as DetectedObject).detected;
      }

      return "item";
    };

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
        data =
          Array.isArray(parsedVal) && parsedVal.length > 0
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
        : Array.isArray(data?.output?.detections)
          ? data.output.detections
          : undefined);

    if (detections && Array.isArray(detections)) {
      for (const detection of detections) {
        if (isFlatDetection(detection)) {
          addItemToGroup(
            detection.category ?? "other",
            toDetectedFurnitureItem(
              getDetectionLabel(detection),
              detection.boundingBox,
            ),
          );
          continue;
        }

        if (!isGroupedDetection(detection)) {
          continue;
        }

        for (const [categoryName, itemsArr] of Object.entries(detection)) {
          if (!Array.isArray(itemsArr)) {
            continue;
          }

          for (const item of itemsArr) {
            if (!isFlatDetection(item)) {
              continue;
            }

            addItemToGroup(
              categoryName,
              toDetectedFurnitureItem(
                getDetectionLabel(item),
                item.boundingBox,
              ),
            );
          }
        }
      }
    }

    if (segmentedObjects && Array.isArray(segmentedObjects)) {
      for (const obj of segmentedObjects) {
        const seg = obj as {
          label?: string;
          boundingBox?: DetectionBoundingBox | null;
        };
        if (!seg.label) {
          continue;
        }

        addItemToGroup(
          "other",
          toDetectedFurnitureItem(seg.label, seg.boundingBox),
        );
      }
    }

    return Array.from(groupsByCategory, ([category, items]) => ({
      category,
      items,
    }));
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
        normalizeRoomType(step1.roomTypes[0] ?? step1.roomType) ||
        "living_room";
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
        setStepErrorMessage(detectResult.error ?? "Failed to detect furniture");
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
      console.log("groupedItems", groupedItems);
      const flatItems = groupedItems.flatMap((g) => g.items);
      console.log("flatItems", flatItems);
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

    // Allow proceeding without selecting any element:
    // - skip remove/empty-room APIs
    // - use the original image as the "intermediate" input for step 3
    // - keep cleaned image URL unset so step 3 shows the original
    if (!allSelected) {
      const selectedItems = step2.detectedFurniture.filter((item) =>
        step2.selectedFurniture.includes(item.id),
      );

      if (selectedItems.length === 0) {
        step2.setCleanedImageUrl(null);
        step2.setIntermediateImageId(imageId);
        step2.setDidRemoveFurniture(false);
        setCurrentStep(3);
        setStepLoadingFor(null);
        setStepErrorMessage(null);
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
      let result: {
        path?: string;
        image?: { id?: string; storagePath?: string };
      } | null = null;

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

      step2.setDidRemoveFurniture(true);

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
    const originalImageId = step1.imageId;
    const intermediateImageId = step2.intermediateImageId;
    const didRemoveFurniture = step2.didRemoveFurniture;
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
      const aiContext = {
        style_keywords: step3.styleKeywords,
        mood: step3.mood,
        materials: step3.materials,
      };

      const res =
        didRemoveFurniture && originalImageId
          ? await fillRoomFromInspirationFurnitureWithActualImage(space.id, {
              originalImageId,
              imageId: intermediateImageId,
              inpirationFurnitureImageId: inspirationImageId,
              aiContext,
            })
          : await fillRoomFromInspirationFurniture(space.id, {
              imageId: intermediateImageId,
              inpirationFurnitureImageId: inspirationImageId,
              aiContext,
            });

      if (res.error) {
        setStepLoadingFor(null);
        setStepErrorMessage(res.error ?? "Failed to generate design");
        return;
      }

      const path = res.data?.path ?? res.data?.image?.storagePath;
      const finalUrl = path ? await getSignedUrlForPath(path) : null;
      const generatedId = res.data?.image?.id;
      if (finalUrl) {
        step4.setFinalImageUrl(finalUrl);
      }
      if (generatedId) {
        step3.setGeneratedImageId(generatedId);
        step3.setGeneratedImageUrl(finalUrl ?? null);
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

  const handleStep3Surprise = async () => {
    const space = step1.space;
    const intermediateImageId = step2.intermediateImageId;
    if (!space || !intermediateImageId) {
      toast.error("Empty room image not found. Please complete step 2 first.");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    setStepErrorMessage(null);

    setCurrentStep(4);
    setStepLoadingFor(4);

    try {
      const res = await fillRoomFromSurprise(space.id, {
        imageId: intermediateImageId,
        aiContext: {
          style_keywords: step3.styleKeywords,
          mood: step3.mood,
          materials: step3.materials,
        },
      });

      if (res.error) {
        setStepLoadingFor(null);
        setStepErrorMessage(res.error ?? "Failed to generate surprise design");
        return;
      }

      const path = res.data?.path ?? res.data?.image?.storagePath;
      const finalUrl = path ? await getSignedUrlForPath(path) : null;
      const generatedId = res.data?.image?.id;
      if (finalUrl) {
        step4.setFinalImageUrl(finalUrl);
        step4.setSurpriseImageUrl(finalUrl);
      }
      if (generatedId) {
        step3.setGeneratedImageId(generatedId);
        step3.setGeneratedImageUrl(finalUrl ?? null);
      }
      setStepLoadingFor(null);
    } catch (error) {
      setStepLoadingFor(null);
      setStepErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to generate surprise design",
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
                    disabled={currentStep === 1 || step4FloorPlanLoading}
                  >
                    Go back
                  </Button>
                </div>

                {currentStep === 3 ? (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => void handleStep3Surprise()}
                      disabled={
                        !step2.intermediateImageId ||
                        isSubmitting ||
                        stepLoadingFor !== null ||
                        stepErrorMessage !== null
                      }
                    >
                      {isSubmitting || stepLoadingFor !== null
                        ? "Processing..."
                        : "Surprise"}
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      disabled={
                        !step3.inspirationImageId ||
                        isSubmitting ||
                        stepLoadingFor !== null ||
                        stepErrorMessage !== null
                      }
                    >
                      {isSubmitting || stepLoadingFor !== null
                        ? "Processing..."
                        : "Generate Design"}
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleNextStep}
                    disabled={
                      (currentStep === 1 &&
                        !(step1.uploadedImageUrl ?? step1.uploadedImage)) ||
                      isSubmitting ||
                      stepLoadingFor !== null ||
                      step4FloorPlanLoading ||
                      stepErrorMessage !== null
                    }
                  >
                    {isSubmitting || stepLoadingFor !== null
                      ? "Processing..."
                      : currentStep === 6
                        ? "Complete"
                        : "Next step"}
                  </Button>
                )}
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
                disabled={currentStep === 1 || step4FloorPlanLoading}
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
            {currentStep === 3 ? (
              <div className="flex gap-3">
                <Button
                  onClick={() => void handleStep3Surprise()}
                  disabled={
                    !step2.intermediateImageId ||
                    isSubmitting ||
                    stepLoadingFor !== null ||
                    stepErrorMessage !== null
                  }
                >
                  {isSubmitting || stepLoadingFor !== null
                    ? "Processing..."
                    : "Surprise"}
                </Button>
                <Button
                  onClick={handleNextStep}
                  disabled={
                    !step3.inspirationImageId ||
                    isSubmitting ||
                    stepLoadingFor !== null ||
                    stepErrorMessage !== null
                  }
                >
                  {isSubmitting || stepLoadingFor !== null
                    ? "Processing..."
                    : "Generate Design"}
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleNextStep}
                disabled={
                  (currentStep === 1 &&
                    !(step1.uploadedImageUrl ?? step1.uploadedImage)) ||
                  isSubmitting ||
                  stepLoadingFor !== null ||
                  step4FloorPlanLoading ||
                  stepErrorMessage !== null
                }
              >
                {isSubmitting || stepLoadingFor !== null
                  ? "Processing..."
                  : currentStep === 6
                    ? "Complete"
                    : "Next step"}
              </Button>
            )}
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
