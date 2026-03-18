import type {
    ChatMessage,
    DetectedFurnitureGroup,
    DetectedFurnitureItem,
    Dimensions,
    FlowTab,
    Step,
    Step1Data,
    Step2Data,
    Step3Data,
    Step4Data,
    Step5Data,
    Step6Data,
} from "@/containers/ai-generation-flow/types";
import type { SpaceWithRelations } from "@/types/space";
import type { Dispatch, SetStateAction } from "react";
export interface Step1Context extends Step1Data {
  setSpace: Dispatch<SetStateAction<SpaceWithRelations | null>>;
  setUploadedImageUrl: Dispatch<SetStateAction<string | null>>;
  setSpaceName: Dispatch<SetStateAction<string>>;
  setSelectedProjectId: Dispatch<SetStateAction<string | null>>;
  setRoomTypes: Dispatch<SetStateAction<string[]>>;
  setRoomType: Dispatch<SetStateAction<string>>;
  setDimensions: Dispatch<SetStateAction<Dimensions>>;
  setBudget: Dispatch<SetStateAction<number | null>>;
  setUploadedImage: Dispatch<SetStateAction<string | null>>;
  setImageId: Dispatch<SetStateAction<string | null>>;
  setImageDimensions: Dispatch<SetStateAction<{
    width: number;
    height: number;
  } | null>>;
}

export interface Step2Context extends Step2Data {
  setDetectedFurniture: Dispatch<SetStateAction<DetectedFurnitureItem[]>>;
  setDetectedFurnitureGrouped: Dispatch<
    SetStateAction<DetectedFurnitureGroup[]>
  >;
  setSelectedFurniture: Dispatch<SetStateAction<string[]>>;
  setCleanedImageUrl: Dispatch<SetStateAction<string | null>>;
  setIntermediateImageId: Dispatch<SetStateAction<string | null>>;
}

export interface Step3Context extends Step3Data {
  setStyleKeywords: Dispatch<SetStateAction<string>>;
  setMood: Dispatch<SetStateAction<string>>;
  setMaterials: Dispatch<SetStateAction<string>>;
  setInspirationImages: Dispatch<SetStateAction<string[]>>;
  setInspirationImageId: Dispatch<SetStateAction<string | null>>;
  setInspirationImageUrl: Dispatch<SetStateAction<string | null>>;
  setGeneratedImageId: Dispatch<SetStateAction<string | null>>;
  setGeneratedImageUrl: Dispatch<SetStateAction<string | null>>;
}

export interface Step4Context extends Step4Data {
  setSelectedLayout: Dispatch<SetStateAction<number | null>>;
  setFinalImageUrl: Dispatch<SetStateAction<string | null>>;
  setFloorPlanImageId: Dispatch<SetStateAction<string | null>>;
  setFloorPlanImageUrl: Dispatch<SetStateAction<string | null>>;
  setFloorPlanResultUrl: Dispatch<SetStateAction<string | null>>;
  setSurpriseImageUrl: Dispatch<SetStateAction<string | null>>;
}

export interface Step5Context extends Step5Data {
  setActiveFilters: Dispatch<SetStateAction<string[]>>;
  setShowBeforeAfter: Dispatch<SetStateAction<boolean>>;
  setCustomProductImages: Dispatch<SetStateAction<string[]>>;
}

export interface Step6Context extends Step6Data {
  setSelectedProducts: Dispatch<SetStateAction<Record<string, number>>>;
}

export interface AIGenerationFlowContextValue {
  // Step-grouped data (space info from creation + step-specific fields)
  step1: Step1Context;
  step2: Step2Context;
  step3: Step3Context;
  step4: Step4Context;
  step5: Step5Context;
  step6: Step6Context;

  // Flow navigation
  currentStep: Step;
  setCurrentStep: Dispatch<SetStateAction<Step>>;
  maxStepReached: Step;

  // Chat (shared across steps)
  chatMessages: ChatMessage[];
  setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  chatMessage: string;
  setChatMessage: Dispatch<SetStateAction<string>>;

  // UI state
  activeTab: FlowTab;
  setActiveTab: Dispatch<SetStateAction<FlowTab>>;
  isFullView: boolean;
  setIsFullView: Dispatch<SetStateAction<boolean>>;
  isCommentsPanelOpen: boolean;
  setIsCommentsPanelOpen: Dispatch<SetStateAction<boolean>>;
  isVersionHistoryOpen: boolean;
  setIsVersionHistoryOpen: Dispatch<SetStateAction<boolean>>;
  isRestoreConfirmOpen: boolean;
  setIsRestoreConfirmOpen: Dispatch<SetStateAction<boolean>>;
  versionToRestore: number | null;
  setVersionToRestore: Dispatch<SetStateAction<number | null>>;
  currentVersion: number;
  setCurrentVersion: Dispatch<SetStateAction<number>>;

  // Step loading & error (API calls after step change)
  stepLoadingFor: 2 | 3 | 4 | null;
  stepErrorMessage: string | null;
  step4FloorPlanLoading: boolean;
  setStepLoadingFor: Dispatch<SetStateAction<2 | 3 | 4 | null>>;
  setStepErrorMessage: Dispatch<SetStateAction<string | null>>;
  setStep4FloorPlanLoading: Dispatch<SetStateAction<boolean>>;

  // Actions
  handleClearDraft: (initialSpaceName?: string) => void;
  handleSendMessage: () => void;
}
