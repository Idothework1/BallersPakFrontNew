"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar, User, Crown, Mail, Lock } from "lucide-react";
import React from "react";

interface PlayerOverviewProps {
  playerName?: string;
  playerTier?: "Pro" | "Elite" | "Free";
  joinDate?: string;
  assignedAdmin?: string;
}

export default function PlayerOverview({ 
  playerName = "Ibrahim",
  playerTier = "Pro",
  joinDate = "July 2025",
  assignedAdmin = "Not yet assigned"
}: PlayerOverviewProps) {
  
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "Pro":
        return <Badge className="bg-red-500 text-white">🔴 Pro</Badge>;
      case "Elite":
        return <Badge className="bg-yellow-500 text-black">🟡 Elite</Badge>;
      case "Free":
        return <Badge className="bg-blue-500 text-white">🆓 Free</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{tier}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Announcement Banner */}
      <Card className="border-emerald-600 bg-emerald-900/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="text-2xl">📢</div>
            <div>
              <h3 className="font-semibold text-emerald-400 mb-2">Welcome to Ballers Pak!</h3>
              <p className="text-emerald-300">
                We&apos;re excited to have you as one of the early members of our academy. While the official launch is still being finalized, 
                you&apos;ll be the first to hear about updates. Keep an eye on this space and your email — big things are coming.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Welcome Greeting */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome, {playerName} 👋
        </h1>
        <p className="text-neutral-400">
          You&apos;re now part of the Ballers Pak program. Check below for your current status and the next steps.
        </p>
      </div>

      {/* Status Card */}
      <Card className="border-neutral-700 bg-neutral-800/50">
        <CardHeader>
          <CardTitle className="text-white">🟦 Status Card</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-blue-400" />
              <span className="font-medium text-white">Tier:</span>
              {getTierBadge(playerTier)}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="font-medium text-white">Status:</span>
              <Badge className="bg-green-500 text-white">✅ Early Member</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-400" />
              <span className="font-medium text-white">Joined On:</span>
              <span className="text-neutral-300">{joinDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-400" />
              <span className="font-medium text-white">Assigned Admin:</span>
              <span className="text-neutral-300">{assignedAdmin}</span>
            </div>
          </div>
          <div className="bg-neutral-700 p-3 rounded-lg">
            <p className="text-white font-medium">
              Your spot has been confirmed. You&apos;re officially in the program.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="border-neutral-700 bg-neutral-800/50">
        <CardHeader>
          <CardTitle className="text-white">🧭 Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-white mb-2">🎯 You&apos;re Early — And That&apos;s a Good Thing</h3>
              <p className="text-neutral-400 mb-4">
                You&apos;re one of the first players to join our academy before official launch. Here&apos;s what&apos;s coming up:
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-white">Your spot is secured</span>
                  <p className="text-neutral-400 text-sm">You&apos;ve been accepted and your status is active.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-white">Onboarding by email</span>
                  <p className="text-neutral-400 text-sm">In the next few weeks, we&apos;ll send instructions on how to access your training and account features.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-white">Program launch</span>
                  <p className="text-neutral-400 text-sm">The full program will begin around September 2025.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0">🛠️</div>
                <div>
                  <span className="font-medium text-white">New features coming</span>
                  <p className="text-neutral-400 text-sm">Your dashboard will unlock more tools (training programs, feedback, session plans) as we get closer to launch.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 text-pink-400 mt-0.5 flex-shrink-0">🎉</div>
                <div>
                  <span className="font-medium text-white">Camps & events</span>
                  <p className="text-neutral-400 text-sm">All details about camps and events will appear right here in your dashboard.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-900/30 border border-yellow-700 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="text-yellow-400">🔔</div>
                <div>
                  <span className="font-medium text-yellow-400">Tip:</span>
                  <span className="text-yellow-300 ml-1">
                    Make sure your email is correct in Settings so you don&apos;t miss anything!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon - Camps */}
      <Card className="border-neutral-700 bg-neutral-800/50">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="mb-4">
              <Lock className="h-12 w-12 text-neutral-500 mx-auto mb-2" />
              <h3 className="text-xl font-semibold text-white mb-2">Camps</h3>
              <div className="inline-block bg-neutral-700 text-neutral-400 px-4 py-2 rounded-full font-medium">
                COMING SOON…
              </div>
            </div>
            <p className="text-neutral-400 max-w-md mx-auto">
              Training camps and special events will be available here once the program officially launches.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Player Summary */}
      <Card className="border-neutral-700 bg-neutral-800/50">
        <CardHeader>
          <CardTitle className="text-white">👤 Player Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Hi, {playerName} 👋</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-neutral-400" />
                  <span className="font-medium text-white">Current Tier:</span>
                  {getTierBadge(playerTier)}
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="font-medium text-white">Active Status:</span>
                  <Badge className="bg-green-500 text-white">✅ Active</Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-neutral-400" />
                  <span className="font-medium text-white">Join Date:</span>
                  <span className="text-neutral-300">{joinDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-neutral-400" />
                  <span className="font-medium text-white">Assigned Admin/Coach:</span>
                  <span className="text-neutral-300">{assignedAdmin}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 