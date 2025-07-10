import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface AnimatedGradientTextProps {
  speed?: number; // seconds per cycle
  colorFrom?: string;
  colorTo?: string;
  className?: string;
  children: React.ReactNode;
}

export function AnimatedGradientText({
  speed = 5,
  colorFrom = "#4ade80",
  colorTo = "#06b6d4",
  className,
  children,
}: AnimatedGradientTextProps) {
  // Inject keyframes once
  useEffect(() => {
    const id = "agt-gradient-style";
    if (document && !document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.innerHTML = `@keyframes agt-gradient {0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}`;
      document.head.appendChild(style);
    }
  }, []);

  const style: React.CSSProperties = {
    backgroundImage: `linear-gradient(90deg, ${colorFrom}, ${colorTo}, ${colorFrom})`,
    backgroundSize: "300% 300%",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    animation: `agt-gradient ${speed}s ease infinite`,
  };

  return (
    <span style={style} className={cn(className)}>
      {children}
    </span>
  );
} 