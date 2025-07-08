export default function ProblemSection() {
  return (
    <section id="problem" className="mx-auto max-w-[80rem] px-6 md:px-8 py-20 text-center">
      <h2 className="text-4xl font-semibold text-white mb-4">
        Why Most Talented Players in Pakistan Never Go Pro
      </h2>
      <h3 className="text-xl font-medium text-primary mb-8">
        You’re Not Failing—The System Is
      </h3>

      <div className="mx-auto max-w-xl space-y-3 text-left mb-10">
        {[
          "Lack of access to elite coaching",
          "No clear roadmap to European opportunities",
          "Limited feedback or tactical education",
          "Mindset struggles, low confidence, and self-doubt",
        ].map((item) => (
          <p key={item} className="flex items-start text-gray-400">
            <span className="mr-3 text-red-500">❌</span> {item}
          </p>
        ))}
      </div>

      <blockquote className="mx-auto max-w-2xl italic text-gray-300">
        “I used to train every day—but I didn’t know if I was doing it right. Then I got feedback
        from <span className="font-semibold text-white">Brahim Díaz</span> and everything changed.” – Ahmed, 16, Lahore
      </blockquote>
    </section>
  );
} 