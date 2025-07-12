"use client";

import { PulsatingButton } from "@/components/magicui/pulsating-button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function NotSureSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const handleApplyClick = () => {
    setIsLoading(true);
    setIsTransitioning(true);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("pageTransition"));
    }

    // After fade to black completes, navigate to signup
    setTimeout(() => {
      router.push("/signup");
    }, 1000); // match CSS duration
  };

  return (
    <>
      {/* Fade to black overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black transition-opacity duration-1000 pointer-events-none",
          isTransitioning ? "opacity-100" : "opacity-0"
        )}
      />

      <section 
        id="apply" 
        className="mx-auto max-w-[80rem] px-6 md:px-8 py-20" 
        ref={ref}
      >
        <div className="relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-800/5 rounded-3xl"></div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative text-center max-w-4xl mx-auto"
          >
            {/* Thinking emoji with animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={inView ? { scale: 1, rotate: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl mb-8"
            >
              🤔
            </motion.div>

            {/* Main heading */}
            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
            >
              Not Sure Which Track Is{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Best for You?
              </span>
            </motion.h3>

            {/* Subheading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <div className="inline-block bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full px-6 py-3">
                <p className="text-lg md:text-xl font-semibold text-blue-300">
                  No worries! We&apos;ve got you covered
                </p>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Tell us about your goals, experience, and football dreams. Our expert coaches will 
              analyze your profile and recommend the perfect training path for your journey to pro.
            </motion.p>

            {/* Features grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
            >
              {[
                {
                  icon: "📋",
                  title: "Quick Application",
                  desc: "Simple 3-minute form"
                },
                {
                  icon: "⚡",
                  title: "Fast Response",
                  desc: "Get recommendations in 24-48h"
                },
                {
                  icon: "🎯",
                  title: "Perfect Match",
                  desc: "Personalized track selection"
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 hover:bg-gray-700/40 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h4 className="text-white font-semibold mb-2">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-6"
            >
              <PulsatingButton
                onClick={handleApplyClick}
                disabled={isLoading}
                className="shadow-lg shadow-blue-500/25 text-lg px-8 py-4"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>🚀</span>
                    Apply First
                  </span>
                )}
              </PulsatingButton>
            </motion.div>

            {/* Bottom note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="text-gray-400 text-sm max-w-md mx-auto"
            >
              <span className="text-green-400 font-medium">100% Free</span> • No commitment required • 
              We&apos;ll review your goals and recommend the right path for your football journey
            </motion.p>
          </motion.div>
        </div>
      </section>
    </>
  );
} 