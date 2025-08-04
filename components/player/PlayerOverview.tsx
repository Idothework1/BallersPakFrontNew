"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Calendar, 
  User, 
  Crown, 
  Mail, 
  Lock,
  Trophy,
  Target,
  Zap,
  Users,
  TrendingUp,
  Star,
  Clock,
  MessageSquare,
  ChevronRight,
  Sparkles,
  Activity,
  Award
} from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

interface PlayerOverviewProps {
  playerName?: string;
  playerTier?: "Pro" | "Elite" | "Free";
  joinDate?: string;
  assignedAdmin?: string;
}

interface QuickStat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  color: string;
}

export default function PlayerOverview({ 
  playerName = "Player",
  playerTier = "Free",
  joinDate = "July 2025",
  assignedAdmin = "Not yet assigned"
}: PlayerOverviewProps) {
  
  const getTierInfo = (tier: string) => {
    switch (tier) {
      case "Pro":
        return {
          badge: <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 px-3 py-1">
            <Trophy className="h-3 w-3 mr-1" />
            PRO ACADEMY
          </Badge>,
          color: "from-red-500/10 to-red-600/10",
          borderColor: "border-red-500/20",
          description: "Elite training program with professional guidance"
        };
      case "Elite":
        return {
          badge: <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 px-3 py-1">
            <Crown className="h-3 w-3 mr-1" />
            ELITE PLAN
          </Badge>,
          color: "from-yellow-500/10 to-orange-500/10",
          borderColor: "border-yellow-500/20",
          description: "Premium access to advanced training resources"
        };
      case "Free":
        return {
          badge: <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 px-3 py-1">
            <Star className="h-3 w-3 mr-1" />
            FREE MEMBER
          </Badge>,
          color: "from-blue-500/10 to-blue-600/10",
          borderColor: "border-blue-500/20",
          description: "Access to basic training and community features"
        };
      default:
        return {
          badge: <Badge className="bg-gray-500 text-white">{tier}</Badge>,
          color: "from-gray-500/10 to-gray-600/10",
          borderColor: "border-gray-500/20",
          description: "Member of BallersPak Academy"
        };
    }
  };

  const tierInfo = getTierInfo(playerTier);

  const quickStats: QuickStat[] = [
    {
      label: "Days Active",
      value: "7",
      icon: <Activity className="h-4 w-4" />,
      trend: "up",
      color: "text-green-400"
    },
    {
      label: "Training Sessions",
      value: "Coming Soon",
      icon: <Target className="h-4 w-4" />,
      color: "text-blue-400"
    },
    {
      label: "Progress Score",
      value: "—",
      icon: <TrendingUp className="h-4 w-4" />,
      color: "text-purple-400"
    },
    {
      label: "Team Rank",
      value: "—",
      icon: <Award className="h-4 w-4" />,
      color: "text-orange-400"
    }
  ];

  const upcomingFeatures = [
    {
      title: "Training Programs",
      description: "Personalized workout plans and skill development",
      icon: <Zap className="h-5 w-5" />,
      status: "September 2025"
    },
    {
      title: "Performance Tracking",
      description: "Monitor your progress with detailed analytics",
      icon: <TrendingUp className="h-5 w-5" />,
      status: "Coming Soon"
    },
    {
      title: "Team Events",
      description: "Exclusive camps and competitive matches",
      icon: <Users className="h-5 w-5" />,
      status: "Registration Opens Soon"
    },
    {
      title: "Coach Feedback",
      description: "Direct guidance from professional coaches",
      icon: <MessageSquare className="h-5 w-5" />,
      status: "Available at Launch"
    }
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-8 md:p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Welcome back, {playerName}! 
                <span className="ml-2 inline-block animate-pulse">⚡</span>
              </h1>
              <p className="text-lg text-gray-300 mb-4">
                Your journey to excellence continues here
              </p>
              <div className="flex flex-wrap items-center gap-4">
                {tierInfo.badge}
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active Member
                </Badge>
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2">
              <div className="text-sm text-gray-400">Member since</div>
              <div className="text-2xl font-semibold text-white">{joinDate}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800/70 transition-all duration-200 hover:scale-[1.02]">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className={cn("p-2 rounded-lg bg-neutral-700/50", stat.color)}>
                  {stat.icon}
                </div>
                {stat.trend && (
                  <div className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    stat.trend === "up" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  )}>
                    {stat.trend === "up" ? "↑" : "↓"}
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className={cn("border-neutral-700 bg-gradient-to-br", tierInfo.color, tierInfo.borderColor)}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5" />
              Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-square w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-white">
                {playerName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-white">{playerName}</h3>
              <p className="text-sm text-gray-400">{tierInfo.description}</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg">
                <span className="text-sm text-gray-400">Status</span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg">
                <span className="text-sm text-gray-400">Coach</span>
                <span className="text-sm text-white">{assignedAdmin}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg">
                <span className="text-sm text-gray-400">ID</span>
                <span className="text-sm text-white font-mono">#{Date.now().toString().slice(-6)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Announcement Card */}
        <Card className="lg:col-span-2 border-emerald-600/30 bg-gradient-to-br from-emerald-900/20 to-emerald-800/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              Welcome to BallersPak Academy!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-emerald-800/20 rounded-lg border border-emerald-600/20">
              <p className="text-emerald-100 leading-relaxed">
                🎉 <strong>You&apos;re an early member!</strong> As one of our founding players, you&apos;ll get exclusive access to new features 
                and programs as they launch. The full academy experience begins in September 2025, but we&apos;ll be rolling out 
                features progressively.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                <Mail className="h-4 w-4 text-blue-400" />
                <div>
                  <div className="text-sm font-medium text-white">Check your email</div>
                  <div className="text-xs text-gray-400">Important updates coming</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                <Clock className="h-4 w-4 text-purple-400" />
                <div>
                  <div className="text-sm font-medium text-white">Full launch: Sept 2025</div>
                  <div className="text-xs text-gray-400">Mark your calendar</div>
                </div>
              </div>
            </div>

            <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white">
              View Full Roadmap
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Features */}
      <Card className="border-neutral-700 bg-neutral-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5" />
            Coming Soon to Your Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingFeatures.map((feature, index) => (
              <div key={index} className="group p-4 bg-neutral-700/30 rounded-lg hover:bg-neutral-700/50 transition-all duration-200 cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-neutral-800 text-blue-400 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-400 mb-2">{feature.description}</p>
                    <Badge className="bg-neutral-800 text-gray-300 border-neutral-600">
                      {feature.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Premium Upsell (for Free users) */}
      {playerTier === "Free" && (
        <Card className="border-yellow-500/30 bg-gradient-to-br from-yellow-900/20 to-orange-900/10">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">
                  Unlock Your Full Potential 🚀
                </h3>
                <p className="text-gray-300 mb-4">
                  Upgrade to Elite or Pro for personalized training, exclusive camps, and professional coaching.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                    ✓ Personal Coach
                  </Badge>
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                    ✓ Training Plans
                  </Badge>
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                    ✓ Priority Access
                  </Badge>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-6">
                View Plans
                <Crown className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}