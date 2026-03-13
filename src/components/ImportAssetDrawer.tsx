import { Upload, X } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";

interface ImportAssetDrawerProps {
  onClose: () => void;
  onImport: (
    name: string,
    type: "Furniture" | "Lighting" | "Kitchen" | "Decor" | "Accessories",
    category: string,
    imageUrl: string,
  ) => void;
}

const types = [
  "Furniture",
  "Lighting",
  "Kitchen",
  "Decor",
  "Accessories",
] as const;
const categoriesByType: Record<(typeof types)[number], string[]> = {
  Furniture: ["Seating", "Tables", "Storage", "Beds"],
  Lighting: ["Ceiling", "Floor", "Table", "Wall"],
  Kitchen: ["Fixtures", "Hardware", "Appliances"],
  Decor: ["Decorative Objects", "Textiles", "Art"],
  Accessories: ["Rugs", "Pillows", "Hardware", "Mirrors"],
};

export function ImportAssetDrawer({
  onClose,
  onImport,
}: ImportAssetDrawerProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<(typeof types)[number] | "">("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTypeChange = (newType: (typeof types)[number]) => {
    setType(newType);
    setCategory(""); // Reset category when type changes
    setIsTypeOpen(false);
  };

  const handleImport = () => {
    if (name.trim() && type && category && imageUrl) {
      onImport(name, type, category, imageUrl);
    }
  };

  const canImport = name.trim() && type && category && imageUrl;
  const availableCategories = type ? categoriesByType[type] : [];

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="max-w-xl">
        <SheetHeader>
          <SheetTitle>Import Asset</SheetTitle>
          <SheetDescription>
            Add a new design element to your asset library
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          {/* Upload Section */}
          <div className="mb-8">
            <h4
              className="text-[11px] uppercase tracking-widest text-textSecondary mb-4"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                letterSpacing: "0.15em",
              }}
            >
              Image
            </h4>

            {/* Upload Area - Fixed Size */}
            <div
              className="bg-background rounded-sm mb-4 overflow-hidden"
              style={{ height: "400px" }}
            >
              {!imageUrl ? (
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
                    Drag & drop image here
                  </p>
                  <p
                    className="text-[11px] text-[#c5c5c5]"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    JPG / PNG • Max 5MB
                  </p>
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center bg-white p-4">
                  <img
                    src={imageUrl}
                    alt="Asset preview"
                    className="max-w-full max-h-full object-contain"
                  />
                  <button
                    onClick={() => setImageUrl(null)}
                    className="absolute top-4 right-4 p-2 bg-[#FDFCFB]/80 backdrop-blur-sm rounded-sm hover:opacity-60 transition-opacity duration-300"
                  >
                    <X size={16} className="text-[#626262]" strokeWidth={1.5} />
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-3 text-[13px] border border-[#E8E6E3] text-[#626262] rounded-sm hover:border-foreground hover:text-foreground transition-all duration-300"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                letterSpacing: "0.05em",
              }}
            >
              {imageUrl ? "Change Image" : "Browse Files"}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Asset Details */}
          <div>
            <h4
              className="text-[11px] uppercase tracking-widest text-textSecondary mb-4"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                letterSpacing: "0.15em",
              }}
            >
              Details
            </h4>

            {/* Name Input */}
            <div className="mb-6">
              <label
                className="block text-[11px] uppercase tracking-widest text-textSecondary mb-2"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.15em",
                }}
              >
                Asset Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Modern Lounge Chair"
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
                className="block text-[11px] uppercase tracking-widest text-textSecondary mb-2"
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
                      onClick={() => handleTypeChange(t)}
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

            {/* Category Dropdown */}
            <div className="relative" ref={categoryRef}>
              <label
                className="block text-[11px] uppercase tracking-widest text-textSecondary mb-2"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.15em",
                }}
              >
                Category
              </label>
              <button
                onClick={() => type && setIsCategoryOpen(!isCategoryOpen)}
                disabled={!type}
                className={`w-full px-4 py-3 text-[14px] bg-transparent border rounded-sm text-left transition-colors duration-300 ${
                  type
                    ? "border-[#E8E6E3] focus:outline-none focus:border-foreground"
                    : "border-[#F3F1EE] cursor-not-allowed"
                }`}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  color: category ? "var(--foreground)" : "#c5c5c5",
                }}
              >
                {category || (type ? "Select category" : "Select type first")}
              </button>

              {/* Dropdown Menu */}
              {isCategoryOpen && type && (
                <div
                  className="absolute top-full left-0 right-0 mt-2 bg-[#FDFCFB] border border-[#E8E6E3] rounded-sm shadow-lg z-20"
                  style={{ maxHeight: "240px", overflowY: "auto" }}
                >
                  {availableCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategory(cat);
                        setIsCategoryOpen(false);
                      }}
                      className="w-full px-4 py-3 text-[14px] text-left hover:bg-background transition-colors duration-300"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 300,
                        color:
                          category === cat ? "var(--foreground)" : "#626262",
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
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
            onClick={handleImport}
            disabled={!canImport}
            className={`px-6 py-3 text-[13px] rounded-sm transition-all duration-300 ${
              canImport
                ? "bg-foreground text-[#FDFCFB] hover:opacity-80"
                : "bg-[#F3F1EE] text-[#c5c5c5] cursor-not-allowed"
            }`}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              letterSpacing: "0.05em",
            }}
          >
            Import Asset
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
