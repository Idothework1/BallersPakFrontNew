"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { TextAnimate } from "@/components/magicui/text-animate";

interface PaidPlanFlowProps {
  plan: "elite" | "pro";
}

type Step = "onboarding" | "success";

export default function PaidPlanFlow({ plan }: PaidPlanFlowProps) {
  const [step, setStep] = useState<Step>("onboarding");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const billing = searchParams.get("billing") || "annual"; // default to annual

  // Plan details based on billing type
  const planDetails = {
    elite: billing === "monthly" ? {
      name: "Elite Plan - Monthly",
      price: "$15",
      period: "per month",
      color: "yellow",
      description: "Train Consistently. Grow Every Week.",
      features: [
        "Full access to the entire program",
        "Tactical, technical, and mindset modules",
        "Access to monthly Q&A with Champions League-level pros",
        "Mobile-friendly + built for Pakistan-based players",
        "Cancel anytime",
      ],
    } : {
      name: "Elite Plan - Annual",
      price: "$111",
      period: "One-Time Payment",
      color: "yellow",
      description: "Train Consistently. Grow Every Week.",
      features: [
        "Full 12-month access to the entire program",
        "Tactical, technical, and mindset modules",
        "Access to monthly Q&A with Champions League-level pros",
        "Mobile-friendly + built for Pakistan-based players",
        "Save $69 compared to monthly payments",
      ],
    },
    pro: {
      name: "Pro Academy Track",
      price: "$299",
      period: "One-Time",
      color: "red",
      description: "Go All-In. Get on the Radar.",
      features: [
        "Full 12-month access to the entire program",
        "Tactical, technical, and mindset modules",
        "Weekly elite video training sessions",
        "Personalized certificate (A-Team Track)",
        "Priority for scouting Nomination and Trial, if you fit the part",
        "Opportunity for a transfer to top clubs if we believe you're ready",
        "Bonus: Support building your highlight reel and Professional CV",
      ],
    },
  };

  const currentPlan = planDetails[plan];

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    birthday: "", // Changed from age to birthday
    position: "",
    currentLevel: "",
    whyJoinReason: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    general: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (field === "email" && errors.email) {
      setErrors(prev => ({ ...prev, email: "" }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: "" }));
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const canContinueToPayment = () => {
    const { fullName, email, birthday, position, currentLevel } = formData;
    const basicFieldsComplete = fullName && email && birthday && position && currentLevel;
    const isEmailValid = validateEmail(email);
    
    if (plan === "pro") {
      return basicFieldsComplete && formData.whyJoinReason && isEmailValid;
    }
    
    return basicFieldsComplete && isEmailValid;
  };

  const handleContinueToPayment = async () => {
    // Validate email first
    if (!validateEmail(formData.email)) {
      setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
      return;
    }

    if (canContinueToPayment()) {
      // Skip the intermediate payment screen and go directly to Stripe
      await handleCompletePayment();
    }
  };

  const handleCompletePayment = async () => {
    try {
      setIsLoading(true);
      setErrors(prev => ({ ...prev, general: "" })); // Clear any previous errors
      
      // Create Stripe checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: plan,
          billing: billing,
          formData: formData
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      setIsLoading(false);
      
      // Show specific error message
      let errorMessage = "Failed to initiate payment. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("email")) {
          setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
          return;
        } else {
          errorMessage = error.message;
        }
      }
      
      setErrors(prev => ({ ...prev, general: errorMessage }));
    }
  };

  if (step === "onboarding") {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back to pricing
          </button>
          
          <TextAnimate
            animation="blurInUp"
            once
            className="text-3xl font-bold text-white mb-2"
          >
            Create Your Player Profile & Secure Your Spot
          </TextAnimate>
          
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 ${
            plan === "elite" 
              ? "bg-yellow-500 text-black" 
              : "bg-red-500 text-white"
          }`}>
            {plan === "elite" ? "🟡" : "🔴"} {currentPlan.name} - {currentPlan.price} {currentPlan.period}
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8 backdrop-blur-md">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  errors.email 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-gray-600 focus:ring-blue-500"
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Player&apos;s Birthday *
              </label>
              <input
                type="date"
                value={formData.birthday}
                onChange={(e) => handleInputChange("birthday", e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Select birthday"
              />
              <p className="text-xs text-gray-400 mt-1">
                💡 Your birthday will be used as your password to access your profile
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Preferred Position *
              </label>
              <select
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select position</option>
                <option value="goalkeeper">Goalkeeper</option>
                <option value="defender">Defender</option>
                <option value="midfielder">Midfielder</option>
                <option value="forward">Forward</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Level *
              </label>
              <select
                value={formData.currentLevel}
                onChange={(e) => handleInputChange("currentLevel", e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select level</option>
                <option value="beginner">Beginner</option>
                <option value="academy">Academy</option>
                <option value="semi-pro">Semi-Pro</option>
                <option value="club-player">Club Player</option>
              </select>
            </div>

            {plan === "pro" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tell us why you want to join the A-Team Track *
                </label>
                <textarea
                  value={formData.whyJoinReason}
                  onChange={(e) => handleInputChange("whyJoinReason", e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Tell us about your goals and motivation..."
                  rows={4}
                />
              </div>
            )}
          </div>

          {errors.general && (
            <div className="mt-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
              <p className="text-red-400 text-sm">{errors.general}</p>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleContinueToPayment}
              disabled={!canContinueToPayment() || isLoading}
              className={`px-8 py-3 ${
                plan === "elite"
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-black"
                  : "bg-gradient-to-r from-red-500 to-red-400 text-white"
              } font-semibold disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? "Redirecting to Payment..." : "Continue to Payment"}
            </Button>
          </div>
        </div>
      </div>
    );
  }


  if (step === "success") {
    return (
      <div className="w-full max-w-2xl mx-auto text-center">
        <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8 backdrop-blur-md">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            
            <TextAnimate
              animation="blurInUp"
              once
              className="text-3xl font-bold text-white mb-2"
            >
              You&apos;re in! Welcome to the BallersPak Family ⚽️
            </TextAnimate>
            
            <p className="text-gray-300 text-lg mb-6">
              Check your player dashboard for your next steps.
            </p>
          </div>

          <div className="bg-green-900/30 border border-green-700 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-green-400 mb-2">What happens next?</h3>
            <ul className="text-sm text-gray-300 space-y-2 text-left">
              <li>• You&apos;ll receive a welcome email with login details</li>
              <li>• Access to your training modules will be available immediately</li>
              <li>• Monthly Q&A sessions with Champions League pros</li>
              <li>• Your personalized certificate will be prepared</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push("/profile")}
              className="bg-gradient-to-r from-green-500 to-emerald-400 text-black font-semibold"
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
} 