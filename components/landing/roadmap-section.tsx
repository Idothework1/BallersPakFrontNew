export default function RoadmapSection() {
  const phases = [
    { phase: "Backyard", desc: "Master fundamentals with at-home drills" },
    { phase: "Academy", desc: "Refine technique & tactical IQ in virtual sessions" },
    { phase: "Trials", desc: "Showcase skills at partner clubs across Europe" },
  ];

  return (
    <section id="roadmap" className="mx-auto max-w-[80rem] px-6 md:px-8 py-20 text-center">
      <h2 className="text-4xl font-semibold text-white mb-12">🚀 The Roadmap</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {phases.map((p) => (
          <div key={p.phase} className="border border-gray-700 rounded-xl p-6 bg-gray-800/30">
            <h3 className="text-2xl font-bold text-white mb-2">{p.phase}</h3>
            <p className="text-gray-400">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
} 