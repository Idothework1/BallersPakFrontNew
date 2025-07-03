import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface NumberTickerProps {
  value: number;
  duration?: number; // total animation duration in ms
  className?: string;
}

export function NumberTicker({ value, duration = 2000, className }: NumberTickerProps) {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCurrent(Math.floor(progress * value));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  return <span className={cn(className)}>{current}</span>;
} 