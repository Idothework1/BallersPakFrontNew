"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PlayerLayout from "@/components/player/PlayerLayout";
import PlayerOverview from "@/components/player/PlayerOverview";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";
import { TextAnimate } from "@/components/magicui/text-animate";
import FadeInOverlay from "@/components/fade-in-overlay";
import DotPatternWithGlowEffectDemo from "@/components/DotPatternWithGlowEffectDemo";

interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  age: string;
  birthday: string;
  planType: string;
  paymentStatus: string;
  position: string;
  currentLevel: string;
  location: string;
  goal: string;
  timestamp: string;
  status?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", birthday: "" });
  const [loginError, setLoginError] = useState("");
  const [errorType, setErrorType] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setShowLogin(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setErrorType("");
    
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      
      if (result.success) {
        setUser(result.user);
        localStorage.setItem("user", JSON.stringify(result.user));
        setShowLogin(false);
      } else {
        // Handle specific error types
        if (result.error === "pending_approval") {
          setErrorType("pending");
          setLoginError(result.message || "Your application is pending approval.");
        } else if (result.error === "application_rejected") {
          setErrorType("rejected");
          setLoginError(result.message || "Your application has been rejected.");
        } else {
          setErrorType("invalid");
          setLoginError(result.message || result.error || "Login failed");
        }
      }
    } catch (error) {
      setErrorType("network");
      setLoginError("Network error. Please try again.");
    }
  };

  const getPlayerName = () => {
    if (!user) return "Ibrahim";
    return user.fullName || `${user.firstName} ${user.lastName}`;
  };

  const getPlayerTier = () => {
    if (!user) return "Pro";
    switch (user.planType) {
      case "elite":
        return "Elite";
      case "pro":
        return "Pro";
      default:
        return "Free";
    }
  };

  const getJoinDate = () => {
    if (!user) return "July 2025";
    const date = new Date(user.timestamp);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (showLogin) {
    return (
      <>
        <FadeInOverlay duration={800} />
        <div className="absolute inset-0 -z-10">
          <DotPatternWithGlowEffectDemo />
        </div>
        
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8 backdrop-blur-md">
              <div className="text-center mb-6">
                <Key className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                <TextAnimate
                  animation="blurInUp"
                  once
                  className="text-2xl font-bold text-white mb-2"
                >
                  Player Login
                </TextAnimate>
                <p className="text-gray-300 text-sm">
                  Enter your email and birthday (your password) to access your profile
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Birthday (Password)
                  </label>
                  <input
                    type="date"
                    value={loginData.birthday}
                    onChange={(e) => setLoginData({ ...loginData, birthday: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {loginError && (
                  <div className={`rounded-lg p-4 text-sm ${
                    errorType === "pending" 
                      ? "bg-yellow-900/30 border border-yellow-700 text-yellow-300"
                      : errorType === "rejected"
                      ? "bg-red-900/30 border border-red-700 text-red-300"
                      : "bg-red-900/30 border border-red-700 text-red-300"
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {errorType === "pending" && <span className="text-lg">⏳</span>}
                        {errorType === "rejected" && <span className="text-lg">❌</span>}
                        {(errorType === "invalid" || errorType === "network") && <span className="text-lg">⚠️</span>}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium mb-1">
                          {errorType === "pending" && "Application Under Review"}
                          {errorType === "rejected" && "Application Rejected"}
                          {errorType === "invalid" && "Login Failed"}
                          {errorType === "network" && "Connection Error"}
                        </div>
                        <div className="text-xs opacity-90">
                          {loginError}
                        </div>
                        {errorType === "pending" && (
                          <div className="mt-2 text-xs opacity-75">
                            💡 You&apos;ll receive an email notification once your application is approved.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white font-semibold py-3"
                >
                  Login
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <PlayerLayout>
      <PlayerOverview
        playerName={getPlayerName()}
        playerTier={getPlayerTier() as "Pro" | "Elite" | "Free"}
        joinDate={getJoinDate()}
        assignedAdmin="Not yet assigned"
      />
    </PlayerLayout>
  );
} 