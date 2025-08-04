"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlayerSettings from "@/components/player/PlayerSettings";
import { Loader2 } from "lucide-react";

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  planType: string;
  paymentStatus: string;
  status: string;
  timestamp: string;
}

export default function PlayerSettingsPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage (set during login)
    const storedUser = localStorage.getItem('user');
    
    if (!storedUser) {
      router.push('/profile');
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      setUserData(user);
    } catch (err) {
      console.error("Error parsing user data:", err);
      router.push('/profile');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  // Determine player tier based on plan type
  const getPlayerTier = () => {
    const plan = userData.planType?.toLowerCase();
    if (plan === 'pro') return 'Pro';
    if (plan === 'elite') return 'Elite';
    return 'Free';
  };

  // Get display name
  const getDisplayName = () => {
    if (userData.fullName) return userData.fullName;
    if (userData.firstName && userData.lastName) {
      return `${userData.firstName} ${userData.lastName}`.trim();
    }
    if (userData.firstName) return userData.firstName;
    return userData.email.split('@')[0];
  };

  return (
    <PlayerSettings 
      playerName={getDisplayName()}
      playerEmail={userData.email}
      playerTier={getPlayerTier() as "Free" | "Elite" | "Pro"}
      onLogout={handleLogout}
    />
  );
}