import { Upload, X } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { AssetSelector } from "./AssetSelector";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";

interface CreateMoodBoardDrawerProps {
  onClose: () => void;
  onCreate: (name: string, type: string, images: string[]) => void;
}

export function CreateMoodBoardDrawer({
  onClose,
  onCreate,
}: CreateMoodBoardDrawerProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [showAssetSelector, setShowAssetSelector] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);

  const types = [
    "Office",
    "Furniture",
    "Lighting",
    "Textiles",
    "Decorative Objects",
    "Materials",
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 10 - images.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages((prev) => {
            if (prev.length < 10) {
              return [...prev, reader.result as string];
            }
            return prev;
          });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;

    const remainingSlots = 10 - images.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages((prev) => {
            if (prev.length < 10) {
              return [...prev, reader.result as string];
            }
            return prev;
          });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSelectFromAssets = (selectedImages: string[]) => {
    const remainingSlots = 10 - images.length;
    const imagesToAdd = selectedImages.slice(0, remainingSlots);
    setImages([...images, ...imagesToAdd]);
    setShowAssetSelector(false);
  };

  const handleCreate = () => {
    if (name.trim() && type && images.length > 0) {
      onCreate(name, type, images);
    }
  };

  const canCreate = name.trim() && type && images.length > 0;

  return (
    <>
      <Sheet
        open
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <SheetContent side="right" className="max-w-2xl">
          <SheetHeader>
            <SheetTitle>Information</SheetTitle>
            <SheetDescription>
              Create your moodboard with up to 10 product images
            </SheetDescription>
          </SheetHeader>
          <SheetBody>
            {/* Inputs Section */}
            <div className="mb-12">
              {/* Name Input */}
              <div className="mb-6">
                <label
                  className="block text-[11px] uppercase tracking-widest text-textSecondary mb-3"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    letterSpacing: "0.15em",
                  }}
                >
                  Mood board name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Scandinavian Living Room"
                  className="w-full px-4 py-3 text-[14px] bg-transparent border border-[#E8E6E3] rounded-sm text-foreground placeholder-[#c5c5c5] focus:outline-none focus:border-foreground transition-colors duration-300"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300,
                  }}
                />
              </div>

              {/* Type Dropdown */}
              <div className="mb-6 relative" ref={typeRef}>
                <label
                  className="block text-[11px] uppercase tracking-widest text-textSecondary mb-3"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    letterSpacing: "0.15em",
                  }}
                >
                  Type
                </label>
                <button
                  onClick={() => setIsTypeOpen(!isTypeOpen)}
                  className="w-full px-4 py-3 text-[14px] bg-transparent border border-[#E8E6E3] rounded-sm text-left focus:outline-none focus:border-foreground transition-colors duration-300"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300,
                    color: type ? "var(--foreground)" : "#c5c5c5",
                  }}
                >
                  {type || "Select type"}
                </button>

                {/* Dropdown Menu */}
                {isTypeOpen && (
                  <div
                    className="absolute top-full left-0 right-0 mt-2 bg-[#FDFCFB] border border-[#E8E6E3] rounded-sm shadow-lg z-20"
                    style={{ maxHeight: "240px", overflowY: "auto" }}
                  >
                    {types.map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setType(t);
                          setIsTypeOpen(false);
                        }}
                        className="w-full px-4 py-3 text-[14px] text-left hover:bg-background transition-colors duration-300"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 300,
                          color: type === t ? "var(--foreground)" : "#626262",
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Upload Section */}
            <div className={images.length === 0 ? "mb-0" : "mb-8"}>
              <h4
                className="text-[11px] uppercase tracking-widest text-textSecondary mb-4"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.15em",
                }}
              >
                Add Images ({images.length}/10)
              </h4>

              {/* Canvas - Fixed Size */}
              <div
                className="bg-background rounded-sm mb-6 overflow-hidden"
                style={{ height: "400px" }}
              >
                {images.length === 0 ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-[#F3F1EE] transition-colors duration-300"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload
                      size={32}
                      className="text-[#c5c5c5] mb-4"
                      strokeWidth={1.5}
                    />
                    <p
                      className="text-[13px] text-textSecondary mb-1"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 300,
                      }}
                    >
                      Drag & drop images here
                    </p>
                    <p
                      className="text-[11px] text-[#c5c5c5]"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 300,
                      }}
                    >
                      JPG / PNG • Max 5MB each • Up to 10 images
                    </p>
                  </div>
                ) : (
                  <div
                    className="w-full h-full p-4 grid gap-2"
                    style={{
                      gridTemplateColumns: `repeat(${Math.min(images.length, 4)}, 1fr)`,
                      gridTemplateRows:
                        images.length > 4 ? "repeat(2, 1fr)" : "1fr",
                    }}
                  >
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative overflow-hidden rounded-sm bg-white"
                      >
                        <img
                          src={img}
                          alt={`Mood board item ${idx + 1}`}
                          className="w-full h-full"
                          style={{
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                        />
                        <button
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-2 right-2 p-1 bg-[#FDFCFB]/80 backdrop-blur-sm rounded-sm hover:opacity-60 transition-opacity duration-300"
                        >
                          <X
                            size={12}
                            className="text-[#626262]"
                            strokeWidth={1.5}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upload Options */}
              <div className="flex gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={images.length >= 10}
                  className={`flex-1 px-4 py-3 text-[13px] border rounded-sm transition-all duration-300 ${
                    images.length >= 10
                      ? "border-[#F3F1EE] text-[#c5c5c5] cursor-not-allowed"
                      : "border-[#E8E6E3] text-[#626262] hover:border-foreground hover:text-foreground"
                  }`}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300,
                    letterSpacing: "0.05em",
                  }}
                >
                  Upload from device
                </button>

                <button
                  onClick={() => setShowAssetSelector(true)}
                  disabled={images.length >= 10}
                  className={`flex-1 px-4 py-3 text-[13px] border rounded-sm transition-all duration-300 ${
                    images.length >= 10
                      ? "border-[#F3F1EE] text-[#c5c5c5] cursor-not-allowed"
                      : "border-[#E8E6E3] text-[#626262] hover:border-foreground hover:text-foreground"
                  }`}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300,
                    letterSpacing: "0.05em",
                  }}
                >
                  Select from assets
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Selected Products Grid */}
            {images.length > 0 && (
              <div className="mb-8">
                <h4
                  className="text-[11px] uppercase tracking-widest text-textSecondary mb-4"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    letterSpacing: "0.15em",
                  }}
                >
                  Selected Items
                </h4>
                <div className="grid grid-cols-5 gap-3">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative bg-background rounded-sm overflow-hidden group"
                      style={{ aspectRatio: "1 / 1" }}
                    >
                      <img
                        src={img}
                        alt={`Item ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-[#FDFCFB]/80 backdrop-blur-sm rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <X
                          size={10}
                          className="text-[#626262]"
                          strokeWidth={1.5}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </SheetBody>
          <SheetFooter>
            <button
              onClick={onClose}
              className="px-6 py-3 text-[13px] text-[#626262] hover:text-foreground transition-colors duration-300"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                letterSpacing: "0.05em",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!canCreate}
              className={`px-6 py-3 text-[13px] rounded-sm transition-all duration-300 ${
                canCreate
                  ? "bg-foreground text-[#FDFCFB] hover:opacity-80"
                  : "bg-[#F3F1EE] text-[#c5c5c5] cursor-not-allowed"
              }`}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                letterSpacing: "0.05em",
              }}
            >
              Create Moodboard
            </button>
          </SheetFooter>

          {/* Asset Selector — rendered inside Sheet so it stays interactive without toggling modal */}
          {showAssetSelector && (
            <AssetSelector
              onClose={() => setShowAssetSelector(false)}
              onSelect={handleSelectFromAssets}
              maxSelection={10 - images.length}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
