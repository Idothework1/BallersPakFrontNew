"use client";

import HeroVideoDialog from "@/components/magicui/hero-video-dialog";

export default function HeroVideoDialogDemo() {
  return (
    <div className="relative w-full h-full">
      <HeroVideoDialog
        className="block dark:hidden w-full h-full"
        animationStyle="from-center"
        videoSrc="/Video.mp4"
        thumbnailSrc="/hero-light.png"
        thumbnailAlt="Hero Video"
      />
      <HeroVideoDialog
        className="hidden dark:block w-full h-full"
        animationStyle="from-center"
        videoSrc="/Video.mp4"
        thumbnailSrc="/hero-dark.png"
        thumbnailAlt="Hero Video"
      />
    </div>
  );
} 