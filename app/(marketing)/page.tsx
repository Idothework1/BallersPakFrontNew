import ClientSection from "@/components/landing/client-section";
import CallToActionSection from "@/components/landing/cta-section";
import HeroSection from "@/components/landing/hero-section";
import { SphereMask } from "@/components/magicui/sphere-mask";
import AboutSection from "@/components/landing/about-section";
import MissionSection from "@/components/landing/mission-section";
import FeatureCardsSection from "@/components/landing/feature-cards-section";
import PlayersMarqueeSection from "@/components/landing/players-marquee-section";
import { DotPatternDemo } from "@/components/magicui/dot-pattern-demo";

export default async function Page() {
  return (
    <>
      <HeroSection />
      <ClientSection />
      <SphereMask />
      <AboutSection />
      <MissionSection />
      <FeatureCardsSection />
      <PlayersMarqueeSection />
      <CallToActionSection />
      <DotPatternDemo />
    </>
  );
}
