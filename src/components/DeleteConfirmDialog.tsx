interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete item?",
  message = "This action will permanently remove this item. This cannot be undone.",
}: DeleteConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-[70] transition-opacity duration-500"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
        <div
          className="bg-background rounded-sm w-full max-w-md"
          style={{
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Title */}
            <h2
              className="text-[24px] text-foreground"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 300,
                letterSpacing: "-0.01em",
              }}
            >
              {title}
            </h2>

            {/* Description */}
            <p
              className="text-[13px] text-textSecondary"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                letterSpacing: "0.01em",
                lineHeight: "1.6",
              }}
            >
              {message}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-2">
              <button
                onClick={onClose}
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
                onClick={handleConfirm}
                className="px-8 py-3 bg-foreground text-background text-[13px] hover:bg-[#3d3d3d] transition-colors duration-300"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.03em",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
