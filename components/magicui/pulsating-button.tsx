import React from "react";
import { cn } from "@/lib/utils";

interface PulsatingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  pulseColor?: string;
}

export const PulsatingButton: React.FC<PulsatingButtonProps> = ({
  children,
  className,
  pulseColor = "#10b981",
  ...props
}) => {
  return (
    <button
      className={cn(
        "relative inline-flex h-12 items-center justify-center rounded-lg bg-emerald-500 px-6 font-medium text-white transition-colors hover:bg-emerald-600",
        className
      )}
      style={
        {
          "--pulse-color": pulseColor,
        } as React.CSSProperties
      }
      {...props}
    >
      <div className="relative z-10">{children}</div>
      <div className="absolute inset-0 rounded-lg bg-emerald-400 animate-ping"></div>
      <div className="absolute inset-0 rounded-lg bg-emerald-400 animate-pulse"></div>
    </button>
  );
}; 