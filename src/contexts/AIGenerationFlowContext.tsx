"use client";

import type {
    ChatMessage,
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

  // Step 2
  const [detectedFurniture, setDetectedFurniture] = useState<
    DetectedFurnitureItem[]
  >([]);
  const [selectedFurniture, setSelectedFurniture] = useState<string[]>([]);
  const [cleanedImageUrl, setCleanedImageUrl] = useState<string | null>(null);

  // Step 3
  const [styleKeywords, setStyleKeywords] = useState("");
  const [mood, setMood] = useState("");
  const [materials, setMaterials] = useState("");
  const [inspirationImages, setInspirationImages] = useState<string[]>([]);

  // Step 4
  const [selectedLayout, setSelectedLayout] = useState<number | null>(null);

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
    setDetectedFurniture([]);
    setSelectedFurniture([]);
    setCleanedImageUrl(null);
    setStyleKeywords("");
    setMood("");
    setMaterials("");
    setInspirationImages([]);
    setSelectedLayout(null);
    setActiveFilters([]);
    setShowBeforeAfter(false);
    setCustomProductImages([]);
    setSelectedProducts({});
    setCurrentStep(1);
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!chatMessage.trim()) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatMessage.trim(),
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
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
      setSpace,
      setUploadedImageUrl,
      setSpaceName,
      setSelectedProjectId,
      setRoomTypes,
      setRoomType,
      setDimensions,
      setBudget,
      setUploadedImage,
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
    ],
  );

  const step2: Step2Context = useMemo(
    () => ({
      detectedFurniture,
      selectedFurniture,
      cleanedImageUrl,
      setDetectedFurniture,
      setSelectedFurniture,
      setCleanedImageUrl,
    }),
    [detectedFurniture, selectedFurniture, cleanedImageUrl],
  );

  const step3: Step3Context = useMemo(
    () => ({
      styleKeywords,
      mood,
      materials,
      inspirationImages,
      setStyleKeywords,
      setMood,
      setMaterials,
      setInspirationImages,
    }),
    [styleKeywords, mood, materials, inspirationImages],
  );

  const step4: Step4Context = useMemo(
    () => ({
      selectedLayout,
      inspirationImages,
      setSelectedLayout,
    }),
    [selectedLayout, inspirationImages],
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
      chatMessages,
      chatMessage,
      activeTab,
      isFullView,
      isCommentsPanelOpen,
      isVersionHistoryOpen,
      isRestoreConfirmOpen,
      versionToRestore,
      currentVersion,
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
