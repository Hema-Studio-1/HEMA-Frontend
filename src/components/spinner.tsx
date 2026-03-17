import React from 'react';

export const Spinner = () => {
  return (
    <div className="relative flex items-center justify-center">
        <div
          className="h-12 w-12 rounded-full border-2 border-foreground/15 border-t-foreground animate-spin"
          style={{ animationDuration: "0.9s" }}
        />
        <div
          className="absolute h-8 w-8 rounded-full border-2 border-transparent border-b-foreground/30 animate-spin"
          style={{ animationDuration: "1.4s", animationDirection: "reverse" }}
        />
      </div>
  );
};