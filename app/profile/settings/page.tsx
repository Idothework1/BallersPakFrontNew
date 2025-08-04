"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PlayerLayout from "@/components/player/PlayerLayout";
import PlayerSettings from "@/components/player/PlayerSettings";
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
}

export default function ProfileSettingsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", birthday: "" });
  const [loginError, setLoginError] = useState("");
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
        setLoginError(result.error || "Login failed");
      }
    } catch (error) {
      setLoginError("Network error. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowLogin(true);
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
                  <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-300 text-sm">
                    {loginError}
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
      <PlayerSettings
        playerName={getPlayerName()}
        playerEmail={user.email}
        playerTier={getPlayerTier() as "Pro" | "Elite" | "Free"}
        onLogout={handleLogout}
      />
    </PlayerLayout>
  );
} 