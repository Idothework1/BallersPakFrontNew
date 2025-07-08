export default function SolutionSection() {
  return (
    <section id="solution" className="mx-auto max-w-[80rem] px-6 md:px-8 py-20 text-center">
      <h2 className="text-4xl font-semibold text-white mb-4">
        Introducing the “Pro-Level Training System”
      </h2>
      <h3 className="text-xl font-medium text-primary mb-8">
        🔥 Your Fast-Track to Becoming a Pro, Designed by the Pros Themselves
      </h3>

      <div className="mx-auto max-w-3xl space-y-4 text-left">
        {[
          {
            title: "Skill Mastery Tracks",
            desc: "Drills used by UEFA-level players, adapted for any environment",
          },
          {
            title: "Tactical IQ Sessions",
            desc: "Learn how the best read the game with real match breakdowns",
          },
          {
            title: "Mindset Mentorship",
            desc: "Pro psychology to keep you focused, motivated, and mentally strong",
          },
          {
            title: "Direct Feedback from Pros",
            desc: "Submit your training videos and get actionable critiques",
          },
          {
            title: "Career Path Guidance",
            desc: "Learn how to get noticed, craft a highlight reel, and pursue club trials",
          },
        ].map((item) => (
          <div key={item.title} className="flex items-start">
            <span className="mr-3 text-green-500">✅</span>
            <p className="text-gray-400">
              <span className="font-semibold text-white">{item.title}</span> – {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
} 