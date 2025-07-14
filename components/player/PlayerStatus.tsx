"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar, Crown, MapPin, TrendingUp } from "lucide-react";
import React from "react";

interface PlayerStatusProps {
  playerTier?: "Pro" | "Elite" | "Free";
  status?: "Active" | "Inactive" | "Pending";
  joinDate?: string;
  region?: string;
  compact?: boolean;
}

export default function PlayerStatus({ 
  playerTier = "Pro",
  status = "Active",
  joinDate = "June 2025",
  region = "Punjab Region",
  compact = false
}: PlayerStatusProps) {
  
  const getTierBadge = (tier: string) => {
    const size = compact ? "px-3 py-1" : "text-lg px-4 py-2";
    switch (tier) {
      case "Pro":
        return <Badge className={`bg-red-500 text-white ${size}`}>🔴 Pro</Badge>;
      case "Elite":
        return <Badge className={`bg-yellow-500 text-black ${size}`}>🟡 Elite</Badge>;
      case "Free":
        return <Badge className={`bg-blue-500 text-white ${size}`}>🆓 Free</Badge>;
      default:
        return <Badge className={`bg-gray-500 text-white ${size}`}>{tier}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    const size = compact ? "px-3 py-1" : "text-lg px-4 py-2";
    switch (status) {
      case "Active":
        return <Badge className={`bg-green-500 text-white ${size}`}>✅ Active</Badge>;
      case "Inactive":
        return <Badge className={`bg-gray-500 text-white ${size}`}>⏸️ Inactive</Badge>;
      case "Pending":
        return <Badge className={`bg-yellow-500 text-black ${size}`}>⏳ Pending</Badge>;
      default:
        return <Badge className={`bg-gray-500 text-white ${size}`}>{status}</Badge>;
    }
  };

  if (compact) {
    return (
      <div className="space-y-4">
        {/* Compact Status Card */}
        <Card className="border-neutral-700 bg-neutral-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              Player Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-white">Tier:</span>
                  {getTierBadge(playerTier)}
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-medium text-white">Status:</span>
                  {getStatusBadge(status)}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium text-white">Joined:</span>
                  <span className="text-sm text-neutral-300">{joinDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-orange-400" />
                  <span className="text-sm font-medium text-white">Region:</span>
                  <span className="text-sm text-neutral-300">{region}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compact Status Details */}
        <Card className="border-neutral-700 bg-neutral-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white">Account Standing</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="bg-green-900/30 border border-green-700 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="font-medium text-green-400 text-sm">Active Account</span>
              </div>
              <p className="text-green-300 text-xs mt-1">
                Full access to all {playerTier} tier features.
              </p>
            </div>

            <div className="bg-blue-900/30 border border-blue-700 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-blue-400" />
                <span className="font-medium text-blue-400 text-sm">Tier Benefits</span>
              </div>
              <p className="text-blue-300 text-xs mt-1">
                {playerTier === "Pro" && "Premium training content, weekly sessions, priority support."}
                {playerTier === "Elite" && "All training modules, monthly Q&A, exclusive content."}
                {playerTier === "Free" && "Basic training content and community features."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Original full layout for standalone use
  return (
    <div className="space-y-6">
      {/* Main Status Card */}
      <Card className="border-neutral-700 bg-neutral-800/50">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-400" />
            Player Classification & Standing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Current Tier */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Crown className="h-5 w-5 text-blue-400" />
                <label className="text-lg font-medium text-white">Current Tier</label>
              </div>
              <div className="pl-8">
                {getTierBadge(playerTier)}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <label className="text-lg font-medium text-white">Status</label>
              </div>
              <div className="pl-8">
                {getStatusBadge(status)}
              </div>
            </div>

            {/* Joined Since */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-purple-400" />
                <label className="text-lg font-medium text-white">Joined Since</label>
              </div>
              <div className="pl-8">
                <span className="text-lg text-neutral-300">{joinDate}</span>
              </div>
            </div>

            {/* Region/Team */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-orange-400" />
                <label className="text-lg font-medium text-white">Region/Team</label>
              </div>
              <div className="pl-8">
                <span className="text-lg text-neutral-300">{region}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Details */}
      <Card className="border-neutral-700 bg-neutral-800/50">
        <CardHeader>
          <CardTitle className="text-xl text-white">Status Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-400">Account Status: Active</h4>
                  <p className="text-green-300 text-sm">
                    Your account is in good standing and you have full access to all {playerTier} tier features.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/30 border border-blue-700 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Crown className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-400">Tier Benefits</h4>
                  <p className="text-blue-300 text-sm">
                    {playerTier === "Pro" && "Access to premium training content, weekly sessions, and priority support."}
                    {playerTier === "Elite" && "Full access to all training modules, monthly Q&A sessions, and exclusive content."}
                    {playerTier === "Free" && "Access to basic training content and community features."}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/30 border border-purple-700 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-purple-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-400">Member Since</h4>
                  <p className="text-purple-300 text-sm">
                    You joined the Ballers Pak academy in {joinDate} and are part of our early member community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Future Features Placeholder */}
      <Card className="border-neutral-700 bg-neutral-800/50">
        <CardContent className="p-6">
          <div className="text-center py-6">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-white mb-2">Skill Areas & Performance Graphs</h3>
            <p className="text-neutral-400 text-sm">
              Detailed skill assessments and progress tracking will be available here in future updates.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 