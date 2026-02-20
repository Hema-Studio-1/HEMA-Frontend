"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "./utils";

function Sheet({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-[#2a2a2a]/5 backdrop-blur-sm transition-opacity duration-500",
        className
      )}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = "right",
  hideCloseButton = false,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left";
  hideCloseButton?: boolean;
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        onInteractOutside={(e) => e.preventDefault()}
        className={cn(
          "fixed z-50 flex flex-col overflow-hidden bg-[#FDFCFB] transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
          side === "right" &&
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-full max-w-3xl border-l border-[#E8E6E3]",
          side === "left" &&
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-full max-w-3xl border-r border-[#E8E6E3]",
          side === "top" &&
            "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto max-h-[90vh] border-b border-[#E8E6E3]",
          side === "bottom" &&
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto max-h-[90vh] border-t border-[#E8E6E3]",
          className
        )}
        style={
          side === "right"
            ? { boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.04)" }
            : side === "left"
              ? { boxShadow: "4px 0 24px rgba(0, 0, 0, 0.04)" }
              : undefined
        }
        {...props}
      >
        {children}
        {!hideCloseButton && (
          <SheetPrimitive.Close
            className="absolute top-10 right-8 z-10 text-[#626262] opacity-100 transition-opacity duration-300 hover:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#2a2a2a]/20 focus:ring-offset-0 disabled:pointer-events-none"
            aria-label="Close"
          >
            <X size={20} strokeWidth={1.5} />
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn(
        "flex flex-shrink-0 flex-col border-b border-[#E8E6E3] bg-[#FDFCFB] p-8",
        className
      )}
      {...props}
    />
  );
}

/** Scrollable middle section for form content. Use between SheetHeader and SheetFooter. */
function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-body"
      className={cn(
        "flex-1 min-h-0 overflow-y-auto p-8",
        className
      )}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "flex flex-shrink-0 flex-col gap-3 border-t border-[#E8E6E3] bg-[#FDFCFB] px-12 py-6 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "text-[24px] text-[#2a2a2a] mb-1 tracking-tight",
        className
      )}
      style={{
        fontFamily: "'Playfair Display', serif",
        fontWeight: 300,
        letterSpacing: "-0.01em",
      }}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-[13px] text-[#9a9a9a]", className)}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 300,
        lineHeight: "1.7",
      }}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
