export default function ProblemSection() {
  return (
    <section id="problem" className="relative mx-auto max-w-[80rem] px-6 md:px-8 py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-red-800/5 rounded-3xl"></div>
      
      <div className="relative text-center">
        {/* Main heading with better typography */}
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Why Most Talented Players in Pakistan 
          <span className="block text-red-400">Never Go Pro</span>
        </h2>
        
        {/* Subheading with emphasis */}
        <div className="inline-block bg-red-500/20 border border-red-500/30 rounded-full px-6 py-3 mb-12">
          <h3 className="text-lg md:text-xl font-semibold text-red-300">
            You&apos;re Not Failing—The System Is
          </h3>
        </div>

        {/* Problems grid */}
        <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            "Lack of access to elite coaching",
            "No clear roadmap to European opportunities", 
            "Limited feedback or tactical education",
            "Mindset struggles, low confidence, and self-doubt",
          ].map((item, index) => (
            <div key={item} className="group bg-gray-900/50 border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/50 hover:border-red-500/30 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                  <span className="text-red-400 text-lg">❌</span>
                </div>
                <p className="text-gray-300 group-hover:text-white transition-colors duration-300 text-left leading-relaxed">
                  {item}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial card */}
        <div className="mx-auto max-w-3xl bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm">
          <div className="text-4xl text-gray-500 mb-4">&ldquo;</div>
          <blockquote className="text-lg md:text-xl text-gray-300 italic leading-relaxed mb-6">
            I used to train every day—but I didn&apos;t know if I was doing it right. Then I got feedback
            from <span className="font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Brahim Díaz</span> and everything changed.
          </blockquote>
          <div className="text-right">
            <cite className="text-gray-400 not-italic">
              <span className="font-semibold text-white">— Ahmed, 16</span>, Lahore
            </cite>
          </div>
        </div>
      </div>
    </section>
  );
} 