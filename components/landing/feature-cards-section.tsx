import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function FeatureCardsSection() {
  const cards = [
    {
      title: "3,500+ Exercises",
      desc: "Drills to sharpen every aspect of your game.",
      image: "/p1.png",
    },
    {
      title: "30+ Programs",
      desc: "Structured pathways for progressive growth.",
      image: "/p2.png",
    },
    {
      title: "Global Community",
      desc: "Train alongside players around the world.",
      image: "/p3.png",
    },
  ];

  return (
    <section className="mx-auto max-w-[80rem] px-6 md:px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {cards.map((card) => (
          <CardContainer key={card.title} containerClassName="py-0">
            <CardBody className="rounded-xl bg-gray-800/30 px-16 pb-16 pt-0 border border-gray-700 text-center">
              <CardItem translateZ={60} className="mb-4 flex justify-center items-center mt-2">
                <Image 
                  src={card.image} 
                  alt={card.title}
                  width={270}
                  height={270}
                  className="object-contain"
                />
              </CardItem>
              <CardItem translateZ={50} className="text-3xl font-bold text-white mb-4 text-center w-full">
                {card.title}
              </CardItem>
              <CardItem translateZ={30} className="text-gray-400 text-sm">
                {card.desc}
              </CardItem>
            </CardBody>
          </CardContainer>
        ))}
      </div>
    </section>
  );
} 