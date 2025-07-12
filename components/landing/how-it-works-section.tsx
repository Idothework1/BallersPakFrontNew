"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function HowItWorksSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      number: "01",
      title: "Join & Choose Your Track",
      desc: "Striker, Midfield, Defender, or All-Rounder",
      icon: "⚽",
      color: "from-blue-500 to-cyan-400"
    },
    {
      number: "02",
      title: "Instant Access",
      desc: "Weekly training plan and tactical sessions",
      icon: "⚡",
      color: "from-green-500 to-emerald-400"
    },
    {
      number: "03",
      title: "Submit Training Clips",
      desc: "Get feedback from pro coaches",
      icon: "📹",
      color: "from-purple-500 to-violet-400"
    },
    {
      number: "04",
      title: "Monthly Live Q&As",
      desc: "Chat with your football heroes",
      icon: "💬",
      color: "from-orange-500 to-yellow-400"
    },
    {
      number: "05",
      title: "Earn Certificate",
      desc: "Nomination for scouting events",
      icon: "🏆",
      color: "from-red-500 to-pink-400"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="how-it-works" className="mx-auto max-w-[80rem] px-6 md:px-8 py-20 text-center" ref={ref}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          How It Works
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Your journey to professional football in 5 simple steps
        </p>
      </motion.div>

      {/* Steps Container */}
      <div className="relative">
        {/* Desktop connecting line */}
        <div className="hidden lg:block absolute top-24 left-0 right-0">
          <div className="flex items-center justify-between px-32">
            {steps.slice(0, -1).map((_, index) => (
              <div key={index} className="flex-1 h-1 bg-gradient-to-r from-gray-600 to-gray-700 mx-8"></div>
            ))}
          </div>
        </div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4 relative z-10"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="group relative"
            >
              {/* Step number badge */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {step.number}
                </div>
              </div>

              {/* Main card */}
              <div className="border border-gray-700 rounded-2xl p-6 bg-gray-800/40 backdrop-blur-sm group-hover:bg-gray-700/50 group-hover:border-gray-600 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl mt-6 h-full">
                {/* Icon */}
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                
                {/* Title */}
                <h3 className={`text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r ${step.color} mb-3 leading-tight`}>
                  {step.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {step.desc}
                </p>

                {/* Progress indicator */}
                <div className="mt-4 w-full bg-gray-700 rounded-full h-1 overflow-hidden">
                  <motion.div 
                    className={`h-full bg-gradient-to-r ${step.color}`}
                    initial={{ width: 0 }}
                    animate={inView ? { width: "100%" } : { width: 0 }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                  ></motion.div>
                </div>
              </div>

              {/* Mobile connecting line */}
              {index < steps.length - 1 && (
                <div className="lg:hidden flex justify-center mt-6 mb-2">
                  <div className="w-1 h-8 bg-gradient-to-b from-gray-600 to-gray-700"></div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 1 }}
        className="mt-16"
      >
        <div className="inline-block bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-blue-500/30 rounded-full px-8 py-4">
          <p className="text-blue-300 font-medium flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            Training is designed for players aged 8–18. Only 2 hours/week required.
          </p>
        </div>
      </motion.div>
    </section>
  );
} 