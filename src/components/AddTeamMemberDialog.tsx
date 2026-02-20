import { useState } from 'react';
import { X } from 'lucide-react';
import { CustomDropdown } from './CustomDropdown';

interface AddTeamMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, email: string, role: 'Admin' | 'Designer' | 'Reviewer' | 'Viewer') => void;
}

export function AddTeamMemberDialog({ isOpen, onClose, onAdd }: AddTeamMemberDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Admin' | 'Designer' | 'Reviewer' | 'Viewer'>('Designer');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (name && email) {
      onAdd(name, email, role);
      setName('');
      setEmail('');
      setRole('Designer');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#2a2a2a]/20 backdrop-blur-sm z-40 transition-opacity duration-500"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-[#F7F5F2] rounded-sm w-full max-w-md"
          style={{
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-8 pb-6">
            <h2
              className="text-[24px] text-[#2a2a2a]"
              style={{ 
                fontFamily: "'Playfair Display', serif",
                fontWeight: 300,
                letterSpacing: '-0.01em'
              }}
            >
              Add team member
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-[#9a9a9a] hover:text-[#2a2a2a] transition-colors duration-300"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Content */}
          <div className="px-8 pb-8 space-y-6">
            {/* Name */}
            <div>
              <label 
                className="block text-[11px] text-[#9a9a9a] mb-2 uppercase tracking-widest"
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: '0.1em'
                }}
              >
                Team member name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-0 py-3 text-[15px] text-[#2a2a2a] placeholder:text-[#c5c5c5] bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] focus:outline-none transition-colors duration-300"
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label 
                className="block text-[11px] text-[#9a9a9a] mb-2 uppercase tracking-widest"
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: '0.1em'
                }}
              >
                Team member email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-0 py-3 text-[15px] text-[#2a2a2a] placeholder:text-[#c5c5c5] bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] focus:outline-none transition-colors duration-300"
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300
                }}
              />
            </div>

            {/* Role */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label 
                  className="text-[11px] text-[#9a9a9a] uppercase tracking-widest"
                  style={{ 
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    letterSpacing: '0.1em'
                  }}
                >
                  Role
                </label>
              </div>
              <CustomDropdown
                value={role}
                onChange={(value) => setRole(value as 'Admin' | 'Designer' | 'Reviewer' | 'Viewer')}
                options={[
                  { value: 'Admin', label: 'Admin' },
                  { value: 'Designer', label: 'Designer' },
                  { value: 'Reviewer', label: 'Reviewer' },
                  { value: 'Viewer', label: 'Viewer' }
                ]}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 text-[13px] text-[#626262] hover:text-[#2a2a2a] border border-[#E8E6E3] hover:border-[#2a2a2a] transition-colors duration-300"
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: '0.03em'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-[#2a2a2a] text-[#F7F5F2] text-[13px] hover:bg-[#3d3d3d] transition-colors duration-300"
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: '0.03em'
                }}
              >
                Add member
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}