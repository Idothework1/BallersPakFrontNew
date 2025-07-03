import { cn } from "@/lib/utils";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="mx-auto max-w-[80rem] px-6 md:px-8 py-20 text-center"
    >
      <h2 className="text-4xl font-semibold text-white mb-6">About Us</h2>
      <p className="mx-auto max-w-3xl text-lg text-gray-400 mb-10">
        BallersPak is an international football academy connecting aspiring
        players across the globe with elite-level coaching and resources.
        Unlock your potential with world-class training, community, and
        expertise—all online.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div className="flex flex-col items-center">
          <span className="text-5xl font-bold text-white">3,500+</span>
          <span className="mt-2 text-gray-400">Training Exercises</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-5xl font-bold text-white">30+</span>
          <span className="mt-2 text-gray-400">Structured Programs</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-5xl font-bold text-white">Worldwide</span>
          <span className="mt-2 text-gray-400">Community</span>
        </div>
      </div>
    </section>
  );
} 