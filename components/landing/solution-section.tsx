export default function SolutionSection() {
  return (
    <section id="solution" className="relative mx-auto max-w-[80rem] px-6 md:px-8 py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-transparent to-blue-800/5 rounded-3xl"></div>
      
      <div className="relative text-center">
        {/* Main heading with better typography */}
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Introducing the 
          <span className="block bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            "Pro-Level Training System"
          </span>
        </h2>
        
        {/* Subheading with fire emoji and emphasis */}
        <div className="inline-block bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full px-8 py-4 mb-16">
          <h3 className="text-lg md:text-xl font-semibold text-orange-300">
            🔥 Your Fast-Track to Becoming a Pro, Designed by the Pros Themselves
          </h3>
        </div>

                 {/* Features grid */}
         <div className="mx-auto max-w-6xl">
           {/* Top 3 cards */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
             {[
               {
                 title: "Skill Mastery Tracks",
                 desc: "Drills used by UEFA-level players, adapted for any environment"
               },
               {
                 title: "Tactical IQ Sessions", 
                 desc: "Learn how the best read the game with real match breakdowns"
               },
               {
                 title: "Mindset Mentorship",
                 desc: "Pro psychology to keep you focused, motivated, and mentally strong"
               },
             ].map((item, index) => (
               <div key={item.title} className="relative group bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 rounded-2xl p-6 hover:scale-105 hover:shadow-2xl hover:border-green-500/50 transition-all duration-300">
                 {/* Title */}
                 <h4 className="text-xl font-bold text-green-400 mb-3 group-hover:text-white transition-colors duration-300">
                   {item.title}
                 </h4>
                 
                 {/* Description */}
                 <p className="text-gray-400 group-hover:text-gray-200 transition-colors duration-300 leading-relaxed">
                   {item.desc}
                 </p>
                 
                 {/* Hover effect border */}
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
               </div>
             ))}
           </div>
           
           {/* Bottom 2 cards - centered */}
           <div className="flex justify-center">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
               {[
                 {
                   title: "Direct Feedback from Pros",
                   desc: "Submit your training videos and get actionable critiques"
                 },
                 {
                   title: "Career Path Guidance",
                   desc: "Learn how to get noticed, craft a highlight reel, and pursue club trials"
                 },
               ].map((item, index) => (
                 <div key={item.title} className="relative group bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 rounded-2xl p-6 hover:scale-105 hover:shadow-2xl hover:border-green-500/50 transition-all duration-300">
              {/* Title */}
              <h4 className="text-xl font-bold text-green-400 mb-3 group-hover:text-white transition-colors duration-300">
                {item.title}
              </h4>
              
              {/* Description */}
              <p className="text-gray-400 group-hover:text-gray-200 transition-colors duration-300 leading-relaxed">
                {item.desc}
              </p>
              
              {/* Hover effect border */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
      
    {/* Call to action hint */}
    <div className="mt-16 text-center">
      <p className="text-gray-400 text-lg">
        Ready to transform your game? 
        <span className="text-white font-semibold ml-2">Join thousands of players already training like pros.</span>
      </p>
    </div>
  </div>
    </section>
  );
} 