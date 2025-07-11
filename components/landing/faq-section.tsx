"use client";

import { ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "Is this for beginners or advanced players?",
      a: "Both. Our program adapts to your level and gives direct feedback to improve fast.",
    },
    {
      q: "Who are the coaches and mentors?",
      a: "Our coaches and mentors are currently playing or have played at the highest level – in national teams, top leagues, and the Champions League. We collaborate with players like Varane, Joselu Mato, Coman, and many others. Parents often say this is a unique opportunity for their child to train with the best and learn how professionals think and work.",
    },
    {
      q: "Will I really hear from the pro players?",
      a: "Yes! Our elite players host monthly live sessions where you'll have the opportunity to ask them questions. Make sure to come prepared before the training sessions!",
    },
    {
      q: "Is this academy something I can do even if I play in a team?",
      a: "Absolutely! Ballers Academy is not a replacement for a club, but an additional program that enhances a player's development. Many of our players already play in serious academies, but here they get what clubs often don't provide – individual attention, personalized training, and education about professional football.",
    },
    {
      q: "How often are the sessions?",
      a: "It depends on the package, but you'll get at least 2 live sessions per week— and you can join up to 7 sessions weekly if you choose the full-access option.",
    },
    {
      q: "How does the online academy actually work?",
      a: "The online part isn't just about watching videos – it's real training sessions and live lectures with our mentors and coaches. Players receive training plans, analysis, tactics, mental preparation, and advice on professional development. Everything is designed to allow players to train independently and progress more quickly.",
    },
    {
      q: "How old do I need to be to join the academy?",
      a: "We currently work with committed players between the ages of 8 and 18.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faqs" className="mx-auto max-w-[80rem] px-6 md:px-8 py-20">
      <h2 className="text-center text-4xl font-semibold text-white mb-12">FAQs</h2>

      <div className="space-y-4">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={item.q}
              className="overflow-hidden rounded-xl border border-gray-700/60 bg-gray-800/30 backdrop-blur-sm"
            >
              {/* Header */}
              <button
                onClick={() => toggleFAQ(index)}
                className="flex w-full items-center justify-between gap-4 p-4 text-left text-lg font-medium text-white transition-colors hover:bg-gray-800/40"
              >
                <span className="flex-1">{item.q}</span>
                <ChevronRight
                  className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-90" : ""
                  }`}
                />
              </button>

              {/* Body */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                      open: { height: "auto", opacity: 1 },
                      collapsed: { height: 0, opacity: 0 },
                    }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="px-4 pb-4 text-gray-300"
                  >
                    {item.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
} 