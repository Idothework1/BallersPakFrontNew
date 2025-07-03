"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface FadeInOverlayProps {
  duration?: number; // milliseconds
}

export function FadeInOverlay({ duration = 800 }: FadeInOverlayProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black transition-opacity pointer-events-none",
        visible ? "opacity-100" : "opacity-0",
        // Tailwind duration class dynamically based on duration
        // fallback to style if not matching default durations
      )}
      style={{ transitionDuration: `${duration}ms` }}
    />
  );
}

export default FadeInOverlay; 