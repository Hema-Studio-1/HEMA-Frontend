import { Plus, Upload, X } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { StepChatInterface } from "../../StepChatInterface";
import { StepTabSwitcher } from "../../StepTabSwitcher";
import {
  FURNITURE_CATEGORIES,
  REFINE_FILTERS,
  ROOM_TYPE_OPTIONS,
  SHOPPING_ITEMS,
  STEPS,
} from "./constants";
import type { ChatMessage, Dimensions, FlowTab, Step } from "./types";

interface SharedPanelProps {
  activeTab: FlowTab;
  setActiveTab: (tab: FlowTab) => void;
  currentStep: Step;
  chatMessages: ChatMessage[];
  chatMessage: string;
  setChatMessage: (value: string) => void;
  onSendMessage: () => void;
}

interface StepControlsPanelProps extends SharedPanelProps {
  roomType: string;
  setRoomType: (value: string) => void;
  dimensions: Dimensions;
  setDimensions: (value: Dimensions) => void;
  budget: string;
  setBudget: (value: string) => void;
  selectedFurniture: string[];
  setSelectedFurniture: (value: string[]) => void;
  styleKeywords: string;
  setStyleKeywords: (value: string) => void;
  mood: string;
  setMood: (value: string) => void;
  materials: string;
  setMaterials: (value: string) => void;
  inspirationImages: string[];
  setInspirationImages: React.Dispatch<React.SetStateAction<string[]>>;
  selectedLayout: number | null;
  setSelectedLayout: (value: number | null) => void;
  activeFilters: string[];
  setActiveFilters: (value: string[]) => void;
  selectedProducts: Record<string, number>;
  setSelectedProducts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

function StepPanelShell({
  children,
  ...shared
}: SharedPanelProps & { children: React.ReactNode }) {
  return (
    <div className="lg:flex lg:flex-col lg:h-full">
      <div className="lg:flex lg:flex-col lg:h-full">
        <div className="flex-shrink-0">
          <StepTabSwitcher activeTab={shared.activeTab} onTabChange={shared.setActiveTab} />
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
  roomType,
  setRoomType,
  dimensions,
  setDimensions,
  budget,
  setBudget,
  ...shared
}: SharedPanelProps & {
  roomType: string;
  setRoomType: (value: string) => void;
  dimensions: Dimensions;
  setDimensions: (value: Dimensions) => void;
  budget: string;
  setBudget: (value: string) => void;
}) {
  const [isRoomTypeOpen, setIsRoomTypeOpen] = useState(false);
  const roomTypeRef = useRef<HTMLDivElement>(null);

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

  return (
    <StepPanelShell {...shared}>
      <div className="space-y-12">
        <div>
          <p
            className="block text-[11px] text-textSecondary mb-4 uppercase tracking-widest"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              letterSpacing: "0.15em",
            }}
          >
            Room Type
          </p>
          <div className="relative" ref={roomTypeRef}>
            <button
              type="button"
              onClick={() => setIsRoomTypeOpen(!isRoomTypeOpen)}
              className="w-full px-0 py-3 text-[16px] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500 text-left"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                color: roomType ? "var(--foreground)" : "#c5c5c5",
              }}
            >
              {roomType ? (
                <span className="flex items-center gap-3">
                  {(() => {
                    const Icon = ROOM_TYPE_OPTIONS.find((option) => option.value === roomType)?.icon;
                    return Icon ? <Icon size={16} strokeWidth={1.5} className="text-textSecondary" /> : null;
                  })()}
                  <span className="text-foreground">
                    {ROOM_TYPE_OPTIONS.find((option) => option.value === roomType)?.label}
                  </span>
                </span>
              ) : (
                "Select room type"
              )}
            </button>
            {isRoomTypeOpen ? (
              <div
                className="absolute left-0 right-0 mt-2 bg-background z-10"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                }}
              >
                {ROOM_TYPE_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => {
                        setRoomType(option.value);
                        setIsRoomTypeOpen(false);
                      }}
                      className="w-full px-0 py-3 text-left text-[16px] text-foreground hover:bg-[#FAF9F7] transition-colors duration-300 flex items-center gap-3"
                    >
                      <Icon size={16} strokeWidth={1.5} className="text-textSecondary" />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <p
            className="block text-[11px] text-textSecondary mb-4 uppercase tracking-widest"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              letterSpacing: "0.15em",
            }}
          >
            Room Dimensions (meters)
          </p>
          <div className="grid grid-cols-3 gap-6">
            {(["width", "depth", "height"] as const).map((key) => (
              <div key={key}>
                <input
                  type="text"
                  value={dimensions[key]}
                  onChange={(e) => setDimensions({ ...dimensions, [key]: e.target.value })}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  className="w-full px-0 py-3 text-[16px] text-foreground placeholder:text-[#c5c5c5] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p
            className="block text-[11px] text-textSecondary mb-4 uppercase tracking-widest"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              letterSpacing: "0.15em",
            }}
          >
            Room Budget (Optional)
          </p>
          <input
            type="text"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="What's reasonable?"
            className="w-full px-0 py-3 text-[16px] text-foreground placeholder:text-[#c5c5c5] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
            }}
          />
        </div>
      </div>
    </StepPanelShell>
  );
}

