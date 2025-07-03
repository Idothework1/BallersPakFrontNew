import Marquee from "@/components/magicui/marquee";
import Image from "next/image";

export default function ClientSection() {
  return (
    <section
      id="clients"
      className="text-center mx-auto max-w-[80rem] px-6 md:px-8"
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
                  id: "Barcelona",
                  src: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
                },
                {
                  id: "ManUnited",
                  src: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
                },
                {
                  id: "PSG",
                  src: "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg",
                },
                {
                  id: "Chelsea",
                  src: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg",
                },
                {
                  id: "Liverpool",
                  src: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
                },
                {
                  id: "Arsenal",
                  src: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
                },
                {
                  id: "ACMilan",
                  src: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg",
                },
                {
                  id: "Dortmund",
                  src: "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg",
                },
              ].map((club) => (
                <Image
                  key={club.id}
                  src={club.src}
                  alt={`${club.id} logo`}
                  width={64}
                  height={64}
                  className="h-16 w-auto px-6 object-contain grayscale opacity-60 dark:grayscale"
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
