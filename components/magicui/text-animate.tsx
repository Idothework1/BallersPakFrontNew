import { cn } from "@/lib/utils";
import { useInView } from "framer-motion";
import { motion } from "framer-motion";
import { useRef } from "react";

interface TextAnimateProps {
  children: React.ReactNode;
  animation?: "blurInDown" | "blurInUp";
  once?: boolean;
  className?: string;
}

export function TextAnimate({
  children,
  animation = "blurInDown",
  once = true,
  className,
}: TextAnimateProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-100px" });

  const variants = {
    hidden: {
      opacity: 0,
      y: animation === "blurInDown" ? -20 : 20,
      filter: "blur(6px)",
    },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      variants={variants}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
} 