"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";
import { ReactNode, useState } from "react";
import Image from "next/image";

interface HeroVideoDialogProps {
  className?: string;
  videoSrc: string; // YouTube embed url
  thumbnailSrc: string;
  thumbnailAlt?: string;
  animationStyle?: "from-center" | "from-bottom";
}

export default function HeroVideoDialog({
  className,
  videoSrc,
  thumbnailSrc,
  thumbnailAlt,
  animationStyle = "from-center",
}: HeroVideoDialogProps) {
  const [open, setOpen] = useState(false);

  const variants = {
    initial: {
      opacity: 0,
      scale: animationStyle === "from-center" ? 0.75 : 1,
      y: animationStyle === "from-bottom" ? 100 : 0,
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { ease: "easeOut", duration: 0.35 },
    },
    exit: {
      opacity: 0,
      scale: animationStyle === "from-center" ? 0.75 : 1,
      y: animationStyle === "from-bottom" ? 100 : 0,
      transition: { ease: "easeIn", duration: 0.25 },
    },
  };

  return (
    <>
      {/* Thumbnail */}
      <Image
        src={thumbnailSrc}
        alt={thumbnailAlt || "thumbnail"}
        width={400}
        height={225}
        className={cn("cursor-pointer rounded-[inherit] border object-contain w-full h-auto", className)}
        onClick={() => setOpen(true)}
      />

      {/* Dialog*/}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl aspect-video"
            >
              {/* Determine if src is local file or YouTube embed */}
              {/^https?:/.test(videoSrc) && !videoSrc.endsWith(".mp4") ? (
                <iframe
                  src={videoSrc}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full rounded-lg border"
                />
              ) : (
                <video
                  src={videoSrc}
                  controls
                  autoPlay
                  className="h-full w-full rounded-lg border bg-black"
                />
              )}
              <button
                className="absolute -right-3 -top-3 rounded-full bg-white p-1 text-black shadow"
                onClick={() => setOpen(false)}
              >
                <XIcon className="h-4 w-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 