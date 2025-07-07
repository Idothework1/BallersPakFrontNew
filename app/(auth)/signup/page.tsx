import SignupFlow from "@/components/SignupFlow";
import FadeInOverlay from "@/components/fade-in-overlay";
import DotPatternWithGlowEffectDemo from "@/components/DotPatternWithGlowEffectDemo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Magic UI",
  description: "Sign Up for Magic UI",
};

export default function SignUpPage() {
  return (
    <>
      <FadeInOverlay duration={800} />
      {/* Dot pattern background */}
      <div className="absolute inset-0 -z-10">
        <DotPatternWithGlowEffectDemo />
      </div>

      <div className="relative container flex h-screen w-screen flex-col items-center justify-center">
        <SignupFlow />
      </div>
    </>
  );
}
