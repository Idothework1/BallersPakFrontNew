"use client";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 md:px-6 py-12 md:py-20">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About Us
          </h1>
          <div className="w-20 h-1 bg-green-500 mx-auto"></div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 md:space-y-8">
          {/* Introduction */}
          <div className="w-full rounded-lg p-4 md:p-6 border border-gray-800 bg-gray-900/50">
            <div className="text-center mb-4 md:mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-800 rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-green-500">
                <span className="text-xl md:text-2xl">👨‍💼</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white mb-1">Aamir Mushtaq</h2>
              <p className="text-green-400 text-sm">Founder & Head Coach</p>
            </div>
            
            <div className="space-y-3 md:space-y-4 text-sm md:text-base">
              <p className="text-gray-300 leading-relaxed">
                Hi, I'm <span className="text-green-400">Aamir</span> — a football coach, player mentor, and believer in unlocking potential.
              </p>
              
              <p className="text-gray-300 leading-relaxed">
                Over the past <span className="text-green-400">10+ years</span>, I've worked with youth athletes around the world, helping them develop not just their skills, but their mindset. I've seen firsthand how young talent in Pakistan is often overlooked — not because it lacks passion or potential, but because it lacks access.
              </p>
              
              <p className="text-gray-300 leading-relaxed">
                That's why I built this platform: to give ambitious players in Pakistan the chance to train like the pros — and learn directly from those playing at the top level in Europe today.
              </p>
              
              <p className="text-gray-300 leading-relaxed">
                Through partnerships with elite athletes like <span className="text-green-400">Brahim Díaz</span>, <span className="text-green-400">Luka Modrić</span>, and others competing in the UEFA Champions League, we offer more than drills — we offer a path.
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="w-full rounded-lg p-4 md:p-6 border border-gray-800 bg-gray-900/50">
            <h3 className="text-lg md:text-xl font-bold text-white mb-3 text-center">
              My Mission
            </h3>
            <div className="w-16 h-1 bg-green-500 mx-auto mb-4"></div>
            
            <p className="text-gray-300 leading-relaxed text-center mb-4 md:mb-6 text-sm md:text-base">
              To help young players transform their game, sharpen their mindset, and unlock real opportunities to pursue football professionally — no matter where they start.
            </p>

            <div className="text-center bg-gray-800/50 rounded-lg p-3 md:p-4 border border-gray-700">
              <p className="text-white font-medium mb-2 text-sm md:text-base">
                If you're serious about the game, and you dream big — you're in the right place.
              </p>
              <p className="text-green-400 font-semibold mb-3">
                Let's get to work.
              </p>
              <p className="text-gray-400 text-xs">
                — Aamir Mushtaq
              </p>
            </div>
          </div>

          {/* Elite Partners */}
          <div className="w-full rounded-lg p-4 md:p-6 border border-gray-800 bg-gray-900/50">
            <h3 className="text-lg md:text-xl font-bold text-white mb-3 text-center">
              Elite Training Partners
            </h3>
            <div className="w-16 h-1 bg-green-500 mx-auto mb-4 md:mb-6"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="text-center p-3 md:p-4 border border-gray-700 rounded-lg bg-gray-800/50">
                <div className="w-10 h-10 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-sm">⚽</span>
                </div>
                <h4 className="text-sm md:text-base font-semibold text-white mb-1">Brahim Díaz</h4>
                <p className="text-green-400 text-xs">Real Madrid</p>
                <p className="text-gray-400 text-xs">Attacking Midfielder</p>
              </div>
              
              <div className="text-center p-3 md:p-4 border border-gray-700 rounded-lg bg-gray-800/50">
                <div className="w-10 h-10 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-sm">⚽</span>
                </div>
                <h4 className="text-sm md:text-base font-semibold text-white mb-1">Luka Modrić</h4>
                <p className="text-green-400 text-xs">Real Madrid</p>
                <p className="text-gray-400 text-xs">Central Midfielder</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 