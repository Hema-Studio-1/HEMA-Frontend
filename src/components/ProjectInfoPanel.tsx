import { X, Edit2, UserPlus, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface ProjectSpace {
  id: string;
  name: string;
  type: string;
  lastUpdated: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  assignedSpaces?: number;
}

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  space: string;
  timestamp: string;
}

interface ProjectData {
  id: string;
  name: string;
  description?: string;
  spacesCount: number;
  spaces: ProjectSpace[];
  status: 'Draft' | 'In Progress' | 'Final';
  createdDate: string;
  lastUpdated: string;
  teamMembers: TeamMember[];
  recentActivity: ActivityItem[];
}

interface ProjectInfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData | null;
  onSpaceClick?: (spaceId: string) => void;
  onRename?: () => void;
  onAssignMember?: () => void;
}

export function ProjectInfoPanel({ 
  isOpen, 
  onClose, 
  project,
  onSpaceClick,
  onRename,
  onAssignMember
}: ProjectInfoPanelProps) {
  if (!project) return null;

  const statusColors = {
    'Draft': 'bg-[#E8E6E3] text-[#626262]',
    'In Progress': 'bg-[#A4AC96]/10 text-[#626262] border border-[#A4AC96]/20',
    'Final': 'bg-[#8a9280]/10 text-[#2a2a2a] border border-[#8a9280]/30'
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#2a2a2a]/10 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-[460px] bg-[#F7F5F2] z-50 transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          borderLeft: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: isOpen ? '-4px 0 24px rgba(0, 0, 0, 0.04)' : 'none'
        }}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-8 py-6 border-b border-[#E8E6E3]">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 
                className="text-[24px] text-[#2a2a2a] mb-1"
                style={{ 
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 300,
                  letterSpacing: '-0.01em'
                }}
              >
                {project.name}
              </h2>
              <p 
                className="text-[12px] text-[#9a9a9a]"
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  lineHeight: '1.6'
                }}
              >
                Created {project.createdDate} · Updated {project.lastUpdated}
              </p>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onRename}
              className="p-2 hover:bg-[#E8E6E3] rounded-sm transition-colors duration-300"
              title="Rename"
            >
              <Edit2 size={14} className="text-[#626262]" strokeWidth={1.5} />
            </button>
            <button
              onClick={onAssignMember}
              className="p-2 hover:bg-[#E8E6E3] rounded-sm transition-colors duration-300"
              title="Assign team member"
            >
              <UserPlus size={14} className="text-[#626262]" strokeWidth={1.5} />
            </button>
            <div className="flex-1" />
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full hover:bg-[#E8E6E3] flex items-center justify-center transition-colors duration-300"
            >
              <X size={16} className="text-[#626262]" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="space-y-8">
            {/* Project Overview */}
            <div>
              <label 
                className="block text-[11px] text-[#9a9a9a] mb-2 uppercase tracking-wider"
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: '0.08em'
                }}
              >
                Overview
              </label>
              <p 
                className="text-[14px] text-[#2a2a2a] mb-4"
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  lineHeight: '1.7'
                }}
              >
                {project.description || 'No description provided'}
              </p>
              
              <div className="flex items-center gap-4">
                <div>
                  <span
                    className="text-[13px] text-[#9a9a9a]"
                    style={{ 
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300
                    }}
                  >
                    {project.spacesCount} {project.spacesCount === 1 ? 'Space' : 'Spaces'}
                  </span>
                </div>
                <span className="text-[#E8E6E3]">·</span>
                <span
                  className={`inline-block px-2 py-1 rounded-sm text-[11px] ${statusColors[project.status]}`}
                  style={{ 
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400
                  }}
                >
                  {project.status}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#E8E6E3]" />

            {/* Spaces Section */}
            <div>
              <label 
                className="block text-[11px] text-[#9a9a9a] mb-4 uppercase tracking-wider"
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: '0.08em'
                }}
              >
                Spaces
              </label>
              
              <div className="space-y-2">
                {project.spaces.map((space) => (
                  <button
                    key={space.id}
                    onClick={() => onSpaceClick?.(space.id)}
                    className="w-full flex items-center justify-between p-3 hover:bg-[#EFEDE9] rounded-sm transition-colors duration-300 group"
                  >
                    <div className="flex-1 text-left">
                      <p 
                        className="text-[14px] text-[#2a2a2a] mb-0.5"
                        style={{ 
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 400
                        }}
                      >
                        {space.name}
                      </p>
                      <p 
                        className="text-[11px] text-[#9a9a9a]"
                        style={{ 
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 300
                        }}
                      >
                        {space.type} · Updated {space.lastUpdated}
                      </p>
                    </div>
                    <ChevronRight 
                      size={14} 
                      className="text-[#c5c5c5] group-hover:text-[#626262] transition-colors duration-300" 
                      strokeWidth={1.5} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#E8E6E3]" />

            {/* Team Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label 
                  className="block text-[11px] text-[#9a9a9a] uppercase tracking-wider"
                  style={{ 
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    letterSpacing: '0.08em'
                  }}
                >
                  Team
                </label>
                <button
                  onClick={onAssignMember}
                  className="text-[11px] text-[#626262] hover:text-[#2a2a2a] transition-colors duration-300"
                  style={{ 
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300,
                    letterSpacing: '0.02em'
                  }}
                >
                  Assign member
                </button>
              </div>
              
              <div className="space-y-3">
                {project.teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    {/* Avatar */}
                    <div 
                      className="w-8 h-8 rounded-full bg-[#E8E6E3] flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: member.avatar || '#E8E6E3'
                      }}
                    >
                      <span
                        className="text-[12px] text-[#626262]"
                        style={{ 
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 400
                        }}
                      >
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1">
                      <p 
                        className="text-[13px] text-[#2a2a2a]"
                        style={{ 
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 400
                        }}
                      >
                        {member.name}
                      </p>
                      <p 
                        className="text-[11px] text-[#9a9a9a]"
                        style={{ 
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 300
                        }}
                      >
                        {member.role}
                        {member.assignedSpaces && member.assignedSpaces > 0 && (
                          <> · {member.assignedSpaces} {member.assignedSpaces === 1 ? 'space' : 'spaces'}</>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#E8E6E3]" />

            {/* Recent Activity */}
            <div>
              <label 
                className="block text-[11px] text-[#9a9a9a] mb-4 uppercase tracking-wider"
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: '0.08em'
                }}
              >
                Recent Activity
              </label>
              
              <div className="space-y-3">
                {project.recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="text-[13px] text-[#626262]">
                    <p 
                      style={{ 
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 300,
                        lineHeight: '1.6'
                      }}
                    >
                      <span className="text-[#2a2a2a]" style={{ fontWeight: 400 }}>
                        {activity.user}
                      </span>
                      {' '}{activity.action}{' '}
                      <span className="text-[#2a2a2a]" style={{ fontWeight: 400 }}>
                        {activity.space}
                      </span>
                    </p>
                    <p 
                      className="text-[11px] text-[#9a9a9a] mt-0.5"
                      style={{ 
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 300
                      }}
                    >
                      {activity.timestamp}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div 
          className="flex-shrink-0 px-8 py-5 border-t border-[#E8E6E3]"
          style={{ backgroundColor: '#FDFCFB' }}
        >
          <p 
            className="text-[12px] text-[#9a9a9a]"
            style={{ 
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              lineHeight: '1.6'
            }}
          >
            Click any space to view details or start editing.
          </p>
        </div>
      </div>
    </>
  );
}
