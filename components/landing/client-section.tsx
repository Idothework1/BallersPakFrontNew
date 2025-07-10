import Marquee from "@/components/magicui/marquee";
import Image from "next/image";

export default function ClientSection() {
  const clubs = [
    {
      id: "RealMadrid",
      src: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
    },
    {
      id: "Villarreal",
      src: "/villa.png",
    },
    {
      id: "BayernMunich",
      src: "/bayern.png",
    },
    {
      id: "RBLeipzig",
      src: "https://upload.wikimedia.org/wikipedia/en/0/04/RB_Leipzig_2014_logo.svg",
    },
  ];

  // Duplicate clubs for better mobile experience
  const allClubs = [...clubs, ...clubs];

  return (
    <section
      id="clients"
      className="text-center mx-auto max-w-[80rem] px-4 md:px-6 lg:px-8 mt-12 md:mt-16 lg:mt-24"
    >
      <div className="pt-4 md:pt-6 pb-10 md:pb-14">
        <div className="mx-auto max-w-screen-xl px-2 md:px-4 lg:px-8">
          <h2 className="text-center text-lg md:text-xl font-semibold text-gray-600 mb-4 md:mb-6">
            TRUSTED BY TEAMS FROM AROUND THE WORLD
          </h2>
          <div className="relative flex w-full items-center justify-center overflow-hidden">
            {/* Mobile Marquee - Faster */}
            <div className="block md:hidden w-full">
              <Marquee className="[--duration:20s]">
                {allClubs.map((club, index) => (
                  <Image
                    key={`${club.id}-${index}`}
                    src={club.src}
                    alt={`${club.id} logo`}
                    width={100}
                    height={100}
                    className="h-[100px] w-auto px-4 object-contain"
                  />
                ))}
              </Marquee>
            </div>
            
            {/* Desktop Marquee - Normal Speed */}
            <div className="hidden md:block w-full">
              <Marquee className="[--duration:40s]">
                {clubs.map((club) => (
                  <Image
                    key={club.id}
                    src={club.src}
                    alt={`${club.id} logo`}
                    width={120}
                    height={120}
                    className="h-[120px] w-auto px-6 object-contain"
                  />
                ))}
              </Marquee>
            </div>
            
            {/* Gradient fade edges - Responsive */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 md:w-1/4 bg-gradient-to-r from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 md:w-1/4 bg-gradient-to-r from-transparent to-background"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
