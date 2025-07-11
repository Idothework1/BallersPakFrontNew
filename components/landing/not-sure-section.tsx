"use client";

import { PulsatingButton } from "@/components/magicui/pulsating-button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NotSureSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

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

      <section id="apply" className="mx-auto max-w-[80rem] px-6 md:px-8 py-20 text-center">
        <h3 className="text-2xl font-semibold text-white mb-6">
          Not Sure Which Track Is Best for You?
        </h3>
        <PulsatingButton
          onClick={handleApplyClick}
          disabled={isLoading}
          className="shadow-lg shadow-green-500/20"
        >
          {isLoading ? "Submitting..." : "Apply First"}
        </PulsatingButton>
        <p className="text-gray-400 text-sm mt-4 max-w-md mx-auto">
          We&apos;ll review your goals and recommend the right path.
        </p>
      </section>
    </>
  );
} 