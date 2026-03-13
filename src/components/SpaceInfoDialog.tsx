import { X } from "lucide-react";

interface SpaceInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  space: {
    id: string;
    name: string;
    type: string;
    category: string;
    description: string;
    assets: string[];
    createdDate: string;
    lastUpdated: string;
  } | null;
}

export function SpaceInfoDialog({
  isOpen,
  onClose,
  space,
}: SpaceInfoDialogProps) {
  if (!isOpen || !space) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 transition-opacity duration-500"
        onClick={onClose}
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
              Space details
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-textSecondary hover:text-foreground transition-colors duration-300"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Content */}
          <div className="px-8 pb-8 space-y-6">
            {/* Space Name */}
            <div>
              <label
                className="block text-[11px] text-textSecondary mb-2 uppercase tracking-widest"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.1em",
                }}
              >
                Space Name
              </label>
              <p
                className="text-[16px] text-foreground"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                }}
              >
                {space.name}
              </p>
            </div>

            {/* Type & Category */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-[11px] text-textSecondary mb-2 uppercase tracking-widest"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    letterSpacing: "0.1em",
                  }}
                >
                  Type
                </label>
                <p
                  className="text-[15px] text-foreground"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300,
                  }}
                >
                  {space.type}
                </p>
              </div>
              <div>
                <label
                  className="block text-[11px] text-textSecondary mb-2 uppercase tracking-widest"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    letterSpacing: "0.1em",
                  }}
                >
                  Category / Style
                </label>
                <p
                  className="text-[15px] text-foreground"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300,
                  }}
                >
                  {space.category}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                className="block text-[11px] text-textSecondary mb-2 uppercase tracking-widest"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.1em",
                }}
              >
                Description
              </label>
              <p
                className="text-[15px] text-foreground leading-relaxed"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  lineHeight: "1.7",
                }}
              >
                {space.description}
              </p>
            </div>

            {/* Assets */}
            <div>
              <label
                className="block text-[11px] text-textSecondary mb-2 uppercase tracking-widest"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.1em",
                }}
              >
                Generated Assets
              </label>
              <ul className="space-y-2">
                {space.assets.map((asset, index) => (
                  <li
                    key={index}
                    className="text-[14px] text-[#626262]"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    • {asset}
                  </li>
                ))}
              </ul>
            </div>

            {/* Metadata */}
            <div className="pt-4 border-t border-[#E8E6E3]">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label
                    className="block text-[11px] text-textSecondary mb-2 uppercase tracking-widest"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      letterSpacing: "0.1em",
                    }}
                  >
                    Created
                  </label>
                  <p
                    className="text-[13px] text-[#626262]"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    {space.createdDate}
                  </p>
                </div>
                <div>
                  <label
                    className="block text-[11px] text-textSecondary mb-2 uppercase tracking-widest"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      letterSpacing: "0.1em",
                    }}
                  >
                    Last Updated
                  </label>
                  <p
                    className="text-[13px] text-[#626262]"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    {space.lastUpdated}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
