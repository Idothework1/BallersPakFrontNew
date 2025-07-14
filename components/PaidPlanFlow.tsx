"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { TextAnimate } from "@/components/magicui/text-animate";

interface PaidPlanFlowProps {
  plan: "elite" | "pro";
}

type Step = "onboarding" | "payment" | "success";

export default function PaidPlanFlow({ plan }: PaidPlanFlowProps) {
  const [step, setStep] = useState<Step>("onboarding");
  const router = useRouter();

  // Plan details
  const planDetails = {
    elite: {
      name: "Elite Plan",
      price: "$111",
      period: "/month",
      color: "yellow",
      description: "Train Consistently. Grow Every Week.",
      features: [
        "Full 12-month access to the entire program",
        "Tactical, technical, and mindset modules",
        "Access to monthly Q&A with Champions League-level pros",
        "Mobile-friendly + built for Pakistan-based players",
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canContinueToPayment = () => {
    const { fullName, email, birthday, position, currentLevel } = formData;
    const basicFieldsComplete = fullName && email && birthday && position && currentLevel;
    
    if (plan === "pro") {
      return basicFieldsComplete && formData.whyJoinReason;
    }
    
    return basicFieldsComplete;
  };

  const handleContinueToPayment = () => {
    if (canContinueToPayment()) {
      setStep("payment");
    }
  };

  const handleCompletePayment = async () => {
    try {
      // Calculate age from birthday for display purposes
      const calculateAge = (birthday: string): string => {
        const today = new Date();
        const birthDate = new Date(birthday);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        return age.toString();
      };

      // Prepare payload for paid plan registration
      const payload = {
        planType: plan, // "elite" or "pro"
        paymentStatus: "completed", // simulated payment success
        // Split fullName into firstName and lastName for admin table compatibility
        firstName: formData.fullName.split(' ')[0] || '',
        lastName: formData.fullName.split(' ').slice(1).join(' ') || '',
        fullName: formData.fullName, // Keep fullName for display
        email: formData.email,
        age: calculateAge(formData.birthday), // Calculate age from birthday
        birthday: formData.birthday, // Use actual birthday for login
        position: formData.position,
        experienceLevel: formData.currentLevel, // Map to experienceLevel for admin table
        currentLevel: formData.currentLevel, // Keep currentLevel for compatibility
        whyJoinReason: formData.whyJoinReason, // for pro plans
        goal: "Pro-level training", // default goal for paid plans
        // Set default values for fields that don't apply to paid plans
        playedBefore: "", // Not collected in paid flow
        playedClub: "", // Not collected in paid flow
        clubName: "", // Not collected in paid flow
        gender: "", // Not collected in paid flow
        hasDisability: "", // Not collected in paid flow
        location: "", // Not collected in paid flow
        phone: "", // Not collected in paid flow
        whyJoin: formData.whyJoinReason || "", // Map to whyJoin for compatibility
      };

      // Send to API
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStep("success");
      } else {
        throw new Error("Failed to save registration data");
      }
    } catch (error) {
      console.error("Payment completion error:", error);
      // For demo purposes, still proceed to success
      // In production, show error message
      setStep("success");
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
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
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

          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleContinueToPayment}
              disabled={!canContinueToPayment()}
              className={`px-8 py-3 ${
                plan === "elite"
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-black"
                  : "bg-gradient-to-r from-red-500 to-red-400 text-white"
              } font-semibold disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Continue to Payment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "payment") {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => setStep("onboarding")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back to profile
          </button>
          
          <TextAnimate
            animation="blurInUp"
            once
            className="text-3xl font-bold text-white mb-6"
          >
            Complete Your Enrollment
          </TextAnimate>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-md">
            <h3 className="text-xl font-bold text-white mb-4">Order Summary</h3>
            
            <div className={`p-4 rounded-lg border-2 mb-6 ${
              plan === "elite" 
                ? "border-yellow-500 bg-yellow-500/10" 
                : "border-red-500 bg-red-500/10"
            }`}>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-white">{currentPlan.name}</h4>
                <span className="text-2xl font-bold text-white">
                  {currentPlan.price}
                  <span className="text-sm font-normal text-gray-400">
                    {currentPlan.period}
                  </span>
                </span>
              </div>
              <p className="text-sm text-gray-300 mb-3">{currentPlan.description}</p>
            </div>

            <div className="space-y-2 mb-6">
              <h4 className="font-semibold text-white">What you get:</h4>
              <ul className="space-y-1">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total</span>
                <span className="text-2xl font-bold text-white">
                  {currentPlan.price}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-md">
            <h3 className="text-xl font-bold text-white mb-4">Payment Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1234 5678 9012 3456"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-900/30 border border-green-700 rounded-lg">
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>🔒 SSL Secured • 30-day money-back guarantee</span>
              </div>
            </div>

            <Button
              onClick={handleCompletePayment}
              className={`w-full mt-6 py-3 ${
                plan === "elite"
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-black"
                  : "bg-gradient-to-r from-red-500 to-red-400 text-white"
              } font-semibold text-lg`}
            >
              Complete Enrollment
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