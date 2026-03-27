import type { LucideIcon } from "lucide-react";

export type Step = 1 | 2 | 3 | 4 | 5 | 6;
export type FlowTab = "controls" | "chat";

export interface StepMeta {
  number: Step;
  title: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
}

export interface Dimensions {
  width: number | null;
  depth: number | null;
  height: number | null;
}

export interface RoomTypeOption {
  value: string;
  label: string;
  icon: LucideIcon;
}

export interface FurnitureCategory {
  category: string;
  items: string[];
}

export interface ShoppingItem {
  id: string;
  name: string;
  price: number;
  retailer: string;
  size: string;
  finish: string;
  imageUrl?: string;
}

export interface VersionHistoryItem {
  version: number;
  label: string;
  timestamp: string;
}

/** Step 1: The Basics - space info from creation + editable fields */
export interface Step1Data {
  space: import("@/types/space").SpaceWithRelations | null;
  spaceName: string;
  selectedProjectId: string | null;
  roomTypes: string[];
  roomType: string; // legacy, kept for compatibility
  dimensions: Dimensions;
  budget: number | null;
  uploadedImage: string | null;
  uploadedImageUrl: string | null;
  imageId: string | null;
  imageDimensions: { width: number; height: number } | null;
}

/** Step 2: Make Space - furniture to remove */
export interface DetectedFurnitureItem {
  id: string;
  label: string;
  maskUrl: string;
  objectUrl?: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
}

/** Group of detected items by category (as returned from API) */
export interface DetectedFurnitureGroup {
  category: string;
  items: DetectedFurnitureItem[];
}

export interface Step2Data {
  detectedFurniture: DetectedFurnitureItem[];
  detectedFurnitureGrouped: DetectedFurnitureGroup[];
  selectedFurniture: string[];
  cleanedImageUrl: string | null;
  intermediateImageId: string | null;
  didRemoveFurniture: boolean;
}

/** Step 3: Add Inspiration - style, mood, materials, inspiration images */
export interface Step3Data {
  styleKeywords: string;
  mood: string;
  materials: string;
  inspirationImages: string[];
  inspirationImageId: string | null;
  inspirationImageUrl: string | null;
  generatedImageId: string | null;
  generatedImageUrl: string | null;
}

/** Step 4: Room Layout */
export interface Step4Data {
  selectedLayout: number | null;
  finalImageUrl: string | null;
  floorPlanImageId: string | null;
  floorPlanImageUrl: string | null;
  floorPlanResultUrl: string | null;
  surpriseImageUrl: string | null;
  inspirationImages: string[];
}

/** Step 5: Amend Design */
export interface Step5Data {
  activeFilters: string[];
  showBeforeAfter: boolean;
  customProductImages: string[];
}

/** Step 6: Shop the Room */
export interface Step6Data {
  selectedProducts: Record<string, number>;
}
