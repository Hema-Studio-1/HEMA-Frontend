import React, { useEffect, useState } from 'react';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';

interface MoodBoardData {
  id: string;
  name: string;
  type: string;
  itemsCount: number;
  createdDate: string;
  lastUpdated: string;
}

interface MoodBoardInfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  moodBoard: MoodBoardData | null;
  onSave?: (name: string, type: string) => void;
}

const types = ['Office', 'Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Furniture', 'Lighting', 'Textiles', 'Decorative Objects', 'Materials'];

export function MoodBoardInfoPanel({ isOpen, onClose, moodBoard, onSave }: MoodBoardInfoPanelProps) {
  const [editedName, setEditedName] = useState(moodBoard?.name ?? '');
  const [editedType, setEditedType] = useState(moodBoard?.type ?? '');

  useEffect(() => {
    if (moodBoard) {
      setEditedName(moodBoard.name);
      setEditedType(moodBoard.type);
    }
  }, [moodBoard]);

  const handleUpdate = () => {
    if (onSave) {
      onSave(editedName, editedType);
    }
    onClose();
  };

  if (!moodBoard) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent side="right" className="max-w-[460px]">
        <SheetHeader>
          <SheetTitle>Mood Board Info</SheetTitle>
          <SheetDescription>Overview and metadata</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <div className="space-y-8">
            {/* Mood Board Name */}
            <div>
              <label
                className="block text-[11px] text-[#9a9a9a] mb-2 uppercase tracking-wider"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: '0.08em'
                }}
              >
                Mood Board Name
              </label>
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full px-3 py-2 text-[16px] text-[#2a2a2a] bg-[#FDFCFB] border border-[#E8E6E3] rounded-sm focus:outline-none focus:border-[#A4AC96] transition-colors duration-300"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  lineHeight: '1.5'
                }}
              />
            </div>

            <div className="border-t border-[#E8E6E3]" />

            {/* Type */}
            <div>
              <label
                className="block text-[11px] text-[#9a9a9a] mb-2 uppercase tracking-wider"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: '0.08em'
                }}
              >
                Mood Board Type
              </label>
              <select
                value={editedType}
                onChange={(e) => setEditedType(e.target.value)}
                className="w-full px-3 py-2 text-[14px] text-[#2a2a2a] bg-[#FDFCFB] border border-[#E8E6E3] rounded-sm focus:outline-none focus:border-[#A4AC96] transition-colors duration-300"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  lineHeight: '1.6'
                }}
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Items */}
            <div>
              <label
                className="block text-[11px] text-[#9a9a9a] mb-2 uppercase tracking-wider"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: '0.08em'
                }}
              >
                Total Items
              </label>
              <p
                className="text-[14px] text-[#2a2a2a]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  lineHeight: '1.6'
                }}
              >
                {moodBoard.itemsCount} {moodBoard.itemsCount === 1 ? 'item' : 'items'}
              </p>
            </div>

            <div className="border-t border-[#E8E6E3]" />

            {/* Metadata */}
            <div className="space-y-4">
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
                    {moodBoard.createdDate}
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
                    {moodBoard.lastUpdated}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SheetBody>
        <SheetFooter>
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
            onClick={handleUpdate}
            className="px-6 py-3 text-[13px] rounded-sm bg-[#2a2a2a] text-[#FDFCFB] hover:opacity-80 transition-all duration-300"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              letterSpacing: '0.05em'
            }}
          >
            Update
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
