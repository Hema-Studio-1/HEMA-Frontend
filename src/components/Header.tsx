import { useAuthFailure } from "@/contexts/AuthFailureContext";
import { useSessionAuthDisplay } from "@/contexts/SessionAuthDisplayContext";
import { Bell, Loader2, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface HeaderProps {
  onHomeClick: () => void;
  onNotificationsClick?: () => void;
}

export function Header({ onHomeClick, onNotificationsClick }: HeaderProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { status } = useSession();
  const { openAuthFailureWithDeploymentCheck } = useAuthFailure();
  const { authStabilizing } = useSessionAuthDisplay();

  const showNavLoading = status === "loading" || authStabilizing;

  const notifications = [
    {
      id: "1",
      type: "task",
      message: "Task assigned to you: Review living room design",
      time: "2 hours ago",
    },
    {
      id: "2",
      type: "space",
      message: "Space updated by Sarah Chen: Minimal Kitchen",
      time: "5 hours ago",
    },
    {
      id: "3",
      type: "mention",
      message: "You were mentioned in Modern Bedroom project",
      time: "1 day ago",
    },
  ];

  const handleViewAllClick = () => {
    setIsNotificationOpen(false);
    if (onNotificationsClick) {
      onNotificationsClick();
    }
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-[#eeeeed]">
      <div className="flex items-center justify-between md:px-8 px-4 py-3">
        {/* Logo - Clickable to expand sidebar */}
        <button
          type="button"
          onClick={onHomeClick}
          className="text-[14px] text-[#1a1a1a] tracking-wide hover:text-foreground transition-colors duration-300"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            letterSpacing: "0.05em",
          }}
        >
          Hema
        </button>

        {/* Right side - Notifications + User */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="w-8 h-8 rounded-full bg-transparent hover:bg-[#E8E6E3]/50 flex items-center justify-center transition-colors duration-300"
            >
              <Bell size={16} className="text-[#626262]" strokeWidth={1.5} />
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <>
                {/* Backdrop to close */}
                <button
                  type="button"
                  aria-label="Close notifications"
                  className="fixed inset-0 z-40"
                  onClick={() => setIsNotificationOpen(false)}
                />

                {/* Dropdown Panel */}
                <div
                  className="absolute right-0 top-12 w-80 bg-background rounded-sm z-50"
                  style={{
                    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
                    border: "1px solid rgba(0, 0, 0, 0.06)",
                  }}
                >
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-[#E8E6E3]">
                    <h3
                      className="text-[13px] text-foreground"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        letterSpacing: "0.03em",
                      }}
                    >
                      Notifications
                    </h3>
                  </div>

                  {/* Notification List */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="px-6 py-4 border-b border-[#E8E6E3] hover:bg-[#E8E6E3]/30 transition-colors duration-300 cursor-pointer"
                      >
                        <p
                          className="text-[13px] text-foreground mb-1"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 300,
                            lineHeight: "1.6",
                          }}
                        >
                          {notification.message}
                        </p>
                        <p
                          className="text-[11px] text-textSecondary"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 300,
                          }}
                        >
                          {notification.time}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 border-t border-[#E8E6E3]">
                    <button
                      type="button"
                      onClick={handleViewAllClick}
                      className="text-[12px] text-[#626262] hover:text-foreground transition-colors duration-300"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        letterSpacing: "0.03em",
                      }}
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Auth status indicator */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px]"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
            }}
          >
            {showNavLoading && (
              <>
                <Loader2 size={14} className="animate-spin text-[#626262]" />
                <span className="text-[#626262]">Connecting...</span>
              </>
            )}
            {!showNavLoading && status === "authenticated" && (
              <>
                <span
                  className="w-2 h-2 rounded-full bg-green-500 shrink-0"
                  title="Authenticated"
                />
                <span className="text-[#1a1a1a]">{"Demo User"}</span>
              </>
            )}
            {!showNavLoading && status === "unauthenticated" && (
              <>
                <span
                  className="w-2 h-2 rounded-full bg-red-500 shrink-0"
                  title="No active session"
                />
                <span className="text-red-600">Auth Failed</span>
                <button
                  type="button"
                  onClick={() =>
                    void openAuthFailureWithDeploymentCheck({
                      title: "Why connection failed",
                    })
                  }
                  className="ml-1 rounded-sm border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] text-red-800 hover:bg-red-100"
                >
                  Why?
                </button>
              </>
            )}
          </div>

          {/* User */}
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-transparent hover:bg-[#E8E6E3]/50 flex items-center justify-center transition-colors duration-300"
          >
            <User size={16} className="text-[#626262]" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
}
