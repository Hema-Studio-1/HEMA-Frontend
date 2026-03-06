import { Upload, X } from "lucide-react";
import { useState } from "react";

interface CreateSpaceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (spaceName: string, description?: string, files?: File[]) => void;
}

export function CreateSpaceDialog({
  isOpen,
  onClose,
  onContinue,
}: CreateSpaceDialogProps) {
  const [spaceName, setSpaceName] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const handleContinue = () => {
    if (!spaceName.trim()) return;
    onContinue(
      spaceName,
      description || undefined,
      uploadedFiles.length > 0 ? uploadedFiles : undefined,
    );

    // Reset form
    setSpaceName("");
    setDescription("");
    setUploadedFiles([]);
  };

  const handleClose = () => {
    setSpaceName("");
    setDescription("");
    setUploadedFiles([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 transition-opacity duration-500"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-background rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          style={{
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-8 pb-6">
            <h2
              className="text-[24px] text-foreground"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 300,
                letterSpacing: "-0.01em",
              }}
            >
              Create a new space
            </h2>
            <button
              onClick={handleClose}
              className="p-2 text-textSecondary hover:text-foreground transition-colors duration-300"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Content */}
          <div className="px-8 pb-8 space-y-8">
            {/* Space Name */}
            <div>
              <label
                className="block text-[11px] text-textSecondary mb-3 uppercase tracking-widest"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.1em",
                }}
              >
                Space Name <span className="text-foreground">*</span>
              </label>
              <input
                type="text"
                value={spaceName}
                onChange={(e) => setSpaceName(e.target.value)}
                placeholder="e.g. Living Room, Master Bedroom"
                className="w-full px-0 py-3 text-[16px] text-foreground placeholder:text-[#c5c5c5] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                }}
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <label
                className="block text-[11px] text-textSecondary mb-3 uppercase tracking-widest"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.1em",
                }}
              >
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the space or intent (optional)"
                rows={3}
                className="w-full px-0 py-3 text-[16px] text-foreground placeholder:text-[#c5c5c5] resize-none focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  lineHeight: "1.8",
                }}
              />
            </div>

            {/* Upload Section */}
            <div>
              <label
                className="block text-[11px] text-textSecondary mb-3 uppercase tracking-widest"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.1em",
                }}
              >
                Upload Floor Plan or Reference (Optional)
              </label>

              <label className="block cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="border border-dashed border-[#E8E6E3] rounded-sm p-8 text-center hover:border-[#A4AC96] transition-colors duration-500">
                  <Upload
                    size={24}
                    className="mx-auto mb-3 text-[#c5c5c5]"
                    strokeWidth={1.5}
                  />
                  <p
                    className="text-[13px] text-textSecondary mb-1"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    {uploadedFiles.length > 0
                      ? `${uploadedFiles.length} file(s) selected`
                      : "Click to upload or drag files"}
                  </p>
                  <p
                    className="text-[11px] text-[#c5c5c5]"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    Floor plans help AI understand layout, but this step is
                    optional
                  </p>
                </div>
              </label>

              {uploadedFiles.length > 0 && (
                <p
                  className="mt-2 text-[11px] text-textSecondary"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300,
                  }}
                >
                  {uploadedFiles.map((f) => f.name).join(", ")}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                onClick={handleClose}
                className="text-[13px] text-textSecondary hover:text-[#626262] transition-colors duration-300"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  letterSpacing: "0.02em",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleContinue}
                disabled={!spaceName.trim()}
                className="px-8 py-3 bg-foreground text-background text-[13px] hover:bg-[#3d3d3d] transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.03em",
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
