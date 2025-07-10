import { ChevronRight } from "lucide-react";

export default function FAQSection() {
  const faqs = [
    {
      q: "Is this for beginners or advanced players?",
      a: "Both. Our program adapts to your level and gives direct feedback to improve fast.",
    },
    {
      q: "What if I miss a session?",
      a: "All content is recorded and available anytime.",
    },
    {
      q: "Will I really hear from the pro players?",
      a: "Yes. Our elite players host monthly live sessions + review selected student videos.",
    },
    {
      q: "How often are the sessions?",
      a: "It depends on the package, but you’ll get at least 2 live sessions per week— and you can join up to 7 sessions weekly if you choose the full-access option.",
    },
    {
      q: "How does the online academy actually work?",
      a: "It’s not just pre-recorded videos. You’ll join real training sessions and live lectures with our mentors and coaches. Each week you receive training plans, tactical breakdowns, mindset work, and career guidance—all structured so you can train independently and progress faster.",
    },
    {
      q: "How old do I need to be to join the academy?",
      a: "We currently work with committed players between the ages of 8 and 18.",
    },
  ];

  return (
    <section id="faqs" className="mx-auto max-w-[80rem] px-6 md:px-8 py-20">
      <h2 className="text-center text-4xl font-semibold text-white mb-12">FAQs</h2>
      <div className="space-y-4">
        {faqs.map((item) => (
          <details key={item.q} className="group rounded-lg bg-gray-800/30 border border-gray-700">
            <summary className="flex cursor-pointer items-center justify-between p-4 text-lg font-medium text-white">
              <span>{item.q}</span>
              <ChevronRight className="h-5 w-5 flex-shrink-0 transition-transform duration-300 group-open:rotate-90" />
            </summary>
            <p className="px-4 pb-4 text-gray-400">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
} 