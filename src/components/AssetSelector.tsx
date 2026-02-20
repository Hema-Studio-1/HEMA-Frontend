import { Check, X } from 'lucide-react';
import React from 'react';
import { useState } from 'react';

interface Asset {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
}

interface AssetSelectorProps {
  onClose: () => void;
  onSelect: (images: string[]) => void;
  maxSelection: number;
}

const assets: Asset[] = [
  {
    id: '1',
    name: 'Sculptural Lounge Chair',
    category: 'Seating',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
  },
  {
    id: '2',
    name: 'Pendant Light',
    category: 'Lighting',
    imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80',
  },
  {
    id: '3',
    name: 'Minimalist Console Table',
    category: 'Tables',
    imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80',
  },
  {
    id: '4',
    name: 'Ceramic Vase',
    category: 'Decorative Objects',
    imageUrl: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80',
  },
  {
    id: '5',
    name: 'Woven Storage Basket',
    category: 'Storage',
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80',
  },
  {
    id: '6',
    name: 'Arc Floor Lamp',
    category: 'Lighting',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
  },
  {
    id: '7',
    name: 'Upholstered Armchair',
    category: 'Seating',
    imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80',
  },
  {
    id: '8',
    name: 'Linen Throw',
    category: 'Textiles',
    imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
  },
  {
    id: '9',
    name: 'Marble Side Table',
    category: 'Tables',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  },
  {
    id: '10',
    name: 'Wall Mirror',
    category: 'Architectural Elements',
    imageUrl: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80',
  },
  {
    id: '11',
    name: 'Wooden Shelving Unit',
    category: 'Storage',
    imageUrl: 'https://images.unsplash.com/photo-1595428773637-056682d2c8e7?w=800&q=80',
  },
  {
    id: '12',
    name: 'Table Lamp',
    category: 'Lighting',
    imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80',
  },
];

export function AssetSelector({ onClose, onSelect, maxSelection }: AssetSelectorProps) {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

  const handleToggleAsset = (imageUrl: string) => {
    if (selectedAssets.includes(imageUrl)) {
      setSelectedAssets(selectedAssets.filter(url => url !== imageUrl));
    } else if (selectedAssets.length < maxSelection) {
      setSelectedAssets([...selectedAssets, imageUrl]);
    }
  };

  const handleConfirm = () => {
    onSelect(selectedAssets);
  };

  return (
    <div className="fixed inset-0 z-[100]" style={{ isolation: 'isolate' }} aria-modal="true">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#2a2a2a]/10 backdrop-blur-sm transition-opacity duration-500"
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[80vh] bg-[#FDFCFB] rounded-sm overflow-hidden"
        style={{
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
        }}
      >
        {/* Header */}
        <div className="border-b border-[#E8E6E3] px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 
                className="text-[20px] text-[#2a2a2a] mb-1"
                style={{ 
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 300,
                  letterSpacing: '-0.01em'
                }}
              >
                Select from Assets
              </h3>
              <p 
                className="text-[12px] text-[#9a9a9a]"
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300
                }}
              >
                Selected {selectedAssets.length} of {maxSelection}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:opacity-60 transition-opacity duration-300"
            >
              <X size={20} className="text-[#626262]" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-8" style={{ maxHeight: 'calc(80vh - 180px)' }}>
          <div className="grid grid-cols-4 gap-4">
            {assets.map((asset) => {
              const isSelected = selectedAssets.includes(asset.imageUrl);
              const canSelect = selectedAssets.length < maxSelection;
              
              return (
                <button
                  key={asset.id}
                  onClick={() => handleToggleAsset(asset.imageUrl)}
                  disabled={!isSelected && !canSelect}
                  className={`relative group ${
                    !isSelected && !canSelect ? 'cursor-not-allowed opacity-40' : ''
                  }`}
                >
                  <div 
                    className={`overflow-hidden rounded-sm transition-all duration-300 ${
                      isSelected ? 'ring-2 ring-[#2a2a2a]' : 'ring-1 ring-transparent hover:ring-[#E8E6E3]'
                    }`}
                  >
                    <img
                      src={asset.imageUrl}
                      alt={asset.name}
                      className="w-full aspect-square object-cover"
                    />
                  </div>
                  
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-[#2a2a2a] rounded-sm flex items-center justify-center">
                      <Check size={14} className="text-[#FDFCFB]" strokeWidth={2} />
                    </div>
                  )}

                  {/* Asset name */}
                  <p
                    className="mt-2 text-[11px] text-[#626262] text-left"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300
                    }}
                  >
                    {asset.name}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#E8E6E3] px-8 py-6">
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 text-[13px] text-[#626262] hover:text-[#2a2a2a] transition-colors duration-300"
              style={{ 
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                letterSpacing: '0.05em'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedAssets.length === 0}
              className={`px-6 py-3 text-[13px] rounded-sm transition-all duration-300 ${
                selectedAssets.length > 0
                  ? 'bg-[#2a2a2a] text-[#FDFCFB] hover:opacity-80'
                  : 'bg-[#F3F1EE] text-[#c5c5c5] cursor-not-allowed'
              }`}
              style={{ 
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                letterSpacing: '0.05em'
              }}
            >
              Add Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
