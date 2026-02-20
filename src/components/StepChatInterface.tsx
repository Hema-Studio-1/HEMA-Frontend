import { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

interface StepChatInterfaceProps {
  stepTitle: string;
  messages: Message[];
  currentMessage: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

export function StepChatInterface({ 
  stepTitle, 
  messages, 
  currentMessage, 
  onMessageChange, 
  onSendMessage 
}: StepChatInterfaceProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[550px]">
      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto mb-6 pr-2" 
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#E8E6E3 transparent' }}
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p 
              className="text-[13px] text-[#c5c5c5] text-center"
              style={{ 
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                lineHeight: '1.6'
              }}
            >
              Start a conversation about {stepTitle}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id} className="space-y-1">
                <div 
                  className="text-[13px] text-[#2a2a2a]"
                  style={{ 
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300,
                    lineHeight: '1.6'
                  }}
                >
                  {message.text}
                </div>
                <div 
                  className="text-[10px] text-[#c5c5c5]"
                  style={{ 
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300
                  }}
                >
                  {message.timestamp}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-[#E8E6E3]/50 pt-6">
        <div className="flex items-end gap-3">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
            placeholder="Add context or feedback for this step…"
            className="flex-1 px-0 py-2 text-[13px] text-[#2a2a2a] placeholder:text-[#c5c5c5] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500"
            style={{ 
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300
            }}
          />
          <button
            onClick={onSendMessage}
            disabled={!currentMessage.trim()}
            className="p-2 text-[#9a9a9a] hover:text-[#626262] transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
