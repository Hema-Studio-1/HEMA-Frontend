/**
 * Image Masking & Selection Logic
 * 
 * This file contains all the logic for:
 * 1. Manual image masking (painting over image to select areas)
 * 2. Furniture/item selection management
 * 3. API calls for refinement
 * 4. Canvas drawing and mask storage
 * 
 * Usage: Import and use in your React component
 */

import { useState, useRef, useEffect } from 'react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SelectableItem {
  id: string;
  type: string;
  description: string;
  bbox?: BoundingBox;
}

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export interface RefinementOptions {
  /** Base64 image data URL of the image to refine */
  imageData: string;
  /** Optional: Original image dimensions for resizing */
  originalDimensions?: ImageDimensions;
  /** API endpoint function to call for refinement */
  apiCall: (params: RefinementApiParams) => Promise<RefinementApiResponse>;
  /** Optional: Storage key for persisting mask (uses localStorage) */
  storageKey?: string;
  /** Optional: Callback when refinement completes */
  onRefinementComplete?: (refinedImage: string) => void;
  /** Optional: Callback for errors */
  onError?: (error: Error) => void;
}

export interface RefinementApiParams {
  imageData: string;
  mode: 'refine';
  manualMask: string;
}

export interface RefinementApiResponse {
  emptyRoomImage?: string;
  refinedImage?: string;
  error?: string;
}

// ============================================================================
// SELECTION MANAGEMENT HOOK
// ============================================================================

/**
 * Hook for managing item selection (furniture, objects, etc.)
 */
