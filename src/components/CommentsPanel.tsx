import { useState, useRef, useEffect } from 'react';
import { X, Send, AtSign, UserPlus } from 'lucide-react';
import { CustomDropdown } from './CustomDropdown';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  text: string;
  timestamp: Date;
  assignedTo?: string;
  isAssigned: boolean;
}

interface CommentsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  spaceName: string;
}

const mockComments: Comment[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Sarah Chen',
    userRole: 'Designer',
    text: 'The lighting feels too warm for this style. Consider cooler temperature fixtures to balance the natural wood tones.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isAssigned: false
  },
  {
    id: '2',
    userId: '2',
    userName: 'Michael Torres',
    userRole: 'Project Lead',
    text: 'Can we explore more sustainable material options for the coffee table? Client mentioned environmental concerns.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    assignedTo: 'Sarah Chen',
    isAssigned: true
  },
  {
    id: '3',
    userId: '3',
    userName: 'Emma Wilson',
    userRole: 'Reviewer',
    text: 'Love the overall direction. The area rug ties everything together beautifully.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isAssigned: false
  },
  {
    id: '4',
    userId: '1',
    userName: 'Sarah Chen',
    userRole: 'Designer',
    text: 'Updated the material palette with eco-friendly alternatives. Please review the revised options.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isAssigned: false
  }
];

const teamMembers = [
  { value: 'sarah', label: 'Sarah Chen' },
  { value: 'michael', label: 'Michael Torres' },
  { value: 'emma', label: 'Emma Wilson' },
  { value: 'alex', label: 'Alex Kumar' }
];

export function CommentsPanel({ isOpen, onClose, spaceName }: CommentsPanelProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [showAssign, setShowAssign] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  };

  const handlePost = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      userRole: 'Designer',
      text: newComment,
      timestamp: new Date(),
      isAssigned: showAssign && selectedAssignee !== '',
      assignedTo: showAssign && selectedAssignee !== '' ? teamMembers.find(m => m.value === selectedAssignee)?.label : undefined
    };

    setComments([comment, ...comments]);
    setNewComment('');
    setShowAssign(false);
    setSelectedAssignee('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handlePost();
    }
  };

  const filteredComments = comments.filter(comment => {
    if (filter === 'all') return true;
    if (filter === 'assigned') return comment.isAssigned;
    if (filter === 'mentions') return false; // Would check for mentions
    return true;
  });

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

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
        className={`fixed top-0 right-0 h-full w-[420px] bg-[#EFEDE9] z-50 transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          borderLeft: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: isOpen ? '-4px 0 24px rgba(0, 0, 0, 0.04)' : 'none'
        }}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-8 py-6 border-b border-[#E8E6E3]">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 
                className="text-[20px] text-[#2a2a2a] mb-1"
                style={{ 
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 300,
                  letterSpacing: '-0.01em'
                }}
              >
                Comments
              </h2>
              <p 
                className="text-[13px] text-[#9a9a9a]"
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  lineHeight: '1.6'
                }}
              >
                Feedback for {spaceName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full hover:bg-[#E8E6E3] flex items-center justify-center transition-colors duration-300"
            >
              <X size={16} className="text-[#626262]" strokeWidth={1.5} />
            </button>
          </div>

          {/* Filter */}
          <div className="mt-4">
            <CustomDropdown
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'all', label: 'All' },
                { value: 'assigned', label: 'Assigned' },
                { value: 'mentions', label: 'Mentions' }
              ]}
              className="w-full"
              variant="filter"
            />
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {filteredComments.length > 0 ? (
            <div className="space-y-6">
              {filteredComments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  {/* Avatar */}
                  <div 
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-[#A4AC96]/20 flex items-center justify-center"
                  >
                    <span 
                      className="text-[10px] text-[#626262]"
                      style={{ 
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 500
                      }}
                    >
                      {getInitials(comment.userName)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className="text-[13px] text-[#2a2a2a]"
                        style={{ 
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 400
                        }}
                      >
                        {comment.userName}
                      </span>
                      <span 
                        className="text-[11px] text-[#9a9a9a]"
                        style={{ 
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 300
                        }}
                      >
                        {comment.userRole}
                      </span>
                      <span 
                        className="text-[11px] text-[#9a9a9a]"
                        style={{ 
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 300
                        }}
                      >
                        · {getRelativeTime(comment.timestamp)}
                      </span>
                    </div>
                    
                    <p 
                      className="text-[14px] text-[#2a2a2a] mb-2"
                      style={{ 
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 300,
                        lineHeight: '1.6'
                      }}
                    >
                      {comment.text}
                    </p>

                    {comment.isAssigned && comment.assignedTo && (
                      <div 
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-[#A4AC96]/10"
                        style={{ border: '1px solid rgba(164, 172, 150, 0.2)' }}
                      >
                        <UserPlus size={11} className="text-[#626262]" strokeWidth={1.5} />
                        <span 
                          className="text-[11px] text-[#626262]"
                          style={{ 
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400
                          }}
                        >
                          Assigned to {comment.assignedTo}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p 
                className="text-[14px] text-[#9a9a9a]"
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  lineHeight: '1.6'
                }}
              >
                No comments yet. Be the first to add feedback.
              </p>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div 
          className="flex-shrink-0 px-8 py-6 border-t border-[#E8E6E3]"
          style={{ backgroundColor: '#F7F5F2' }}
        >
          {/* Assign Options */}
          {showAssign && (
            <div className="mb-3">
              <CustomDropdown
                value={selectedAssignee}
                onChange={setSelectedAssignee}
                options={teamMembers}
                placeholder="Select team member"
                className="w-full"
                variant="filter"
              />
            </div>
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add feedback or suggestion…"
            className="w-full px-4 py-3 bg-white rounded-sm text-[14px] text-[#2a2a2a] placeholder:text-[#9a9a9a] resize-none focus:outline-none focus:ring-1 focus:ring-[#A4AC96]/30"
            style={{ 
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              lineHeight: '1.6',
              minHeight: '80px',
              border: '1px solid #E8E6E3'
            }}
          />

          {/* Controls */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAssign(!showAssign)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm transition-colors duration-300 ${
                  showAssign 
                    ? 'bg-[#A4AC96]/10 text-[#2a2a2a]' 
                    : 'hover:bg-[#E8E6E3] text-[#626262]'
                }`}
                style={{ border: showAssign ? '1px solid rgba(164, 172, 150, 0.2)' : '1px solid transparent' }}
              >
                <UserPlus size={14} strokeWidth={1.5} />
                <span 
                  className="text-[12px]"
                  style={{ 
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400
                  }}
                >
                  Assign
                </span>
              </button>
            </div>

            <button
              onClick={handlePost}
              disabled={!newComment.trim()}
              className={`px-4 py-1.5 rounded-sm transition-colors duration-300 ${
                newComment.trim()
                  ? 'bg-[#A4AC96] text-white hover:bg-[#8a9280]'
                  : 'bg-[#E8E6E3] text-[#9a9a9a] cursor-not-allowed'
              }`}
            >
              <span 
                className="text-[13px]"
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: '0.03em'
                }}
              >
                Post
              </span>
            </button>
          </div>

          {/* Hint */}
          <p 
            className="text-[11px] text-[#9a9a9a] mt-2"
            style={{ 
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300
            }}
          >
            ⌘ + Enter to post
          </p>
        </div>
      </div>
    </>
  );
}
