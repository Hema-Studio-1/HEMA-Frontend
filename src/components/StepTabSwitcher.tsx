interface StepTabSwitcherProps {
  activeTab: 'controls' | 'chat';
  onTabChange: (tab: 'controls' | 'chat') => void;
}

export function StepTabSwitcher({ activeTab, onTabChange }: StepTabSwitcherProps) {
  return (
    <div className="flex items-center gap-8 mb-8 border-b border-[#E8E6E3]/50">
      <button
        onClick={() => onTabChange('controls')}
        className="relative pb-3 text-[12px] uppercase tracking-widest transition-colors duration-300"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: activeTab === 'controls' ? 400 : 300,
          letterSpacing: '0.12em',
          color: activeTab === 'controls' ? '#2a2a2a' : '#9a9a9a'
        }}
      >
        Controls
        {activeTab === 'controls' && (
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#2a2a2a]" />
        )}
      </button>
      <button
        onClick={() => onTabChange('chat')}
        className="relative pb-3 text-[12px] uppercase tracking-widest transition-colors duration-300"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: activeTab === 'chat' ? 400 : 300,
          letterSpacing: '0.12em',
          color: activeTab === 'chat' ? '#2a2a2a' : '#9a9a9a'
        }}
      >
        Chat
        {activeTab === 'chat' && (
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#2a2a2a]" />
        )}
      </button>
    </div>
  );
}
