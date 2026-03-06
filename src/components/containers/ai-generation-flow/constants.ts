import {
  Bath,
  Bed,
  Briefcase,
  ChefHat,
  DoorOpen,
  Home,
  UtensilsCrossed,
} from "lucide-react";
import type {
  FurnitureCategory,
  RoomTypeOption,
  ShoppingItem,
  StepMeta,
  VersionHistoryItem,
} from "./types";

export const STEPS: StepMeta[] = [
  { number: 1, title: "The Basics" },
  { number: 2, title: "Make Space" },
  { number: 3, title: "Add Inspiration" },
  { number: 4, title: "Room Layout" },
  { number: 5, title: "Amend Design" },
  { number: 6, title: "Shop the Room" },
];

export const ROOM_TYPE_OPTIONS: RoomTypeOption[] = [
  { value: "living-room", label: "Living room", icon: Home },
  { value: "bedroom", label: "Bedroom", icon: Bed },
  { value: "kitchen", label: "Kitchen", icon: ChefHat },
  { value: "dining-room", label: "Dining room", icon: UtensilsCrossed },
  { value: "bathroom", label: "Bathroom", icon: Bath },
  { value: "office", label: "Office", icon: Briefcase },
  { value: "entryway", label: "Entryway", icon: DoorOpen },
];

export const FURNITURE_CATEGORIES: FurnitureCategory[] = [
  {
    category: "Seating",
    items: ["Grey sofa", "Armchair", "Ottoman"],
  },
  {
    category: "Tables",
    items: ["Coffee table", "Side table"],
  },
  {
    category: "Textiles",
    items: ["Area rug", "Curtains"],
  },
  {
    category: "Lighting",
    items: ["Floor lamp", "Table lamp"],
  },
  {
    category: "Decor",
    items: ["Wall art", "Plants", "Vases"],
  },
];

export const SHOPPING_ITEMS: ShoppingItem[] = [
  {
    id: "1",
    name: "Scandinavian Oak Sofa",
    price: 1299,
    retailer: "West Elm",
    size: "220 x 90 cm",
    finish: "Natural Oak",
  },
  {
    id: "2",
    name: "Linen Accent Chair",
    price: 549,
    retailer: "Article",
    size: "80 x 85 cm",
    finish: "Off-white Linen",
  },
  {
    id: "3",
    name: "Walnut Coffee Table",
    price: 429,
    retailer: "CB2",
    size: "120 x 60 cm",
    finish: "Walnut Veneer",
  },
  {
    id: "4",
    name: "Woven Area Rug",
    price: 349,
    retailer: "Rugs USA",
    size: "240 x 170 cm",
    finish: "Natural Jute",
  },
  {
    id: "5",
    name: "Arc Floor Lamp",
    price: 189,
    retailer: "West Elm",
    size: "180 cm height",
    finish: "Brass",
  },
  {
    id: "6",
    name: "Ceramic Vase Set",
    price: 79,
    retailer: "CB2",
    size: "Assorted",
    finish: "Matte Cream",
  },
];

export const REFINE_FILTERS: string[] = [
  "Seating",
  "Tables",
  "Lighting",
  "Textiles",
  "Decor",
  "Color palette",
  "Materials",
];

export const VERSION_HISTORY: VersionHistoryItem[] = [
  { version: 3, label: "Final tweaks", timestamp: "2 hours ago" },
  { version: 2, label: "Lighting changes", timestamp: "Yesterday" },
  { version: 1, label: "Initial generation", timestamp: "3 days ago" },
];
