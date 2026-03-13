import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CustomDropdownProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  variant?: "filter" | "form";
}

export function CustomDropdown({
  id,
  value,
  onChange,
  options,
  placeholder,
  className = "",
  variant = "form",
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 text-[13px] text-foreground rounded-md focus:outline-none transition-all duration-300 cursor-pointer flex items-center justify-between ${
          variant === "filter"
            ? "bg-[#EFEDE9] border border-[#E8E6E3] hover:bg-[#E8E6E3] hover:border-[#d5d3cf]"
            : "bg-[#EFEDE9]/50 border border-[#E8E6E3] hover:border-[#A4AC96]"
        }`}
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
        }}
      >
        <span>{selectedOption?.label || placeholder}</span>
        <ChevronDown
          size={14}
          strokeWidth={1.5}
          className={`text-textSecondary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-background border border-[#E8E6E3] rounded-md shadow-sm z-50 overflow-hidden"
          style={{
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
          }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`block w-full px-4 py-2.5 text-left text-[13px] transition-all duration-200 relative ${
                option.value === value
                  ? "bg-[#EFEDE9] text-foreground"
                  : "text-[#626262] hover:bg-[#EFEDE9]/50 hover:text-foreground"
              }`}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: option.value === value ? 400 : 300,
              }}
            >
              {option.value === value && (
                <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#A4AC96]" />
              )}
              <span className={option.value === value ? "ml-3" : ""}>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
