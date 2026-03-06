import { Upload, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CustomDropdown } from "./CustomDropdown";

export interface SpaceFormData {
  name: string;
  type: string;
  category: string;
  description: string;
}

interface SpaceFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  editSpace?: {
    id: string;
    name: string;
    type?: string;
    category?: string;
    description?: string;
  } | null;
  onCreate: (data: SpaceFormData) => void;
  onUpdate?: (id: string, data: SpaceFormData) => void;
}

const defaultFormData: SpaceFormData = {
  name: "",
  type: "Living Room",
  category: "Modern",
  description: "",
};

export function SpaceFormDialog({
  isOpen,
  onClose,
  mode,
  editSpace,
  onCreate,
  onUpdate,
}: SpaceFormDialogProps) {
  const [formData, setFormData] = useState<SpaceFormData>(defaultFormData);

  useEffect(() => {
    if (mode === "edit" && editSpace) {
      setFormData({
        name: editSpace.name,
        type: editSpace.type ?? "Living Room",
        category: editSpace.category ?? "Modern",
        description: editSpace.description ?? "",
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [mode, editSpace, isOpen]);

  const handleSubmit = () => {
    if (!formData.name.trim()) return;
    if (mode === "edit" && editSpace && onUpdate) {
      onUpdate(editSpace.id, formData);
    } else {
      onCreate(formData);
    }
    setFormData(defaultFormData);
    onClose();
  };

  const handleCancel = () => {
    setFormData(defaultFormData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-50 transition-opacity duration-500"
        onClick={handleCancel}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-background rounded-sm w-full max-w-xl p-12 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleCancel}
            className="absolute top-6 right-6 p-2 hover:opacity-60 transition-opacity duration-300"
          >
            <X size={20} className="text-[#626262]" strokeWidth={1.5} />
          </button>

          <h3
            className="text-[28px] mb-8 text-foreground"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 300,
              letterSpacing: "-0.01em",
            }}
          >
            {mode === "edit" ? "Edit space" : "New Space"}
          </h3>

          <div className="space-y-8">
            <div>
              <label
                className="block text-[12px] text-textSecondary mb-3 uppercase tracking-widest"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.1em",
                }}
              >
                Space Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Modern Living Room"
                className="w-full px-0 py-3 text-[16px] text-foreground placeholder:text-[#c5c5c5] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                }}
                autoFocus
              />
            </div>

            <div>
              <label
                className="block text-[12px] text-textSecondary mb-3 uppercase tracking-widest"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.1em",
                }}
              >
                Space Type
              </label>
              <CustomDropdown
                value={formData.type}
                onChange={(value) => setFormData({ ...formData, type: value })}
                options={[
                  { value: "Living Room", label: "Living Room" },
                  { value: "Bedroom", label: "Bedroom" },
                  { value: "Kitchen", label: "Kitchen" },
                  { value: "Bathroom", label: "Bathroom" },
                  { value: "Dining Room", label: "Dining Room" },
                  { value: "Home Office", label: "Home Office" },
                  { value: "Custom", label: "Custom" },
                ]}
                variant="form"
              />
            </div>

            <div>
              <label
                className="block text-[12px] text-textSecondary mb-3 uppercase tracking-widest"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.1em",
                }}
              >
                Category / Style
              </label>
              <CustomDropdown
                value={formData.category}
                onChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
                options={[
                  { value: "Modern", label: "Modern" },
                  { value: "Japandi", label: "Japandi" },
                  { value: "Minimal", label: "Minimal" },
                  { value: "Industrial", label: "Industrial" },
                  { value: "Scandinavian", label: "Scandinavian" },
                  { value: "Organic", label: "Organic" },
                ]}
                variant="form"
              />
            </div>

            <div>
              <label
                className="block text-[12px] text-textSecondary mb-3 uppercase tracking-widest"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.1em",
                }}
              >
                Description (Optional)
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description"
                className="w-full px-0 py-3 text-[16px] text-foreground placeholder:text-[#c5c5c5] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                }}
              />
            </div>

            <div>
              <label
                className="block text-[12px] text-textSecondary mb-3 uppercase tracking-widest"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.1em",
                }}
              >
                Reference Image (Optional)
              </label>
              <button
                className="flex items-center gap-2 text-[13px] text-textSecondary hover:text-[#626262] transition-colors duration-300"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
              >
                <Upload size={16} strokeWidth={1.5} />
                Upload image
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-6 mt-12">
            <button
              onClick={handleCancel}
              className="text-[13px] text-textSecondary hover:text-[#626262] transition-colors duration-300"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                letterSpacing: "0.02em",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!formData.name.trim()}
              className="px-8 py-3 bg-foreground text-background text-[13px] hover:bg-[#3d3d3d] transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                letterSpacing: "0.03em",
              }}
            >
              {mode === "edit" ? "Update" : "Create Space"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
