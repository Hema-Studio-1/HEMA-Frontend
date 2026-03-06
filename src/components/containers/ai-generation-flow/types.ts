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
  width: string;
  depth: string;
  height: string;
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
}

export interface VersionHistoryItem {
  version: number;
  label: string;
  timestamp: string;
}
