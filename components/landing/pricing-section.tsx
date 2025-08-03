"use client";

import { Button } from "@/components/ui/button";
import { CheckIcon } from "@radix-ui/react-icons";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function PricingSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showEliteConfirmation, setShowEliteConfirmation] = useState(false);
  const router = useRouter();

  const handleJoinClick = async (planId: string) => {
    if (planId === "elite") {
      // Show confirmation modal for Elite plan annual discount
      setShowEliteConfirmation(true);
      return;
    }
    
    setIsLoading(true);
    setActiveId(planId);
    
    // Navigate to paid plan registration with plan details
    router.push(`/paid-plan/${planId}`);
  };

  const handleEliteConfirm = async () => {
    setShowEliteConfirmation(false);
    setIsLoading(true);
    setActiveId("elite");
    
    // Navigate to paid plan registration with plan details
    router.push(`/paid-plan/elite`);
  };

  return (
    <>
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
              <span className="text-5xl font-extrabold text-white">$15</span>
              <span className="ml-2 text-lg text-gray-400">USD/month</span>
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
              <span className="ml-3 text-sm text-gray-500 line-through">Value $899</span>
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

      </section>

      {/* Elite Plan Annual Discount Confirmation Modal */}
      <AnimatePresence>
        {showEliteConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setShowEliteConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md mx-4 bg-gray-900 border border-yellow-500 rounded-2xl p-6 shadow-xl"
            >
              <button
                className="absolute -right-3 -top-3 rounded-full bg-yellow-500 p-2 text-black shadow-lg hover:bg-yellow-400 transition-colors"
                onClick={() => setShowEliteConfirmation(false)}
              >
                <XIcon className="h-4 w-4" />
              </button>

              <div className="text-center">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-yellow-500 text-black rounded-full">
                    🟡 Elite Plan - Special Offer
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  💰 Pay for the Full Year & Save Big!
                </h3>

                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Monthly Plan (12 months)</span>
                    <span className="text-lg text-gray-400 line-through">$180</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">Annual Plan (Pay Now)</span>
                    <span className="text-2xl font-bold text-yellow-400">$111</span>
                  </div>
                  <div className="border-t border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-green-400 font-semibold">You Save</span>
                      <span className="text-xl font-bold text-green-400">$69</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-6">
                  Get full access to the entire program for 12 months with a one-time payment of just $111 USD instead of paying $15/month.
                </p>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowEliteConfirmation(false)}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Maybe Later
                  </Button>
                  <Button
                    onClick={handleEliteConfirm}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:opacity-90 text-black font-semibold"
                  >
                    {isLoading ? "Processing..." : "🎯 Pay $111 Now & Save $69"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
