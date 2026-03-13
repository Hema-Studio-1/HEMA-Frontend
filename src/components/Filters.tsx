import { ChevronRight } from "lucide-react";
import React, { useState } from "react";

export function Filters() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedLight, setSelectedLight] = useState("");

  const styles = ["Minimal", "Japandi", "Modern", "Wabi-Sabi", "Scandinavian"];
  const rooms = ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Office"];
  const moods = ["Warm", "Neutral", "Earthy", "Cool", "Bright"];
  const lights = ["Soft Daylight", "Sunset", "Studio", "Natural", "Ambient"];

  const FilterSection = ({
    title,
    options,
    selected,
    onChange,
  }: {
    title: string;
    options: string[];
    selected: string;
    onChange: (value: string) => void;
  }) => (
    <div className="mb-10">
      <p className="text-sm uppercase tracking-widest text-textSecondary mb-4">
        {title}
      </p>
      <div className="space-y-1.5">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(selected === option ? "" : option)}
            className={`block text-left text-sm transition-colors duration-300 ${
              selected === option
                ? "text-foreground"
                : "text-[#c5c5c5] hover:text-[#626262]"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Toggle Button - Almost invisible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed top-28 right-8 z-[100] flex items-center gap-2 text-[12px] text-textSecondary hover:text-[#626262] transition-colors duration-300"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          letterSpacing: "0.05em",
        }}
      >
        Filters
        <ChevronRight
          size={14}
          strokeWidth={1.5}
          className={`transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Filter Panel - Text only; high z-index so it appears above all content */}
      <aside
        className={`fixed right-0 top-0 bottom-0 w-72 bg-[#FDFCFB] px-12 py-12 overflow-y-auto transition-transform duration-500 ease-out z-[100] shadow-[-4px_0_24px_rgba(0,0,0,0.06)] ${
          isExpanded ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <FilterSection
          title="Style"
          options={styles}
          selected={selectedStyle}
          onChange={setSelectedStyle}
        />

        <FilterSection
          title="Room"
          options={rooms}
          selected={selectedRoom}
          onChange={setSelectedRoom}
        />

        <FilterSection
          title="Mood"
          options={moods}
          selected={selectedMood}
          onChange={setSelectedMood}
        />

        <FilterSection
          title="Light"
          options={lights}
          selected={selectedLight}
          onChange={setSelectedLight}
        />

        {/* Reset - Minimal text link */}
        {(selectedStyle || selectedRoom || selectedMood || selectedLight) && (
          <button
            className="text-[12px] text-textSecondary hover:text-foreground transition-colors duration-300 mt-12"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              letterSpacing: "0.05em",
            }}
            onClick={() => {
              setSelectedStyle("");
              setSelectedRoom("");
              setSelectedMood("");
              setSelectedLight("");
            }}
          >
            Reset
          </button>
        )}
      </aside>

      {/* Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-foreground/5 backdrop-blur-sm z-[90] transition-opacity duration-500"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
}
