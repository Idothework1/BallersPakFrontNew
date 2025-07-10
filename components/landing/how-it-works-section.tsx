export default function HowItWorksSection() {
  const steps = [
    {
      title: "Join & Choose Your Track",
      desc: "Striker, Midfield, Defender, or All-Rounder",
    },
    {
      title: "Instant Access",
      desc: "Weekly training plan and tactical sessions",
    },
    {
      title: "Submit Training Clips",
      desc: "Get feedback from pro coaches",
    },
    {
      title: "Monthly Live Q&As",
      desc: "Chat with your football heroes",
    },
    {
      title: "Earn Certificate",
      desc: "Nomination for scouting events",
    },
  ];

  return (
    <section id="how-it-works" className="mx-auto max-w-[80rem] px-6 md:px-8 py-20 text-center">
      <h2 className="text-4xl font-semibold text-white mb-12">How It Works</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        {steps.map((step) => (
          <div key={step.title} className="flex flex-col items-center">
            <span className="text-5xl font-bold text-primary mb-4">•</span>
            <h3 className="text-2xl font-semibold text-white mb-2">{step.title}</h3>
            <p className="text-gray-400 max-w-xs">{step.desc}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-gray-400 text-sm">
        🧠 Training is designed for players aged 8–18. Only 2 hours/week required.
      </p>
    </section>
  );
} 