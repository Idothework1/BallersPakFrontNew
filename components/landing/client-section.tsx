import Marquee from "@/components/magicui/marquee";
import Image from "next/image";

export default function ClientSection() {
  return (
    <section
      id="clients"
      className="text-center mx-auto max-w-[80rem] px-6 md:px-8 mt-16 md:mt-24"
    >
      <div className="pt-6 pb-14">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="text-center text-sm font-semibold text-gray-600">
            TRUSTED BY TEAMS FROM AROUND THE WORLD
          </h2>
          <div className="mt-6 relative flex w-full items-center justify-center overflow-hidden">
            <Marquee className="[--duration:40s]">
              {[
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
              ].map((club) => (
                <Image
                  key={club.id}
                  src={club.src}
                  alt={`${club.id} logo`}
                  width={64}
                  height={64}
                  className="h-16 w-auto px-6 object-contain opacity-60"
                />
              ))}
            </Marquee>
            {/* Gradient fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
