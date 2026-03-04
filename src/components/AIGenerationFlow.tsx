import {
  ArrowLeft,
  Bath,
  Bed,
  Briefcase,
  ChefHat,
  DoorOpen,
  Home,
  Maximize2,
  MessageSquare,
  Minimize2,
  Minus,
  Plus,
  RefreshCw,
  Upload,
  UtensilsCrossed,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { CommentsPanel } from "./CommentsPanel";
import { StepChatInterface } from "./StepChatInterface";
import { StepTabSwitcher } from "./StepTabSwitcher";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

interface AIGenerationFlowProps {
  initialSpaceName?: string;
  onBack: () => void;
  onFullViewChange?: (isFullView: boolean) => void;
}

const roomTypeOptions = [
  { value: "living-room", label: "Living room", icon: Home },
  { value: "bedroom", label: "Bedroom", icon: Bed },
  { value: "kitchen", label: "Kitchen", icon: ChefHat },
  { value: "dining-room", label: "Dining room", icon: UtensilsCrossed },
  { value: "bathroom", label: "Bathroom", icon: Bath },
  { value: "office", label: "Office", icon: Briefcase },
  { value: "entryway", label: "Entryway", icon: DoorOpen },
];

export function AIGenerationFlow({
  initialSpaceName = "",
  onBack,
  onFullViewChange,
}: AIGenerationFlowProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [spaceName, setSpaceName] = useState(initialSpaceName);
  const [roomType, setRoomType] = useState("");
  const [isRoomTypeOpen, setIsRoomTypeOpen] = useState(false);
  const [isFullView, setIsFullView] = useState(false);
  const [isCommentsPanelOpen, setIsCommentsPanelOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false);
  const [versionToRestore, setVersionToRestore] = useState<number | null>(null);
  const [currentVersion, setCurrentVersion] = useState(3);
  const [showRegenerateTooltip, setShowRegenerateTooltip] = useState(false);
  const [activeTab, setActiveTab] = useState<"controls" | "chat">("controls");
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { id: string; text: string; sender: "user" | "ai"; timestamp: string }[]
  >([]);
  const roomTypeRef = useRef<HTMLDivElement>(null);

  const [dimensions, setDimensions] = useState({
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
  const [selectedProducts, setSelectedProducts] = useState<{
    [key: string]: number;
  }>({});
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const steps = [
    { number: 1, title: "The Basics" },
    { number: 2, title: "Make Space" },
    { number: 3, title: "Add Inspiration" },
    { number: 4, title: "Room Layout" },
    { number: 5, title: "Amend Design" },
    { number: 6, title: "Shop the Room" },
  ];

  const furnitureCategories = [
    {
      category: "Seating",
      items: ["Grey sofa", "Armchair", "Ottoman"],
    },
    {
      category: "Tables",
      items: ["Coffee table", "Side table"],
    },
    {
      category: "Textiles",
      items: ["Area rug", "Curtains"],
    },
    {
      category: "Lighting",
      items: ["Floor lamp", "Table lamp"],
    },
    {
      category: "Decor",
      items: ["Wall art", "Plants", "Vases"],
    },
  ];

  const shoppingItems = [
    {
      id: "1",
      name: "Scandinavian Oak Sofa",
      price: 1299,
      retailer: "West Elm",
      size: "220 x 90 cm",
      finish: "Natural Oak",
    },
    {
      id: "2",
      name: "Linen Accent Chair",
      price: 549,
      retailer: "Article",
      size: "80 x 85 cm",
      finish: "Off-white Linen",
    },
    {
      id: "3",
      name: "Walnut Coffee Table",
      price: 429,
      retailer: "CB2",
      size: "120 x 60 cm",
      finish: "Walnut Veneer",
    },
    {
      id: "4",
      name: "Woven Area Rug",
      price: 349,
      retailer: "Rugs USA",
      size: "240 x 170 cm",
      finish: "Natural Jute",
    },
    {
      id: "5",
      name: "Arc Floor Lamp",
      price: 189,
      retailer: "West Elm",
      size: "180 cm height",
      finish: "Brass",
    },
    {
      id: "6",
      name: "Ceramic Vase Set",
      price: 79,
      retailer: "CB2",
      size: "Assorted",
      finish: "Matte Cream",
    },
  ];

  const refineFilters = [
    "Seating",
    "Tables",
    "Lighting",
    "Textiles",
    "Decor",
    "Color palette",
    "Materials",
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInspirationUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInspirationImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeInspirationImage = (index: number) => {
    setInspirationImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleFurniture = (item: string) => {
    if (selectedFurniture.includes(item)) {
      setSelectedFurniture(selectedFurniture.filter((i) => i !== item));
    } else {
      setSelectedFurniture([...selectedFurniture, item]);
    }
  };

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

  const updateProductQuantity = (productId: string, change: number) => {
    setSelectedProducts((prev) => {
      const current = prev[productId] || 0;
      const newQuantity = Math.max(0, current + change);
      if (newQuantity === 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: newQuantity };
    });
  };

  const calculateTotal = () => {
    return Object.entries(selectedProducts).reduce((total, [id, quantity]) => {
      const item = shoppingItems.find((i) => i.id === id);
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter((f) => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  useEffect(() => {
    const currentRef = roomTypeRef.current;
    const handleClickOutside = (event: MouseEvent) => {
      if (currentRef && !currentRef.contains(event.target as Node)) {
        setIsRoomTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (onFullViewChange) {
      onFullViewChange(isFullView);
    }
  }, [isFullView, onFullViewChange]);

  const toggleFullView = () => {
    setIsFullView(!isFullView);
  };

  const handleRegenerate = () => {
    // Regenerate the current step output
    console.log(`Regenerating step ${currentStep}`);
    // Add actual regeneration logic here
  };

  const versionHistory = [
    { version: 3, label: "Final tweaks", timestamp: "2 hours ago" },
    { version: 2, label: "Lighting changes", timestamp: "Yesterday" },
    { version: 1, label: "Initial generation", timestamp: "3 days ago" },
  ];

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

    const newMessage = {
      id: Date.now().toString(),
      text: chatMessage.trim(),
      sender: "user" as const,
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
      {/* Top Navigation Bar - Back, Space Name, Full-View */}
      <div className="relative mb-6 flex items-center justify-between flex-shrink-0">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[13px] text-[#9a9a9a] hover:text-[#626262] transition-colors duration-300"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            letterSpacing: "0.02em",
          }}
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Back
        </button>

        {/* Centered Space Name */}
        {spaceName && (
          <div
            className="absolute left-1/2 -translate-x-1/2 text-[13px] text-[#9a9a9a]"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              letterSpacing: "0.02em",
            }}
          >
            {spaceName}
          </div>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Regenerate Button */}
          <div className="relative">
            <button
              onClick={handleRegenerate}
              onMouseEnter={() => setShowRegenerateTooltip(true)}
              onMouseLeave={() => setShowRegenerateTooltip(false)}
              className="text-[#9a9a9a] hover:text-[#626262] transition-colors duration-300"
              aria-label="Regenerate"
            >
              <RefreshCw size={16} strokeWidth={1.5} />
            </button>

            {/* Tooltip */}
            {showRegenerateTooltip && (
              <div
                className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-[#2a2a2a] text-[#F7F5F2] text-[11px] rounded-sm whitespace-nowrap pointer-events-none z-50"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  letterSpacing: "0.02em",
                }}
              >
                Regenerate
              </div>
            )}
          </div>

          {/* Version Indicator */}
          <button
            onClick={() => setIsVersionHistoryOpen(true)}
            className="px-2.5 py-1 rounded-full bg-[#E8E6E3]/40 hover:bg-[#E8E6E3]/60 transition-all duration-300"
          >
            <span
              className="text-[10px] text-[#9a9a9a] tracking-wide uppercase"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                letterSpacing: "0.08em",
              }}
            >
              v{currentVersion}
            </span>
          </button>

          {/* Comments Button */}
          <button
            onClick={() => setIsCommentsPanelOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[#9a9a9a] hover:text-[#626262] hover:bg-[#E8E6E3]/50 transition-colors duration-300"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              letterSpacing: "0.02em",
            }}
          >
            <MessageSquare size={16} strokeWidth={1.5} />
            <span className="text-[12px]">Comments</span>
          </button>

          {/* Full-View Toggle */}
          <button
            onClick={toggleFullView}
            className="text-[#9a9a9a] hover:text-[#626262] transition-colors duration-300"
            style={{ marginTop: "-10px" }}
            aria-label={isFullView ? "Exit full view" : "Enter full view"}
          >
            {isFullView ? (
              <Minimize2 size={20} strokeWidth={1.5} />
            ) : (
              <Maximize2 size={20} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {/* Main Content with Step Indicator */}
      <div className="relative flex-1 flex items-center min-h-0">
        <div className="relative w-full max-w-[1640px] mx-auto">
          {/* Vertical Step Indicator - Right Side - Fixed/Absolute, centered vertically */}
          <div className="hidden xl:flex absolute right-0 top-1/2 -translate-y-1/2 flex-col gap-6 z-10">
            {steps.map((step) => (
              <button
                key={step.number}
                onClick={() =>
                  step.number <= currentStep &&
                  setCurrentStep(step.number as Step)
                }
                className="flex flex-col items-center gap-1.5 group"
                disabled={step.number > currentStep}
              >
                {/* Step Number */}
                <div
                  className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors duration-300 ${
                    currentStep === step.number
                      ? "bg-[#2a2a2a] text-[#F7F5F2]"
                      : currentStep > step.number
                        ? "bg-[#E8E6E3] text-[#9a9a9a]"
                        : "bg-transparent border border-[#E8E6E3] text-[#c5c5c5]"
                  }`}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "10px",
                    fontWeight: 300,
                  }}
                >
                  {step.number}
                </div>

                {/* Step Title - full title, limited width so words wrap */}
                <span
                  className={`text-[9px] tracking-wider uppercase transition-colors duration-300 text-center break-words ${
                    currentStep === step.number
                      ? "text-[#2a2a2a]"
                      : "text-[#9a9a9a]"
                  }`}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300,
                    letterSpacing: "0.12em",
                    width: "70px",
                    lineHeight: 1.4,
                  }}
                >
                  {step.title}
                </span>
              </button>
            ))}
          </div>

          {/* Step Indicator - Mobile/Below lg: horizontal row at top, centered */}
          <div className="flex xl:hidden items-center justify-center gap-4 mb-4 overflow-x-auto pb-1">
            {steps.map((step) => (
              <button
                key={step.number}
                onClick={() =>
                  step.number <= currentStep &&
                  setCurrentStep(step.number as Step)
                }
                className="flex items-center gap-2 flex-shrink-0 group"
                disabled={step.number > currentStep}
              >
                <div
                  className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors duration-300 ${
                    currentStep === step.number
                      ? "bg-[#2a2a2a] text-[#F7F5F2]"
                      : currentStep > step.number
                        ? "bg-[#E8E6E3] text-[#9a9a9a]"
                        : "bg-transparent border border-[#E8E6E3] text-[#c5c5c5]"
                  }`}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "10px",
                    fontWeight: 300,
                  }}
                >
                  {step.number}
                </div>
                <span
                  className={`text-[10px] tracking-wider uppercase transition-colors duration-300 ${
                    currentStep === step.number
                      ? "text-[#2a2a2a]"
                      : "text-[#9a9a9a]"
                  }`}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300,
                    letterSpacing: "0.12em",
                  }}
                >
                  {step.title}
                </span>
              </button>
            ))}
          </div>

          {/* Step Content - single grid: left 1fr, right minmax(350px,420px) */}
          <div className="grid gap-x-8 gap-y-4 xl:pr-24 lg:grid-cols-[1fr_minmax(290px,300px)] xl:grid-cols-[1fr_minmax(320px,380px)]">
            {/* Left column - canvas */}
            <div className="flex flex-col gap-3 min-h-0">
              <div className="min-h-0">
                {currentStep === 1 && (
                  <>
                    <label htmlFor="image-upload">
                      <div
                        className="bg-[#FDFCFB] rounded-sm flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-300 hover:bg-[#FAF9F7] relative shadow-sm overflow-hidden h-[400px] lg:h-[550px]"
                        style={{}}
                      >
                        {uploadedImage ? (
                          <>
                            <img
                              src={uploadedImage}
                              alt="Uploaded space"
                              className="rounded-sm"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                objectPosition: "center",
                              }}
                            />
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setUploadedImage(null);
                              }}
                              className="absolute top-4 right-4 p-2 bg-[#F7F5F2]/80 backdrop-blur-sm rounded-sm hover:opacity-60 transition-opacity duration-300"
                            >
                              <X
                                size={16}
                                className="text-[#626262]"
                                strokeWidth={1.5}
                              />
                            </button>
                          </>
                        ) : (
                          <>
                            <Upload
                              size={32}
                              className="text-[#c5c5c5] mb-6"
                              strokeWidth={1.5}
                            />
                            <p
                              className="text-[18px] text-[#c5c5c5] mb-2"
                              style={{
                                fontFamily: "'Playfair Display', serif",
                                fontWeight: 300,
                              }}
                            >
                              Upload your space
                            </p>
                            <p
                              className="text-[12px] text-[#d5d5d5]"
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 300,
                                letterSpacing: "0.02em",
                              }}
                            >
                              Drag & drop or click to browse
                            </p>
                          </>
                        )}
                      </div>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </>
                )}

                {/* STEP 2 - MAKE SPACE (left) */}
                {currentStep === 2 && (
                  <div>
                    {/* Left Section - Image Comparison */}
                    <div>
                      <div
                        className="bg-[#FDFCFB] rounded-sm flex flex-col items-center justify-center text-center relative shadow-sm overflow-hidden h-[400px] lg:h-[550px]"
                        style={{}}
                      >
                        {uploadedImage ? (
                          <>
                            <img
                              src={uploadedImage}
                              alt="Space to clear"
                              className="rounded-sm"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                objectPosition: "center",
                              }}
                            />
                            <p
                              className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[12px] text-[#9a9a9a] bg-[#F7F5F2]/90 backdrop-blur-sm px-4 py-2 rounded-sm"
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 300,
                                letterSpacing: "0.02em",
                              }}
                            >
                              Select furniture you want to remove
                            </p>
                          </>
                        ) : (
                          <p
                            className="text-[14px] text-[#c5c5c5]"
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 300,
                            }}
                          >
                            No image uploaded
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3 - ADD INSPIRATION (left) */}
                {currentStep === 3 && (
                  <div>
                    <div className="bg-[#FDFCFB] rounded-sm flex flex-col items-center justify-center text-center relative shadow-sm overflow-hidden h-[400px] lg:h-[550px]">
                      {uploadedImage ? (
                        <img
                          src={uploadedImage}
                          alt="Your space"
                          className="rounded-sm"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                        />
                      ) : (
                        <p
                          className="text-[14px] text-[#c5c5c5]"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 300,
                          }}
                        >
                          No image uploaded
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 4 - ROOM LAYOUT (left) */}
                {currentStep === 4 && (
                  <div>
                    <div>
                      <div
                        className="bg-[#FDFCFB] rounded-sm flex flex-col items-center justify-center text-center relative shadow-sm overflow-hidden h-[400px] lg:h-[550px]"
                        style={{}}
                      >
                        {uploadedImage ? (
                          <img
                            src={uploadedImage}
                            alt="Room reference"
                            className="rounded-sm"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              objectPosition: "center",
                            }}
                          />
                        ) : (
                          <p
                            className="text-[14px] text-[#c5c5c5]"
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 300,
                            }}
                          >
                            No image uploaded
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5 - AMEND DESIGN (left) */}
                {currentStep === 5 && (
                  <div>
                    <div>
                      <div className="relative">
                        <button
                          onClick={() => setShowBeforeAfter(!showBeforeAfter)}
                          className="absolute top-4 left-4 z-10 px-3 py-2 bg-[#F7F5F2]/90 backdrop-blur-sm rounded-sm text-[11px] text-[#2a2a2a] hover:opacity-60 transition-opacity duration-300"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 300,
                            letterSpacing: "0.01em",
                          }}
                        >
                          {showBeforeAfter ? "Before" : "After"}
                        </button>
                        <div
                          className="bg-[#FDFCFB] rounded-sm flex flex-col items-center justify-center text-center relative shadow-sm overflow-hidden h-[400px] lg:h-[550px]"
                          style={{}}
                        >
                          {uploadedImage ? (
                            <img
                              src={uploadedImage}
                              alt={showBeforeAfter ? "Before" : "After"}
                              className="rounded-sm"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                objectPosition: "center",
                              }}
                            />
                          ) : (
                            <p
                              className="text-[14px] text-[#c5c5c5]"
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 300,
                              }}
                            >
                              No image uploaded
                            </p>
                          )}
                          {uploadedImage && !showBeforeAfter && (
                            <p
                              className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] text-[#9a9a9a] bg-[#F7F5F2]/90 backdrop-blur-sm px-3 py-2 rounded-sm"
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 300,
                                letterSpacing: "0.01em",
                              }}
                            >
                              Hover to highlight • Click to amend
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 6 - SHOP THE ROOM (left) */}
                {currentStep === 6 && (
                  <div>
                    <div>
                      <div className="relative">
                        <button
                          onClick={() => setShowBeforeAfter(!showBeforeAfter)}
                          className="absolute top-4 left-4 z-10 px-3 py-2 bg-[#F7F5F2]/90 backdrop-blur-sm rounded-sm text-[11px] text-[#2a2a2a] hover:opacity-60 transition-opacity duration-300"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 300,
                            letterSpacing: "0.01em",
                          }}
                        >
                          {showBeforeAfter ? "Before" : "After"}
                        </button>
                        <div
                          className="bg-[#FDFCFB] rounded-sm flex flex-col items-center justify-center text-center shadow-sm overflow-hidden h-[400px] lg:h-[550px]"
                          style={{}}
                        >
                          {uploadedImage ? (
                            <img
                              src={uploadedImage}
                              alt={showBeforeAfter ? "Before" : "Final design"}
                              className="rounded-sm"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                objectPosition: "center",
                              }}
                            />
                          ) : (
                            <p
                              className="text-[14px] text-[#c5c5c5]"
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 300,
                              }}
                            >
                              No image uploaded
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Bottom bar — desktop only (hidden on mobile, shown after grid) */}
              <div className="hidden lg:flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <button
                    onClick={handleClearDraft}
                    className="text-[13px] text-[#9a9a9a] hover:text-[#626262] transition-colors duration-300"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                      letterSpacing: "0.02em",
                    }}
                  >
                    Clear draft
                  </button>

                  {currentStep > 1 && (
                    <button
                      onClick={handlePreviousStep}
                      className="text-[13px] text-[#9a9a9a] hover:text-[#2a2a2a] transition-colors duration-300"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        letterSpacing: "0.02em",
                      }}
                    >
                      Go back
                    </button>
                  )}
                </div>

                <button
                  onClick={handleNextStep}
                  disabled={currentStep === 1 && !spaceName.trim()}
                  className="text-[13px] text-[#2a2a2a] hover:text-[#626262] transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    letterSpacing: "0.02em",
                  }}
                >
                  {currentStep === 6
                    ? "Complete"
                    : currentStep === 3
                      ? "Generate design"
                      : "Next step"}
                </button>
              </div>
            </div>
            {/* Right column - panel */}
            <div className="min-h-0 lg:h-[550px] lg:flex lg:flex-col">
              {currentStep === 1 && (
                <div className="lg:flex lg:flex-col lg:h-full">
                  {/* Right Section - Form */}
                  <div className="lg:flex lg:flex-col lg:h-full">
                    <div className="flex-shrink-0">
                      <StepTabSwitcher
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                      />
                    </div>

                    {/* Tab Content */}
                    <div className="lg:flex-1 lg:overflow-y-auto lg:min-h-0 mt-4">
                      {activeTab === "controls" ? (
                        <div className="space-y-12">
                          {/* Room Type */}
                          <div>
                            <label
                              className="block text-[11px] text-[#9a9a9a] mb-4 uppercase tracking-widest"
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 400,
                                letterSpacing: "0.15em",
                              }}
                            >
                              Room Type
                            </label>
                            <div className="relative" ref={roomTypeRef}>
                              <button
                                onClick={() =>
                                  setIsRoomTypeOpen(!isRoomTypeOpen)
                                }
                                className="w-full px-0 py-3 text-[16px] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500 text-left"
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontWeight: 300,
                                  color: roomType ? "#2a2a2a" : "#c5c5c5",
                                }}
                              >
                                {roomType ? (
                                  <span className="flex items-center gap-3">
                                    {(() => {
                                      const Icon = roomTypeOptions.find(
                                        (option) => option.value === roomType,
                                      )?.icon;
                                      return Icon ? (
                                        <Icon
                                          size={16}
                                          strokeWidth={1.5}
                                          className="text-[#9a9a9a]"
                                        />
                                      ) : null;
                                    })()}
                                    <span className="text-[#2a2a2a]">
                                      {
                                        roomTypeOptions.find(
                                          (option) => option.value === roomType,
                                        )?.label
                                      }
                                    </span>
                                  </span>
                                ) : (
                                  "Select room type"
                                )}
                              </button>
                              {isRoomTypeOpen && (
                                <div
                                  className="absolute left-0 right-0 mt-2 bg-[#F7F5F2] z-10"
                                  style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 300,
                                  }}
                                >
                                  {roomTypeOptions.map((option) => {
                                    const Icon = option.icon;
                                    return (
                                      <button
                                        key={option.value}
                                        onClick={() => {
                                          setRoomType(option.value);
                                          setIsRoomTypeOpen(false);
                                        }}
                                        className="w-full px-0 py-3 text-left text-[16px] text-[#2a2a2a] hover:bg-[#FAF9F7] transition-colors duration-300 flex items-center gap-3"
                                      >
                                        <Icon
                                          size={16}
                                          strokeWidth={1.5}
                                          className="text-[#9a9a9a]"
                                        />
                                        <span>{option.label}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Room Dimensions */}
                          <div>
                            <label
                              className="block text-[11px] text-[#9a9a9a] mb-4 uppercase tracking-widest"
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 400,
                                letterSpacing: "0.15em",
                              }}
                            >
                              Room Dimensions (meters)
                            </label>
                            <div className="grid grid-cols-3 gap-6">
                              <div>
                                <input
                                  type="text"
                                  value={dimensions.width}
                                  onChange={(e) =>
                                    setDimensions({
                                      ...dimensions,
                                      width: e.target.value,
                                    })
                                  }
                                  placeholder="Width"
                                  className="w-full px-0 py-3 text-[16px] text-[#2a2a2a] placeholder:text-[#c5c5c5] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500"
                                  style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 300,
                                  }}
                                />
                              </div>
                              <div>
                                <input
                                  type="text"
                                  value={dimensions.depth}
                                  onChange={(e) =>
                                    setDimensions({
                                      ...dimensions,
                                      depth: e.target.value,
                                    })
                                  }
                                  placeholder="Depth"
                                  className="w-full px-0 py-3 text-[16px] text-[#2a2a2a] placeholder:text-[#c5c5c5] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500"
                                  style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 300,
                                  }}
                                />
                              </div>
                              <div>
                                <input
                                  type="text"
                                  value={dimensions.height}
                                  onChange={(e) =>
                                    setDimensions({
                                      ...dimensions,
                                      height: e.target.value,
                                    })
                                  }
                                  placeholder="Height"
                                  className="w-full px-0 py-3 text-[16px] text-[#2a2a2a] placeholder:text-[#c5c5c5] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500"
                                  style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 300,
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Room Budget */}
                          <div>
                            <label
                              className="block text-[11px] text-[#9a9a9a] mb-4 uppercase tracking-widest"
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 400,
                                letterSpacing: "0.15em",
                              }}
                            >
                              Room Budget (Optional)
                            </label>
                            <input
                              type="text"
                              value={budget}
                              onChange={(e) => setBudget(e.target.value)}
                              placeholder="What's reasonable?"
                              className="w-full px-0 py-3 text-[16px] text-[#2a2a2a] placeholder:text-[#c5c5c5] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500"
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 300,
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <StepChatInterface
                          stepTitle={steps[currentStep - 1]?.title || ""}
                          messages={chatMessages}
                          currentMessage={chatMessage}
                          onMessageChange={setChatMessage}
                          onSendMessage={handleSendMessage}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="lg:flex lg:flex-col lg:h-full">
                  {/* Right Section - Detected Furniture */}
                  <div className="lg:flex lg:flex-col lg:h-full">
                    <div className="flex-shrink-0">
                      <StepTabSwitcher
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                      />
                    </div>
                    <div className="lg:flex-1 lg:overflow-y-auto lg:min-h-0 mt-4">
                      {activeTab === "controls" ? (
                        <div className="space-y-6">
                          <h3 className="text-[18px] text-[#2a2a2a] mb-6">
                            Detected Elements
                          </h3>

                          <div className="space-y-8">
                            {furnitureCategories.map((category) => (
                              <div key={category.category}>
                                <p
                                  className="text-[11px] text-[#9a9a9a] mb-4 uppercase tracking-widest"
                                  style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 400,
                                    letterSpacing: "0.15em",
                                  }}
                                >
                                  {category.category}
                                </p>
                                <div className="space-y-2">
                                  {category.items.map((item) => (
                                    <button
                                      key={item}
                                      onClick={() => toggleFurniture(item)}
                                      className={`w-full text-left px-4 py-3 rounded-sm transition-colors duration-300 ${
                                        selectedFurniture.includes(item)
                                          ? "bg-[#2a2a2a] text-[#F7F5F2]"
                                          : "bg-[#FDFCFB] text-[#2a2a2a] hover:bg-[#FAF9F7]"
                                      }`}
                                      style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontWeight: 300,
                                        fontSize: "14px",
                                      }}
                                    >
                                      {item}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          {selectedFurniture.length > 0 && (
                            <button
                              onClick={() => setSelectedFurniture([])}
                              className="text-[13px] text-[#2a2a2a] hover:text-[#626262] transition-colors duration-300"
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 400,
                                letterSpacing: "0.02em",
                              }}
                            >
                              Clear selected furniture (
                              {selectedFurniture.length})
                            </button>
                          )}
                        </div>
                      ) : (
                        <StepChatInterface
                          stepTitle={steps[currentStep - 1]?.title || ""}
                          messages={chatMessages}
                          currentMessage={chatMessage}
                          onMessageChange={setChatMessage}
                          onSendMessage={handleSendMessage}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="lg:flex lg:flex-col lg:h-full">
                  {/* Right Section - Style Definition */}
                  <div className="lg:flex lg:flex-col lg:h-full">
                    <div className="flex-shrink-0">
                      <StepTabSwitcher
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                      />
                    </div>
                    <div className="lg:flex-1 lg:overflow-y-auto lg:min-h-0 mt-4">
                      {activeTab === "controls" ? (
                        <div className="space-y-12">
                          <h3
                            className="text-[18px] text-[#2a2a2a]"
                            style={{
                              fontFamily: "'Playfair Display', serif",
                              fontWeight: 300,
                            }}
                          >
                            Define Direction
                          </h3>

                          {/* Style Keywords */}
                          <div>
                            <label
                              className="block text-[11px] text-[#9a9a9a] mb-4 uppercase tracking-widest"
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 400,
                                letterSpacing: "0.15em",
                              }}
                            >
                              Style Keywords
                            </label>
                            <input
                              type="text"
                              value={styleKeywords}
                              onChange={(e) => setStyleKeywords(e.target.value)}
                              placeholder="Scandinavian, mid-century, industrial…"
                              className="w-full px-0 py-3 text-[16px] text-[#2a2a2a] placeholder:text-[#c5c5c5] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500"
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 300,
                              }}
                            />
                          </div>

                          {/* Mood */}
                          <div>
                            <label
                              className="block text-[11px] text-[#9a9a9a] mb-4 uppercase tracking-widest"
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 400,
                                letterSpacing: "0.15em",
                              }}
                            >
                              Mood
                            </label>
                            <input
                              type="text"
                              value={mood}
                              onChange={(e) => setMood(e.target.value)}
                              placeholder="Warm, minimal, earthy, cozy…"
                              className="w-full px-0 py-3 text-[16px] text-[#2a2a2a] placeholder:text-[#c5c5c5] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500"
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 300,
                              }}
                            />
                          </div>

                          {/* Materials */}
                          <div>
                            <label
                              className="block text-[11px] text-[#9a9a9a] mb-4 uppercase tracking-widest"
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 400,
                                letterSpacing: "0.15em",
                              }}
                            >
                              Materials
                            </label>
                            <input
                              type="text"
                              value={materials}
                              onChange={(e) => setMaterials(e.target.value)}
                              placeholder="Wood, stone, metal, linen…"
                              className="w-full px-0 py-3 text-[16px] text-[#2a2a2a] placeholder:text-[#c5c5c5] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500"
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 300,
                              }}
                            />
                          </div>

                          {/* Inspiration Images */}
                          <div>
                            <p
                              className="block text-[11px] text-[#9a9a9a] mb-4 uppercase tracking-widest"
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 400,
                                letterSpacing: "0.15em",
                              }}
                            >
                              Inspiration Images
                            </p>
                            <div className="grid grid-cols-5 lg:grid-cols-3 gap-2">
                              {inspirationImages.map((src, idx) => (
                                <div
                                  key={idx}
                                  className="relative aspect-square rounded-sm overflow-hidden bg-[#FDFCFB] shadow-sm"
                                >
                                  <img
                                    src={src}
                                    alt={`Inspiration ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeInspirationImage(idx)}
                                    className="absolute top-1.5 right-1.5 w-5 h-5 flex items-center justify-center rounded-full bg-[#F2F0ED] hover:bg-[#E8E6E3] transition-colors duration-200"
                                  >
                                    <X
                                      size={10}
                                      strokeWidth={2}
                                      className="text-[#626262]"
                                    />
                                  </button>
                                </div>
                              ))}
                              {/* Add new image block — always last in the same grid */}
                              <label
                                htmlFor="inspiration-upload-panel"
                                className="aspect-square rounded-sm border border-dashed border-[#E8E6E3] hover:border-[#c5c5c5] bg-[#FDFCFB] hover:bg-[#FAF9F7] flex flex-col items-center justify-center cursor-pointer transition-colors duration-200"
                              >
                                <Plus
                                  size={16}
                                  strokeWidth={1.5}
                                  className="text-[#c5c5c5]"
                                />
                              </label>
                              <input
                                id="inspiration-upload-panel"
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleInspirationUpload}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <StepChatInterface
                          stepTitle={steps[currentStep - 1]?.title || ""}
                          messages={chatMessages}
                          currentMessage={chatMessage}
                          onMessageChange={setChatMessage}
                          onSendMessage={handleSendMessage}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="lg:flex lg:flex-col lg:h-full">
                  {/* Right Section - Layout Options */}
                  <div className="lg:flex lg:flex-col lg:h-full">
                    <div className="flex-shrink-0">
                      <StepTabSwitcher
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                      />
                    </div>
                    <div className="lg:flex-1 lg:overflow-y-auto lg:min-h-0 mt-4">
                      {activeTab === "controls" ? (
                        <div className="space-y-6">
                          <div>
                            <h3
                              className="text-[16px] text-[#2a2a2a] mb-1"
                              style={{
                                fontFamily: "'Playfair Display', serif",
                                fontWeight: 300,
                              }}
                            >
                              Proposed Layouts
                            </h3>
                            <p
                              className="text-[10px] text-[#9a9a9a] mb-6 uppercase tracking-widest"
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 400,
                                letterSpacing: "0.15em",
                              }}
                            >
                              Optional — skip if preferred
                            </p>
                          </div>

                          {/* Layout Grid - 2x2 Larger Cards */}
                          <div className="grid grid-cols-2 gap-4">
                            {/* Layout 1 */}
                            <button
                              onClick={() => setSelectedLayout(1)}
                              className={`transition-all duration-300 ${
                                selectedLayout === 1
                                  ? "opacity-100"
                                  : "opacity-60 hover:opacity-80"
                              }`}
                            >
                              <div className="bg-[#FDFCFB] rounded-sm p-6 mb-2">
                                <div className="space-y-3">
                                  <div
                                    className="h-12 bg-[#E8E6E3] rounded-sm"
                                    style={{ width: "60%" }}
                                  ></div>
                                  <div className="flex gap-3">
                                    <div
                                      className="h-10 bg-[#E8E6E3] rounded-sm"
                                      style={{ width: "40%" }}
                                    ></div>
                                    <div
                                      className="h-10 bg-[#E8E6E3] rounded-sm"
                                      style={{ width: "40%" }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                              <p
                                className="text-[12px] text-[#2a2a2a] text-left"
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontWeight: 300,
                                  letterSpacing: "0.01em",
                                }}
                              >
                                Centered
                              </p>
                            </button>

                            {/* Layout 2 */}
                            <button
                              onClick={() => setSelectedLayout(2)}
                              className={`transition-all duration-300 ${
                                selectedLayout === 2
                                  ? "opacity-100"
                                  : "opacity-60 hover:opacity-80"
                              }`}
                            >
                              <div className="bg-[#FDFCFB] rounded-sm p-6 mb-2">
                                <div className="space-y-3">
                                  <div className="flex gap-3">
                                    <div
                                      className="h-10 bg-[#E8E6E3] rounded-sm"
                                      style={{ width: "50%" }}
                                    ></div>
                                    <div
                                      className="h-10 bg-[#E8E6E3] rounded-sm"
                                      style={{ width: "30%" }}
                                    ></div>
                                  </div>
                                  <div
                                    className="h-8 bg-[#E8E6E3] rounded-sm"
                                    style={{ width: "70%" }}
                                  ></div>
                                </div>
                              </div>
                              <p
                                className="text-[12px] text-[#2a2a2a] text-left"
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontWeight: 300,
                                  letterSpacing: "0.01em",
                                }}
                              >
                                Corner focus
                              </p>
                            </button>

                            {/* Layout 3 */}
                            <button
                              onClick={() => setSelectedLayout(3)}
                              className={`transition-all duration-300 ${
                                selectedLayout === 3
                                  ? "opacity-100"
                                  : "opacity-60 hover:opacity-80"
                              }`}
                            >
                              <div className="bg-[#FDFCFB] rounded-sm p-6 mb-2">
                                <div className="space-y-3">
                                  <div
                                    className="h-10 bg-[#E8E6E3] rounded-sm"
                                    style={{ width: "75%" }}
                                  ></div>
                                  <div
                                    className="h-10 bg-[#E8E6E3] rounded-sm"
                                    style={{ width: "45%" }}
                                  ></div>
                                </div>
                              </div>
                              <p
                                className="text-[12px] text-[#2a2a2a] text-left"
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontWeight: 300,
                                  letterSpacing: "0.01em",
                                }}
                              >
                                Window-first
                              </p>
                            </button>

                            {/* Layout 4 */}
                            <button
                              onClick={() => setSelectedLayout(4)}
                              className={`transition-all duration-300 ${
                                selectedLayout === 4
                                  ? "opacity-100"
                                  : "opacity-60 hover:opacity-80"
                              }`}
                            >
                              <div className="bg-[#FDFCFB] rounded-sm p-6 mb-2">
                                <div className="space-y-3">
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="h-10 bg-[#E8E6E3] rounded-sm"></div>
                                    <div className="h-10 bg-[#E8E6E3] rounded-sm"></div>
                                  </div>
                                  <div
                                    className="h-6 bg-[#E8E6E3] rounded-sm"
                                    style={{ width: "80%" }}
                                  ></div>
                                </div>
                              </div>
                              <p
                                className="text-[12px] text-[#2a2a2a] text-left"
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontWeight: 300,
                                  letterSpacing: "0.01em",
                                }}
                              >
                                Balanced
                              </p>
                            </button>
                          </div>

                          {/* Inspiration Images reference from step 3 */}
                          {inspirationImages.length > 0 && (
                            <div className="pt-2">
                              <p
                                className="text-[10px] text-[#9a9a9a] mb-3 uppercase tracking-widest"
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontWeight: 400,
                                  letterSpacing: "0.15em",
                                }}
                              >
                                Your Inspiration
                              </p>
                              <div className="grid grid-cols-3 gap-2">
                                {inspirationImages.map((src, idx) => (
                                  <div
                                    key={idx}
                                    className="aspect-square rounded-sm overflow-hidden bg-[#FDFCFB] shadow-sm"
                                  >
                                    <img
                                      src={src}
                                      alt={`Inspiration ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <StepChatInterface
                          stepTitle={steps[currentStep - 1]?.title || ""}
                          messages={chatMessages}
                          currentMessage={chatMessage}
                          onMessageChange={setChatMessage}
                          onSendMessage={handleSendMessage}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="lg:flex lg:flex-col lg:h-full">
                  {/* Right Section - Amend Controls */}
                  <div className="lg:flex lg:flex-col lg:h-full">
                    <div className="flex-shrink-0">
                      <StepTabSwitcher
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                      />
                    </div>
                    <div className="lg:flex-1 lg:overflow-y-auto lg:min-h-0 mt-4">
                      {activeTab === "controls" ? (
                        <div className="space-y-6">
                          <h3
                            className="text-[16px] text-[#2a2a2a]"
                            style={{
                              fontFamily: "'Playfair Display', serif",
                              fontWeight: 300,
                            }}
                          >
                            Refine Elements
                          </h3>

                          {/* Filters - Horizontal Scroll at TOP */}
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {refineFilters.map((filter) => (
                              <button
                                key={filter}
                                onClick={() => toggleFilter(filter)}
                                className={`px-3 py-1.5 rounded-full text-[10px] transition-all duration-300 flex-shrink-0 ${
                                  activeFilters.includes(filter)
                                    ? "bg-[#2a2a2a] text-[#F7F5F2]"
                                    : "bg-[#FDFCFB] text-[#9a9a9a] hover:bg-[#FAF9F7]"
                                }`}
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontWeight: 300,
                                  letterSpacing: "0.01em",
                                }}
                              >
                                {filter}
                              </button>
                            ))}
                          </div>

                          {/* Inspiration Gallery - 2 Column Grid - Reduced Size */}
                          <div className="grid grid-cols-2 gap-2">
                            {[1, 2, 3, 4].map((i) => (
                              <div
                                key={i}
                                className="bg-[#E8E6E3] rounded-sm cursor-pointer hover:opacity-75 transition-opacity duration-300"
                                style={{ aspectRatio: "1", height: "auto" }}
                              ></div>
                            ))}
                          </div>

                          {/* Add Specific Product - Reduced Size */}
                          <div className="pt-2">
                            <p
                              className="text-[10px] text-[#9a9a9a] mb-2 uppercase tracking-widest"
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 400,
                                letterSpacing: "0.15em",
                              }}
                            >
                              Upload specific item
                            </p>
                            <label htmlFor="product-upload">
                              <div
                                className="bg-[#FDFCFB] rounded-sm p-4 flex flex-col items-center justify-center cursor-pointer transition-colors duration-300 hover:bg-[#FAF9F7]"
                                style={{
                                  minHeight: "60px",
                                  border: "1px dashed #E8E6E3",
                                }}
                              >
                                <Upload
                                  size={16}
                                  className="text-[#c5c5c5] mb-1"
                                  strokeWidth={1.5}
                                />
                                <p
                                  className="text-[10px] text-[#c5c5c5]"
                                  style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 300,
                                    letterSpacing: "0.01em",
                                  }}
                                >
                                  Add product image
                                </p>
                              </div>
                            </label>
                            <input
                              id="product-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                            />
                          </div>
                        </div>
                      ) : (
                        <StepChatInterface
                          stepTitle={steps[currentStep - 1]?.title || ""}
                          messages={chatMessages}
                          currentMessage={chatMessage}
                          onMessageChange={setChatMessage}
                          onSendMessage={handleSendMessage}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                <div className="lg:flex lg:flex-col lg:h-full">
                  {/* Right Section - Shopping List */}
                  <div className="lg:flex lg:flex-col lg:h-full">
                    <div className="flex-shrink-0">
                      <StepTabSwitcher
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                      />
                    </div>
                    <div className="lg:flex-1 lg:overflow-y-auto lg:min-h-0 mt-4">
                      {activeTab === "controls" ? (
                        <div className="space-y-4 flex flex-col">
                          <h3
                            className="text-[16px] text-[#2a2a2a]"
                            style={{
                              fontFamily: "'Playfair Display', serif",
                              fontWeight: 300,
                            }}
                          >
                            Curated Shopping List
                          </h3>

                          <div className="space-y-3">
                            {shoppingItems.map((item) => {
                              const quantity = selectedProducts[item.id] || 0;
                              return (
                                <div
                                  key={item.id}
                                  className="group relative bg-[#FDFCFB] rounded-sm p-3 transition-all duration-300"
                                >
                                  <div className="flex gap-4 items-center">
                                    {/* Thumbnail - Larger */}
                                    <div className="w-16 h-16 bg-[#E8E6E3] rounded-sm flex-shrink-0"></div>

                                    {/* Details - Center */}
                                    <div className="flex-1 min-w-0">
                                      <h4
                                        className="text-[13px] text-[#2a2a2a] mb-1 truncate"
                                        style={{
                                          fontFamily: "'Inter', sans-serif",
                                          fontWeight: 400,
                                          letterSpacing: "0.01em",
                                        }}
                                      >
                                        {item.name}
                                      </h4>
                                      <p
                                        className="text-[12px] text-[#9a9a9a]"
                                        style={{
                                          fontFamily: "'Inter', sans-serif",
                                          fontWeight: 300,
                                        }}
                                      >
                                        ${item.price}
                                      </p>

                                      {/* Hover Specifications */}
                                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2">
                                        <p
                                          className="text-[10px] text-[#9a9a9a] mb-1"
                                          style={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontWeight: 300,
                                            letterSpacing: "0.01em",
                                          }}
                                        >
                                          {item.retailer} • {item.size}
                                        </p>
                                        <button
                                          onClick={() =>
                                            window.open("#", "_blank")
                                          }
                                          className="text-[10px] text-[#2a2a2a] hover:text-[#626262] transition-colors duration-300"
                                          style={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontWeight: 400,
                                            letterSpacing: "0.01em",
                                          }}
                                        >
                                          View →
                                        </button>
                                      </div>
                                    </div>

                                    {/* Quantity Control - Right */}
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() =>
                                          updateProductQuantity(item.id, -1)
                                        }
                                        disabled={quantity === 0}
                                        className="w-6 h-6 flex items-center justify-center text-[#9a9a9a] hover:text-[#2a2a2a] transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                                      >
                                        <Minus size={12} strokeWidth={1.5} />
                                      </button>
                                      <span
                                        className="text-[12px] text-[#2a2a2a] w-5 text-center"
                                        style={{
                                          fontFamily: "'Inter', sans-serif",
                                          fontWeight: 300,
                                        }}
                                      >
                                        {quantity}
                                      </span>
                                      <button
                                        onClick={() =>
                                          updateProductQuantity(item.id, 1)
                                        }
                                        className="w-6 h-6 flex items-center justify-center text-[#9a9a9a] hover:text-[#2a2a2a] transition-colors duration-300"
                                      >
                                        <Plus size={12} strokeWidth={1.5} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Room Total */}
                          <div className="pt-4 border-t border-[#E8E6E3] mt-auto">
                            <div className="flex items-center justify-between mb-1">
                              <p
                                className="text-[10px] text-[#9a9a9a] uppercase tracking-widest"
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontWeight: 400,
                                  letterSpacing: "0.15em",
                                }}
                              >
                                Room Total
                              </p>
                              <p
                                className="text-[16px] text-[#2a2a2a]"
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontWeight: 400,
                                }}
                              >
                                ${calculateTotal().toLocaleString()}
                              </p>
                            </div>
                            <p
                              className="text-[10px] text-[#c5c5c5]"
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 300,
                                letterSpacing: "0.01em",
                              }}
                            >
                              Informational only — no checkout
                            </p>
                          </div>
                        </div>
                      ) : (
                        <StepChatInterface
                          stepTitle={steps[currentStep - 1]?.title || ""}
                          messages={chatMessages}
                          currentMessage={chatMessage}
                          onMessageChange={setChatMessage}
                          onSendMessage={handleSendMessage}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom bar — mobile only (hidden on lg+) */}
          <div className="flex lg:hidden items-center justify-between mt-4">
            <div className="flex items-center gap-8">
              <button
                onClick={handleClearDraft}
                className="text-[13px] text-[#9a9a9a] hover:text-[#626262] transition-colors duration-300"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  letterSpacing: "0.02em",
                }}
              >
                Clear draft
              </button>

              {currentStep > 1 && (
                <button
                  onClick={handlePreviousStep}
                  className="text-[13px] text-[#9a9a9a] hover:text-[#2a2a2a] transition-colors duration-300"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    letterSpacing: "0.02em",
                  }}
                >
                  Go back
                </button>
              )}
            </div>

            <button
              onClick={handleNextStep}
              disabled={currentStep === 1 && !spaceName.trim()}
              className="text-[13px] text-[#2a2a2a] hover:text-[#626262] transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                letterSpacing: "0.02em",
              }}
            >
              {currentStep === 6
                ? "Complete"
                : currentStep === 3
                  ? "Generate design"
                  : "Next step"}
            </button>
          </div>
        </div>
      </div>

      {/* Comments Panel */}
      <CommentsPanel
        isOpen={isCommentsPanelOpen}
        onClose={() => setIsCommentsPanelOpen(false)}
        spaceName={spaceName || "this space"}
      />

      {/* Version History Dialog */}
      {isVersionHistoryOpen && (
        <div
          className="fixed inset-0 bg-[#2a2a2a]/20 flex items-center justify-center z-50"
          onClick={() => setIsVersionHistoryOpen(false)}
        >
          <div
            className="bg-[#F7F5F2] rounded-sm p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
            style={{ boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)" }}
          >
            {/* Title */}
            <h3
              className="text-[16px] text-[#2a2a2a] mb-6"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                letterSpacing: "0.01em",
              }}
            >
              Version history
            </h3>

            {/* Version List */}
            <div className="space-y-3">
              {versionHistory.map((item) => (
                <div
                  key={item.version}
                  className="flex items-center justify-between py-3 border-b border-[#E8E6E3]/50"
                >
                  {/* Version Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[13px] text-[#2a2a2a]"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight:
                            item.version === currentVersion ? 400 : 300,
                          letterSpacing: "0.01em",
                        }}
                      >
                        v{item.version}
                      </span>
                      <span
                        className="text-[13px] text-[#9a9a9a]"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 300,
                          letterSpacing: "0.01em",
                        }}
                      >
                        {item.label}
                      </span>
                      {item.version === currentVersion && (
                        <span
                          className="text-[10px] text-[#9a9a9a] ml-1"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 300,
                            letterSpacing: "0.02em",
                          }}
                        >
                          (current)
                        </span>
                      )}
                    </div>
                    <p
                      className="text-[11px] text-[#c5c5c5]"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 300,
                        letterSpacing: "0.01em",
                      }}
                    >
                      {item.timestamp}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      className="text-[12px] text-[#9a9a9a] hover:text-[#2a2a2a] transition-colors duration-300"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 300,
                        letterSpacing: "0.01em",
                      }}
                    >
                      View
                    </button>
                    {item.version !== currentVersion && (
                      <button
                        onClick={() => handleRestoreClick(item.version)}
                        className="text-[12px] text-[#9a9a9a] hover:text-[#2a2a2a] transition-colors duration-300"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 300,
                          letterSpacing: "0.01em",
                        }}
                      >
                        Restore
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Close */}
            <button
              onClick={() => setIsVersionHistoryOpen(false)}
              className="mt-6 w-full text-[12px] text-[#9a9a9a] hover:text-[#2a2a2a] transition-colors duration-300"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                letterSpacing: "0.02em",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Restore Confirmation Dialog */}
      {isRestoreConfirmOpen && versionToRestore !== null && (
        <div
          className="fixed inset-0 bg-[#2a2a2a]/20 flex items-center justify-center z-50"
          onClick={() => setIsRestoreConfirmOpen(false)}
        >
          <div
            className="bg-[#F7F5F2] rounded-sm p-8 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
            style={{ boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)" }}
          >
            {/* Message */}
            <p
              className="text-[14px] text-[#2a2a2a] mb-6"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                letterSpacing: "0.01em",
                lineHeight: 1.6,
              }}
            >
              This will make v{versionToRestore} your current version.
            </p>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <button
                onClick={() => setIsRestoreConfirmOpen(false)}
                className="text-[12px] text-[#9a9a9a] hover:text-[#2a2a2a] transition-colors duration-300"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  letterSpacing: "0.02em",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleRestoreConfirm}
                className="text-[12px] text-[#2a2a2a] hover:text-[#626262] transition-colors duration-300"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                }}
              >
                Restore version
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
