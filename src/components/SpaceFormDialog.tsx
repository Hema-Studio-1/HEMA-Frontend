"use client";

import { uploadSingleFile } from "@/actions/upload-files";
import { useAIGenerationFlowContext } from "@/contexts/AIGenerationFlowContext";
import { extractDimensionsFromMeasureRoom } from "@/lib/dimensions";
import { createSpaceWithImage, measureRoom } from "@/services/api/spaces";
import { ImageType } from "@/types/image";
import type { SpaceWithRelations } from "@/types/space";
import { Upload, X } from "lucide-react";
import NextImage from "next/image";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { CustomDropdown } from "./CustomDropdown";

export interface SpaceFormData {
  name: string;
  type: string;
  category: string;
  description: string;
}

const TYPE_TO_ROOM_TYPE: Record<string, string> = {
  "Living Room": "living-room",
  Bedroom: "bedroom",
  Kitchen: "kitchen",
  Bathroom: "bathroom",
  "Dining Room": "dining-room",
  "Home Office": "office",
  Custom: "living-room",
};

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
  onCreate: (space: SpaceWithRelations) => void;
  onUpdate?: (id: string, data: SpaceFormData) => void;
}

const defaultFormData: SpaceFormData = {
  name: "",
  type: "Living Room",
  category: "Modern",
  description: "",
};

function getImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}