function Step2Controls({
  selectedFurniture,
  setSelectedFurniture,
  ...shared
}: SharedPanelProps & {
  selectedFurniture: string[];
  setSelectedFurniture: (value: string[]) => void;
}) {
  const toggleFurniture = (item: string) => {
    if (selectedFurniture.includes(item)) {
      setSelectedFurniture(selectedFurniture.filter((i) => i !== item));
      return;
    }
    setSelectedFurniture([...selectedFurniture, item]);
  };

  return (
    <StepPanelShell {...shared}>
      <div className="space-y-6">
        <h3 className="text-[18px] text-foreground mb-6">Detected Elements</h3>
        <div className="space-y-8">
          {FURNITURE_CATEGORIES.map((category) => (
            <div key={category.category}>
              <p
                className="text-[11px] text-textSecondary mb-4 uppercase tracking-widest"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.15em",
                }}
              >
                {category.category}
              </p>
              <div className="space-y-2">
                {category.items.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggleFurniture(item)}
                    className={`w-full text-left px-4 py-3 rounded-sm transition-colors duration-300 ${
                      selectedFurniture.includes(item)
                        ? "bg-foreground text-background"
                        : "bg-[#FDFCFB] text-foreground hover:bg-[#FAF9F7]"
                    }`}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                      fontSize: "14px",
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {selectedFurniture.length ? (
          <button
            type="button"
            onClick={() => setSelectedFurniture([])}
            className="text-[13px] text-foreground hover:text-[#626262] transition-colors duration-300"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              letterSpacing: "0.02em",
            }}
          >
            Clear selected furniture ({selectedFurniture.length})
          </button>
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
  inspirationImages,
  setInspirationImages,
  ...shared
}: SharedPanelProps & {
  styleKeywords: string;
  setStyleKeywords: (value: string) => void;
  mood: string;
  setMood: (value: string) => void;
  materials: string;
  setMaterials: (value: string) => void;
  inspirationImages: string[];
  setInspirationImages: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const handleInspirationUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        setInspirationImages((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeInspirationImage = (index: number) => {
    setInspirationImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <StepPanelShell {...shared}>
      <div className="space-y-12">
        <h3
          className="text-[18px] text-foreground"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}
        >
          Define Direction
        </h3>

        <div>
          <p
            className="block text-[11px] text-textSecondary mb-4 uppercase tracking-widest"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, letterSpacing: "0.15em" }}
          >
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
          <p
            className="block text-[11px] text-textSecondary mb-4 uppercase tracking-widest"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, letterSpacing: "0.15em" }}
          >
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
          <p
            className="block text-[11px] text-textSecondary mb-4 uppercase tracking-widest"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, letterSpacing: "0.15em" }}
          >
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

        <div>
          <p
            className="block text-[11px] text-textSecondary mb-4 uppercase tracking-widest"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, letterSpacing: "0.15em" }}
          >
            Inspiration Images
          </p>
          <div className="grid grid-cols-5 lg:grid-cols-3 gap-2">
            {inspirationImages.map((src,idx) => (
              <div
                key={src}
                className="relative aspect-square rounded-sm overflow-hidden bg-[#FDFCFB] shadow-sm"
              >
                <img src={src} alt="Inspiration reference" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeInspirationImage(idx)}
                  className="absolute top-1.5 right-1.5 w-5 h-5 flex items-center justify-center rounded-full bg-[#F2F0ED] hover:bg-[#E8E6E3] transition-colors duration-200"
                >
                  <X size={10} strokeWidth={2} className="text-[#626262]" />
                </button>
              </div>
            ))}
            <label
              htmlFor="inspiration-upload-panel"
              className="aspect-square rounded-sm border border-dashed border-[#E8E6E3] hover:border-[#c5c5c5] bg-[#FDFCFB] hover:bg-[#FAF9F7] flex flex-col items-center justify-center cursor-pointer transition-colors duration-200"
            >
              <Plus size={16} strokeWidth={1.5} className="text-[#c5c5c5]" />
            </label>
            <input
              id="inspiration-upload-panel"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleInspirationUpload}
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
          <div className="h-12 bg-[#E8E6E3] rounded-sm" style={{ width: "60%" }} />
          <div className="flex gap-3">
            <div className="h-10 bg-[#E8E6E3] rounded-sm" style={{ width: "40%" }} />
            <div className="h-10 bg-[#E8E6E3] rounded-sm" style={{ width: "40%" }} />
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
            <div className="h-10 bg-[#E8E6E3] rounded-sm" style={{ width: "50%" }} />
            <div className="h-10 bg-[#E8E6E3] rounded-sm" style={{ width: "30%" }} />
          </div>
          <div className="h-8 bg-[#E8E6E3] rounded-sm" style={{ width: "70%" }} />
        </div>
      ),
    },
    {
      id: 3,
      label: "Window-first",
      preview: (
        <div className="space-y-3">
          <div className="h-10 bg-[#E8E6E3] rounded-sm" style={{ width: "75%" }} />
          <div className="h-10 bg-[#E8E6E3] rounded-sm" style={{ width: "45%" }} />
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
          <div className="h-6 bg-[#E8E6E3] rounded-sm" style={{ width: "80%" }} />
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
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, letterSpacing: "0.15em" }}
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
                selectedLayout === layout.id ? "opacity-100" : "opacity-60 hover:opacity-80"
              }`}
            >
              <div className="bg-[#FDFCFB] rounded-sm p-6 mb-2">{layout.preview}</div>
              <p
                className="text-[12px] text-foreground text-left"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, letterSpacing: "0.01em" }}
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
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, letterSpacing: "0.15em" }}
            >
              Your Inspiration
            </p>
            <div className="grid grid-cols-3 gap-2">
              {inspirationImages.map((src) => (
                <div
                  key={src}
                  className="aspect-square rounded-sm overflow-hidden bg-[#FDFCFB] shadow-sm"
                >
                  <img src={src} alt="Inspiration reference" className="w-full h-full object-cover" />
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
  ...shared
}: SharedPanelProps & {
  activeFilters: string[];
  setActiveFilters: (value: string[]) => void;
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
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, letterSpacing: "0.01em" }}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-[#E8E6E3] rounded-sm cursor-pointer hover:opacity-75 transition-opacity duration-300"
              style={{ aspectRatio: "1", height: "auto" }}
            />
          ))}
        </div>

        <div className="pt-2">
          <p
            className="text-[10px] text-textSecondary mb-2 uppercase tracking-widest"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, letterSpacing: "0.15em" }}
          >
            Upload specific item
          </p>
          <label htmlFor="product-upload">
            <div
              className="bg-[#FDFCFB] rounded-sm p-4 flex flex-col items-center justify-center cursor-pointer transition-colors duration-300 hover:bg-[#FAF9F7]"
              style={{ minHeight: "60px", border: "1px dashed #E8E6E3" }}
            >
              <Upload size={16} className="text-[#c5c5c5] mb-1" strokeWidth={1.5} />
              <p
                className="text-[10px] text-[#c5c5c5]"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, letterSpacing: "0.01em" }}
              >
                Add product image
              </p>
            </div>
          </label>
          <input id="product-upload" type="file" accept="image/*" className="hidden" />
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
  setSelectedProducts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
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

  const total = Object.entries(selectedProducts).reduce((sum, [id, quantity]) => {
    const item = SHOPPING_ITEMS.find((value) => value.id === id);
    return sum + (item ? item.price * quantity : 0);
  }, 0);

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
              <div key={item.id} className="group relative bg-[#FDFCFB] rounded-sm p-3 transition-all duration-300">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-[#E8E6E3] rounded-sm flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-[13px] text-foreground mb-1 truncate"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, letterSpacing: "0.01em" }}
                    >
                      {item.name}
                    </h4>
                    <p
                      className="text-[12px] text-textSecondary"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                    >
                      ${item.price}
                    </p>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2">
                      <p
                        className="text-[10px] text-textSecondary mb-1"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, letterSpacing: "0.01em" }}
                      >
                        {item.retailer} • {item.size}
                      </p>
                      <button
                        type="button"
                        onClick={() => window.open("#", "_blank")}
                        className="text-[10px] text-foreground hover:text-[#626262] transition-colors duration-300"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, letterSpacing: "0.01em" }}
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
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
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
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, letterSpacing: "0.15em" }}
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
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, letterSpacing: "0.01em" }}
          >
            Informational only — no checkout
          </p>
        </div>
      </div>
    </StepPanelShell>
  );
}

export function StepControlsPanel(props: StepControlsPanelProps) {
  const {
    currentStep,
    roomType,
    setRoomType,
    dimensions,
    setDimensions,
    budget,
    setBudget,
    selectedFurniture,
    setSelectedFurniture,
    styleKeywords,
    setStyleKeywords,
    mood,
    setMood,
    materials,
    setMaterials,
    inspirationImages,
    setInspirationImages,
    selectedLayout,
    setSelectedLayout,
    activeFilters,
    setActiveFilters,
    selectedProducts,
    setSelectedProducts,
    ...shared
  } = props;

  if (currentStep === 1) {
    return (
      <Step1Controls
        {...shared}
        currentStep={currentStep}
        roomType={roomType}
        setRoomType={setRoomType}
        dimensions={dimensions}
        setDimensions={setDimensions}
        budget={budget}
        setBudget={setBudget}
      />
    );
  }

  if (currentStep === 2) {
    return (
      <Step2Controls
        {...shared}
        currentStep={currentStep}
        selectedFurniture={selectedFurniture}
        setSelectedFurniture={setSelectedFurniture}
      />
    );
  }

  if (currentStep === 3) {
    return (
      <Step3Controls
        {...shared}
        currentStep={currentStep}
        styleKeywords={styleKeywords}
        setStyleKeywords={setStyleKeywords}
        mood={mood}
        setMood={setMood}
        materials={materials}
        setMaterials={setMaterials}
        inspirationImages={inspirationImages}
        setInspirationImages={setInspirationImages}
      />
    );
  }

  if (currentStep === 4) {
    return (
      <Step4Controls
        {...shared}
        currentStep={currentStep}
        selectedLayout={selectedLayout}
        setSelectedLayout={setSelectedLayout}
        inspirationImages={inspirationImages}
      />
    );
  }

  if (currentStep === 5) {
    return (
      <Step5Controls
        {...shared}
        currentStep={currentStep}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      />
    );
  }

  return (
    <Step6Controls
      {...shared}
      currentStep={currentStep}
      selectedProducts={selectedProducts}
      setSelectedProducts={setSelectedProducts}
    />
  );
}
