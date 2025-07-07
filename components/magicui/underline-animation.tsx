import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface UnderlineAnimationProps {
  className?: string;
  duration?: number;
}

export default function UnderlineAnimation({ className = "", duration = 1 }: UnderlineAnimationProps) {
  return (
    <motion.span
      aria-hidden="true"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration, ease: "easeInOut" }}
      style={{ transformOrigin: "left center" }}
      className={cn(
        "absolute left-0 bottom-0 h-[2px] bg-gradient-to-r from-green-400 to-cyan-500",
        className
      )}
    />
  );
} 