export function SpaceFormDialog({
  isOpen,
  onClose,
  mode,
  editSpace,
  onCreate,
  onUpdate,
}: SpaceFormDialogProps) {
  const [formData, setFormData] = useState<SpaceFormData>(defaultFormData);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<{
    path: string;
    url: string;
  } | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { step1, step3 } = useAIGenerationFlowContext();

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
      setUploadedFile(null);
      setUploadPreviewUrl(null);
      setUploadResult(null);
      setImageDimensions(null);
      setError(null);
    }
  }, [mode, editSpace]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPEG, PNG, etc.)");
      return;
    }
    setUploadedFile(file);
    setUploadResult(null);

    // Get dimensions (best effort, skip if fails)
    try {
      const dims = await getImageDimensions(file);
      setImageDimensions(dims);
    } catch {
      setImageDimensions(null);
    }

    // Upload immediately - imageStoragePath comes from upload response
    setIsUploading(true);
    try {
      const result = await uploadSingleFile(file);
      if (result.success && result.path && result.url) {
        setUploadResult({ path: result.path, url: result.url });
        setUploadPreviewUrl(result.url);
      } else {
        setError(result.error ?? "Upload failed");
        setUploadPreviewUrl(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploadPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
    e.target.value = "";
  };

  const handleRemoveImage = () => {
    if (uploadPreviewUrl?.startsWith("blob:"))
      URL.revokeObjectURL(uploadPreviewUrl);
    setUploadedFile(null);
    setUploadPreviewUrl(null);
    setUploadResult(null);
    setImageDimensions(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (mode === "edit" && editSpace && onUpdate) {
      if (!formData.name.trim()) return;
      onUpdate(editSpace.id, formData);
      setFormData(defaultFormData);
      onClose();
      return;
    }

    if (!formData.name.trim() || !formData.description.trim()) {
      setError("Name and description are required");
      return;
    }
    // Need either uploadResult (from upload-on-select) or uploadedFile (to upload on submit)
    if (!uploadResult && !uploadedFile) {
      setError("Please upload a space image");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      let path: string;
      let signedUrl: string;

      if (uploadResult) {
        // Use path from upload-on-select (contains filename)
        path = uploadResult.path;
        signedUrl = uploadResult.url;
      } else if (uploadedFile) {
        // Fallback: upload on submit
        setIsUploading(true);
        const result = await uploadSingleFile(uploadedFile);
        setIsUploading(false);
        if (!result.success || !result.path || !result.url) {
          setError(result.error ?? "Upload failed");
          setIsSubmitting(false);
          return;
        }
        path = result.path;
        signedUrl = result.url;
      } else {
        setError("Please upload a space image");
        setIsSubmitting(false);
        return;
      }

      // imageStoragePath = path from upload (contains filename), imageType always "original"
      const apiPayload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        imageType: ImageType.ORIGINAL,
        imageStoragePath: path,
        ...(imageDimensions && {
          imageWidth: imageDimensions.width,
          imageHeight: imageDimensions.height,
        }),
      };

      const apiResult = await createSpaceWithImage(apiPayload);

      if (apiResult.error || !apiResult.data) {
        setError(apiResult.error ?? "Failed to create space");
        setIsSubmitting(false);
        return;
      }

      const space = apiResult.data;
      const roomType = TYPE_TO_ROOM_TYPE[formData.type] ?? "living-room";

      step1.setSpace(space);
      step1.setUploadedImageUrl(signedUrl);
      step1.setSpaceName(space.name);
      step1.setRoomType(roomType);
      step3.setStyleKeywords(formData.category);

      const imageId =
        space.images?.find((img) => img.storagePath === path)?.id ??
        space.images?.find((img) => img.type === ImageType.ORIGINAL)?.id ??
        space.images?.[0]?.id;

      // Wait for room measurement before redirecting; continue flow even if this fails.
      if (imageId) {
        const measureResult = await measureRoom({ imageId });
        if (!measureResult.error && measureResult.data) {
          const measuredDimensions = extractDimensionsFromMeasureRoom(
            measureResult.data,
          );
          step1.setDimensions(measuredDimensions);
        }
      }

      setFormData(defaultFormData);
      handleRemoveImage();
      onClose();
      onCreate(space);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    handleRemoveImage();
    setFormData(defaultFormData);
    setError(null);
    onClose();
  };

  const canSubmitCreate =
    formData.name.trim() &&
    formData.description.trim() &&
    (uploadedFile || uploadResult) &&
    !isSubmitting &&
    !isUploading;

  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close dialog"
        className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-50 transition-opacity duration-500 w-full h-full cursor-default"
        onClick={handleCancel}
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        aria-hidden
      >
        <div
          role="dialog"
          aria-modal
          aria-labelledby="space-dialog-title"
          className="bg-background rounded-sm w-full max-w-xl p-12 relative pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleCancel}
            className="absolute top-6 right-6 p-2 hover:opacity-60 transition-opacity duration-300"
          >
            <X size={20} className="text-[#626262]" strokeWidth={1.5} />
          </button>

          <h3
            id="space-dialog-title"
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
                htmlFor="space-name"
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
                id="space-name"
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
              />
            </div>

            <div>
              <label
                htmlFor="space-type"
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
                id="space-type"
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
                htmlFor="space-category"
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
                id="space-category"
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
                htmlFor="space-description"
                className="block text-[12px] text-textSecondary mb-3 uppercase tracking-widest"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.1em",
                }}
              >
                Description
              </label>
              <input
                id="space-description"
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of the space"
                className="w-full px-0 py-3 text-[16px] text-foreground placeholder:text-[#c5c5c5] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                }}
              />
            </div>

            <div>
              <span
                className="block text-[12px] text-textSecondary mb-3 uppercase tracking-widest"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.1em",
                }}
              >
                Space Image
              </span>
              {uploadPreviewUrl ? (
                <div className="relative mt-2 h-40 overflow-hidden rounded-sm border border-[#E8E6E3]">
                  <NextImage
                    src={uploadPreviewUrl}
                    alt="Space preview"
                    width={imageDimensions?.width ?? 400}
                    height={imageDimensions?.height ?? 300}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-sm hover:opacity-60 transition-opacity duration-300"
                  >
                    <X size={16} className="text-[#626262]" strokeWidth={1.5} />
                  </button>
                  {imageDimensions && (
                    <p
                      className="text-[11px] text-textSecondary mt-1"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 300,
                      }}
                    >
                      {imageDimensions.width} × {imageDimensions.height}
                    </p>
                  )}
                </div>
              ) : (
                <label
                  htmlFor="space-image-upload"
                  className="flex items-center justify-center gap-2 w-full py-8 border border-dashed border-[#E8E6E3] rounded-sm cursor-pointer hover:border-[#A4AC96] transition-colors duration-300"
                >
                  <input
                    ref={fileInputRef}
                    id="space-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Upload
                    size={20}
                    className="text-textSecondary"
                    strokeWidth={1.5}
                  />
                  <span
                    className="text-[13px] text-textSecondary"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    {isUploading ? "Uploading..." : "Upload image"}
                  </span>
                </label>
              )}
            </div>
          </div>

          {error && (
            <div
              className="mt-6 px-4 py-3 rounded-sm bg-red-500/10 border border-red-500/20 text-[13px] text-red-600"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
            >
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-6 mt-6">
            <button
              type="button"
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
              type="button"
              onClick={handleSubmit}
              disabled={
                mode === "edit" ? !formData.name.trim() : !canSubmitCreate
              }
              className="px-8 py-3 bg-foreground text-background text-[13px] hover:bg-[#3d3d3d] transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                letterSpacing: "0.03em",
              }}
            >
              {mode === "edit"
                ? "Update"
                : isSubmitting || isUploading
                  ? "Creating..."
                  : "Create Space"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
