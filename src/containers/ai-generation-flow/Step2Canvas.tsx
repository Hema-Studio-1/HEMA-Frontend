"use client";

import type { DetectedFurnitureItem } from "@/containers/ai-generation-flow/types";
import { useEffect, useRef, useState } from "react";

interface Step2CanvasProps {
  imageUrl: string | null;
  detectedItems: DetectedFurnitureItem[];
  selectedItemIds: string[];
  onItemToggle: (itemId: string) => void;
}

/**
 * Step 2 Canvas with visual selection of detected furniture items
 * Shows detected items as clickable overlays/regions on the image
 */
export function Step2Canvas({
  imageUrl,
  detectedItems,
  selectedItemIds,
  onItemToggle,
}: Step2CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [displayInfo, setDisplayInfo] = useState<{
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  // Calculate actual displayed image dimensions and position
  useEffect(() => {
    if (!imageRef.current || !containerRef.current || !imageUrl) return;

    const img = imageRef.current;
    const container = containerRef.current;

    const updateDimensions = () => {
      const naturalWidth = img.naturalWidth || img.width;
      const naturalHeight = img.naturalHeight || img.height;

      if (naturalWidth > 0 && naturalHeight > 0) {
        // Get actual displayed image dimensions (after object-contain scaling)
        const displayedWidth = img.clientWidth;
        const displayedHeight = img.clientHeight;

        // Get image position relative to container (accounting for centering)
        const imgRect = img.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const offsetX = imgRect.left - containerRect.left;
        const offsetY = imgRect.top - containerRect.top;

        setImageDimensions({ width: naturalWidth, height: naturalHeight });
        setDisplayInfo({
          width: displayedWidth,
          height: displayedHeight,
          offsetX,
          offsetY,
        });
      }
    };

    if (img.complete) {
      updateDimensions();
    } else {
      img.onload = updateDimensions;
    }

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(container);
    resizeObserver.observe(img);

    // Also listen for window resize
    window.addEventListener("resize", updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, [imageUrl]);

  // Draw bounding boxes on overlay canvas
  useEffect(() => {
    if (
      !overlayCanvasRef.current ||
      !containerRef.current ||
      !imageDimensions ||
      !displayInfo ||
      detectedItems.length === 0
    )
      return;

    const canvas = overlayCanvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match container (full overlay)
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    // Calculate scale factors based on actual displayed image size
    const scaleX = displayInfo.width / imageDimensions.width;
    const scaleY = displayInfo.height / imageDimensions.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bounding boxes for detected items
    detectedItems.forEach((item) => {
      if (!item.boundingBox) return;

      const { x, y, width, height } = item.boundingBox;
      const isSelected = selectedItemIds.includes(item.id);

      // Scale bounding box to displayed image size
      const scaledX = x * scaleX;
      const scaledY = y * scaleY;
      const scaledWidth = width * scaleX;
      const scaledHeight = height * scaleY;

      // Offset by image position within container
      const finalX = scaledX + displayInfo.offsetX;
      const finalY = scaledY + displayInfo.offsetY;

      // Draw semi-transparent overlay
      ctx.fillStyle = isSelected
        ? "rgba(0, 150, 255, 0.3)"
        : "rgba(255, 200, 0, 0.2)";
      ctx.fillRect(finalX, finalY, scaledWidth, scaledHeight);

      // Draw border
      ctx.strokeStyle = isSelected ? "#0096ff" : "#ffc800";
      ctx.lineWidth = 2;
      ctx.strokeRect(finalX, finalY, scaledWidth, scaledHeight);

      // Draw label background
      if (scaledWidth > 60 && scaledHeight > 20) {
        const labelText = item.label;
        ctx.font = "12px Inter, sans-serif";
        const metrics = ctx.measureText(labelText);
        const labelWidth = metrics.width + 8;
        const labelHeight = 18;

        // Label background
        ctx.fillStyle = isSelected ? "#0096ff" : "#ffc800";
        ctx.fillRect(finalX + 4, finalY + 4, labelWidth, labelHeight);

        // Label text
        ctx.fillStyle = "#ffffff";
        ctx.fillText(labelText, finalX + 8, finalY + 16);
      }
    });
  }, [detectedItems, selectedItemIds, imageDimensions, displayInfo]);

  // Handle click on canvas to toggle item selection
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!imageDimensions || !displayInfo || !overlayCanvasRef.current) return;

    const canvas = overlayCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Get click position relative to canvas
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert click position to coordinates relative to displayed image
    const imageRelativeX = clickX - displayInfo.offsetX;
    const imageRelativeY = clickY - displayInfo.offsetY;

    // Check if click is within image bounds
    if (
      imageRelativeX < 0 ||
      imageRelativeY < 0 ||
      imageRelativeX > displayInfo.width ||
      imageRelativeY > displayInfo.height
    ) {
      return; // Clicked outside image
    }

    // Convert to natural image coordinates
    const scaleX = imageDimensions.width / displayInfo.width;
    const scaleY = imageDimensions.height / displayInfo.height;

    const actualX = imageRelativeX * scaleX;
    const actualY = imageRelativeY * scaleY;

    // Find which item was clicked (with small tolerance for easier clicking)
    const tolerance = 5; // pixels tolerance in natural image coordinates
    for (const item of detectedItems) {
      if (!item.boundingBox) continue;

      const { x, y, width, height } = item.boundingBox;
      if (
        actualX >= x - tolerance &&
        actualX <= x + width + tolerance &&
        actualY >= y - tolerance &&
        actualY <= y + height + tolerance
      ) {
        onItemToggle(item.id);
        break;
      }
    }
  };

  if (!imageUrl) {
    return (
      <div className="bg-[#FDFCFB] rounded-sm flex flex-col items-center justify-center text-center relative shadow-sm overflow-hidden h-[400px] lg:h-[550px]">
        <p
          className="text-[14px] text-[#c5c5c5]"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
          }}
        >
          No image uploaded
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="bg-[#FDFCFB] rounded-sm flex flex-col items-center justify-center relative shadow-sm overflow-hidden h-[400px] lg:h-[550px]"
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Space to clear"
          className="max-w-full max-h-full w-auto h-auto object-contain"
          style={{
            display: "block",
          }}
        />
        {detectedItems.length > 0 && displayInfo && (
          <canvas
            ref={overlayCanvasRef}
            className="absolute top-0 left-0 cursor-pointer"
            onClick={handleCanvasClick}
            style={{
              pointerEvents: "auto",
              width: "100%",
              height: "100%",
            }}
          />
        )}
      </div>
      {detectedItems.length === 0 && (
        <p
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[12px] text-textSecondary bg-background/90 backdrop-blur-sm px-4 py-2 rounded-sm"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            letterSpacing: "0.02em",
          }}
        >
          Select furniture you want to remove
        </p>
      )}
      {detectedItems.length > 0 && (
        <p
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[12px] text-textSecondary bg-background/90 backdrop-blur-sm px-4 py-2 rounded-sm pointer-events-none"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            letterSpacing: "0.02em",
          }}
        >
          {detectedItems.some((item) => item.boundingBox)
            ? `Click highlighted items to select • ${selectedItemIds.length} selected`
            : `Use the list on the right to select • ${selectedItemIds.length} selected`}
        </p>
      )}
    </div>
  );
}
