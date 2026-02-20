import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CustomDropdown } from './CustomDropdown';

interface Notification {
  id: string;
  type: 'task' | 'space' | 'team' | 'comment';
  primaryText: string;
  secondaryText: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'task',
    primaryText: 'Task assigned to you',
    secondaryText: 'Review living room design · Modern Minimal Living Room',
    timestamp: '2 hours ago',
    isRead: false
  },
  {
    id: '2',
    type: 'space',
    primaryText: 'Space generation completed',
    secondaryText: 'Your Japandi Bedroom is ready to view',
    timestamp: '5 hours ago',
    isRead: false
  },
  {
    id: '3',
    type: 'team',
    primaryText: 'New team member added',
    secondaryText: 'Emma Wilson joined as Reviewer',
    timestamp: '1 day ago',
    isRead: true
  },
  {
    id: '4',
    type: 'comment',
    primaryText: 'Review requested',
    secondaryText: 'Sarah Chen requested feedback on Minimalist Kitchen',
    timestamp: '1 day ago',
    isRead: true
  },
  {
    id: '5',
    type: 'task',
    primaryText: 'Task status updated',
    secondaryText: 'Update material palette marked as completed',
    timestamp: '2 days ago',
    isRead: true
  },
  {
    id: '6',
    type: 'space',
    primaryText: 'Space updated',
    secondaryText: 'Modern Loft was modified by Michael Torres',
    timestamp: '3 days ago',
    isRead: true
  },
  {
    id: '7',
    type: 'team',
    primaryText: 'Role changed',
    secondaryText: 'Your role was updated to Designer',
    timestamp: '1 week ago',
    isRead: true
  }
];

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<string>('all');

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'tasks') return notification.type === 'task';
    if (filter === 'spaces') return notification.type === 'space';
    if (filter === 'team') return notification.type === 'team' || notification.type === 'comment';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
    // In a real app, this would navigate to the relevant page
  };

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 
              className="text-3xl lg:text-4xl leading-[1.1] mb-3 tracking-tight text-[#2a2a2a]"
            >
              Notifications
            </h1>
            <p 
              className="text-[#9a9a9a] leading-relaxed"
            >
              All updates, assignments, and activity across your spaces
            </p>
          </div>

          {/* Filters & Controls */}
          <div className="flex items-center gap-3">
            <CustomDropdown
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'all', label: 'All' },
                { value: 'tasks', label: 'Tasks' },
                { value: 'spaces', label: 'Spaces' },
                { value: 'team', label: 'Team' }
              ]}
              className="min-w-[120px]"
              variant="filter"
            />
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[13px] text-[#626262] hover:text-[#2a2a2a] transition-colors duration-300"
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: '0.03em'
                }}
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-0">
          {filteredNotifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => handleNotificationClick(notification.id)}
              className={`w-full text-left py-6 border-b border-[#E8E6E3] transition-colors duration-300 ${
                notification.isRead 
                  ? 'hover:bg-[#E8E6E3]/20' 
                  : 'bg-[#EFEDE9]/30 hover:bg-[#EFEDE9]/50'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Status Dot */}
                <div className="pt-2">
                  {!notification.isRead && (
                    <span className="block w-1.5 h-1.5 rounded-full bg-[#A4AC96]" />
                  )}
                  {notification.isRead && (
                    <span className="block w-1.5 h-1.5" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p 
                    className={`text-[15px] mb-1 ${
                      notification.isRead ? 'text-[#626262]' : 'text-[#2a2a2a]'
                    }`}
                    style={{ 
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: notification.isRead ? 300 : 400
                    }}
                  >
                    {notification.primaryText}
                  </p>
                  <p 
                    className="text-[13px] text-[#9a9a9a]"
                    style={{ 
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                      lineHeight: '1.6'
                    }}
                  >
                    {notification.secondaryText}
                  </p>
                </div>

                {/* Timestamp */}
                <div className="flex-shrink-0 pt-1">
                  <p 
                    className="text-[12px] text-[#9a9a9a]"
                    style={{ 
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300
                    }}
                  >
                    {notification.timestamp}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-24">
          <p 
            className="text-[20px] text-[#2a2a2a] mb-2"
            style={{ 
              fontFamily: "'Playfair Display', serif",
              fontWeight: 300,
              letterSpacing: '-0.01em'
            }}
          >
            You're all caught up
          </p>
          <p 
            className="text-[14px] text-[#9a9a9a] text-center max-w-md"
            style={{ 
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              lineHeight: '1.7'
            }}
          >
            New updates will appear here as your team works on spaces
          </p>
        </div>
      )}
    </div>
  );
}
