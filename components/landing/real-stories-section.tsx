export default function RealStoriesSection() {
  return (
    <section id="stories" className="mx-auto max-w-[80rem] px-6 md:px-8 py-20 text-center">
      <h2 className="text-4xl font-semibold text-white mb-6">Real Stories</h2>
      <p className="mx-auto max-w-3xl text-lg text-gray-400 mb-10">
        Hear directly from players who transformed their game with BallersPak. Video testimonials
        coming soon!
      </p>
      {/* Placeholder for video clips / testimonials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-60 rounded-xl bg-gray-800/30 border border-gray-700 flex items-center justify-center text-gray-500">
            Video {i}
          </div>
        ))}
      </div>
    </section>
  );
} 