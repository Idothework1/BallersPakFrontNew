"use client";

import { cn } from "@/lib/utils";
import { useState, MouseEvent } from "react";

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  rippleColor?: string;
}

export function RippleButton({ rippleColor = "rgba(255,255,255,0.5)", className, children, ...props }: RippleButtonProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; size: number; id: number }[]>([]);

  const addRipple = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, size, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  return (
    <button
      {...props}
      onClick={(e) => {
        addRipple(e);
        props.onClick?.(e);
      }}
      className={cn(
        "relative overflow-hidden rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none",
        className
      )}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          style={{
            top: r.y,
            left: r.x,
            width: r.size,
            height: r.size,
            backgroundColor: rippleColor,
          }}
          className="pointer-events-none absolute rounded-full opacity-75 animate-ping"
        />
      ))}
    </button>
  );
}

export default RippleButton; 