"use client";

import { Button } from "@/components/ui/button";

export default function AmbassadorPage() {
  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 md:px-6 py-12 md:py-20">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🌟 Become an Official Ambassador
          </h1>
          <div className="w-20 h-1 bg-green-500 mx-auto"></div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 md:space-y-8">
          {/* Introduction */}
          <div className="w-full rounded-lg p-4 md:p-6 border border-gray-800 bg-gray-900/50">
            <div className="text-center mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold text-white mb-3">
                Help us grow the future of football in Pakistan — and get rewarded for it.
              </h2>
            </div>
            
            <p className="text-gray-300 leading-relaxed text-center text-sm md:text-base">
              We're building a movement to bring elite football training to every corner of Pakistan. If you believe in our mission and want to be part of something bigger, join our Ambassador Program.
            </p>
          </div>

          {/* Who It's For */}
          <div className="w-full rounded-lg p-4 md:p-6 border border-gray-800 bg-gray-900/50">
            <h3 className="text-lg md:text-xl font-bold text-white mb-3 text-center">
              Who It's For
            </h3>
            <div className="w-16 h-1 bg-green-500 mx-auto mb-4 md:mb-6"></div>
            
            <div className="space-y-3 text-sm md:text-base">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 leading-relaxed">
                  Passionate players, coaches, or fans who want to promote football
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 leading-relaxed">
                  Anyone connected to a school, academy, or local club
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 leading-relaxed">
                  Creators and influencers in the sports or youth space
                </p>
              </div>
            </div>
          </div>

          {/* What You'll Get */}
          <div className="w-full rounded-lg p-4 md:p-6 border border-gray-800 bg-gray-900/50">
            <h3 className="text-lg md:text-xl font-bold text-white mb-3 text-center">
              What You'll Get
            </h3>
            <div className="w-16 h-1 bg-green-500 mx-auto mb-4 md:mb-6"></div>
            
            <div className="space-y-3 text-sm md:text-base">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 leading-relaxed">
                  Earn rewards for every new member you refer
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 leading-relaxed">
                  Get early access to new training drops and merch
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 leading-relaxed">
                  Feature on our website + social channels
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 leading-relaxed">
                  Special invite-only calls with pro players & mentors
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 leading-relaxed">
                  Build your resume — great for players, students, and youth leaders
                </p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="w-full rounded-lg p-4 md:p-6 border border-gray-800 bg-gray-900/50">
            <h3 className="text-lg md:text-xl font-bold text-white mb-3 text-center">
              How It Works
            </h3>
            <div className="w-16 h-1 bg-green-500 mx-auto mb-4 md:mb-6"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 md:p-4 border border-gray-700 rounded-lg bg-gray-800/50">
                <div className="w-10 h-10 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-black">
                  1
                </div>
                <h4 className="text-sm md:text-base font-semibold text-white mb-1">Apply</h4>
                <p className="text-gray-400 text-xs">
                  Apply with a short form
                </p>
              </div>
              
              <div className="text-center p-3 md:p-4 border border-gray-700 rounded-lg bg-gray-800/50">
                <div className="w-10 h-10 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-black">
                  2
                </div>
                <h4 className="text-sm md:text-base font-semibold text-white mb-1">Get Tools</h4>
                <p className="text-gray-400 text-xs">
                  Get your personal link & toolkit
                </p>
              </div>

              <div className="text-center p-3 md:p-4 border border-gray-700 rounded-lg bg-gray-800/50">
                <div className="w-10 h-10 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-black">
                  3
                </div>
                <h4 className="text-sm md:text-base font-semibold text-white mb-1">Earn Rewards</h4>
                <p className="text-gray-400 text-xs">
                  Start spreading the word and earning rewards
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="w-full rounded-lg p-6 md:p-8 border border-gray-800 bg-gray-900/50 text-center">
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-bold text-white">
                Ready to Make an Impact?
              </h3>
              <p className="text-gray-300 text-sm md:text-base mb-6">
                Join our mission to revolutionize football training in Pakistan
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-500 to-emerald-400 hover:opacity-90 text-black font-semibold px-8 py-3"
              >
                🟢 Apply to Be an Ambassador
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 