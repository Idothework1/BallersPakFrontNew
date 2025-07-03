"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

const players = [
  { name: "Ahsan Ali", img: "/player1.jpg" },
  { name: "Fatima Khan", img: "/player2.jpg" },
  { name: "Bilal Ahmed", img: "/player3.jpg" },
  { name: "Sara Malik", img: "/player4.jpg" },
  { name: "Hamza Shah", img: "/player5.jpg" },
  { name: "Zain Raza", img: "/player6.jpg" },
  { name: "Marium Yousaf", img: "/player7.jpg" },
  { name: "Usman Tariq", img: "/player8.jpg" },
];

export default function PlayersCarouselSection() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  return (
    <section className="py-20" id="players">
      <h2 className="text-center text-3xl font-bold text-white mb-8">Meet Our Rising Stars</h2>
      <div className="relative overflow-hidden" ref={emblaRef}>
        {/* fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-10" />

        <div className="flex gap-8">
          {players.map((player) => (
            <div key={player.name} className="relative flex-[0_0_33.333%]">
              <Image
                src={player.img}
                alt={player.name}
                width={250}
                height={300}
                className="rounded-xl object-cover border border-white/10 w-full h-[300px]"
              />
              <p className="mt-2 text-center text-lg font-semibold text-white">{player.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 