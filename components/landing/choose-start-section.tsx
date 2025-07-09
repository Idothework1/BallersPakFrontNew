"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShineBorder } from "@/components/magicui/shine-border";
import { CheckIcon } from "@radix-ui/react-icons";

export default function ChooseStartSection() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const handleApplyClick = () => {
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

      {/* Rest of the section UI */}
      <ChooseStartSectionContent handleApplyClick={handleApplyClick} />
    </>
  );
}

interface ChooseStartSectionContentProps {
  handleApplyClick: () => void;
}

function ChooseStartSectionContent({ handleApplyClick }: ChooseStartSectionContentProps) {
  return (
    <section id="choose-start" className="mx-auto max-w-[80rem] px-6 md:px-8 py-20 text-center">
      <h2 className="text-4xl font-semibold text-white mb-4">Choose How You Want to Start</h2>
      <p className="mx-auto max-w-3xl text-lg text-gray-400 mb-12">
        Whether you&apos;re ready to commit now or want to apply first — we’ve made it easy for serious
        players to take the next step.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pay Now */}
        <div className="relative rounded-2xl bg-gray-900/50 border border-[var(--color-one)] p-8 flex flex-col items-start text-left overflow-hidden shadow-[0_0_25px_0_rgba(34,197,94,0.6)] backdrop-blur-md">
          <ShineBorder shineColor="var(--color-one)" borderWidth={2} />
          <span className="mb-2 text-sm font-semibold text-green-400">Option 1 – For Ready Players & Parents</span>
          <h3 className="text-2xl font-bold text-white mb-4">Pay Now & Get Instant Access</h3>
          {/* Price */}
          <div className="flex items-baseline mb-6">
            <span className="text-5xl font-extrabold text-white">$399</span>
            <span className="ml-2 text-lg text-gray-400">USD</span>
          </div>

          {/* Features */}
          <ul className="mb-8 space-y-3">
            {[
              "12-month training program",
              "Mentorship sessions with elite professionals",
              "Tactical and mindset modules",
              "Player evaluation opportunities",
              "Scholarship & scouting nomination eligibility",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckIcon className="h-5 w-5 text-green-400 mt-[2px]" />
                <span className="text-gray-300">{item}</span>
              </li>
            ))}
          </ul>

          <Button
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-green-400 hover:opacity-90 w-full md:w-auto shadow-lg shadow-emerald-500/20"
          >
            Pay Now
          </Button>

          <p className="mt-4 text-gray-400 text-sm">
            Start training instantly with no application required. Perfect if you&apos;re ready and serious.
          </p>
        </div>

        {/* Apply Now */}
        <div className="relative rounded-2xl bg-gray-900/50 border border-blue-400 p-8 flex flex-col items-start text-left overflow-hidden shadow-[0_0_25px_0_rgba(59,130,246,0.5)] backdrop-blur-md">
          <ShineBorder shineColor="#60a5fa" borderWidth={2} />
          <span className="mb-2 text-sm font-semibold text-blue-400">Option 2 – For Those Who Want to Apply First</span>
          <h3 className="text-2xl font-bold text-white mb-4">Apply First – We&apos;ll Review Your Profile</h3>
          {/* Price */}
          <div className="flex items-baseline mb-6">
            <span className="text-4xl font-extrabold text-white">Free</span>
          </div>

          {/* Features */}
          <ul className="mb-8 space-y-3">
            {[
              "Fill out a short application form",
              "Tell us about your goals, experience & motivation",
              "Get a personal response within 24-48 hours",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckIcon className="h-5 w-5 text-blue-400 mt-[2px]" />
                <span className="text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
          <Button
            variant="outline"
            size="lg"
            className="border-blue-400 text-blue-400 hover:bg-blue-400/10 w-full md:w-auto shadow-lg shadow-blue-500/20"
            onClick={handleApplyClick}
          >
            Apply Now
          </Button>
          <p className="mt-4 text-gray-400 text-sm">
            Recommended for players who want a personal plan before enrolling.
          </p>
        </div>
      </div>
    </section>
  );
} 