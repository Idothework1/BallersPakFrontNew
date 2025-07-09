"use client";

import "./elite-players-section.css";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider, KeenSliderPlugin } from "keen-slider/react";
import Image from "next/image";

const players = [
  {
    name: "Lionel Messi",
    img: "https://upload.wikimedia.org/wikipedia/commons/b/b8/FIFA_World_Cup_Qatar_2022_Group_C_Argentina_vs_Mexico_-_Lionel_Messi_%28cropped%29.jpg",
  },
  {
    name: "Kylian Mbappé",
    img: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Portrait_of_Kylian_Mbapp%C3%A9_%28cropped%29.jpg",
  },
  {
    name: "Erling Haaland",
    img: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Erling_Haaland_2023_%28cropped%29.jpg",
  },
  {
    name: "Kevin De Bruyne",
    img: "https://upload.wikimedia.org/wikipedia/commons/5/5c/20180610_FIFA_Friendly_Match_Austria_vs._Brazil_Kevin_De_Bruyne_850_1625.jpg",
  },
  {
    name: "Vinícius Júnior",
    img: "https://upload.wikimedia.org/wikipedia/commons/0/0c/2022_FIFA_World_Cup_Brazil_vs_Serbia_-_Vin%C3%ADcius_J%C3%BAnior_%28cropped%29.jpg",
  },
  {
    name: "Mohamed Salah",
    img: "https://upload.wikimedia.org/wikipedia/commons/2/2d/201718_FC_Salzburg_vs._Liverpool_FC_-_Mohamed_Salah_1.jpg",
  },
];

const carousel: KeenSliderPlugin = (slider) => {
  const z = 400;
  function rotate() {
    const deg = 360 * slider.track.details.progress;
    slider.container.style.transform = `translateZ(-${z}px) rotateY(${-deg}deg)`;
  }
  slider.on("created", () => {
    const deg = 360 / slider.slides.length;
    slider.slides.forEach((element: HTMLElement, idx: number) => {
      (element as HTMLElement).style.transform = `rotateY(${deg * idx}deg) translateZ(${z}px)`;
    });
    rotate();
  });
  slider.on("detailsChanged", rotate);
};

export default function ElitePlayersSection() {
  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      selector: ".carousel__cell",
      renderMode: "custom",
      mode: "free-snap",
    },
    [carousel]
  );

  return (
    <section id="elite-players" className="py-20 flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
        Meet Our Elite Players
      </h2>
      <div className="wrapper">
        <div className="scene">
          <div className="carousel keen-slider" ref={sliderRef as any}>
            {players.map((player) => (
              <div
                key={player.name}
                className="carousel__cell flex items-center justify-center overflow-hidden"
              >
                <Image
                  src={player.img}
                  alt={player.name}
                  width={220}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}