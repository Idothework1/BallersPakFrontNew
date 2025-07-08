"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
        <div className="rounded-xl bg-gray-800/30 border border-gray-700 p-8 flex flex-col items-start text-left">
          <span className="mb-2 text-sm font-semibold text-green-400">Option 1 – For Ready Players & Parents</span>
          <h3 className="text-2xl font-bold text-white mb-4">Pay Now & Get Instant Access</h3>
          <ul className="list-disc ml-5 space-y-2 text-gray-400 mb-6">
            {[
              "12-month training program",
              "Mentorship sessions with elite professionals",
              "Tactical and mindset modules",
              "Player evaluation opportunities",
              "Scholarship and scouting nomination eligibility",
            ].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Button size="lg" className="bg-green-600 hover:bg-green-700 w-full md:w-auto">Pay Now – $399 USD</Button>
          <p className="mt-4 text-gray-400 text-sm">
            Start training instantly. No application required. Perfect if you&apos;re ready and serious.
            Limited instant access slots available.
          </p>
        </div>

        {/* Apply Now */}
        <div className="rounded-xl bg-gray-800/30 border border-gray-700 p-8 flex flex-col items-start text-left">
          <span className="mb-2 text-sm font-semibold text-blue-400">Option 2 – For Those Who Want to Apply First</span>
          <h3 className="text-2xl font-bold text-white mb-4">Apply First – We&apos;ll Review Your Profile</h3>
          <ul className="list-disc ml-5 space-y-2 text-gray-400 mb-6">
            {[
              "Fill out a short application form",
              "Tell us about your goals, experience, and motivation",
              "Get a personal response within 24-48 hours",
            ].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Button
            variant="outline"
            size="lg"
            className="border-blue-400 text-blue-400 hover:bg-blue-400/10 w-full md:w-auto"
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