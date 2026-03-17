"use client";

import { uploadImages } from "@/actions/upload-files";
import { StepChatInterface } from "@/components/StepChatInterface";
import { StepLoader } from "@/components/StepLoader";
import { StepTabSwitcher } from "@/components/StepTabSwitcher";
import { Button } from "@/components/ui/button";
import { useAIGenerationFlowContext } from "@/contexts/AIGenerationFlowContext";
import { createImage } from "@/services/api/images";
import { ImageType } from "@/types/image";
import { Plus, Upload, X } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import {
  MOCK_PROJECTS,
  REFINE_FILTERS,
  ROOM_TYPE_OPTIONS,
  SHOPPING_ITEMS,
  STEPS,
  UNSPLASH_IMAGES_BY_CATEGORY,
} from "./constants";
import type {
  ChatMessage,
  DetectedFurnitureItem,
  Dimensions,
  FlowTab,
  Step,
} from "./types";

interface SharedPanelProps {
  activeTab: FlowTab;
  setActiveTab: (tab: FlowTab) => void;
  currentStep: Step;
  chatMessages: ChatMessage[];
  chatMessage: string;
  setChatMessage: (value: string) => void;
  onSendMessage: () => void;
}

function StepPanelShell({
  children,
  ...shared
}: SharedPanelProps & { children: React.ReactNode }) {
  return (
    <div className="lg:flex lg:flex-col lg:h-full">
      <div className="lg:flex lg:flex-col lg:h-full">
        <div className="flex-shrink-0">
          <StepTabSwitcher
            activeTab={shared.activeTab}
            onTabChange={shared.setActiveTab}
          />
        </div>
        <div className="lg:flex-1 lg:overflow-y-auto lg:min-h-0 mt-4">
          {shared.activeTab === "controls" ? (
            children
          ) : (
            <StepChatInterface
              stepTitle={STEPS[shared.currentStep - 1]?.title || ""}
              messages={shared.chatMessages}
              currentMessage={shared.chatMessage}
              onMessageChange={shared.setChatMessage}
              onSendMessage={shared.onSendMessage}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Step1Controls({
  selectedProjectId,
  setSelectedProjectId,
  spaceName,
  setSpaceName,
  roomTypes,
  setRoomTypes,
  dimensions,
  setDimensions,
  budget,
  setBudget,
  ...shared
}: SharedPanelProps & {
  selectedProjectId: string | null;
  setSelectedProjectId: (value: string | null) => void;
  spaceName: string;
  setSpaceName: (value: string) => void;
  roomTypes: string[];
  setRoomTypes: (value: string[]) => void;
  dimensions: Dimensions;
  setDimensions: (value: Dimensions) => void;
  budget: number | null;
  setBudget: (value: number | null) => void;
}) {
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [isRoomTypeOpen, setIsRoomTypeOpen] = useState(false);
  const projectRef = useRef<HTMLDivElement>(null);
  const roomTypeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = projectRef.current;
    const handleClickOutside = (event: MouseEvent) => {
      if (currentRef && !currentRef.contains(event.target as Node)) {
        setIsProjectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const currentRef = roomTypeRef.current;
    const handleClickOutside = (event: MouseEvent) => {
      if (currentRef && !currentRef.contains(event.target as Node)) {
        setIsRoomTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const parseOptionalNumber = (value: string): number | null => {
    if (!value.trim()) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const toggleRoomType = (value: string) => {
    if (roomTypes.includes(value)) {
      setRoomTypes(roomTypes.filter((v) => v !== value));
    } else {
      setRoomTypes([...roomTypes, value]);
    }
  };

  const inputStyle = {
    fontFamily: "'Inter', sans-serif" as const,
    fontWeight: 300,
  };

  return (
    <StepPanelShell {...shared}>
      <div className="space-y-8">
        {/* Project dropdown - commented out
        <div>
          <p className="block text-xs text-primary mb-2 uppercase tracking-widest font-medium">
            Project
          </p>
          <div className="relative" ref={projectRef}>
            <button
              type="button"
              onClick={() => setIsProjectOpen(!isProjectOpen)}
              className="w-full px-0 py-3 text-[16px] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500 text-left"
              style={{
                ...inputStyle,
                color: selectedProjectId ? "var(--foreground)" : "#c5c5c5",
              }}
            >
              {selectedProjectId
                ? MOCK_PROJECTS.find((p) => p.id === selectedProjectId)?.name ??
                  "Select project"
                : "Select project"}
            </button>
            {isProjectOpen ? (
              <div
                className="absolute left-0 right-0 mt-2 bg-background z-10 border border-[#E8E6E3] rounded-sm max-h-48 overflow-y-auto"
                style={inputStyle}
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProjectId(null);
                    setIsProjectOpen(false);
                  }}
                  className="w-full px-0 py-3 text-left text-[16px] text-foreground hover:bg-[#FAF9F7] transition-colors duration-300"
                >
                  (None)
                </button>
                {MOCK_PROJECTS.map((proj) => (
                  <button
                    type="button"
                    key={proj.id}
                    onClick={() => {
                      setSelectedProjectId(proj.id);
                      setIsProjectOpen(false);
                    }}
                    className="w-full px-0 py-3 text-left text-[16px] text-foreground hover:bg-[#FAF9F7] transition-colors duration-300"
                  >
                    {proj.name}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        */}

        <div>
          <p className="block text-xs text-primary mb-2 uppercase tracking-widest font-medium">
            Room Name
          </p>
          <input
            type="text"
            value={spaceName}
            onChange={(e) => setSpaceName(e.target.value)}
            placeholder="e.g., Living Room"
            className="w-full px-0 py-3 text-[16px] text-foreground placeholder:text-[#c5c5c5] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500"
            style={inputStyle}
          />
        </div>

        <div>
          <p className="block text-xs text-primary mb-2 uppercase tracking-widest font-medium">
            Room Type
          </p>
          <div className="relative" ref={roomTypeRef}>
            <button
              type="button"
              onClick={() => setIsRoomTypeOpen(!isRoomTypeOpen)}
              className="w-full px-0 py-3 text-[16px] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500 text-left"
              style={{
                ...inputStyle,
                color: roomTypes.length > 0 ? "var(--foreground)" : "#c5c5c5",
              }}
            >
              {roomTypes.length > 0
                ? roomTypes
                    .map(
                      (v) =>
                        ROOM_TYPE_OPTIONS.find((o) => o.value === v)?.label ??
                        v,
                    )
                    .join(", ")
                : "Select room type(s)"}
            </button>
            {isRoomTypeOpen ? (
              <div
                className="absolute left-0 right-0 mt-2 bg-background z-10 border border-[#E8E6E3] rounded-sm max-h-48 overflow-y-auto"
                style={inputStyle}
              >
                {ROOM_TYPE_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = roomTypes.includes(option.value);
                  return (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => toggleRoomType(option.value)}
                      className="w-full px-0 py-3 text-left text-[16px] text-foreground hover:bg-[#FAF9F7] transition-colors duration-300 flex items-center gap-3"
                    >
                      <span
                        className={`w-4 h-4 rounded border flex-shrink-0 ${
                          isSelected
                            ? "bg-foreground border-foreground"
                            : "border-[#E8E6E3]"
                        }`}
                      />
                      <Icon
                        size={16}
                        strokeWidth={1.5}
                        className="text-textSecondary"
                      />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <p className="block text-xs text-primary mb-2 uppercase tracking-widest font-medium">
            Room Dimensions (meters)
          </p>
          <div className="grid grid-cols-3 gap-6">
            {(["width", "depth", "height"] as const).map((key) => (
              <div key={key}>
                <input
                  type="number"
                  step="any"
                  inputMode="decimal"
                  value={dimensions[key] ?? ""}
                  onChange={(e) =>
                    setDimensions({
                      ...dimensions,
                      [key]: parseOptionalNumber(e.target.value),
                    })
                  }
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  className="w-full px-0 py-3 text-[16px] text-foreground placeholder:text-[#c5c5c5] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500"
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="block text-xs text-primary mb-2 uppercase tracking-widest font-medium">
            Room Budget (Optional)
          </p>
          <input
            type="number"
            step="any"
            inputMode="decimal"
            value={budget ?? ""}
            onChange={(e) => setBudget(parseOptionalNumber(e.target.value))}
            placeholder="What's reasonable?"
            className="w-full px-0 py-3 text-[16px] text-foreground placeholder:text-[#c5c5c5] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500"
            style={inputStyle}
          />
        </div>
      </div>
    </StepPanelShell>
  );
}

function formatCategoryLabel(category: string): string {
  return category
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function Step2Controls({
  detectedFurniture,
  detectedFurnitureGrouped,
  selectedFurniture,
  setSelectedFurniture,
  ...shared
}: SharedPanelProps & {
  detectedFurniture: import("@/containers/ai-generation-flow/types").DetectedFurnitureItem[];
  detectedFurnitureGrouped: import("@/containers/ai-generation-flow/types").DetectedFurnitureGroup[];
  selectedFurniture: string[];
  setSelectedFurniture: (value: string[]) => void;
}) {
  const toggleFurniture = (itemId: string) => {
    if (selectedFurniture.includes(itemId)) {
      setSelectedFurniture(selectedFurniture.filter((i) => i !== itemId));
      return;
    }
    setSelectedFurniture([...selectedFurniture, itemId]);
  };

  const handleSelectAll = () => {
    if (detectedFurniture.length === 0) return;
    const allIds = detectedFurniture.map((item) => item.id);
    if (selectedFurniture.length === detectedFurniture.length) {
      setSelectedFurniture([]);
    } else {
      setSelectedFurniture(allIds);
    }
  };

  const isAllSelected =
    detectedFurniture.length > 0 &&
    selectedFurniture.length === detectedFurniture.length;

  const handleClearAllFurniture = () => {
    if (detectedFurniture.length === 0) return;
    setSelectedFurniture(detectedFurniture.map((item) => item.id));
  };

  return (
    <StepPanelShell {...shared}>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[18px] text-foreground">Detected Elements</h3>
          {detectedFurniture.length > 0 && (
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-[12px] text-foreground hover:text-[#626262] transition-colors duration-300"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                letterSpacing: "0.02em",
              }}
            >
              {isAllSelected ? "Deselect All" : "Select All"}
            </button>
          )}
        </div>
        {detectedFurniture.length === 0 ? (
          <p
            className="text-[14px] text-textSecondary"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
            }}
          >
            No furniture detected yet. Complete step 1 to detect furniture.
          </p>
        ) : (
          <div className="space-y-4">
            {detectedFurnitureGrouped.map((group) => (
              <div key={group.category} className="space-y-2">
                <p
                  className="text-[11px] uppercase tracking-widest text-textSecondary font-medium"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {formatCategoryLabel(group.category)}
                </p>
                <div className="space-y-1.5">
                  {group.items.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => toggleFurniture(item.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-sm transition-colors duration-300 ${
                        selectedFurniture.includes(item.id)
                          ? "bg-foreground text-background"
                          : "bg-[#FDFCFB] text-foreground hover:bg-[#FAF9F7]"
                      }`}
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 300,
                        fontSize: "14px",
                      }}
                    >
                      {item.label.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {selectedFurniture.length > 0 ? (
          <Button onClick={() => setSelectedFurniture([])} variant="link">
            Clear selected furniture ({selectedFurniture.length})
          </Button>
        ) : null}
      </div>
    </StepPanelShell>
  );
}

function Step3Controls({
  styleKeywords,
  setStyleKeywords,
  mood,
  setMood,
  materials,
  setMaterials,
  inspirationImageUrl,
  setInspirationImageId,
  setInspirationImageUrl,
  ...shared
}: SharedPanelProps & {
  styleKeywords: string;
  setStyleKeywords: (value: string) => void;
  mood: string;
  setMood: (value: string) => void;
  materials: string;
  setMaterials: (value: string) => void;
  inspirationImageUrl: string | null;
  setInspirationImageId: (value: string | null) => void;
  setInspirationImageUrl: (value: string | null) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);

  const handleInspirationUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    setIsUploading(true);
    try {
      const [uploadResult] = await uploadImages(file, "hema");
      if (!uploadResult.success || !uploadResult.path || !uploadResult.url) {
        return;
      }
      // storagePath: path after bucket name (e.g. hema/filename.png)
      const createResult = await createImage({
        type: ImageType.INSPIRATION,
        storagePath: uploadResult.path,
      });
      if (createResult.error || !createResult.data) {
        return;
      }
      setInspirationImageId(createResult.data.id);
      setInspirationImageUrl(uploadResult.url);
    } finally {
      setIsUploading(false);
    }
    e.target.value = "";
  };

  const removeInspirationImage = () => {
    setInspirationImageId(null);
    setInspirationImageUrl(null);
  };

  return (
    <StepPanelShell {...shared}>
      <div className="space-y-8">
        {/* Inspiration Images - moved above Define Direction */}
        <div>
          <h3
            className="text-[18px] text-foreground mb-4"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
          >
            Inspiration Images
          </h3>
          <label
            htmlFor="inspiration-upload-panel"
            className={isUploading ? "pointer-events-none opacity-70" : ""}
          >
            <div
              className="bg-[#FDFCFB] rounded-sm p-4 flex flex-col items-center justify-center cursor-pointer transition-colors duration-300 hover:bg-[#FAF9F7]"
              style={{ minHeight: "60px", border: "1px dashed #E8E6E3" }}
            >
              <Plus
                size={16}
                className="text-[#c5c5c5] mb-1"
                strokeWidth={1.5}
              />
              <p
                className="text-[10px] text-[#c5c5c5]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  letterSpacing: "0.01em",
                }}
              >
                {isUploading ? "Uploading…" : "Add inspiration image"}
              </p>
            </div>
          </label>
          <input
            id="inspiration-upload-panel"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleInspirationUpload}
            disabled={isUploading}
          />
          {inspirationImageUrl ? (
            <div className="flex flex-wrap gap-2 mt-3">
              <div className="relative w-12 h-12 rounded-sm overflow-hidden bg-[#FDFCFB] shadow-sm flex-shrink-0">
                <img
                  src={inspirationImageUrl}
                  alt="Inspiration reference"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeInspirationImage}
                  className="absolute top-0 right-0 w-4 h-4 flex items-center justify-center rounded-full bg-foreground/80 hover:bg-foreground transition-colors"
                >
                  <X size={8} strokeWidth={2} className="text-background" />
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <h3
          className="text-[18px] text-foreground"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
        >
          Define Direction
        </h3>

        <div className="space-y-6">
          <div>
            <p className="block text-xs text-primary mb-3 uppercase tracking-widest font-medium">
              Style Keywords
            </p>
            <input
              type="text"
              value={styleKeywords}
              onChange={(e) => setStyleKeywords(e.target.value)}
              placeholder="Scandinavian, mid-century, industrial…"
              className="w-full px-0 py-3 text-[16px] text-foreground placeholder:text-[#c5c5c5] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
            />
          </div>

          <div>
            <p className="block text-xs text-primary mb-3 uppercase tracking-widest font-medium">
              Mood
            </p>
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="Warm, minimal, earthy, cozy…"
              className="w-full px-0 py-3 text-[16px] text-foreground placeholder:text-[#c5c5c5] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
            />
          </div>

          <div>
            <p className="block text-xs text-primary mb-3 uppercase tracking-widest font-medium">
              Materials
            </p>
            <input
              type="text"
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              placeholder="Wood, stone, metal, linen…"
              className="w-full px-0 py-3 text-[16px] text-foreground placeholder:text-[#c5c5c5] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
            />
          </div>
        </div>
      </div>
    </StepPanelShell>
  );
}

function Step4Controls({
  selectedLayout,
  setSelectedLayout,
  inspirationImages,
  ...shared
}: SharedPanelProps & {
  selectedLayout: number | null;
  setSelectedLayout: (value: number | null) => void;
  inspirationImages: string[];
}) {
  const layoutCards = [
    {
      id: 1,
      label: "Centered",
      preview: (
        <div className="space-y-3">
          <div
            className="h-12 bg-[#E8E6E3] rounded-sm"
            style={{ width: "60%" }}
          />
          <div className="flex gap-3">
            <div
              className="h-10 bg-[#E8E6E3] rounded-sm"
              style={{ width: "40%" }}
            />
            <div
              className="h-10 bg-[#E8E6E3] rounded-sm"
              style={{ width: "40%" }}
            />
          </div>
        </div>
      ),
    },
    {
      id: 2,
      label: "Corner focus",
      preview: (
        <div className="space-y-3">
          <div className="flex gap-3">
            <div
              className="h-10 bg-[#E8E6E3] rounded-sm"
              style={{ width: "50%" }}
            />
            <div
              className="h-10 bg-[#E8E6E3] rounded-sm"
              style={{ width: "30%" }}
            />
          </div>
          <div
            className="h-8 bg-[#E8E6E3] rounded-sm"
            style={{ width: "70%" }}
          />
        </div>
      ),
    },
    {
      id: 3,
      label: "Window-first",
      preview: (
        <div className="space-y-3">
          <div
            className="h-10 bg-[#E8E6E3] rounded-sm"
            style={{ width: "75%" }}
          />
          <div
            className="h-10 bg-[#E8E6E3] rounded-sm"
            style={{ width: "45%" }}
          />
        </div>
      ),
    },
    {
      id: 4,
      label: "Balanced",
      preview: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="h-10 bg-[#E8E6E3] rounded-sm" />
            <div className="h-10 bg-[#E8E6E3] rounded-sm" />
          </div>
          <div
            className="h-6 bg-[#E8E6E3] rounded-sm"
            style={{ width: "80%" }}
          />
        </div>
      ),
    },
  ];

  return (
    <StepPanelShell {...shared}>
      <div className="space-y-6">
        <div>
          <h3
            className="text-[16px] text-foreground mb-1"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
          >
            Proposed Layouts
          </h3>
          <p
            className="text-[10px] text-textSecondary mb-6 uppercase tracking-widest"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              letterSpacing: "0.15em",
            }}
          >
            Optional — skip if preferred
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {layoutCards.map((layout) => (
            <button
              type="button"
              key={layout.id}
              onClick={() => setSelectedLayout(layout.id)}
              className={`transition-all duration-300 ${
                selectedLayout === layout.id
                  ? "opacity-100"
                  : "opacity-60 hover:opacity-80"
              }`}
            >
              <div className="bg-[#FDFCFB] rounded-sm p-6 mb-2">
                {layout.preview}
              </div>
              <p
                className="text-[12px] text-foreground text-left"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  letterSpacing: "0.01em",
                }}
              >
                {layout.label}
              </p>
            </button>
          ))}
        </div>

        {inspirationImages.length ? (
          <div className="pt-2">
            <p
              className="text-[10px] text-textSecondary mb-3 uppercase tracking-widest"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                letterSpacing: "0.15em",
              }}
            >
              Your Inspiration
            </p>
            <div className="grid grid-cols-3 gap-2">
              {inspirationImages.map((src) => (
                <div
                  key={src}
                  className="aspect-square rounded-sm overflow-hidden bg-[#FDFCFB] shadow-sm"
                >
                  <img
                    src={src}
                    alt="Inspiration reference"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </StepPanelShell>
  );
}

function Step5Controls({
  activeFilters,
  setActiveFilters,
  customProductImages,
  setCustomProductImages,
  ...shared
}: SharedPanelProps & {
  activeFilters: string[];
  setActiveFilters: (value: string[]) => void;
  customProductImages: string[];
  setCustomProductImages: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter((f) => f !== filter));
      return;
    }
    setActiveFilters([...activeFilters, filter]);
  };

  return (
    <StepPanelShell {...shared}>
      <div className="space-y-6">
        <h3
          className="text-[16px] text-foreground"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
        >
          Refine Elements
        </h3>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {REFINE_FILTERS.map((filter) => (
            <button
              type="button"
              key={filter}
              onClick={() => toggleFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-[10px] transition-all duration-300 flex-shrink-0 ${
                activeFilters.includes(filter)
                  ? "bg-foreground text-background"
                  : "bg-[#FDFCFB] text-textSecondary hover:bg-[#FAF9F7]"
              }`}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                letterSpacing: "0.01em",
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="space-y-4 overflow-y-auto max-h-[280px]">
          {REFINE_FILTERS.map((category) => (
            <div key={category}>
              <p
                className="text-[10px] text-textSecondary uppercase tracking-widest mb-2"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.12em",
                }}
              >
                {category}
              </p>
              <div className="flex flex-col gap-2">
                {(UNSPLASH_IMAGES_BY_CATEGORY[category] ?? []).map((img) => (
                  <div
                    key={img}
                    className="aspect-video rounded-sm overflow-hidden bg-[#E8E6E3] cursor-pointer hover:opacity-90 transition-opacity duration-300"
                  >
                    <img
                      src={img}
                      alt={category}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <p className="block text-xs text-primary mb-4 uppercase tracking-widest font-medium">
            Upload specific item
          </p>
          <label htmlFor="product-upload">
            <div
              className="bg-[#FDFCFB] rounded-sm p-4 flex flex-col items-center justify-center cursor-pointer transition-colors duration-300 hover:bg-[#FAF9F7]"
              style={{ minHeight: "60px", border: "1px dashed #E8E6E3" }}
            >
              <Upload
                size={16}
                className="text-[#c5c5c5] mb-1"
                strokeWidth={1.5}
              />
              <p
                className="text-[10px] text-[#c5c5c5]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  letterSpacing: "0.01em",
                }}
              >
                Add product image
              </p>
            </div>
          </label>
          <input
            id="product-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const files = e.target.files;
              if (!files) return;
              Array.from(files).forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () =>
                  setCustomProductImages((prev) => [
                    ...prev,
                    reader.result as string,
                  ]);
                reader.readAsDataURL(file);
              });
              e.target.value = "";
            }}
          />
          {customProductImages.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-3">
              {customProductImages.map((src, idx) => (
                <div
                  key={`${src}-${idx}`}
                  className="relative w-16 h-16 rounded-sm overflow-hidden bg-[#FDFCFB] shadow-sm shrink-0"
                >
                  <img
                    src={src}
                    alt="Custom product"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setCustomProductImages((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center rounded-full bg-foreground/80 hover:bg-foreground transition-colors"
                  >
                    <X size={10} strokeWidth={2} className="text-background" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </StepPanelShell>
  );
}

function Step6Controls({
  selectedProducts,
  setSelectedProducts,
  ...shared
}: SharedPanelProps & {
  selectedProducts: Record<string, number>;
  setSelectedProducts: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
}) {
  const updateProductQuantity = (productId: string, change: number) => {
    setSelectedProducts((prev) => {
      const current = prev[productId] || 0;
      const newQuantity = Math.max(0, current + change);
      if (newQuantity === 0) {
        const { [productId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: newQuantity };
    });
  };

  const total = Object.entries(selectedProducts).reduce(
    (sum, [id, quantity]) => {
      const item = SHOPPING_ITEMS.find((value) => value.id === id);
      return sum + (item ? item.price * quantity : 0);
    },
    0,
  );

  return (
    <StepPanelShell {...shared}>
      <div className="space-y-4 flex flex-col">
        <h3
          className="text-[16px] text-foreground"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
        >
          Curated Shopping List
        </h3>
        <div className="space-y-3">
          {SHOPPING_ITEMS.map((item) => {
            const quantity = selectedProducts[item.id] || 0;
            return (
              <div
                key={item.id}
                className="group relative bg-[#FDFCFB] rounded-sm p-3 transition-all duration-300"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-sm overflow-hidden bg-[#E8E6E3] shrink-0">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-[13px] text-foreground mb-1 truncate"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        letterSpacing: "0.01em",
                      }}
                    >
                      {item.name}
                    </h4>
                    <p
                      className="text-[12px] text-textSecondary"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 300,
                      }}
                    >
                      ${item.price}
                    </p>
                    <div className="mt-1">
                      <p
                        className="text-[10px] text-textSecondary"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 300,
                          letterSpacing: "0.01em",
                        }}
                      >
                        {item.retailer} • {item.size} • {item.finish}
                      </p>
                      <button
                        type="button"
                        onClick={() => window.open("#", "_blank")}
                        className="text-[10px] text-foreground hover:text-[#626262] transition-colors duration-300 mt-0.5"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 400,
                          letterSpacing: "0.01em",
                        }}
                      >
                        View →
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateProductQuantity(item.id, -1)}
                      disabled={quantity === 0}
                      className="w-6 h-6 flex items-center justify-center text-textSecondary hover:text-foreground transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span
                      className="text-[12px] text-foreground w-5 text-center"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 300,
                      }}
                    >
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateProductQuantity(item.id, 1)}
                      className="w-6 h-6 flex items-center justify-center text-textSecondary hover:text-foreground transition-colors duration-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-[#E8E6E3] mt-auto">
          <div className="flex items-center justify-between mb-1">
            <p
              className="text-[10px] text-textSecondary uppercase tracking-widest"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                letterSpacing: "0.15em",
              }}
            >
              Room Total
            </p>
            <p
              className="text-[16px] text-foreground"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
            >
              ${total.toLocaleString()}
            </p>
          </div>
          <p
            className="text-[10px] text-[#c5c5c5]"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              letterSpacing: "0.01em",
            }}
          >
            Informational only — no checkout
          </p>
        </div>
      </div>
    </StepPanelShell>
  );
}

export function StepControlsPanel() {
  const {
    currentStep,
    activeTab,
    setActiveTab,
    chatMessages,
    chatMessage,
    setChatMessage,
    handleSendMessage,
    step1,
    step2,
    step3,
    step4,
    step5,
    step6,
    stepLoadingFor,
  } = useAIGenerationFlowContext();

  const showPanelLoader =
    stepLoadingFor === currentStep &&
    stepLoadingFor !== null &&
    [2, 3, 4].includes(currentStep);

  const shared = {
    activeTab,
    setActiveTab,
    currentStep,
    chatMessages,
    chatMessage,
    setChatMessage,
    onSendMessage: handleSendMessage,
  };

  if (currentStep === 1) {
    return (
      <Step1Controls
        {...shared}
        currentStep={currentStep}
        selectedProjectId={step1.selectedProjectId}
        setSelectedProjectId={step1.setSelectedProjectId}
        spaceName={step1.spaceName}
        setSpaceName={step1.setSpaceName}
        roomTypes={step1.roomTypes}
        setRoomTypes={step1.setRoomTypes}
        dimensions={step1.dimensions}
        setDimensions={step1.setDimensions}
        budget={step1.budget}
        setBudget={step1.setBudget}
      />
    );
  }

  if (currentStep === 2) {
    if (showPanelLoader) {
      return (
        <div className="lg:flex lg:flex-col lg:h-full">
          <div className="flex-shrink-0">
            <StepTabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          <div className="lg:flex-1 lg:overflow-y-auto lg:min-h-0 mt-4 flex items-center justify-center">
            <StepLoader step={2} />
          </div>
        </div>
      );
    }
    return (
      <Step2Controls
        {...shared}
        currentStep={currentStep}
        detectedFurniture={step2.detectedFurniture}
        detectedFurnitureGrouped={step2.detectedFurnitureGrouped}
        selectedFurniture={step2.selectedFurniture}
        setSelectedFurniture={step2.setSelectedFurniture}
      />
    );
  }

  if (currentStep === 3) {
    if (showPanelLoader) {
      return (
        <div className="lg:flex lg:flex-col lg:h-full">
          <div className="flex-shrink-0">
            <StepTabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          <div className="lg:flex-1 lg:overflow-y-auto lg:min-h-0 mt-4 flex items-center justify-center">
            <StepLoader step={3} />
          </div>
        </div>
      );
    }
    return (
      <Step3Controls
        {...shared}
        currentStep={currentStep}
        styleKeywords={step3.styleKeywords}
        setStyleKeywords={step3.setStyleKeywords}
        mood={step3.mood}
        setMood={step3.setMood}
        materials={step3.materials}
        setMaterials={step3.setMaterials}
        inspirationImageUrl={step3.inspirationImageUrl}
        setInspirationImageId={step3.setInspirationImageId}
        setInspirationImageUrl={step3.setInspirationImageUrl}
      />
    );
  }

  if (currentStep === 4) {
    if (showPanelLoader) {
      return (
        <div className="lg:flex lg:flex-col lg:h-full">
          <div className="flex-shrink-0">
            <StepTabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          <div className="lg:flex-1 lg:overflow-y-auto lg:min-h-0 mt-4 flex items-center justify-center">
            <StepLoader step={4} />
          </div>
        </div>
      );
    }
    return (
      <Step4Controls
        {...shared}
        currentStep={currentStep}
        selectedLayout={step4.selectedLayout}
        setSelectedLayout={step4.setSelectedLayout}
        inspirationImages={
          step3.inspirationImageUrl ? [step3.inspirationImageUrl] : []
        }
      />
    );
  }

  if (currentStep === 5) {
    return (
      <Step5Controls
        {...shared}
        currentStep={currentStep}
        activeFilters={step5.activeFilters}
        setActiveFilters={step5.setActiveFilters}
        customProductImages={step5.customProductImages}
        setCustomProductImages={step5.setCustomProductImages}
      />
    );
  }

  return (
    <Step6Controls
      {...shared}
      currentStep={currentStep}
      selectedProducts={step6.selectedProducts}
      setSelectedProducts={step6.setSelectedProducts}
    />
  );
}
