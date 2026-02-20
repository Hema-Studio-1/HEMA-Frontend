import React from 'react';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';

export interface SpaceData {
  id: string;
  name: string;
  type: string;
  category?: string;
  styleTags?: string[];
  description?: string;
  generatedAssets?: string[];
  status: 'Draft' | 'In progress' | 'Final';
  createdBy: string;
  createdDate: string;
  lastUpdated: string;
}

interface SpaceInfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  space: SpaceData | null;
}

export function SpaceInfoPanel({ isOpen, onClose, space }: SpaceInfoPanelProps) {
  if (!space) return null;

  const spaceData = {
    ...space,
    type: space.type || 'Custom',
    status: space.status || 'Draft' as const,
    createdBy: space.createdBy || 'Unknown',
    createdDate: space.createdDate || 'N/A',
    lastUpdated: space.lastUpdated || 'N/A'
  };

  const statusColors = {
    'Draft': 'bg-[#E8E6E3] text-[#626262]',
    'In progress': 'bg-[#A4AC96]/10 text-[#626262] border border-[#A4AC96]/20',
    'Final': 'bg-[#8a9280]/10 text-[#2a2a2a] border border-[#8a9280]/30'
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent side="right" className="max-w-[460px]">
        <SheetHeader>
          <SheetTitle>Space Details</SheetTitle>
          <SheetDescription>Overview and metadata</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <div className="space-y-8">
            {/* Space Name */}
            <div>
              <label
                className="block text-[11px] text-[#9a9a9a] mb-2 uppercase tracking-wider"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: '0.08em'
                }}
              >
                Space Name
              </label>
              <p
                className="text-[16px] text-[#2a2a2a]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  lineHeight: '1.5'
                }}
              >
                {spaceData.name}
              </p>
            </div>

            <div className="border-t border-[#E8E6E3]" />

            {/* Type and Category */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-[11px] text-[#9a9a9a] mb-2 uppercase tracking-wider"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    letterSpacing: '0.08em'
                  }}
                >
                  Type
                </label>
                <p
                  className="text-[14px] text-[#2a2a2a]"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300,
                    lineHeight: '1.6'
                  }}
                >
                  {spaceData.type}
                </p>
              </div>

              {spaceData.category && (
                <div>
                  <label
                    className="block text-[11px] text-[#9a9a9a] mb-2 uppercase tracking-wider"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      letterSpacing: '0.08em'
                    }}
                  >
                    Category
                  </label>
                  <p
                    className="text-[14px] text-[#2a2a2a]"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                      lineHeight: '1.6'
                    }}
                  >
                    {spaceData.category}
                  </p>
                </div>
              )}
            </div>

            {/* Style Tags */}
            {spaceData.styleTags && spaceData.styleTags.length > 0 && (
              <div>
                <label
                  className="block text-[11px] text-[#9a9a9a] mb-3 uppercase tracking-wider"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    letterSpacing: '0.08em'
                  }}
                >
                  Style Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {spaceData.styleTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#EFEDE9] text-[#626262] rounded-sm text-[12px]"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 300
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {spaceData.description && (
              <div>
                <label
                  className="block text-[11px] text-[#9a9a9a] mb-2 uppercase tracking-wider"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    letterSpacing: '0.08em'
                  }}
                >
                  Description
                </label>
                <p
                  className="text-[14px] text-[#2a2a2a]"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300,
                    lineHeight: '1.7'
                  }}
                >
                  {spaceData.description}
                </p>
              </div>
            )}

            <div className="border-t border-[#E8E6E3]" />

            {/* Generated Assets */}
            {spaceData.generatedAssets && spaceData.generatedAssets.length > 0 && (
              <div>
                <label
                  className="block text-[11px] text-[#9a9a9a] mb-3 uppercase tracking-wider"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    letterSpacing: '0.08em'
                  }}
                >
                  Generated Assets
                </label>
                <ul className="space-y-2">
                  {spaceData.generatedAssets.map((asset, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-[14px] text-[#2a2a2a]"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 300,
                        lineHeight: '1.6'
                      }}
                    >
                      <span className="text-[#9a9a9a] mt-1">•</span>
                      <span>{asset}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Status */}
            <div>
              <label
                className="block text-[11px] text-[#9a9a9a] mb-3 uppercase tracking-wider"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: '0.08em'
                }}
              >
                Status
              </label>
              <span
                className={`inline-block px-3 py-1.5 rounded-sm text-[12px] ${statusColors[spaceData.status]}`}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400
                }}
              >
                {spaceData.status}
              </span>
            </div>

            <div className="border-t border-[#E8E6E3]" />

            {/* Metadata */}
            <div className="space-y-4">
              <div>
                <label
                  className="block text-[11px] text-[#9a9a9a] mb-2 uppercase tracking-wider"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    letterSpacing: '0.08em'
                  }}
                >
                  Created By
                </label>
                <p
                  className="text-[14px] text-[#2a2a2a]"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300,
                    lineHeight: '1.6'
                  }}
                >
                  {spaceData.createdBy}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label
                    className="block text-[11px] text-[#9a9a9a] mb-2 uppercase tracking-wider"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      letterSpacing: '0.08em'
                    }}
                  >
                    Created
                  </label>
                  <p
                    className="text-[14px] text-[#2a2a2a]"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                      lineHeight: '1.6'
                    }}
                  >
                    {spaceData.createdDate}
                  </p>
                </div>

                <div>
                  <label
                    className="block text-[11px] text-[#9a9a9a] mb-2 uppercase tracking-wider"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      letterSpacing: '0.08em'
                    }}
                  >
                    Last Updated
                  </label>
                  <p
                    className="text-[14px] text-[#2a2a2a]"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                      lineHeight: '1.6'
                    }}
                  >
                    {spaceData.lastUpdated}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
