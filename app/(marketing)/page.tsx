import HeroSection from "@/components/landing/hero-section";
import FeatureCardsSection from "@/components/landing/feature-cards-section";
import CallToActionSection from "@/components/landing/cta-section";
import ProblemSection from "@/components/landing/problem-section";
import SolutionSection from "@/components/landing/solution-section";
import EliteCoachesSection from "@/components/landing/elite-coaches-section";
import HowItWorksSection from "@/components/landing/how-it-works-section";
import RoadmapSection from "@/components/landing/roadmap-section";
import FAQSection from "@/components/landing/faq-section";
import ClientSection from "@/components/landing/client-section";
import ChooseStartSection from "@/components/landing/choose-start-section";
import { SphereMask } from "@/components/magicui/sphere-mask";

export default async function Page() {
  return (
    <>
      <HeroSection />
      <ClientSection />
      <SphereMask />
      <ProblemSection />
      <SolutionSection />
      <EliteCoachesSection />
      <FeatureCardsSection />
      <HowItWorksSection />
      <RoadmapSection />
      <ChooseStartSection />
      <CallToActionSection />
      <FAQSection />
    </>
  );
}
