import React from 'react';

interface MainLayoutProps {
  /** Renders in the top row; height is deduced from viewport for the body. Omit or null when no header. */
  header?: React.ReactNode | null;
  /** Optional expandable sidebar (e.g. left nav). When present, main content gets left offset. */
  sidebar?: React.ReactNode;
  /** Whether the sidebar is expanded (used to compute main content left offset). */
  sidebarExpanded?: boolean;
  /** Main content: padding applied here; fills remaining height and scrolls when content overflows. */
  children: React.ReactNode;
}

const SIDEBAR_WIDTH_COLLAPSED = 73;  // w-[73px] = 4.5625rem = 73px
const SIDEBAR_WIDTH_EXPANDED = 192;   // w-48 = 12rem = 192px

export function MainLayout({
  header = null,
  sidebar,
  sidebarExpanded = false,
  children,
}: MainLayoutProps) {
  const sidebarWidth = sidebar
    ? (sidebarExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED)
    : 0;

  return (
    <div
      className="flex flex-col h-screen overflow-hidden bg-background"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Row 1: Header – fixed height; remaining viewport height is for the body */}
      {header != null && <div className="flex-shrink-0">{header}</div>}

      {/* Row 2: Body – takes remaining height, overflow hidden; inner 2 columns: sidebar + main */}
      <div className="flex-1 min-h-0 overflow-hidden relative flex">
        {/* Column 1: Expandable sidebar (fixed so it stays in place; layout reserves space via main left offset) */}
        {sidebar != null && sidebar}

        {/* Column 2: Main content – padding, fills remaining height, overflow-y only when content overflows */}
        <div
          className="flex-1 min-w-0 min-h-0 overflow-y-auto transition-[margin] duration-500 ease-out md:p-8 p-4"
          style={{ marginLeft: sidebarWidth }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
