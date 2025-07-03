"use client";

import { BorderBeam } from "@/components/magicui/border-beam";
import TextShimmer from "@/components/magicui/text-shimmer";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { TextAnimate } from "@/components/magicui/text-animate";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import HeroVideoAutoPlay from "@/components/HeroVideoAutoPlay";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import HeroVideoPreviewButton from "@/components/HeroVideoPreviewButton";

export default function HeroSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const handleJoinClick = () => {
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
        id="hero"
        className="relative mx-auto mt-32 max-w-[80rem] px-6 text-center md:px-8"
      >
        <div className="backdrop-filter-[12px] inline-flex h-7 items-center justify-between rounded-full border border-white/5 bg-white/10 px-3 text-xs text-white dark:text-black transition-all ease-in hover:cursor-pointer hover:bg-white/20 group gap-1 translate-y-[-1rem] animate-fade-in opacity-0">
          <TextShimmer className="inline-flex items-center justify-center">
            <span>✨ Introducing BallersPak Online</span>{" "}
            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </TextShimmer>
        </div>
        <h1 className="bg-gradient-to-br dark:from-white from-black from-30% dark:to-white/40 to-black/40 bg-clip-text py-6 text-5xl font-medium leading-none tracking-tighter text-transparent text-balance sm:text-6xl md:text-7xl lg:text-8xl translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
          Ballers
          <AnimatedGradientText
            speed={2}
            colorFrom="#4ade80"
            colorTo="#06b6d4"
            className="inline-block"
          >
            Pak
          </AnimatedGradientText>
        </h1>

        <h2 className="mb-6 text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:300ms] text-balance">
          Pakistan's Most Popular Academy is{" "}
          <PointerHighlight>
            <span>Now Online</span>
          </PointerHighlight>
        </h2>
        <p className="mb-12 text-lg tracking-tight text-gray-400 md:text-xl text-balance translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
          Unlock your potential and train with the elite. Join the largest, most ambitious football community in
          <AnimatedGradientText
            speed={2}
            colorFrom="#4ade80"
            colorTo="#06b6d4"
            className="inline-block mx-1 font-semibold"
          >
            Pakistan
          </AnimatedGradientText>
          and elevate your game from anywhere in the world.
        </p>
        <Button 
          onClick={handleJoinClick}
          className="translate-y-[-1rem] animate-fade-in gap-1 rounded-lg text-white dark:text-black opacity-0 ease-in-out [--animation-delay:600ms]"
        >
          <span>Join the Club </span>
          <ArrowRightIcon className="ml-1 size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
        </Button>

        {/* Member Counter */}
        <TextAnimate animation="blurInDown" once className="mt-6 flex items-baseline justify-center gap-2">
          <AnimatedGradientText
            speed={2}
            colorFrom="#4ade80"
            colorTo="#06b6d4"
            className="text-4xl font-semibold tracking-tight"
          >
            <NumberTicker value={200} />+
          </AnimatedGradientText>
          <span className="text-lg font-semibold text-gray-400">Members and growing</span>
        </TextAnimate>

        <div
          ref={ref}
          className="relative mt-[8rem] animate-fade-up opacity-0 [--animation-delay:400ms] [perspective:2000px] after:absolute after:inset-0 after:z-50 after:[background:linear-gradient(to_top,hsl(var(--background))_30%,transparent)]"
        >
          <div
            className={`rounded-xl border border-white/10 bg-white bg-opacity-[0.01] before:absolute before:bottom-1/2 before:left-0 before:top-0 before:h-full before:w-full before:opacity-0 before:[filter:blur(180px)] before:[background-image:linear-gradient(to_bottom,var(--color-one),var(--color-two),transparent_40%)] ${
              inView ? "before:animate-image-glow" : ""
            }`}
          >
            <BorderBeam
              size={200}
              duration={10}
              delay={11}
              colorFrom="#4ade80"
              colorTo="#06b6d4"
            />

            <HeroVideoAutoPlay />
          </div>
        </div>
      </section>
      <HeroVideoPreviewButton />
    </>
  );
}
