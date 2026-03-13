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
    imageUrl:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
  },
  {
    id: "2",
    name: "Linen Accent Chair",
    price: 549,
    retailer: "Article",
    size: "80 x 85 cm",
    finish: "Off-white Linen",
    imageUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
  },
  {
    id: "3",
    name: "Walnut Coffee Table",
    price: 429,
    retailer: "CB2",
    size: "120 x 60 cm",
    finish: "Walnut Veneer",
    imageUrl:
      "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400",
  },
  {
    id: "4",
    name: "Woven Area Rug",
    price: 349,
    retailer: "Rugs USA",
    size: "240 x 170 cm",
    finish: "Natural Jute",
    imageUrl:
      "https://images.unsplash.com/photo-1600166898405-da9535204843?w=400",
  },
  {
    id: "5",
    name: "Arc Floor Lamp",
    price: 189,
    retailer: "West Elm",
    size: "180 cm height",
    finish: "Brass",
    imageUrl:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
  },
  {
    id: "6",
    name: "Ceramic Vase Set",
    price: 79,
    retailer: "CB2",
    size: "Assorted",
    finish: "Matte Cream",
    imageUrl:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400",
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

/** Unsplash images by category for Step 5 (2-3 per category) */
export const UNSPLASH_IMAGES_BY_CATEGORY: Record<string, string[]> = {
  Seating: [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
    "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
  ],
  Tables: [
    "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800",
    "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
  ],
  Lighting: [
    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",
    "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800",
    "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800",
  ],
  Textiles: [
    "https://images.unsplash.com/photo-1600166898405-da9535204843?w=800",
    "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800",
    "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=800",
  ],
  Decor: [
    "https://images.unsplash.com/photo-1578909197646-13f650468e38?w=800",
    "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
  ],
  "Color palette": [
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
  ],
  Materials: [
    "https://images.unsplash.com/photo-1615529328331-f89187477180?w=800",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800",
  ],
};

/** Mock projects for Step 1 project dropdown */
export const MOCK_PROJECTS: { id: string; name: string }[] = [
  { id: "proj-1", name: "Modern Apartment" },
  { id: "proj-2", name: "Beach House" },
  { id: "proj-3", name: "Urban Loft" },
];

export const VERSION_HISTORY: VersionHistoryItem[] = [
  { version: 3, label: "Final tweaks", timestamp: "2 hours ago" },
  { version: 2, label: "Lighting changes", timestamp: "Yesterday" },
  { version: 1, label: "Initial generation", timestamp: "3 days ago" },
];
