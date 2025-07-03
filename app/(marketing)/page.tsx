import ClientSection from "@/components/landing/client-section";
import CallToActionSection from "@/components/landing/cta-section";
import HeroSection from "@/components/landing/hero-section";
import Particles from "@/components/magicui/particles";
import { SphereMask } from "@/components/magicui/sphere-mask";
import AboutSection from "@/components/landing/about-section";
import MissionSection from "@/components/landing/mission-section";
import FeatureCardsSection from "@/components/landing/feature-cards-section";
import PlayersMarqueeSection from "@/components/landing/players-marquee-section";

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
      <Particles
        className="absolute inset-0 -z-10"
        quantity={50}
        ease={70}
        size={0.05}
        staticity={40}
        color={"#ffffff"}
      />
    </>
  );
}
