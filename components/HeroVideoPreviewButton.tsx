"use client";

import { useEffect, useState } from "react";
import { RippleButton } from "@/components/magicui/ripple-button";
import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";

export default function HeroVideoPreviewButton() {
  const [show, setShow] = useState(true);
  const [open, setOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  // Observe hero section visibility
  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShow(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // listen for pageTransition custom event
  useEffect(() => {
    const handler = () => setTransitioning(true);
    window.addEventListener("pageTransition", handler);
    return () => window.removeEventListener("pageTransition", handler);
  }, []);

  return (
    <>
      {/* Button */}
      <AnimatePresence>
        {show && !open && !transitioning && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 inset-x-0 z-50 flex justify-center"
          >
            <RippleButton
              onClick={() => setOpen(true)}
              rippleColor="#ffffff"
              className="backdrop-filter-[12px] inline-flex h-7 items-center rounded-full border border-white/10 bg-black/40 px-3 text-xs text-white hover:bg-black/60"
            >
              Preview the Ballers App video
            </RippleButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
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