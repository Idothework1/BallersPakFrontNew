"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon } from "lucide-react";

export default function HeroVideoAutoPlay() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <video
        src="/Video.mp4"
        autoPlay
        muted
        loop
        playsInline
        onClick={() => setOpen(true)}
        className="relative z-60 w-full h-full cursor-pointer rounded-[inherit] border object-cover"
      />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl aspect-video"
            >
              <video
                src="/Video.mp4"
                controls
                autoPlay
                className="h-full w-full rounded-lg object-contain"
              />
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