export function useItemSelection<T extends SelectableItem>(
  items: T[],
  storageKey?: string
) {
  // Convert storage key to array format
  const arrayKey = storageKey ? `${storageKey}-selectedItems` : undefined;
  
  // Load from localStorage if key provided
  const loadFromStorage = (): string[] => {
    if (!arrayKey) return [];
    try {
      const stored = localStorage.getItem(arrayKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const [selectedItemsArray, setSelectedItemsArray] = useState<string[]>(
    loadFromStorage
  );

  // Save to localStorage when selection changes
  useEffect(() => {
    if (arrayKey) {
      localStorage.setItem(arrayKey, JSON.stringify(selectedItemsArray));
    }
  }, [selectedItemsArray, arrayKey]);

  // Convert array to Set for O(1) lookup
  const selectedItems = new Set(selectedItemsArray);

  const setSelectedItems = (newSet: Set<string> | string[]) => {
    const array = Array.isArray(newSet) ? newSet : Array.from(newSet);
    setSelectedItemsArray(array);
  };

  const toggleItemSelection = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const selectAllItems = () => {
    setSelectedItems(new Set(items.map(item => item.id)));
  };

  const deselectAllItems = () => {
    setSelectedItems(new Set());
  };

  const selectItems = (itemIds: string[]) => {
    const newSelected = new Set(selectedItems);
    itemIds.forEach(id => newSelected.add(id));
    setSelectedItems(newSelected);
  };

  const deselectItems = (itemIds: string[]) => {
    const newSelected = new Set(selectedItems);
    itemIds.forEach(id => newSelected.delete(id));
    setSelectedItems(newSelected);
  };

  const isSelected = (itemId: string) => selectedItems.has(itemId);

  const getSelectedItems = (): T[] => {
    return items.filter(item => selectedItems.has(item.id));
  };

  return {
    selectedItems,
    selectedItemsArray,
    setSelectedItems,
    toggleItemSelection,
    selectAllItems,
    deselectAllItems,
    selectItems,
    deselectItems,
    isSelected,
    getSelectedItems,
    selectedCount: selectedItems.size,
  };
}

// ============================================================================
// IMAGE MASKING HOOK (PAINTING LOGIC)
// ============================================================================

/**
 * Hook for manual image masking (painting over image)
 * Handles canvas drawing, mask storage, and refinement API calls
 */
export function useImageMasking(options: RefinementOptions) {
  const {
    imageData,
    originalDimensions,
    apiCall,
    storageKey,
    onRefinementComplete,
    onError,
  } = options;

  // State management
  const [isRefinementMode, setIsRefinementMode] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(30);
  const [isErasing, setIsErasing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Use ref for immediate drawing state (avoids async state update issues)
  const isDrawingRef = useRef(false);

  // Mask storage key
  const maskStorageKey = storageKey ? `${storageKey}-manualMask` : undefined;

  // Load mask from localStorage if available
  const loadMaskFromStorage = (): string | null => {
    if (!maskStorageKey) return null;
    try {
      return localStorage.getItem(maskStorageKey);
    } catch {
      return null;
    }
  };

  const [manualMask, setManualMask] = useState<string | null>(
    loadMaskFromStorage()
  );

  // Save mask to localStorage
  const saveMaskToStorage = (mask: string | null) => {
    if (maskStorageKey) {
      if (mask) {
        localStorage.setItem(maskStorageKey, mask);
      } else {
        localStorage.removeItem(maskStorageKey);
      }
    }
  };

  // Update localStorage when mask changes
  useEffect(() => {
    saveMaskToStorage(manualMask);
  }, [manualMask, maskStorageKey]);

  // ============================================================================
  // CANVAS INITIALIZATION
  // ============================================================================

  /**
   * Initialize canvas when entering refinement mode
   * Sets canvas size to match image aspect ratio
   */
  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !imageData) return;

    const img = new Image();
    img.onload = () => {
      // Set canvas size to match image aspect ratio
      const containerWidth = container.clientWidth;
      const aspectRatio = img.height / img.width;
      const canvasHeight = containerWidth * aspectRatio;

      canvas.width = containerWidth;
      canvas.height = canvasHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // If there's an existing mask, load it
      if (manualMask) {
        const maskImg = new Image();
        maskImg.onload = () => {
          ctx.drawImage(maskImg, 0, 0, canvas.width, canvas.height);
        };
        maskImg.src = manualMask;
      } else {
        // Clear canvas (transparent)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    img.src = imageData;
  };

  // ============================================================================
  // DRAWING FUNCTIONS
  // ============================================================================

  /**
   * Get mouse/touch coordinates relative to canvas
   */
  const getCanvasCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  /**
   * Start drawing on canvas
   */
  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    isDrawingRef.current = true;
    setIsDrawing(true);
    draw(e);
  };

  /**
   * Draw brush stroke on canvas
   */
  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    // Use ref for immediate check (state updates are async)
    if (!isDrawingRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoordinates(e);
    if (!coords) return;

    const { x, y } = coords;

    // Draw circle at mouse position
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);

    if (isErasing) {
      // Erase mode: remove pixels
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    } else {
      // Draw mode: add yellow-green highlight
      ctx.fillStyle = 'rgba(200, 255, 0, 0.6)'; // Yellow-green highlight
      ctx.fill();
    }
  };

  /**
   * Stop drawing and save mask
   */
  const stopDrawing = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      setIsDrawing(false);
      saveMask();
    }
  };

  /**
   * Save current canvas state as mask (base64 PNG)
   */
  const saveMask = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const maskData = canvas.toDataURL('image/png');
    setManualMask(maskData);
  };

  /**
   * Clear the mask
   */
  const clearMask = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setManualMask(null);
  };

  // ============================================================================
  // REFINEMENT API CALL
  // ============================================================================

  /**
   * Apply refinement with manual mask
   * Sends mask to API and processes response
   */
  const applyRefinement = async (): Promise<string | null> => {
    if (!imageData || !manualMask) {
      const error = new Error('Image data and mask are required');
      onError?.(error);
      return null;
    }

    setIsProcessing(true);
    try {
      const response = await apiCall({
        imageData,
        mode: 'refine',
        manualMask,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      // Get refined image (check both possible response fields)
      const refinedImage =
        response.emptyRoomImage || response.refinedImage || null;

      if (!refinedImage) {
        throw new Error('No refined image returned from API');
      }

      // Optional: Resize to match original dimensions
      let finalImage = refinedImage;
      if (originalDimensions) {
        try {
          const refinedDimensions = await getImageDimensions(refinedImage);
          const needsResize =
            refinedDimensions.width !== originalDimensions.width ||
            refinedDimensions.height !== originalDimensions.height;

          if (needsResize) {
            finalImage = await resizeImageToMatch(
              refinedImage,
              originalDimensions.width,
              originalDimensions.height
            );
          }
        } catch (resizeError) {
          console.warn('Failed to resize refined image:', resizeError);
          // Continue with original refined image
        }
      }

      // Clear mask and exit refinement mode
      setManualMask(null);
      setIsRefinementMode(false);

      // Call completion callback
      onRefinementComplete?.(finalImage);

      return finalImage;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      console.error('Error refining image:', err);
      onError?.(err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  // ============================================================================
  // MODE MANAGEMENT
  // ============================================================================

  /**
   * Enter refinement mode
   */
  const enterRefinementMode = () => {
    setIsRefinementMode(true);
    // Small delay to ensure DOM is ready
    setTimeout(initializeCanvas, 100);
  };

  /**
   * Exit refinement mode
   */
  const exitRefinementMode = () => {
    setIsRefinementMode(false);
    setManualMask(null);
    // Reset drawing state
    isDrawingRef.current = false;
    setIsDrawing(false);
  };

  // ============================================================================
  // RETURN VALUES
  // ============================================================================

  return {
    // State
    isRefinementMode,
    isDrawing,
    brushSize,
    setBrushSize,
    isErasing,
    setIsErasing,
    isProcessing,
    manualMask,
    hasMask: !!manualMask,

    // Refs (attach these to your DOM elements)
    canvasRef,
    containerRef,

    // Drawing functions
    startDrawing,
    draw,
    stopDrawing,
    clearMask,

    // Mode management
    enterRefinementMode,
    exitRefinementMode,

    // API call
    applyRefinement,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get image dimensions from base64 data URL
 */
export async function getImageDimensions(
  imageData: string
): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
      });
    };
    img.onerror = reject;
    img.src = imageData;
  });
}

