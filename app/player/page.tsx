"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlayerOverview from "@/components/player/PlayerOverview";
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

export default function PlayerPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      
      // Check if user has proper access
      const isPaidUser = user.planType === 'elite' || user.planType === 'pro' || 
                        user.paymentStatus === 'paid' || user.paymentStatus === 'subscription';
      const isApprovedFree = user.planType === 'free' && user.status === 'approved';
      
      if (!isPaidUser && !isApprovedFree) {
        setError("Your account is pending approval. Please wait for admin approval.");
      }
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
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-6 mb-4">
            <p className="text-yellow-300">{error}</p>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="text-blue-400 hover:underline"
          >
            Return Home
          </button>
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

  // Format join date
  const formatJoinDate = () => {
    if (!userData.timestamp) return 'Unknown';
    const date = new Date(userData.timestamp);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Get display name
  const getDisplayName = () => {
    if (userData.firstName) return userData.firstName;
    if (userData.fullName) {
      // Try to extract first name from full name
      const firstName = userData.fullName.split(' ')[0];
      return firstName || userData.fullName;
    }
    // Fallback to email username
    return userData.email.split('@')[0];
  };

  return (
    <PlayerOverview 
      playerName={getDisplayName()}
      playerTier={getPlayerTier() as "Free" | "Elite" | "Pro"}
      joinDate={formatJoinDate()}
      assignedAdmin="Not yet assigned"
    />
  );
}