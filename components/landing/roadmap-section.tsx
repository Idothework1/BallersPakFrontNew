export default function RoadmapSection() {
  const phases = [
    { 
      phase: "Foundation", 
      desc: "Master fundamentals with at-home drills",
      details: "Build your technical base with ball control, passing accuracy, and basic movements",
      icon: "🏠",
      color: "from-blue-500 to-cyan-400"
    },
    { 
      phase: "Academy", 
      desc: "Refine technique & tactical IQ in virtual sessions",
      details: "Advanced drills, position-specific training, and live feedback from pro mentors",
      icon: "🎓",
      color: "from-green-500 to-emerald-400"
    },
    { 
      phase: "Pro Track", 
      desc: "Showcase skills at partner clubs across Europe",
      details: "Get scouted, receive club trial invitations, and pursue professional opportunities",
      icon: "⚽",
      color: "from-yellow-500 to-orange-400"
    },
  ];

  return (
    <section id="roadmap" className="mx-auto max-w-[80rem] px-6 md:px-8 py-20 text-center">
      <div className="mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          🚀 Your Journey to Pro
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          From backyard training to European trials - here&apos;s your complete pathway to professional football
        </p>
      </div>

      <div className="relative">
        {/* Desktop connecting line */}
        <div className="hidden md:block absolute top-24 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
          <div className="flex items-center justify-between px-16">
            <div className="flex-1 h-1 bg-gradient-to-r from-blue-500 to-green-500"></div>
            <div className="w-8"></div>
            <div className="flex-1 h-1 bg-gradient-to-r from-green-500 to-yellow-500"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
          {phases.map((phase, index) => (
            <div key={phase.phase} className="group relative">
              {/* Step number */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${phase.color} flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {index + 1}
                </div>
              </div>

              {/* Main card */}
              <div className="border border-gray-700 rounded-2xl p-8 bg-gray-800/40 backdrop-blur-sm group-hover:bg-gray-700/50 group-hover:border-gray-600 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl mt-6">
                {/* Icon */}
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {phase.icon}
                </div>
                
                {/* Phase name */}
                <h3 className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${phase.color} mb-3`}>
                  {phase.phase}
                </h3>
                
                {/* Main description */}
                <p className="text-white font-medium text-lg mb-3">
                  {phase.desc}
                </p>
                
                {/* Detailed description */}
                <p className="text-gray-400 text-sm leading-relaxed">
                  {phase.details}
                </p>

                {/* Progress indicator */}
                <div className="mt-6 w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${phase.color} transition-all duration-1000`}
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>

              {/* Mobile connecting arrow */}
              {index < phases.length - 1 && (
                <div className="md:hidden flex justify-center mt-6 mb-2">
                  <div className="text-3xl text-gray-600">↓</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h3>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Join thousands of players who have already begun their transformation from amateur to professional.
          </p>
        </div>
      </div>
    </section>
  );
} 