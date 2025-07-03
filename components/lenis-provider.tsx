"use client";

import Lenis from "@studio-freight/lenis";
import { ReactNode, useEffect } from "react";

interface LenisProviderProps {
  children: ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      // Adjust settings as desired
      duration: 1.2,
      easing: (x: number) => Math.min(1, 1.001 - Math.pow(2, -10 * x)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
} 