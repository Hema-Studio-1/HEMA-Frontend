import { X } from "lucide-react";
import { useState } from "react";
import { CustomDropdown } from "./CustomDropdown";

interface AddTeamMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    name: string,
    email: string,
    role: "Admin" | "Designer" | "Reviewer" | "Viewer",
  ) => void;
}

export function AddTeamMemberDialog({
  isOpen,
  onClose,
  onAdd,
}: AddTeamMemberDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<
    "Admin" | "Designer" | "Reviewer" | "Viewer"
  >("Designer");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (name && email) {
      onAdd(name, email, role);
      setName("");
      setEmail("");
      setRole("Designer");
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 transition-opacity duration-500"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-background rounded-sm w-full max-w-md"
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
              Add team member
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
            {/* Name */}
            <div>
              <label
                className="block text-[11px] text-textSecondary mb-2 uppercase tracking-widest"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.1em",
                }}
              >
                Team member name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-0 py-3 text-[15px] text-foreground placeholder:text-[#c5c5c5] bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] focus:outline-none transition-colors duration-300"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label
                className="block text-[11px] text-textSecondary mb-2 uppercase tracking-widest"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.1em",
                }}
              >
                Team member email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-0 py-3 text-[15px] text-foreground placeholder:text-[#c5c5c5] bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] focus:outline-none transition-colors duration-300"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                }}
              />
            </div>

            {/* Role */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className="text-[11px] text-textSecondary uppercase tracking-widest"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    letterSpacing: "0.1em",
                  }}
                >
                  Role
                </label>
              </div>
              <CustomDropdown
                value={role}
                onChange={(value) =>
                  setRole(value as "Admin" | "Designer" | "Reviewer" | "Viewer")
                }
                options={[
                  { value: "Admin", label: "Admin" },
                  { value: "Designer", label: "Designer" },
                  { value: "Reviewer", label: "Reviewer" },
                  { value: "Viewer", label: "Viewer" },
                ]}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 text-[13px] text-[#626262] hover:text-foreground border border-[#E8E6E3] hover:border-foreground transition-colors duration-300"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.03em",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-foreground text-background text-[13px] hover:bg-[#3d3d3d] transition-colors duration-300"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.03em",
                }}
              >
                Add member
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
