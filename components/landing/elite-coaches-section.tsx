"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const coaches = [
  {
    name: "Luka Modrić",
    role: "Real Madrid & Croatia Legend",
    img: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Luka_Modrić_2018.jpg",
    bio: "Ballon d'Or winner mentoring our midfield mastery track.",
  },
  {
    name: "Brahim Díaz",
    role: "Real Madrid Midfielder",
    img: "https://upload.wikimedia.org/wikipedia/commons/3/35/Brahim_Díaz_2023.jpg",
    bio: "Provides technical feedback and video analysis for attackers.",
  },
  {
    name: "Raphaël Varane",
    role: "Manchester United Defender",
    img: "https://upload.wikimedia.org/wikipedia/commons/8/86/Raphael_Varane_2022.jpg",
    bio: "Leads defensive IQ sessions and mindset coaching.",
  },
];

export default function EliteCoachesSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", skipSnaps: false }
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };
  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  return (
    <section id="coaches" className="mx-auto max-w-[80rem] px-6 md:px-8 py-20 text-center">
      <h2 className="text-4xl font-semibold text-white mb-6">Meet Your Elite Coaches</h2>
      <p className="mx-auto max-w-3xl text-lg text-gray-400 mb-10">
        These are not YouTube trainers—these are active players mentoring you personally.
      </p>

      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex">
          {coaches.map((coach, idx) => (
            <div
              key={coach.name}
              className={`embla__slide flex-[0_0_100%] transition-opacity duration-500 ${idx===selectedIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className="mx-4 rounded-xl bg-gray-800/30 border border-gray-700 p-6 flex flex-col items-center h-full">
                {/* Placeholder avatar */}
                <div className="h-40 w-40 rounded-full bg-gray-600 mb-4 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">{coach.name.split(" ")[0][0]}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">{coach.name}</h3>
                <p className="text-sm text-primary mb-2">{coach.role}</p>
                <p className="text-gray-400 text-sm text-center">{coach.bio}</p>
              </div>
            </div>
          ))}
        </div>
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent" />
      </div>

      {/* Navigation buttons */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={scrollPrev}
          className="rounded-full border border-gray-600 p-2 hover:bg-gray-700"
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>
        <button
          onClick={scrollNext}
          className="rounded-full border border-gray-600 p-2 hover:bg-gray-700"
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5 text-white" />
        </button>
      </div>
    </section>
  );
} 