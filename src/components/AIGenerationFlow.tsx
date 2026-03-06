import { ArrowLeft, Maximize2, MessageSquare, Minimize2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { CommentsPanel } from "./CommentsPanel";
import {
  STEPS,
  VERSION_HISTORY,
} from "./containers/ai-generation-flow/constants";
import { StepCanvasPanel } from "./containers/ai-generation-flow/StepCanvasPanel";
import { StepControlsPanel } from "./containers/ai-generation-flow/StepControlsPanel";
import { StepIndicator } from "./containers/ai-generation-flow/StepIndicator";
import type { ChatMessage, Dimensions, FlowTab, Step } from "./containers/ai-generation-flow/types";

interface AIGenerationFlowProps {
  initialSpaceName?: string;
  onBack: () => void;
  onFullViewChange?: (isFullView: boolean) => void;
}

export function AIGenerationFlow({
  initialSpaceName = "",
  onBack,
  onFullViewChange,
}: AIGenerationFlowProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [spaceName, setSpaceName] = useState(initialSpaceName);
  const [isFullView, setIsFullView] = useState(false);
  const [isCommentsPanelOpen, setIsCommentsPanelOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false);
  const [versionToRestore, setVersionToRestore] = useState<number | null>(null);
  const [currentVersion, setCurrentVersion] = useState(3);
  const [showRegenerateTooltip, setShowRegenerateTooltip] = useState(false);

  const [activeTab, setActiveTab] = useState<FlowTab>("controls");
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const [roomType, setRoomType] = useState("");
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: "",
    depth: "",
    height: "",
  });
  const [budget, setBudget] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFurniture, setSelectedFurniture] = useState<string[]>([]);
  const [styleKeywords, setStyleKeywords] = useState("");
  const [mood, setMood] = useState("");
  const [materials, setMaterials] = useState("");
  const [inspirationImages, setInspirationImages] = useState<string[]>([]);
  const [selectedLayout, setSelectedLayout] = useState<number | null>(null);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Record<string, number>>({});
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    if (onFullViewChange) {
      onFullViewChange(isFullView);
    }
  }, [isFullView, onFullViewChange]);

  const handleNextStep = () => {
    if (currentStep < 6) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleClearDraft = () => {
    setSpaceName(initialSpaceName);
    setRoomType("");
    setDimensions({ width: "", depth: "", height: "" });
    setBudget("");
    setUploadedImage(null);
    setInspirationImages([]);
    setSelectedFurniture([]);
    setStyleKeywords("");
    setMood("");
    setMaterials("");
    setSelectedLayout(null);
    setShowBeforeAfter(false);
    setSelectedProducts({});
    setActiveFilters([]);
    setCurrentStep(1);
  };

  const handleRegenerate = () => {
    console.log(`Regenerating step ${currentStep}`);
  };

  const handleRestoreClick = (version: number) => {
    setVersionToRestore(version);
    setIsRestoreConfirmOpen(true);
  };

  const handleRestoreConfirm = () => {
    if (versionToRestore !== null) {
      setCurrentVersion(versionToRestore);
      setIsRestoreConfirmOpen(false);
      setIsVersionHistoryOpen(false);
      setVersionToRestore(null);
    }
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatMessage.trim(),
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setChatMessages([...chatMessages, newMessage]);
    setChatMessage("");
  };

  return (
    <div className="flex flex-col lg:h-full">
      <div className="relative mb-6 flex items-center justify-between flex-shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-[13px] text-textSecondary hover:text-[#626262] transition-colors duration-300"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, letterSpacing: "0.02em" }}
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Back
        </button>

        {spaceName ? (
          <div
            className="absolute left-1/2 -translate-x-1/2 text-[13px] text-textSecondary"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, letterSpacing: "0.02em" }}
          >
            {spaceName}
          </div>
        ) : null}

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={handleRegenerate}
              onMouseEnter={() => setShowRegenerateTooltip(true)}
              onMouseLeave={() => setShowRegenerateTooltip(false)}
              className="text-textSecondary hover:text-[#626262] transition-colors duration-300"
              aria-label="Regenerate"
            >
              <RefreshCw size={16} strokeWidth={1.5} />
            </button>
            {showRegenerateTooltip ? (
              <div
                className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-foreground text-background text-[11px] rounded-sm whitespace-nowrap pointer-events-none z-50"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, letterSpacing: "0.02em" }}
              >
                Regenerate
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setIsVersionHistoryOpen(true)}
            className="px-2.5 py-1 rounded-full bg-[#E8E6E3]/40 hover:bg-[#E8E6E3]/60 transition-all duration-300"
          >
            <span
              className="text-[10px] text-textSecondary tracking-wide uppercase"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, letterSpacing: "0.08em" }}
            >
              v{currentVersion}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsCommentsPanelOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-textSecondary hover:text-[#626262] hover:bg-[#E8E6E3]/50 transition-colors duration-300"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, letterSpacing: "0.02em" }}
          >
            <MessageSquare size={16} strokeWidth={1.5} />
            <span className="text-[12px]">Comments</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullView(!isFullView)}
            className="text-textSecondary hover:text-[#626262] transition-colors duration-300"
            style={{ marginTop: "-10px" }}
            aria-label={isFullView ? "Exit full view" : "Enter full view"}
          >
            {isFullView ? <Minimize2 size={20} strokeWidth={1.5} /> : <Maximize2 size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      <div className="relative flex-1 flex items-center min-h-0">
        <div className="relative w-full max-w-[1640px] mx-auto">
          <StepIndicator steps={STEPS} currentStep={currentStep} setCurrentStep={setCurrentStep} />

          <div className="grid gap-x-8 gap-y-4 xl:pr-24 lg:grid-cols-[1fr_minmax(290px,300px)] xl:grid-cols-[1fr_minmax(320px,380px)]">
            <div className="flex flex-col gap-3 min-h-0">
              <div className="min-h-0">
                <StepCanvasPanel
                  currentStep={currentStep}
                  uploadedImage={uploadedImage}
                  setUploadedImage={setUploadedImage}
                  showBeforeAfter={showBeforeAfter}
                  setShowBeforeAfter={setShowBeforeAfter}
                />
              </div>

              <div className="hidden lg:flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <button
                    type="button"
                    onClick={handleClearDraft}
                    className="text-[13px] text-textSecondary hover:text-[#626262] transition-colors duration-300"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, letterSpacing: "0.02em" }}
                  >
                    Clear draft
                  </button>
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePreviousStep}
                      className="text-[13px] text-textSecondary hover:text-foreground transition-colors duration-300"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, letterSpacing: "0.02em" }}
                    >
                      Go back
                    </button>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={currentStep === 1 && !spaceName.trim()}
                  className="text-[13px] text-foreground hover:text-[#626262] transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, letterSpacing: "0.02em" }}
                >
                  {currentStep === 6 ? "Complete" : currentStep === 3 ? "Generate design" : "Next step"}
                </button>
              </div>
            </div>

            <div className="min-h-0 lg:h-[550px] lg:flex lg:flex-col">
              <StepControlsPanel
                currentStep={currentStep}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                chatMessages={chatMessages}
                chatMessage={chatMessage}
                setChatMessage={setChatMessage}
                onSendMessage={handleSendMessage}
                roomType={roomType}
                setRoomType={setRoomType}
                dimensions={dimensions}
                setDimensions={setDimensions}
                budget={budget}
                setBudget={setBudget}
                selectedFurniture={selectedFurniture}
                setSelectedFurniture={setSelectedFurniture}
                styleKeywords={styleKeywords}
                setStyleKeywords={setStyleKeywords}
                mood={mood}
                setMood={setMood}
                materials={materials}
                setMaterials={setMaterials}
                inspirationImages={inspirationImages}
                setInspirationImages={setInspirationImages}
                selectedLayout={selectedLayout}
                setSelectedLayout={setSelectedLayout}
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
              />
            </div>
          </div>

          <div className="flex lg:hidden items-center justify-between mt-4">
            <div className="flex items-center gap-8">
              <button
                type="button"
                onClick={handleClearDraft}
                className="text-[13px] text-textSecondary hover:text-[#626262] transition-colors duration-300"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, letterSpacing: "0.02em" }}
              >
                Clear draft
              </button>

              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="text-[13px] text-textSecondary hover:text-foreground transition-colors duration-300"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, letterSpacing: "0.02em" }}
                >
                  Go back
                </button>
              ) : null}
            </div>

            <button
              type="button"
              onClick={handleNextStep}
              disabled={currentStep === 1 && !spaceName.trim()}
              className="text-[13px] text-foreground hover:text-[#626262] transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, letterSpacing: "0.02em" }}
            >
              {currentStep === 6 ? "Complete" : currentStep === 3 ? "Generate design" : "Next step"}
            </button>
          </div>
        </div>
      </div>

      <CommentsPanel
        isOpen={isCommentsPanelOpen}
        onClose={() => setIsCommentsPanelOpen(false)}
        spaceName={spaceName || "this space"}
      />

      {isVersionHistoryOpen ? (
        <div className="fixed inset-0 bg-foreground/20 flex items-center justify-center z-50">
          <div
            className="bg-background rounded-sm p-8 max-w-md w-full mx-4"
            style={{ boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)" }}
          >
            <h3
              className="text-[16px] text-foreground mb-6"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, letterSpacing: "0.01em" }}
            >
              Version history
            </h3>

            <div className="space-y-3">
              {VERSION_HISTORY.map((item) => (
                <div
                  key={item.version}
                  className="flex items-center justify-between py-3 border-b border-[#E8E6E3]/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[13px] text-foreground"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: item.version === currentVersion ? 400 : 300,
                          letterSpacing: "0.01em",
                        }}
                      >
                        v{item.version}
                      </span>
                      <span
                        className="text-[13px] text-textSecondary"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, letterSpacing: "0.01em" }}
                      >
                        {item.label}
                      </span>
                      {item.version === currentVersion ? (
                        <span
                          className="text-[10px] text-textSecondary ml-1"
                          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, letterSpacing: "0.02em" }}
                        >
                          (current)
                        </span>
                      ) : null}
                    </div>
                    <p
                      className="text-[11px] text-[#c5c5c5]"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, letterSpacing: "0.01em" }}
                    >
                      {item.timestamp}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="text-[12px] text-textSecondary hover:text-foreground transition-colors duration-300"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, letterSpacing: "0.01em" }}
                    >
                      View
                    </button>
                    {item.version !== currentVersion ? (
                      <button
                        type="button"
                        onClick={() => handleRestoreClick(item.version)}
                        className="text-[12px] text-textSecondary hover:text-foreground transition-colors duration-300"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, letterSpacing: "0.01em" }}
                      >
                        Restore
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsVersionHistoryOpen(false)}
              className="mt-6 w-full text-[12px] text-textSecondary hover:text-foreground transition-colors duration-300"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, letterSpacing: "0.02em" }}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      {isRestoreConfirmOpen && versionToRestore !== null ? (
        <div className="fixed inset-0 bg-foreground/20 flex items-center justify-center z-50">
          <div
            className="bg-background rounded-sm p-8 max-w-sm w-full mx-4"
            style={{ boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)" }}
          >
            <p
              className="text-[14px] text-foreground mb-6"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                letterSpacing: "0.01em",
                lineHeight: 1.6,
              }}
            >
              This will make v{versionToRestore} your current version.
            </p>
            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsRestoreConfirmOpen(false)}
                className="text-[12px] text-textSecondary hover:text-foreground transition-colors duration-300"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, letterSpacing: "0.02em" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRestoreConfirm}
                className="text-[12px] text-foreground hover:text-[#626262] transition-colors duration-300"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, letterSpacing: "0.02em" }}
              >
                Restore version
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
