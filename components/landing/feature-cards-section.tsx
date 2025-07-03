import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { cn } from "@/lib/utils";

export default function FeatureCardsSection() {
  const cards = [
    {
      title: "3,500+ Exercises",
      desc: "Drills to sharpen every aspect of your game.",
    },
    {
      title: "30+ Programs",
      desc: "Structured pathways for progressive growth.",
    },
    {
      title: "Global Community",
      desc: "Train alongside players around the world.",
    },
  ];

  return (
    <section className="mx-auto max-w-[80rem] px-6 md:px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {cards.map((card) => (
          <CardContainer key={card.title} containerClassName="py-0">
            <CardBody className="rounded-xl bg-gray-800/30 p-10 border border-gray-700 text-center">
              <CardItem translateZ={50} className="text-3xl font-bold text-white mb-4">
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