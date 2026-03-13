import {
  ArrowUpCircle,
  ChevronDown,
  Heart,
  Image as ImageIcon,
  MessageSquare,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

interface Asset {
  id: string;
  name: string;
  category: string;
  type: "Furniture" | "Lighting" | "Kitchen" | "Decor" | "Accessories";
  imageUrl: string;
  isLiked: boolean;
  description?: string;
}

interface AssetDetailViewProps {
  asset: Asset;
  onClose: () => void;
  onToggleLike: (id: string) => void;
  onDelete: (id: string) => void;
}

interface DropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
}

function Dropdown({
  label,
  value,
  options,
  onChange,
  placeholder = "Select...",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label
        className="block text-[11px] text-textSecondary mb-2"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2.5 bg-[#FDFCFB] border border-[#E8E6E3] rounded-sm text-left flex items-center justify-between hover:border-[#c5c5c5] transition-colors duration-300"
      >
        <span
          className="text-[13px]"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            color: value ? "var(--foreground)" : "var(--text-secondary)",
          }}
        >
          {value || placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`text-[#626262] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          strokeWidth={1.5}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="absolute top-full left-0 right-0 mt-1 bg-[#FDFCFB] border border-[#E8E6E3] rounded-sm z-20 max-h-64 overflow-y-auto"
            style={{
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            }}
          >
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2.5 text-left hover:bg-background transition-colors duration-200"
              >
                <span
                  className="text-[13px]"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: value === option ? 400 : 300,
                    color: value === option ? "var(--foreground)" : "#626262",
                  }}
                >
                  {option}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function AssetDetailView({
  asset,
  onClose,
  onToggleLike,
  onDelete,
}: AssetDetailViewProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Dropdown states
  const [selectedLighting, setSelectedLighting] = useState("");
  const [selectedPointOfView, setSelectedPointOfView] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedRenderMode, setSelectedRenderMode] =
    useState("Precise render");
  const [selectedArchContext, setSelectedArchContext] = useState("");

  const handleDelete = () => {
    onDelete(asset.id);
    onClose();
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const lightingOptions = [
    "Morning light",
    "Midday",
    "Overcast light",
    "Cloudy",
    "Sunset",
    "Night lighting",
    "Night lighting with stars",
  ];

  const pointOfViewOptions = [
    "Side view",
    "Front view",
    "Top view",
    "Low-angle (worm's-eye) view",
    "Close-up of the main subject",
    "Detail view (small design detail)",
    "Multiple view grid",
  ];

  const styleOptions = [
    "Art deco",
    "Biophilic / Nature-Forward",
    "Bohemian",
    "Haussmannian",
    "Industrial",
    "Japandi",
    "Mediterranean",
    "Midcentury modern interior",
    "Rustic",
    "Scandinavian / Soft Minimalism",
  ];

  const archContextOptions = [
    "Precise render",
    "Provence – South of France",
    "Mediterranean sea",
    "Puglia – Italy",
    "Pine forest",
    "In a desert",
    "In Iceland",
    "Iceland – snow",
    "In nature – at night",
    "In nature – at night, Milky Way",
    "Tokyo",
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-[60] transition-opacity duration-500"
        onClick={onClose}
      />

      {/* Modal - Full Width & Height */}
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vh] bg-[#FDFCFB] rounded-sm z-[60] overflow-hidden flex"
        style={{
          maxWidth: "1400px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Left Side - Large Image (60-65%) */}
        <div className="w-[65%] bg-background p-12 flex items-center justify-center relative">
          <img
            src={asset.imageUrl}
            alt={asset.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Right Side - Operations Panel (35-40%) */}
        <div className="w-[35%] flex flex-col">
          {/* Minimal Header with Actions */}
          <div className="px-12 py-8 border-b border-[#E8E6E3] flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h3
                className="text-[28px] text-foreground mb-3"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 300,
                  letterSpacing: "-0.01em",
                  lineHeight: "1.2",
                }}
              >
                {asset.name}
              </h3>
              <span
                className="inline-block px-2 py-1 text-[10px] bg-background text-[#626262] rounded-sm"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  letterSpacing: "0.05em",
                }}
              >
                {asset.type}
              </span>
            </div>

            {/* Top-right Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => onToggleLike(asset.id)}
                className="p-2 hover:opacity-60 transition-opacity duration-300"
                title={asset.isLiked ? "Unlike" : "Like"}
              >
                <Heart
                  size={18}
                  className={`transition-colors duration-300 ${
                    asset.isLiked
                      ? "text-foreground fill-current"
                      : "text-[#626262]"
                  }`}
                  strokeWidth={1.5}
                />
              </button>
              <button
                onClick={handleDeleteClick}
                className="p-2 hover:opacity-60 transition-opacity duration-300"
                title="Delete"
              >
                <Trash2
                  size={18}
                  className="text-[#626262]"
                  strokeWidth={1.5}
                />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:opacity-60 transition-opacity duration-300"
              >
                <X size={18} className="text-[#626262]" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Operations Panel - Scrollable */}
          <div className="flex-1 overflow-y-auto px-12 py-8">
            {/* Section A - Refine */}
            <div className="mb-8">
              <h4
                className="text-[12px] text-foreground mb-5"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                }}
              >
                Refine
              </h4>

              <div className="space-y-4">
                {/* A1 - Change Lighting */}
                <Dropdown
                  label="Lighting"
                  value={selectedLighting}
                  options={lightingOptions}
                  onChange={setSelectedLighting}
                  placeholder="Select lighting"
                />

                {/* A2 - Change Point of View */}
                <Dropdown
                  label="Point of view"
                  value={selectedPointOfView}
                  options={pointOfViewOptions}
                  onChange={setSelectedPointOfView}
                  placeholder="Select view"
                />

                {/* A3 - Restyle */}
                <Dropdown
                  label="Style"
                  value={selectedStyle}
                  options={styleOptions}
                  onChange={setSelectedStyle}
                  placeholder="Select style"
                />

                {/* A4 - Smart Render Mode (Segmented Control) */}
                <div>
                  <label
                    className="block text-[11px] text-textSecondary mb-2"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                      letterSpacing: "0.02em",
                    }}
                  >
                    Render mode
                  </label>
                  <div className="flex border border-[#E8E6E3] rounded-sm overflow-hidden">
                    <button
                      onClick={() => setSelectedRenderMode("Precise render")}
                      className={`flex-1 px-3 py-2.5 text-[13px] transition-colors duration-300 ${
                        selectedRenderMode === "Precise render"
                          ? "bg-background text-foreground"
                          : "bg-[#FDFCFB] text-[#626262] hover:bg-background/50"
                      }`}
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight:
                          selectedRenderMode === "Precise render" ? 400 : 300,
                        letterSpacing: "0.01em",
                      }}
                    >
                      Precise render
                    </button>
                    <button
                      onClick={() => setSelectedRenderMode("Creative render")}
                      className={`flex-1 px-3 py-2.5 text-[13px] border-l border-[#E8E6E3] transition-colors duration-300 ${
                        selectedRenderMode === "Creative render"
                          ? "bg-background text-foreground"
                          : "bg-[#FDFCFB] text-[#626262] hover:bg-background/50"
                      }`}
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight:
                          selectedRenderMode === "Creative render" ? 400 : 300,
                        letterSpacing: "0.01em",
                      }}
                    >
                      Creative render
                    </button>
                  </div>
                </div>

                {/* A5 - Smart Render for Architecture */}
                <Dropdown
                  label="Architecture context"
                  value={selectedArchContext}
                  options={archContextOptions}
                  onChange={setSelectedArchContext}
                  placeholder="Select context"
                />
              </div>
            </div>

            {/* Section B - Enhance */}
            <div className="mb-8 pb-8 border-b border-[#E8E6E3]">
              <h4
                className="text-[12px] text-foreground mb-4"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                }}
              >
                Enhance
              </h4>

              <button
                onClick={() => console.log("Upscale 4K")}
                className="w-full px-4 py-2.5 bg-[#FDFCFB] border border-[#E8E6E3] rounded-sm text-left flex items-center gap-2 hover:border-[#c5c5c5] hover:bg-background transition-colors duration-300"
              >
                <ArrowUpCircle
                  size={14}
                  className="text-[#626262]"
                  strokeWidth={1.5}
                />
                <span
                  className="text-[13px] text-foreground"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300,
                    letterSpacing: "0.01em",
                  }}
                >
                  Upscale 4K
                </span>
              </button>
            </div>

            {/* Section C - Utilities */}
            <div>
              <h4
                className="text-[12px] text-foreground mb-4"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                }}
              >
                Utilities
              </h4>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => console.log("Rerun")}
                  className="px-3 py-2 bg-[#FDFCFB] border border-[#E8E6E3] rounded-sm flex items-center gap-2 hover:border-[#c5c5c5] hover:bg-background transition-colors duration-300"
                  title="Rerun"
                >
                  <RotateCcw
                    size={12}
                    className="text-[#626262]"
                    strokeWidth={1.5}
                  />
                  <span
                    className="text-[12px] text-foreground"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                      letterSpacing: "0.01em",
                    }}
                  >
                    Rerun
                  </span>
                </button>

                <button
                  onClick={() => console.log("Replace image")}
                  className="px-3 py-2 bg-[#FDFCFB] border border-[#E8E6E3] rounded-sm flex items-center gap-2 hover:border-[#c5c5c5] hover:bg-background transition-colors duration-300"
                  title="Replace image"
                >
                  <ImageIcon
                    size={12}
                    className="text-[#626262]"
                    strokeWidth={1.5}
                  />
                  <span
                    className="text-[12px] text-foreground"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                      letterSpacing: "0.01em",
                    }}
                  >
                    Replace image
                  </span>
                </button>

                <button
                  onClick={() => console.log("Edit prompt")}
                  className="px-3 py-2 bg-[#FDFCFB] border border-[#E8E6E3] rounded-sm flex items-center gap-2 hover:border-[#c5c5c5] hover:bg-background transition-colors duration-300"
                  title="Edit prompt"
                >
                  <MessageSquare
                    size={12}
                    className="text-[#626262]"
                    strokeWidth={1.5}
                  />
                  <span
                    className="text-[12px] text-foreground"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                      letterSpacing: "0.01em",
                    }}
                  >
                    Edit prompt
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