/**
 * Resize image to match target dimensions
 */
export async function resizeImageToMatch(
  imageData: string,
  targetWidth: number,
  targetHeight: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      const resizedData = canvas.toDataURL('image/png');
      resolve(resizedData);
    };
    img.onerror = reject;
    img.src = imageData;
  });
}

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

/**
 * EXAMPLE COMPONENT USAGE:
 * 
 * ```tsx
 * import { useImageMasking, useItemSelection } from './imageMaskingLogic';
 * 
 * function MyComponent() {
 *   const [imageData, setImageData] = useState<string | null>(null);
 *   const [refinedImage, setRefinedImage] = useState<string | null>(null);
 *   
 *   // API call function
 *   const callRefinementAPI = async (params) => {
 *     const { data, error } = await supabase.functions.invoke('detect-furniture', {
 *       body: params
 *     });
 *     if (error) throw error;
 *     return data;
 *   };
 * 
 *   // Image masking hook
 *   const masking = useImageMasking({
 *     imageData: refinedImage || imageData || '',
 *     apiCall: callRefinementAPI,
 *     storageKey: 'my-component',
 *     onRefinementComplete: (newImage) => {
 *       setRefinedImage(newImage);
 *       toast.success('Image refined!');
 *     },
 *     onError: (error) => {
 *       toast.error(error.message);
 *     },
 *   });
 * 
 *   // Item selection hook
 *   const items = [
 *     { id: '1', type: 'sofa', description: 'beige sofa' },
 *     { id: '2', type: 'table', description: 'wooden table' },
 *   ];
 *   const selection = useItemSelection(items, 'my-component');
 * 
 *   return (
 *     <div>
 *       {/* Image with canvas overlay *}
 *       {masking.isRefinementMode ? (
 *         <div ref={masking.containerRef} className="relative">
 *           <img src={imageData} alt="Room" />
 *           <canvas
 *             ref={masking.canvasRef}
 *             className="absolute top-0 left-0 w-full h-full cursor-crosshair"
 *             onMouseDown={masking.startDrawing}
 *             onMouseMove={masking.draw}
 *             onMouseUp={masking.stopDrawing}
 *             onMouseLeave={masking.stopDrawing}
 *             onTouchStart={masking.startDrawing}
 *             onTouchMove={masking.draw}
 *             onTouchEnd={masking.stopDrawing}
 *           />
 *           
 *           /* Controls *
 *           <div>
 *             <button onClick={() => masking.setIsErasing(false)}>Draw</button>
 *             <button onClick={() => masking.setIsErasing(true)}>Erase</button>
 *             <input
 *               type="range"
 *               min="10"
 *               max="80"
 *               value={masking.brushSize}
 *               onChange={(e) => masking.setBrushSize(parseInt(e.target.value))}
 *             />
 *             <button onClick={masking.clearMask}>Clear</button>
 *             <button
 *               onClick={masking.applyRefinement}
 *               disabled={masking.isProcessing || !masking.hasMask}
 *             >
 *               Apply Refinement
 *             </button>
 *           </div>
 *         </div>
 *       ) : (
 *         <div>
 *           <img src={refinedImage || imageData} alt="Room" />
 *           <button onClick={masking.enterRefinementMode}>
 *             Refine Manually
 *           </button>
 *         </div>
 *       )}
 * 
 *       {/* Item selection *
 *       <div>
 *         {items.map(item => (
 *           <button
 *             key={item.id}
 *             onClick={() => selection.toggleItemSelection(item.id)}
 *             className={selection.isSelected(item.id) ? 'selected' : ''}
 *           >
 *             {item.type} - {item.description}
 *           </button>
 *         ))}
 *         <button onClick={selection.selectAllItems}>Select All</button>
 *         <button onClick={selection.deselectAllItems}>Deselect All</button>
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */
