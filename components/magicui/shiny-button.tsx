"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ShinyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function ShinyButton({ children, className, ...props }: ShinyButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      {...(props as any)}
      className={cn(
        "group relative inline-flex h-7 items-center rounded-full border border-white/10 bg-black/40 px-3 text-xs text-white overflow-hidden focus:outline-none",
        className
      )}
    >
      {children}
      {/* shine overlay */}
      <motion.span
        variants={{
          rest: { x: "-100%", opacity: 0 },
          hover: { x: "150%", opacity: 0.6, transition: { duration: 0.8, ease: "easeOut" } },
        }}
        className="pointer-events-none absolute inset-0 w-1/3 bg-white/40 blur-sm"
      />
    </motion.button>
  );
}

export default ShinyButton; 