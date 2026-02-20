import { X, Heart, Trash2, Download, UserPlus, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { AssignTeamMemberDialog } from './AssignTeamMemberDialog';

interface MoodBoard {
  id: string;
  name: string;
  type: string;
  images: string[];
  isLiked: boolean;
}

interface MoodBoardViewProps {
  moodBoard: MoodBoard;
  onClose: () => void;
  onToggleLike: (id: string) => void;
  onDelete: (id: string) => void;
}

interface DropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
}

function Dropdown({ label, value, options, onChange, placeholder = 'Select...' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label 
        className="block text-[11px] text-[#9a9a9a] mb-2"
        style={{ 
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          letterSpacing: '0.02em'
        }}
      >
        {label}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2.5 bg-[#FDFCFB] border border-[#E8E6E3] rounded-sm text-left flex items-center justify-between hover:border-[#c5c5c5] transition-colors duration-300"
      >
        <span
          className="text-[13px]"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            color: value ? '#2a2a2a' : '#9a9a9a'
          }}
        >
          {value || placeholder}
        </span>
        <ChevronDown 
          size={14} 
          className={`text-[#626262] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          strokeWidth={1.5} 
        />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          <div 
            className="absolute top-full left-0 right-0 mt-1 bg-[#FDFCFB] border border-[#E8E6E3] rounded-sm z-20 max-h-64 overflow-y-auto"
            style={{
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}
          >
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2.5 text-left hover:bg-[#F7F5F2] transition-colors duration-200"
              >
                <span
                  className="text-[13px]"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: value === option ? 400 : 300,
                    color: value === option ? '#2a2a2a' : '#626262'
                  }}
                >
                  {option}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function MoodBoardView({ moodBoard, onClose, onToggleLike, onDelete }: MoodBoardViewProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  
  // Dropdown states
  const [selectedLighting, setSelectedLighting] = useState('');
  const [selectedPointOfView, setSelectedPointOfView] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedInteriorRender, setSelectedInteriorRender] = useState('Precise render');
  const [selectedArchContext, setSelectedArchContext] = useState('');

  const handleDelete = () => {
    onDelete(moodBoard.id);
    onClose();
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleAssignMember = (memberId: string, note: string) => {
    console.log('Assigned member to mood board:', memberId, note);
    setIsAssignDialogOpen(false);
  };

  const lightingOptions = [
    'Morning light',
    'Midday',
    'Overcast light',
    'Cloudy',
    'Sunset',
    'Night lighting',
    'Night lighting with stars'
  ];

  const pointOfViewOptions = [
    'Side view',
    'Front view',
    'Top view',
    'Low-angle (worm\'s-eye) view',
    'Close-up of the main subject',
    'Detail view (small design detail)',
    'Multiple view grid'
  ];

  const styleOptions = [
    'Art deco',
    'Biophilic / Nature-Forward',
    'Bohemian',
    'Haussmannian',
    'Industrial',
    'Japandi',
    'Mediterranean',
    'Midcentury modern interior',
    'Rustic',
    'Scandinavian / Soft Minimalism'
  ];

  const archContextOptions = [
    'Precise render',
    'Provence – South of France',
    'Mediterranean sea',
    'Puglia – Italy',
    'Pine forest',
    'In a desert',
    'In Iceland',
    'Iceland – snow',
    'In nature – at night',
    'In nature – at night, Milky Way',
    'Tokyo'
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#2a2a2a]/10 backdrop-blur-sm z-[60] transition-opacity duration-500"
        onClick={onClose}
      />

      {/* Modal - Full Width & Height */}
      <div 
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vh] bg-[#FDFCFB] rounded-sm z-[60] overflow-hidden flex"
        style={{
          maxWidth: '1400px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
        }}
      >
        {/* Left Side - Mood Board Grid (65%) */}
        <div className="w-[65%] bg-[#F7F5F2] p-12 flex items-center justify-center relative">
          <div 
            className="w-full max-w-full"
            style={{
              display: 'grid',
              gridTemplateColumns: moodBoard.images.length === 1 ? '1fr' : 'repeat(2, 1fr)',
              gap: '16px',
              maxHeight: '100%'
            }}
          >
            {moodBoard.images.map((img, idx) => (
              <div 
                key={idx}
                className="overflow-hidden rounded-sm"
                style={{
                  gridColumn: moodBoard.images.length === 1 ? 'span 2' : undefined,
                }}
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover"
                  style={{
                    maxHeight: moodBoard.images.length === 1 ? '70vh' : '35vh'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Operations Panel (35%) */}
        <div className="w-[35%] flex flex-col">
          {/* Header with Actions */}
          <div className="px-12 py-8 border-b border-[#E8E6E3] flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h3 
                className="text-[28px] text-[#2a2a2a] mb-3"
                style={{ 
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 300,
                  letterSpacing: '-0.01em',
                  lineHeight: '1.2'
                }}
              >
                {moodBoard.name}
              </h3>
              <span
                className="inline-block px-2 py-1 text-[10px] bg-[#F7F5F2] text-[#626262] rounded-sm"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  letterSpacing: '0.05em'
                }}
              >
                {moodBoard.type}
              </span>
            </div>
            
            {/* Top-right Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => console.log('Download')}
                className="p-2 hover:opacity-60 transition-opacity duration-300"
                title="Download"
              >
                <Download size={18} className="text-[#626262]" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => onToggleLike(moodBoard.id)}
                className="p-2 hover:opacity-60 transition-opacity duration-300"
                title={moodBoard.isLiked ? "Unlike" : "Like"}
              >
                <Heart 
                  size={18} 
                  className={`transition-colors duration-300 ${
                    moodBoard.isLiked 
                      ? 'text-[#2a2a2a] fill-current' 
                      : 'text-[#626262]'
                  }`}
                  strokeWidth={1.5}
                />
              </button>
              <button
                onClick={handleDeleteClick}
                className="p-2 hover:opacity-60 transition-opacity duration-300"
                title="Delete"
              >
                <Trash2 size={18} className="text-[#626262]" strokeWidth={1.5} />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:opacity-60 transition-opacity duration-300"
              >
                <X size={18} className="text-[#626262]" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Operations Panel - Scrollable */}
          <div className="flex-1 overflow-y-auto px-12 py-8">
            {/* Section 1 - Shortcuts */}
            <div className="mb-8 pb-8 border-b border-[#E8E6E3]">
              <h4 
                className="text-[12px] text-[#2a2a2a] mb-4"
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: '0.02em'
                }}
              >
                Shortcuts
              </h4>
              
              <button
                onClick={() => setIsAssignDialogOpen(true)}
                className="w-full px-4 py-2.5 bg-[#FDFCFB] border border-[#E8E6E3] rounded-sm text-left flex items-center gap-2 hover:border-[#c5c5c5] hover:bg-[#F7F5F2] transition-colors duration-300"
              >
                <UserPlus size={14} className="text-[#626262]" strokeWidth={1.5} />
                <span
                  className="text-[13px] text-[#2a2a2a]"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300,
                    letterSpacing: '0.01em'
                  }}
                >
                  Add people
                </span>
              </button>
            </div>

            {/* Section 2 - Change / Refine */}
            <div className="mb-8">
              <h4 
                className="text-[12px] text-[#2a2a2a] mb-5"
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: '0.02em'
                }}
              >
                Change / Refine
              </h4>
              
              <div className="space-y-4">
                {/* Change Lighting */}
                <Dropdown
                  label="Lighting"
                  value={selectedLighting}
                  options={lightingOptions}
                  onChange={setSelectedLighting}
                  placeholder="Select lighting"
                />

                {/* Change Point of View */}
                <Dropdown
                  label="Point of view"
                  value={selectedPointOfView}
                  options={pointOfViewOptions}
                  onChange={setSelectedPointOfView}
                  placeholder="Select view"
                />

                {/* Restyle */}
                <Dropdown
                  label="Restyle mood board"
                  value={selectedStyle}
                  options={styleOptions}
                  onChange={setSelectedStyle}
                  placeholder="Select style"
                />
              </div>
            </div>

            {/* Section 3 - Smart Render */}
            <div className="mb-8 pb-8 border-b border-[#E8E6E3]">
              <h4 
                className="text-[12px] text-[#2a2a2a] mb-5"
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: '0.02em'
                }}
              >
                Smart Render
              </h4>
              
              <div className="space-y-4">
                {/* Smart Render for Interiors (Segmented Control) */}
                <div>
                  <label 
                    className="block text-[11px] text-[#9a9a9a] mb-2"
                    style={{ 
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                      letterSpacing: '0.02em'
                    }}
                  >
                    Smart render for interiors
                  </label>
                  <div className="flex border border-[#E8E6E3] rounded-sm overflow-hidden">
                    <button
                      onClick={() => setSelectedInteriorRender('Precise render')}
                      className={`flex-1 px-3 py-2.5 text-[13px] transition-colors duration-300 ${
                        selectedInteriorRender === 'Precise render'
                          ? 'bg-[#F7F5F2] text-[#2a2a2a]'
                          : 'bg-[#FDFCFB] text-[#626262] hover:bg-[#F7F5F2]/50'
                      }`}
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: selectedInteriorRender === 'Precise render' ? 400 : 300,
                        letterSpacing: '0.01em'
                      }}
                    >
                      Precise render
                    </button>
                    <button
                      onClick={() => setSelectedInteriorRender('Creative render')}
                      className={`flex-1 px-3 py-2.5 text-[13px] border-l border-[#E8E6E3] transition-colors duration-300 ${
                        selectedInteriorRender === 'Creative render'
                          ? 'bg-[#F7F5F2] text-[#2a2a2a]'
                          : 'bg-[#FDFCFB] text-[#626262] hover:bg-[#F7F5F2]/50'
                      }`}
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: selectedInteriorRender === 'Creative render' ? 400 : 300,
                        letterSpacing: '0.01em'
                      }}
                    >
                      Creative render
                    </button>
                  </div>
                </div>

                {/* Smart Render for Architecture */}
                <Dropdown
                  label="Smart render for architecture"
                  value={selectedArchContext}
                  options={archContextOptions}
                  onChange={setSelectedArchContext}
                  placeholder="Select context"
                />
              </div>
            </div>

            {/* Section 4 - Enhancements */}
            <div className="mb-8 pb-8 border-b border-[#E8E6E3]">
              <h4 
                className="text-[12px] text-[#2a2a2a] mb-4"
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: '0.02em'
                }}
              >
                Enhancements
              </h4>
              
              <button
                onClick={() => console.log('Upscale 4K')}
                className="w-full px-4 py-2.5 bg-[#FDFCFB] border border-[#E8E6E3] rounded-sm text-left flex items-center gap-2 hover:border-[#c5c5c5] hover:bg-[#F7F5F2] transition-colors duration-300"
              >
                <span
                  className="text-[13px] text-[#2a2a2a]"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300,
                    letterSpacing: '0.01em'
                  }}
                >
                  Upscale 4K
                </span>
              </button>
            </div>

            {/* Section 5 - More */}
            <div>
              <h4 
                className="text-[12px] text-[#2a2a2a] mb-4"
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: '0.02em'
                }}
              >
                More
              </h4>
              
              <div className="space-y-2">
                <button
                  onClick={() => console.log('Rerun')}
                  className="w-full px-4 py-2.5 bg-[#FDFCFB] border border-[#E8E6E3] rounded-sm text-left hover:border-[#c5c5c5] hover:bg-[#F7F5F2] transition-colors duration-300"
                >
                  <span
                    className="text-[13px] text-[#2a2a2a]"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                      letterSpacing: '0.01em'
                    }}
                  >
                    Rerun
                  </span>
                </button>
                
                <button
                  onClick={() => console.log('Replace images')}
                  className="w-full px-4 py-2.5 bg-[#FDFCFB] border border-[#E8E6E3] rounded-sm text-left hover:border-[#c5c5c5] hover:bg-[#F7F5F2] transition-colors duration-300"
                >
                  <span
                    className="text-[13px] text-[#2a2a2a]"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                      letterSpacing: '0.01em'
                    }}
                  >
                    Replace images
                  </span>
                </button>
                
                <button
                  onClick={() => console.log('Edit prompt')}
                  className="w-full px-4 py-2.5 bg-[#FDFCFB] border border-[#E8E6E3] rounded-sm text-left hover:border-[#c5c5c5] hover:bg-[#F7F5F2] transition-colors duration-300"
                >
                  <span
                    className="text-[13px] text-[#2a2a2a]"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                      letterSpacing: '0.01em'
                    }}
                  >
                    Edit prompt
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Mood Board"
        message="This will permanently delete the mood board and all included items."
      />

      {/* Assign Team Member Dialog */}
      <AssignTeamMemberDialog
        isOpen={isAssignDialogOpen}
        onClose={() => setIsAssignDialogOpen(false)}
        onAssign={handleAssignMember}
      />
    </>
  );
}
