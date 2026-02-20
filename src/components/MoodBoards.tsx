import { Eye, Heart, Info, Plus, Search, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { CreateMoodBoardDrawer } from './CreateMoodBoardDrawer';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { MoodBoardInfoPanel } from './MoodBoardInfoPanel';
import { MoodBoardView } from './MoodBoardView';

interface MoodBoard {
  id: string;
  name: string;
  type: string;
  images: string[];
  createdAt: Date;
  isLiked: boolean;
}

export function MoodBoards() {
  const [moodBoards, setMoodBoards] = useState<MoodBoard[]>([]);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showLikedOnly, setShowLikedOnly] = useState(false);
  const [selectedMoodBoardForInfo, setSelectedMoodBoardForInfo] = useState<string | null>(null);
  const [selectedMoodBoardForView, setSelectedMoodBoardForView] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [moodBoardToDelete, setMoodBoardToDelete] = useState<string | null>(null);

  const types = ['Office', 'Furniture', 'Lighting', 'Textiles', 'Decorative Objects', 'Materials'];

  const handleCreateMoodBoard = (name: string, type: string, images: string[]) => {
    const newMoodBoard: MoodBoard = {
      id: Date.now().toString(),
      name,
      type,
      images,
      createdAt: new Date(),
      isLiked: false,
    };
    setMoodBoards([newMoodBoard, ...moodBoards]);
    setIsCreateDrawerOpen(false);
  };

  const handleToggleLike = (id: string) => {
    setMoodBoards(moodBoards.map(mb => 
      mb.id === id ? { ...mb, isLiked: !mb.isLiked } : mb
    ));
  };

  const handleDelete = (id: string) => {
    setMoodBoards(moodBoards.filter(mb => mb.id !== id));
    setDeleteDialogOpen(false);
    setMoodBoardToDelete(null);
  };

  const handleDeleteClick = (id: string) => {
    setMoodBoardToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleSaveMoodBoardInfo = (name: string, type: string) => {
    if (selectedMoodBoardForInfo) {
      setMoodBoards(moodBoards.map(mb =>
        mb.id === selectedMoodBoardForInfo ? { ...mb, name, type } : mb
      ));
    }
  };

  const filteredMoodBoards = moodBoards.filter(mb => {
    const matchesSearch = mb.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || mb.type === selectedType;
    const matchesLiked = !showLikedOnly || mb.isLiked;
    return matchesSearch && matchesType && matchesLiked;
  });

  const selectedMoodBoardData = selectedMoodBoardForView 
    ? moodBoards.find(mb => mb.id === selectedMoodBoardForView)
    : null;

  const selectedMoodBoardInfoData = selectedMoodBoardForInfo
    ? moodBoards.find(mb => mb.id === selectedMoodBoardForInfo)
    : null;

  return (
    <>
      <div className="flex flex-col h-full min-h-0">
        {/* Top Section - title, description, Create button */}
        <div className="flex-shrink-0 flex gap-3 justify-between">
          <div>
            <h2 
              className="text-3xl lg:text-4xl tracking-tight text-[#2a2a2a] mb-2"
            >
              Mood Boards
            </h2>
            <p 
              className="text-[#9a9a9a] text-sm"
            >
              Curated inspiration collections for design exploration
            </p>
          </div>
          {moodBoards.length !== 0 && (
            <button
              onClick={() => setIsCreateDrawerOpen(true)}
              className="w-fit h-fit px-4 py-3 bg-[#2a2a2a] text-[#FDFCFB] text-[13px] rounded-sm hover:opacity-80 transition-opacity duration-300 "
            >
              Create moodboard
            </button>
          )}
        </div>

        {/* Row: Left = listing (or empty state) | Right = filters - full height, aligned grid */}
        <div className="grid grid-cols-[1fr_220px] flex-1 min-h-0 gap-8 mt-8">
          {/* Left: full height - empty state centered or moodboard grid */}
          <div className="min-h-0 overflow-y-auto flex flex-col">
            {moodBoards.length === 0 ? (
              <div className="flex-1 flex items-center justify-center px-4">
                <div 
                  className="bg-[#FDFCFB] rounded-sm flex flex-col items-center justify-center text-center transition-colors duration-300"
                  style={{ 
                    width: '100%',
                    maxWidth: '560px',
                    minHeight: '400px',
                    padding: '64px 48px'
                  }}
                >
                  <div className="mb-8 flex items-center justify-center p-2 border border-[#E8E6E3] rounded-sm">
                    <Plus className="text-[#9a9a9a] transition-colors duration-300 size-6" />
                  </div>

                  <h3 
                    className="text-[28px] mb-4 text-[#2a2a2a]"
                    style={{ 
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 300,
                      letterSpacing: '-0.01em'
                    }}
                  >
                    No mood boards yet
                  </h3>

                  <p 
                    className="text-[13px] text-[#9a9a9a] mb-10 max-w-sm"
                    style={{ 
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                      lineHeight: '1.7'
                    }}
                  >
                    Create your first mood board to collect and organize inspiration
                  </p>

                  <button 
                    onClick={() => setIsCreateDrawerOpen(true)}
                    className="px-6 py-3 bg-[#2a2a2a] text-[#FDFCFB] text-[13px] rounded-sm hover:opacity-80 transition-opacity duration-300"
                    style={{ 
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                      letterSpacing: '0.05em'
                    }}
                  >
                    Create Mood Board
                  </button>
                </div>
              </div>
            ) : filteredMoodBoards.length === 0 ? (
              <div className="flex-1 flex items-center justify-center px-4">
                <div
                  className="bg-[#FDFCFB] rounded-sm flex flex-col items-center justify-center text-center transition-colors duration-300"
                  style={{
                    width: '100%',
                    maxWidth: '480px',
                    minHeight: '280px',
                    padding: '40px 32px'
                  }}
                >
                  <div className="w-11 h-11 mb-3 flex items-center justify-center">
                    <div className="w-9 h-9 border border-[#E8E6E3] rounded-sm flex items-center justify-center">
                      <Search size={18} className="text-[#c5c5c5]" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3
                    className="text-[22px] mb-2 text-[#2a2a2a]"
                  >
                    No mood boards match your search
                  </h3>

                  <p
                    className="text-[13px] text-[#9a9a9a] mb-6 leading-relaxed w-[80%]"
                  >
                    Try different keywords or clear filters to see your boards
                  </p>

                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedType('');
                      setShowLikedOnly(false);
                    }}
                    className="px-5 py-2.5 bg-[#2a2a2a] text-[#FDFCFB] text-[13px] rounded-sm hover:opacity-80 transition-opacity duration-300"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                      letterSpacing: '0.05em'
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredMoodBoards.map((moodBoard) => (
                <div
                  key={moodBoard.id}
                  className="relative cursor-pointer group"
                  onMouseEnter={() => setHoveredId(moodBoard.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Mood Board Preview - Collage */}
                  <div 
                    className="overflow-hidden rounded-sm bg-[#FDFCFB] transition-all duration-300"
                    style={{ 
                      aspectRatio: '1 / 1',
                      padding: '8px'
                    }}
                  >
                    {moodBoard.images.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 h-full">
                        {moodBoard.images.slice(0, 4).map((img, idx) => (
                          <div 
                            key={idx}
                            className="overflow-hidden rounded-sm"
                            style={{
                              gridColumn: moodBoard.images.length === 1 ? 'span 2' : undefined,
                              gridRow: moodBoard.images.length === 1 ? 'span 2' : undefined,
                            }}
                          >
                            <img
                              src={img}
                              alt=""
                              className="w-full h-full object-cover transition-opacity duration-500"
                              style={{
                                opacity: hoveredId === moodBoard.id ? 0.85 : 1
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center border border-[#E8E6E3] rounded-sm">
                        <span className="text-[11px] text-[#c5c5c5]" style={{ fontFamily: "'Inter', sans-serif" }}>
                          No images
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Mood Board Info */}
                  <div className="mt-3">
                    <p
                      className="text-[13px] text-[#2a2a2a] mb-1"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        letterSpacing: '0.01em'
                      }}
                    >
                      {moodBoard.name}
                    </p>
                    <p
                      className="text-[11px] text-[#9a9a9a]"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 300,
                        letterSpacing: '0.03em'
                      }}
                    >
                      {moodBoard.type} • {moodBoard.images.length} {moodBoard.images.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>

                  {/* Hover Action Icons - Top Right */}
                  {hoveredId === moodBoard.id && (
                    <div 
                      className="absolute top-3 right-3 flex items-center gap-1 bg-[#FDFCFB]/90 backdrop-blur-sm rounded-sm p-1"
                      style={{
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMoodBoardForView(moodBoard.id);
                        }}
                        className="p-1.5 hover:bg-[#F7F5F2] rounded-sm transition-colors duration-300"
                        title="View mood board"
                      >
                        <Eye size={16} className="text-[#626262]" strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMoodBoardForInfo(moodBoard.id);
                        }}
                        className="p-1.5 hover:bg-[#F7F5F2] rounded-sm transition-colors duration-300"
                        title="Mood board info"
                      >
                        <Info size={16} className="text-[#626262]" strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleLike(moodBoard.id);
                        }}
                        className="p-1.5 hover:bg-[#F7F5F2] rounded-sm transition-colors duration-300"
                        title={moodBoard.isLiked ? "Unlike" : "Like"}
                      >
                        <Heart 
                          size={16} 
                          className={`transition-colors duration-300 ${
                            moodBoard.isLiked 
                              ? 'text-[#2a2a2a] fill-current' 
                              : 'text-[#626262]'
                          }`}
                          strokeWidth={1.5}
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(moodBoard.id);
                        }}
                        className="p-1.5 hover:bg-[#F7F5F2] rounded-sm transition-colors duration-300"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-[#626262]" strokeWidth={1.5} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
              </div>
            )}
          </div>

          {/* Right: Filters - reserved width 220px, full height of row */}
          <div className="flex flex-col min-h-0 pl-6">
            {/* Search */}
        <div className="mb-10">
          <input
            type="text"
            placeholder="Search mood boards"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-0 py-2 text-[13px] bg-transparent border-b border-[#E8E6E3] text-[#2a2a2a] placeholder-[#c5c5c5] focus:outline-none focus:border-[#2a2a2a] transition-colors duration-300"
            style={{ 
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300
            }}
          />
        </div>

        {/* Filter by Type */}
        <div className="mb-10">
          <p 
            className="text-xs text-[#9a9a9a] mb-3"
          >
            Filter by type
          </p>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedType('')}
              className={`block text-left text-[14px] transition-colors duration-300 relative ${
                selectedType === ''
                  ? 'text-[#2a2a2a]'
                  : 'text-[#c5c5c5] hover:text-[#626262]'
              }`}
              style={{ 
                fontFamily: "'Inter', sans-serif",
                fontWeight: selectedType === '' ? 400 : 300
              }}
            >
              {selectedType === '' && (
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#2a2a2a] rounded-full" />
              )}
              All
            </button>
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(selectedType === type ? '' : type)}
                className={`block text-left text-[14px] transition-colors duration-300 relative ${
                  selectedType === type
                    ? 'text-[#2a2a2a]'
                    : 'text-[#c5c5c5] hover:text-[#626262]'
                }`}
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: selectedType === type ? 400 : 300
                }}
              >
                {selectedType === type && (
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#2a2a2a] rounded-full" />
                )}
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Liked Only Checkbox */}
        <div className="mb-10">
          <button
            onClick={() => setShowLikedOnly(!showLikedOnly)}
            className={`flex items-center gap-2 text-[13px] transition-colors duration-300 ${
              showLikedOnly
                ? 'text-[#2a2a2a]'
                : 'text-[#c5c5c5] hover:text-[#626262]'
            }`}
            style={{ 
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300
            }}
          >
            <div className={`w-3 h-3 rounded-sm border transition-all duration-300 flex items-center justify-center ${
              showLikedOnly 
                ? 'border-[#2a2a2a] bg-[#2a2a2a]' 
                : 'border-[#c5c5c5]'
            }`}>
              {showLikedOnly && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#FDFCFB" strokeWidth="1.5">
                  <path d="M2 6l2 2 6-6" />
                </svg>
              )}
            </div>
            Liked only
          </button>
        </div>

        {/* Reset */}
        {(searchQuery || selectedType || showLikedOnly) && (
          <button 
            className="text-[11px] text-[#9a9a9a] hover:text-[#2a2a2a] transition-colors duration-300"
            style={{ 
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              letterSpacing: '0.05em'
            }}
            onClick={() => {
              setSearchQuery('');
              setSelectedType('');
              setShowLikedOnly(false);
            }}
          >
            Reset filters
          </button>
        )}
          </div>
        </div>
      </div>

      {/* Create Drawer */}
      {isCreateDrawerOpen && (
        <CreateMoodBoardDrawer
          onClose={() => setIsCreateDrawerOpen(false)}
          onCreate={handleCreateMoodBoard}
        />
      )}

      {/* Info Panel */}
      <MoodBoardInfoPanel
        isOpen={selectedMoodBoardForInfo !== null}
        onClose={() => setSelectedMoodBoardForInfo(null)}
        moodBoard={
          selectedMoodBoardInfoData
            ? {
                id: selectedMoodBoardInfoData.id,
                name: selectedMoodBoardInfoData.name,
                type: selectedMoodBoardInfoData.type,
                itemsCount: selectedMoodBoardInfoData.images.length,
                createdDate: selectedMoodBoardInfoData.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                lastUpdated: '2 hours ago'
              }
            : null
        }
        onSave={handleSaveMoodBoardInfo}
      />

      {/* View Modal */}
      {selectedMoodBoardData && (
        <MoodBoardView
          moodBoard={selectedMoodBoardData}
          onClose={() => setSelectedMoodBoardForView(null)}
          onToggleLike={handleToggleLike}
          onDelete={handleDelete}
        />
      )}

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => moodBoardToDelete && handleDelete(moodBoardToDelete)}
        title="Delete Mood Board"
        message="This will permanently delete the mood board and all included items."
      />
    </>
  );
}
