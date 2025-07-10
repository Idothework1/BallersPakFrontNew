"use client";

import { Button } from "@/components/ui/button";
import { PulsatingButton } from "@/components/magicui/pulsating-button";
import { CheckIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function PricingSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const handleJoinClick = async (planId: string) => {
    setIsLoading(true);
    setActiveId(planId);
    // Simulate loading for demo purposes
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setActiveId(null);
  };

  const handleApplyClick = () => {
    setIsLoading(true);
    setActiveId("apply");
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

      <section id="pricing" className="mx-auto max-w-[80rem] px-6 md:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-semibold text-white mb-4">
          💰 Choose Your Path to Pro-Level Football
        </h2>
        <p className="mx-auto max-w-3xl text-lg text-gray-400">
          Whether you&apos;re ready to grow month by month or want to unlock the full roadmap — choose the plan that fits your ambition.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Elite Plan */}
        <div className="relative rounded-2xl bg-gray-900/50 border border-yellow-500 p-8 flex flex-col text-left overflow-hidden shadow-[0_0_25px_0_rgba(234,179,8,0.6)] backdrop-blur-md">
          <div className="absolute top-4 left-4">
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-yellow-500 text-black rounded-full">
              🟡 Elite Plan
            </span>
          </div>
          
          <div className="mt-8 mb-6">
            <div className="flex items-baseline mb-2">
              <span className="text-5xl font-extrabold text-white">$111</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Train Consistently. Grow Every Week.</h3>
            <p className="text-yellow-400 font-medium">Mentorship from Champions League players</p>
          </div>

          <ul className="mb-8 space-y-3 flex-grow">
            {[
              "Full 12-month access to the entire program",
              "Tactical, technical, and mindset modules",
              "Access to monthly Q&A with Champions League-level pros",
              "Mobile-friendly + built for Pakistan-based players",
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <CheckIcon className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-4">
              🔹 Ideal for committed players looking to improve steadily.
            </p>
          </div>

          <Button
            onClick={() => handleJoinClick("elite")}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:opacity-90 text-black font-semibold shadow-lg shadow-yellow-500/20"
          >
            {isLoading && activeId === "elite" ? "Joining..." : "🟢 Join the Program Now"}
          </Button>
        </div>

        {/* Pro Academy Track */}
        <div className="relative rounded-2xl bg-gray-900/50 border border-red-500 p-8 flex flex-col text-left overflow-hidden shadow-[0_0_25px_0_rgba(239,68,68,0.6)] backdrop-blur-md">
          <div className="absolute top-4 left-4">
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-red-500 text-white rounded-full">
              🔴 Pro Academy Track
            </span>
          </div>
          
          <div className="mt-8 mb-6">
            <div className="flex items-baseline mb-2">
              <span className="text-5xl font-extrabold text-white">$299</span>
              <span className="ml-2 text-lg text-gray-400">One-Time</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Go All-In. Get on the Radar.</h3>
            <p className="text-red-400 font-medium">Mentorship from Champions League players</p>
          </div>

          <ul className="mb-8 space-y-3 flex-grow">
            {[
              "Full 12-month access to the entire program",
              "Tactical, technical, and mindset modules", 
              "Weekly elite video training sessions",
              "Personalized certificate (A-Team Track)",
              "Priority for scouting Nomination and Trial, if you fit the part",
              "Opportunity for a transfer to top clubs if we believe you're ready",
              "Bonus: Support building your highlight reel and Professional CV",
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <CheckIcon className="h-5 w-5 text-red-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-4">
              🔹 For players aiming to go pro or earn scholarships abroad.
            </p>
          </div>

          <Button
            onClick={() => handleJoinClick("pro")}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-red-500 to-red-400 hover:opacity-90 text-white font-semibold shadow-lg shadow-red-500/20"
          >
            {isLoading && activeId === "pro" ? "Joining..." : "🟢 Join the Program Now"}
          </Button>
        </div>
      </div>

             {/* Not Sure Section */}
       <div className="text-center border-t border-gray-700 pt-12">
         <h3 className="text-2xl font-semibold text-white mb-6">
           Not Sure Which Track Is Best for You?
         </h3>
         <PulsatingButton
           onClick={handleApplyClick}
           disabled={isLoading}
           className="shadow-lg shadow-green-500/20"
         >
           {isLoading && activeId === "apply" ? "Submitting..." : "Apply First"}
         </PulsatingButton>
         <p className="text-gray-400 text-sm mt-4 max-w-md mx-auto">
           We&apos;ll review your goals and recommend the right path.
         </p>
       </div>

      </section>
    </>
  );
}
