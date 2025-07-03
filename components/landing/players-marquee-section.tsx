"use client";

import Marquee from "@/components/magicui/marquee";
import { cn } from "@/lib/utils";

const players = [
  { name: "Lionel Messi", desc: "Inter Miami CF", color: "bg-rose-500" },
  { name: "Kylian Mbappé", desc: "Paris Saint-Germain", color: "bg-fuchsia-500" },
  { name: "Erling Haaland", desc: "Manchester City", color: "bg-sky-500" },
  { name: "Kevin De Bruyne", desc: "Manchester City", color: "bg-amber-400" },
  { name: "Vinícius Júnior", desc: "Real Madrid", color: "bg-green-500" },
  { name: "Mohamed Salah", desc: "Liverpool FC", color: "bg-red-600" },
  { name: "Robert Lewandowski", desc: "FC Barcelona", color: "bg-blue-600" },
  { name: "Jude Bellingham", desc: "Real Madrid", color: "bg-yellow-300" },
];

const firstRow = players.slice(0, players.length / 2);
const secondRow = players.slice(players.length / 2);

function PlayerCard({ color, name, desc }: { color: string; name: string; desc: string }) {
  return (
    <figure
      className={cn(
        "relative flex w-64 items-center gap-4 cursor-pointer overflow-hidden rounded-xl border p-4 flex-shrink-0",
        "border-white/10 bg-white/5 dark:bg-white/10 backdrop-blur-sm"
      )}
    >
      <div className={`h-20 w-20 rounded-full flex-shrink-0 ${color}`} />
      <div className="flex flex-col">
        <figcaption className="text-sm font-semibold text-white">{name}</figcaption>
        <p className="text-xs text-white/70">{desc}</p>
      </div>
    </figure>
  );
}

export default function PlayersMarqueeSection() {
  return (
    <section id="players" className="py-20">
      <h2 className="mb-10 text-center text-3xl font-bold text-white">Meet Our Rising Stars</h2>
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <Marquee className="[--duration:25s]">
          {firstRow.map((p) => (
            // @ts-ignore
            <PlayerCard key={p.name} {...p} />
          ))}
        </Marquee>
        <Marquee reverse className="[--duration:25s]">
          {secondRow.map((p) => (
            // @ts-ignore
            <PlayerCard key={p.name} {...p} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black to-transparent" />
      </div>
    </section>
  );
} 