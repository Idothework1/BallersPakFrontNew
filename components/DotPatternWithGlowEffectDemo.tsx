"use client";

import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/magicui/dot-pattern";

export function DotPatternWithGlowEffectDemo() {
  return (
    <div className="fixed inset-0 -z-10 flex items-center justify-center overflow-hidden pointer-events-none">
      <DotPattern
        glow={true}
        className={cn(
          "opacity-20 scale-150 [mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
          "transform-gpu"
        )}
      />
    </div>
  );
}

export default DotPatternWithGlowEffectDemo; 