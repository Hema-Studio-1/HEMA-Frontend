"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthFailure } from "@/contexts/AuthFailureContext";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export function AuthFailureDialog() {
  const { failure, closeAuthFailure } = useAuthFailure();
  const [showRaw, setShowRaw] = useState(false);

  return (
    <Dialog
      open={failure != null}
      onOpenChange={(open) => {
        if (!open) closeAuthFailure();
      }}
    >
      <DialogContent className="z-1002 max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{failure?.title ?? "Authentication issue"}</DialogTitle>
          <DialogDescription className="text-left text-foreground/90 whitespace-pre-wrap">
            {failure?.message}
          </DialogDescription>
        </DialogHeader>

        {failure?.isLoading ? (
          <div className="flex items-center gap-2 rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">
            <Loader2 size={16} className="animate-spin" />
            <span>Diagnosing the failure...</span>
          </div>
        ) : null}

        {failure?.detail ? (
          <div className="rounded-md border bg-muted/40 p-3 text-sm whitespace-pre-wrap text-muted-foreground">
            {failure.detail}
          </div>
        ) : null}

        {failure?.diagnostics ? (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setShowRaw((s) => !s)}
              className="text-sm text-foreground underline-offset-4 hover:underline"
            >
              {showRaw ? "Hide" : "Show"} technical summary
            </button>
            {showRaw ? (
              <pre className="max-h-40 overflow-auto rounded-md border bg-muted/30 p-2 text-xs">
                {JSON.stringify(failure.diagnostics, null, 2)}
              </pre>
            ) : null}
          </div>
        ) : null}

        <DialogFooter>
          <button
            type="button"
            onClick={closeAuthFailure}
            disabled={Boolean(failure?.isLoading)}
            className="inline-flex h-9 items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-[#3d3d3d]"
          >
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
