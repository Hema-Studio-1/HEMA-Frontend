"use client";

import type {
  ChatMessage,
  DetectedFurnitureGroup,
  DetectedFurnitureItem,
  Dimensions,
  FlowTab,
  Step,
} from "@/containers/ai-generation-flow/types";
import type { SpaceWithRelations } from "@/types/space";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  AIGenerationFlowContextValue,
  Step1Context,
  Step2Context,
  Step3Context,
  Step4Context,
  Step5Context,
  Step6Context,
} from "./types";

const AIGenerationFlowContext =
  createContext<AIGenerationFlowContextValue | null>(null);

const defaultDimensions: Dimensions = {
  width: null,
  depth: null,
  height: null,
};

export function AIGenerationFlowProvider({
  children,
  initialSpaceName = "",
}: {
  children: React.ReactNode;
  initialSpaceName?: string;
}) {
  // Step 1: Space info (from creation + editable)
  const [space, setSpace] = useState<SpaceWithRelations | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [spaceName, setSpaceName] = useState(initialSpaceName);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
  const [roomTypes, setRoomTypes] = useState<string[]>([]);
  const [roomType, setRoomType] = useState("");
  const [dimensions, setDimensions] = useState<Dimensions>(defaultDimensions);
  const [budget, setBudget] = useState<number | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // Step 2
  const [detectedFurniture, setDetectedFurniture] = useState<
    DetectedFurnitureItem[]
  >([]);
  const [detectedFurnitureGrouped, setDetectedFurnitureGrouped] = useState<
    DetectedFurnitureGroup[]
  >([]);
  const [selectedFurniture, setSelectedFurniture] = useState<string[]>([]);
  const [cleanedImageUrl, setCleanedImageUrl] = useState<string | null>(null);
  const [intermediateImageId, setIntermediateImageId] = useState<string | null>(
    null,
  );
  const [didRemoveFurniture, setDidRemoveFurniture] = useState(false);

  // Step 3
  const [styleKeywords, setStyleKeywords] = useState("");
  const [mood, setMood] = useState("");
  const [materials, setMaterials] = useState("");
  const [inspirationImages, setInspirationImages] = useState<string[]>([]);
  const [inspirationImageId, setInspirationImageId] = useState<string | null>(
    null,
  );
  const [inspirationImageUrl, setInspirationImageUrl] = useState<string | null>(
    null,
  );
  const [generatedImageId, setGeneratedImageId] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null,
  );

  // Step 4
  const [selectedLayout, setSelectedLayout] = useState<number | null>(null);
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);
  const [floorPlanImageId, setFloorPlanImageId] = useState<string | null>(null);
  const [floorPlanImageUrl, setFloorPlanImageUrl] = useState<string | null>(
    null,
  );
  const [floorPlanResultUrl, setFloorPlanResultUrl] = useState<string | null>(
    null,
  );
  const [surpriseImageUrl, setSurpriseImageUrl] = useState<string | null>(null);

  // Step 5
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [customProductImages, setCustomProductImages] = useState<string[]>([]);

  // Step 6
  const [selectedProducts, setSelectedProducts] = useState<
    Record<string, number>
  >({});

  // Flow navigation
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [maxStepReached, setMaxStepReached] = useState<Step>(1);

  useEffect(() => {
    setMaxStepReached((max) => (currentStep > max ? currentStep : max));
  }, [currentStep]);

  // Step loading & error (shown in target step after advance)
  const [stepLoadingFor, setStepLoadingFor] = useState<2 | 3 | 4 | null>(null);
  const [stepErrorMessage, setStepErrorMessage] = useState<string | null>(null);
  const [step4FloorPlanLoading, setStep4FloorPlanLoading] = useState(false);

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatMessage, setChatMessage] = useState("");

  // UI
  const [activeTab, setActiveTab] = useState<FlowTab>("controls");
  const [isFullView, setIsFullView] = useState(false);
  const [isCommentsPanelOpen, setIsCommentsPanelOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false);
  const [versionToRestore, setVersionToRestore] = useState<number | null>(null);
  const [currentVersion, setCurrentVersion] = useState(3);

  useEffect(() => {
    setSpaceName(initialSpaceName);
  }, [initialSpaceName]);

  const handleClearDraft = useCallback((initialSpaceName = "") => {
    setSpace(null);
    setUploadedImageUrl(null);
    setSpaceName(initialSpaceName);
    setSelectedProjectId(null);
    setRoomTypes([]);
    setRoomType("");
    setDimensions(defaultDimensions);
    setBudget(null);
    setUploadedImage(null);
    setImageId(null);
    setImageDimensions(null);
    setDetectedFurniture([]);
    setDetectedFurnitureGrouped([]);
    setSelectedFurniture([]);
    setCleanedImageUrl(null);
    setIntermediateImageId(null);
    setDidRemoveFurniture(false);
    setStyleKeywords("");
    setMood("");
    setMaterials("");
    setInspirationImages([]);
    setInspirationImageId(null);
    setInspirationImageUrl(null);
    setGeneratedImageId(null);
    setGeneratedImageUrl(null);
    setSelectedLayout(null);
    setFinalImageUrl(null);
    setFloorPlanImageId(null);
    setFloorPlanImageUrl(null);
    setFloorPlanResultUrl(null);
    setSurpriseImageUrl(null);
    setStepLoadingFor(null);
    setStepErrorMessage(null);
    setStep4FloorPlanLoading(false);
    setActiveFilters([]);
    setShowBeforeAfter(false);
    setCustomProductImages([]);
    setSelectedProducts({});
    setCurrentStep(1);
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!chatMessage.trim()) return;
    const newMessage: ChatMessage = {
      id: "2026-03-19T17:54:49.425Z",
      text: chatMessage.trim(),
      sender: "user",
      timestamp: "2026-03-19T17:54:49.425Z",
    };
    setChatMessages((prev) => [...prev, newMessage]);
    setChatMessage("");
  }, [chatMessage]);

  const step1: Step1Context = useMemo(
    () => ({
      space,
      uploadedImageUrl,
      spaceName,
      selectedProjectId,
      roomTypes,
      roomType,
      dimensions,
      budget,
      uploadedImage,
      imageId,
      imageDimensions,
      setSpace,
      setUploadedImageUrl,
      setSpaceName,
      setSelectedProjectId,
      setRoomTypes,
      setRoomType,
      setDimensions,
      setBudget,
      setUploadedImage,
      setImageId,
      setImageDimensions,
    }),
    [
      space,
      uploadedImageUrl,
      spaceName,
      selectedProjectId,
      roomTypes,
      roomType,
      dimensions,
      budget,
      uploadedImage,
      imageId,
      imageDimensions,
    ],
  );

  const step2: Step2Context = useMemo(
    () => ({
      detectedFurniture,
      detectedFurnitureGrouped,
      selectedFurniture,
      cleanedImageUrl,
      intermediateImageId,
      didRemoveFurniture,
      setDetectedFurniture,
      setDetectedFurnitureGrouped,
      setSelectedFurniture,
      setCleanedImageUrl,
      setIntermediateImageId,
      setDidRemoveFurniture,
    }),
    [
      detectedFurniture,
      detectedFurnitureGrouped,
      selectedFurniture,
      cleanedImageUrl,
      intermediateImageId,
      didRemoveFurniture,
    ],
  );

  const step3: Step3Context = useMemo(
    () => ({
      styleKeywords,
      mood,
      materials,
      inspirationImages,
      inspirationImageId,
      inspirationImageUrl,
      generatedImageId,
      generatedImageUrl,
      setStyleKeywords,
      setMood,
      setMaterials,
      setInspirationImages,
      setInspirationImageId,
      setInspirationImageUrl,
      setGeneratedImageId,
      setGeneratedImageUrl,
    }),
    [
      styleKeywords,
      mood,
      materials,
      inspirationImages,
      inspirationImageId,
      inspirationImageUrl,
      generatedImageId,
      generatedImageUrl,
    ],
  );

  const step4: Step4Context = useMemo(
    () => ({
      selectedLayout,
      inspirationImages,
      finalImageUrl,
      floorPlanImageId,
      floorPlanImageUrl,
      floorPlanResultUrl,
      surpriseImageUrl,
      setSelectedLayout,
      setFinalImageUrl,
      setFloorPlanImageId,
      setFloorPlanImageUrl,
      setFloorPlanResultUrl,
      setSurpriseImageUrl,
    }),
    [
      selectedLayout,
      inspirationImages,
      finalImageUrl,
      floorPlanImageId,
      floorPlanImageUrl,
      floorPlanResultUrl,
      surpriseImageUrl,
    ],
  );

  const step5: Step5Context = useMemo(
    () => ({
      activeFilters,
      showBeforeAfter,
      customProductImages,
      setActiveFilters,
      setShowBeforeAfter,
      setCustomProductImages,
    }),
    [activeFilters, showBeforeAfter, customProductImages],
  );

  const step6: Step6Context = useMemo(
    () => ({
      selectedProducts,
      setSelectedProducts,
    }),
    [selectedProducts],
  );

  const value = useMemo<AIGenerationFlowContextValue>(
    () => ({
      step1,
      step2,
      step3,
      step4,
      step5,
      step6,
      currentStep,
      setCurrentStep,
      maxStepReached,
      chatMessages,
      setChatMessages,
      chatMessage,
      setChatMessage,
      activeTab,
      setActiveTab,
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
      stepLoadingFor,
      stepErrorMessage,
      step4FloorPlanLoading,
      setStepLoadingFor,
      setStepErrorMessage,
      setStep4FloorPlanLoading,
      handleClearDraft,
      handleSendMessage,
    }),
    [
      step1,
      step2,
      step3,
      step4,
      step5,
      step6,
      currentStep,
      maxStepReached,
      chatMessages,
      chatMessage,
      activeTab,
      isFullView,
      isCommentsPanelOpen,
      isVersionHistoryOpen,
      isRestoreConfirmOpen,
      versionToRestore,
      currentVersion,
      stepLoadingFor,
      stepErrorMessage,
      step4FloorPlanLoading,
      handleClearDraft,
      handleSendMessage,
    ],
  );

  return (
    <AIGenerationFlowContext.Provider value={value}>
      {children}
    </AIGenerationFlowContext.Provider>
  );
}

export function useAIGenerationFlowContext(): AIGenerationFlowContextValue {
  const ctx = useContext(AIGenerationFlowContext);
  if (!ctx) {
    throw new Error(
      "useAIGenerationFlowContext must be used within AIGenerationFlowProvider",
    );
  }
  return ctx;
}
