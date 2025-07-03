"use client";

import Marquee from "@/components/magicui/marquee";
import Image from "next/image";
import { cn } from "@/lib/utils";

const players = [
  { name: "Lionel Messi", desc: "Inter Miami CF", img: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Lionel_Messi_20180626.jpg" },
  { name: "Kylian Mbappé", desc: "Paris Saint-Germain", img: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Kylian_Mbappe_2019.jpg" },
  { name: "Erling Haaland", desc: "Manchester City", img: "https://upload.wikimedia.org/wikipedia/commons/0/09/Erling_Haaland_2023_%28cropped%29.jpg" },
  { name: "Kevin De Bruyne", desc: "Manchester City", img: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Kevin_De_Bruyne_201807091.jpg" },
  { name: "Vinícius Júnior", desc: "Real Madrid", img: "https://upload.wikimedia.org/wikipedia/commons/9/92/Vinicius_Jr_2023.jpg" },
  { name: "Mohamed Salah", desc: "Liverpool FC", img: "https://upload.wikimedia.org/wikipedia/commons/8/80/Mohamed_Salah_2018.jpg" },
  { name: "Robert Lewandowski", desc: "FC Barcelona", img: "https://upload.wikimedia.org/wikipedia/commons/9/97/Robert_Lewandowski_2023_%28cropped%29.jpg" },
  { name: "Jude Bellingham", desc: "Real Madrid", img: "https://upload.wikimedia.org/wikipedia/commons/2/29/Jude_Bellingham_2023.jpg" },
];

const firstRow = players.slice(0, players.length / 2);
const secondRow = players.slice(players.length / 2);

function PlayerCard({ img, name, desc }: { img: string; name: string; desc: string }) {
  return (
    <figure
      className={cn(
        "relative flex w-64 items-center gap-4 cursor-pointer overflow-hidden rounded-xl border p-4 flex-shrink-0",
        "border-white/10 bg-white/5 dark:bg-white/10 backdrop-blur-sm"
      )}
    >
      <Image src={img} alt={name} width={80} height={80} className="h-20 w-20 rounded-lg object-cover flex-shrink-0" />
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
            <PlayerCard key={p.name} {...p} />
          ))}
        </Marquee>
        <Marquee reverse className="[--duration:25s]">
          {secondRow.map((p) => (
            <PlayerCard key={p.name} {...p} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black to-transparent" />
      </div>
    </section>
  );
} 