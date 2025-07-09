"use client";

import { Button } from "@/components/ui/button";

export default function AmbassadorPage() {
  const responsibilities = [
    "Spread the Word: Invite your circle to join BallersPak.",
    "Engage the Community: Be the bridge between new users and the BallersPak ecosystem.",
    "Grow with Us: Represent the brand online and offline.",
  ];

  const perks = [
    "Earn rewards for every successful referral",
    "Exclusive access to insider content & early features",
    "Build cred with a verified Ambassador badge",
  ];

  const candidates = [
    "Campus leaders, content creators & community builders",
    "Passionate about tech, lifestyle, and helping others grow",
    "Active on social media or within a niche community",
  ];

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-24 flex flex-col items-center text-center space-y-10">
      {/* Heading */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white flex flex-col gap-1">
          <span>🎓 Become an Official BallersPak Ambassador</span>
        </h1>
        <p className="text-xl font-semibold text-primary-foreground/90">
          Be More Than Just a Fan. Be a Leader. Join the movement. Get rewarded.
        </p>
      </div>

      {/* Intro paragraph */}
      <p className="text-lg text-gray-300 leading-relaxed">
        Are you passionate about building communities and helping others level up? As an official BallersPak
        Ambassador, you’ll represent the leading platform for bold, driven individuals. Whether you&apos;re on campus,
        online, or in your local scene — you’ll help bring more people into the Pak, and earn exclusive rewards while
        doing it.
      </p>

      {/* Responsibilities */}
      <div className="w-full text-left space-y-4">
        <h2 className="text-2xl font-semibold text-white">💼 What You’ll Do</h2>
        <ul className="list-disc ml-6 space-y-2 text-gray-300">
          {responsibilities.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>

      {/* Perks */}
      <div className="w-full text-left space-y-4">
        <h2 className="text-2xl font-semibold text-white">🎁 Perks & Benefits</h2>
        <ul className="list-disc ml-6 space-y-2 text-gray-300">
          {perks.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>

      {/* Who we're looking for */}
      <div className="w-full text-left space-y-4">
        <h2 className="text-2xl font-semibold text-white">🌍 Who We&apos;re Looking For</h2>
        <ul className="list-disc ml-6 space-y-2 text-gray-300">
          {candidates.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">📝 Ready to Represent?</h2>
        <a href="mailto:ambassador@ballerspak.com">
          <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-green-400 hover:opacity-90">
            Apply Now
          </Button>
        </a>
        <p className="text-sm text-gray-400 max-w-md">
          Together, we don’t just grow — we level up.
        </p>
      </div>
    </section>
  );
} 