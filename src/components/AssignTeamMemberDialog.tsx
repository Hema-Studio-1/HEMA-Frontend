import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface AssignTeamMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (memberId: string, note: string) => void;
}

const mockTeamMembers: TeamMember[] = [
  { id: '1', name: 'Sarah Chen', role: 'Senior Designer', avatar: 'SC' },
  { id: '2', name: 'Michael Rodriguez', role: 'Lead Architect', avatar: 'MR' },
  { id: '3', name: 'Emma Thompson', role: 'Interior Designer', avatar: 'ET' },
  { id: '4', name: 'James Kim', role: 'Project Manager', avatar: 'JK' },
  { id: '5', name: 'Olivia Martinez', role: 'Designer', avatar: 'OM' },
];

export function AssignTeamMemberDialog({ isOpen, onClose, onAssign }: AssignTeamMemberDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const filteredMembers = mockTeamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssign = () => {
    if (selectedMemberId) {
      onAssign(selectedMemberId, note);
      handleClose();
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedMemberId(null);
    setNote('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#2a2a2a]/10 backdrop-blur-sm z-50 transition-opacity duration-500"
        onClick={handleClose}
      />

      {/* Modal */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onKeyDown={handleKeyDown}
      >
        <div 
          className="bg-[#F7F5F2] rounded-sm w-full max-w-md p-8 relative"
          onClick={(e) => e.stopPropagation()}
          style={{
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}
        >
          {/* Title */}
          <h2 
            className="text-[24px] mb-6 text-[#2a2a2a]"
            style={{ 
              fontFamily: "'Playfair Display', serif",
              fontWeight: 400,
              letterSpacing: '-0.01em'
            }}
          >
            Assign team member
          </h2>

          {/* Search Input */}
          <div className="mb-4 relative">
            <Search 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9a9a9a]" 
              strokeWidth={1.5}
            />
            <input
              type="text"
              placeholder="Search team member"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FDFCFB] text-[13px] text-[#2a2a2a] placeholder-[#c5c5c5] focus:outline-none focus:ring-1 focus:ring-[#2a2a2a]/10 transition-all duration-300"
              style={{ 
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300
              }}
              autoFocus
            />
          </div>

          {/* Team Members List */}
          <div className="mb-6 max-h-64 overflow-y-auto">
            {filteredMembers.length > 0 ? (
              <div className="space-y-1">
                {filteredMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => setSelectedMemberId(member.id)}
                    className={`w-full p-3 flex items-center gap-3 transition-colors duration-300 ${
                      selectedMemberId === member.id 
                        ? 'bg-[#E8E6E3]' 
                        : 'hover:bg-[#FDFCFB]'
                    }`}
                  >
                    {/* Avatar */}
                    <div 
                      className="w-8 h-8 rounded-full bg-[#2a2a2a] text-[#F7F5F2] flex items-center justify-center text-[11px] flex-shrink-0"
                      style={{ 
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 500
                      }}
                    >
                      {member.avatar}
                    </div>

                    {/* Name and Role */}
                    <div className="flex-1 text-left">
                      <div 
                        className="text-[13px] text-[#2a2a2a]"
                        style={{ 
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 400
                        }}
                      >
                        {member.name}
                      </div>
                      <div 
                        className="text-[11px] text-[#9a9a9a]"
                        style={{ 
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 300
                        }}
                      >
                        {member.role}
                      </div>
                    </div>

                    {/* Selected Indicator */}
                    {selectedMemberId === member.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#2a2a2a] flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div 
                className="text-center py-8 text-[#9a9a9a] text-[13px]"
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300
                }}
              >
                No team members found
              </div>
            )}
          </div>

          {/* Note/Instruction Field */}
          <div className="mb-8">
            <textarea
              placeholder="Add a note or instruction for this task…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-[#FDFCFB] text-[13px] text-[#2a2a2a] placeholder-[#c5c5c5] focus:outline-none focus:ring-1 focus:ring-[#2a2a2a]/10 transition-all duration-300 resize-none"
              style={{ 
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-6 py-2.5 text-[13px] text-[#626262] hover:text-[#2a2a2a] transition-colors duration-300"
              style={{ 
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={!selectedMemberId}
              className={`px-6 py-2.5 text-[13px] rounded-sm transition-all duration-300 ${
                selectedMemberId
                  ? 'bg-[#2a2a2a] text-[#F7F5F2] hover:bg-[#3d3d3d]'
                  : 'bg-[#E8E6E3] text-[#c5c5c5] cursor-not-allowed'
              }`}
              style={{ 
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                letterSpacing: '0.03em'
              }}
            >
              Assign
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
