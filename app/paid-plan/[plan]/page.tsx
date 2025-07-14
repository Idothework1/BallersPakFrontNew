import { Metadata } from "next";
import { notFound } from "next/navigation";
import PaidPlanFlow from "@/components/PaidPlanFlow";
import FadeInOverlay from "@/components/fade-in-overlay";
import DotPatternWithGlowEffectDemo from "@/components/DotPatternWithGlowEffectDemo";

interface PaidPlanPageProps {
  params: {
    plan: string;
  };
}

export async function generateMetadata({ params }: PaidPlanPageProps): Promise<Metadata> {
  const { plan } = params;
  
  if (plan === "elite") {
    return {
      title: "Join Elite Plan | BallersPak",
      description: "Join our Elite Plan - Train consistently and grow every week",
    };
  } else if (plan === "pro") {
    return {
      title: "Join Pro Academy Track | BallersPak",
      description: "Join our Pro Academy Track - Go all-in and get on the radar",
    };
  }
  
  return {
    title: "Join Plan | BallersPak",
    description: "Join our football training program",
  };
}

export default function PaidPlanPage({ params }: PaidPlanPageProps) {
  const { plan } = params;
  
  // Validate plan type
  if (plan !== "elite" && plan !== "pro") {
    notFound();
  }
  
  return (
    <>
      <FadeInOverlay duration={800} />
      {/* Dot pattern background */}
      <div className="absolute inset-0 -z-10">
        <DotPatternWithGlowEffectDemo />
      </div>

      <div className="relative container flex min-h-screen w-screen flex-col items-center justify-center py-10">
        <PaidPlanFlow plan={plan} />
      </div>
    </>
  );
} 