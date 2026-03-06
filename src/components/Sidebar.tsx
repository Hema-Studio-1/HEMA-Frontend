import { useState } from 'react';
import { Plus, FolderOpen, Layers, Grid3x3, Users, Settings, LogOut } from 'lucide-react';
import React from 'react';

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  currentView: 'home' | 'projects' | 'assets' | 'settings' | 'moodboard' | 'team';
  onNavigate: (view: 'home' | 'projects' | 'assets' | 'settings' | 'moodboard' | 'team') => void;
}

export function Sidebar({ isExpanded, onToggle, currentView, onNavigate }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const mainMenuItems = [
    { icon: Plus, label: 'Create', view: 'home' as const },
    { icon: FolderOpen, label: 'Projects', view: 'projects' as const },
    { icon: Layers, label: 'Assets', view: 'assets' as const },
    { icon: Grid3x3, label: 'Mood Board', view: 'moodboard' as const },
  ];

  const bottomMenuItems = [
    { icon: Users, label: 'Team', view: 'team' as const },
    { icon: Settings, label: 'Settings', view: 'settings' as const },
    { icon: LogOut, label: 'Logout', view: undefined },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 bottom-0 flex flex-col pt-24 pb-6 transition-all duration-500 ease-out z-40 ${
        isExpanded ? 'px-8 w-48' : 'px-4 w-[73px]'
      }`}
      style={{
        boxShadow: '4px 0 24px 0 #eeeeed',
      }}
    >
      {/* Clickable area to toggle */}
      <button
        onClick={onToggle}
        className="absolute inset-0 w-full h-full z-0 cursor-pointer"
        aria-label="Toggle sidebar"
      />

      {/* Main Menu */}
      <nav className="flex-1 space-y-4 relative z-10">
        {mainMenuItems.map((item) => (
          <div
            key={item.label}
            className="relative flex items-center"
            onMouseEnter={() => setHoveredItem(item.label)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <button 
              onClick={() => onNavigate(item.view)}
              className={`p-2 transition-opacity duration-300 pointer-events-auto cursor-pointer ${
                currentView === item.view 
                  ? 'opacity-100' 
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <item.icon size={20} className="text-[#626262]" strokeWidth={1.5} />
            </button>
            
            {/* Text - always visible when expanded; when collapsed, show as tooltip with background/border */}
            {isExpanded ? (
              <span
                className="ml-4 text-[13px] text-[#626262] whitespace-nowrap"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: currentView === item.view ? 400 : 300
                }}
              >
                {item.label}
              </span>
            ) : (
              <span
                className={`absolute left-[40px] text-[13px] text-[#626262] whitespace-nowrap px-3 py-1.5 rounded-md transition-all duration-300 border border-black/10 bg-background shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${
                  hoveredItem === item.label
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-2 pointer-events-none'
                }`}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: currentView === item.view ? 400 : 300
                }}
              >
                {item.label}
              </span>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom Menu */}
      <nav className="space-y-4 relative z-10">
        {bottomMenuItems.map((item) => (
          <div
            key={item.label}
            className="relative flex items-center"
            onMouseEnter={() => setHoveredItem(item.label)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <button 
              onClick={() => item.view && onNavigate(item.view)}
              className={`p-2 transition-opacity duration-300 pointer-events-auto cursor-pointer ${
                item.view && currentView === item.view
                  ? 'opacity-100'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <item.icon size={20} className="text-[#626262]" strokeWidth={1.5} />
            </button>
            
            {/* Text - always visible when expanded; when collapsed, show as tooltip with background/border */}
            {isExpanded ? (
              <span
                className="ml-4 text-[13px] text-[#626262] whitespace-nowrap"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: item.view && currentView === item.view ? 400 : 300
                }}
              >
                {item.label}
              </span>
            ) : (
              <span
                className={`absolute left-[40px] text-[13px] text-[#626262] whitespace-nowrap px-3 py-1.5 rounded-md transition-all duration-300 border border-black/10 bg-[#FDFCFB] shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${
                  hoveredItem === item.label
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-2 pointer-events-none'
                }`}
                style={{
                  fontWeight: item.view && currentView === item.view ? 400 : 300
                }}
              >
                {item.label}
              </span>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}