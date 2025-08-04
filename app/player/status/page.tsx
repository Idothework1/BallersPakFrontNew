"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlayerStatus from "@/components/player/PlayerStatus";
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

export default function PlayerStatusPage() {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading your progress...</p>
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
    if (userData.firstName) return userData.firstName;
    if (userData.fullName) {
      const firstName = userData.fullName.split(' ')[0];
      return firstName || userData.fullName;
    }
    return userData.email.split('@')[0];
  };

  return (
    <PlayerStatus 
      playerName={getDisplayName()}
      playerTier={getPlayerTier() as "Free" | "Elite" | "Pro"}
      joinDate={userData.timestamp}
    />
  );
}