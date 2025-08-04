"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Award, 
  Zap, 
  BarChart3,
  CheckCircle,
  Clock,
  ChevronRight,
  Star,
  Activity,
  Users,
  Calendar,
  Medal,
  Flame,
  TrendingDown,
  Plus,
  Eye,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface PlayerStatusProps {
  playerName?: string;
  playerTier?: "Pro" | "Elite" | "Free";
  joinDate?: string;
}

interface StatCard {
  title: string;
  value: string | number;
  change?: number;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface TrainingSession {
  id: string;
  date: string;
  type: string;
  duration: string;
  completed: boolean;
  score?: number;
}

export default function PlayerStatus({ 
  playerName = "Player",
  playerTier = "Free",
  joinDate
}: PlayerStatusProps) {
  
  // Calculate days active since joining
  const calculateDaysActive = () => {
    if (!joinDate) return 1; // Default to 1 day if no join date
    
    try {
      const join = new Date(joinDate);
      const now = new Date();
      const diffTime = now.getTime() - join.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(1, diffDays); // At least 1 day
    } catch (error) {
      console.error("Error calculating days active:", error);
      return 1;
    }
  };

  const daysActive = calculateDaysActive();
  
  // Mock training data - this would come from API
  const stats: StatCard[] = [
    {
      title: "Training Score",
      value: "—",
      trend: "neutral",
      icon: <Trophy className="h-5 w-5" />,
      color: "text-yellow-400",
      description: "Your overall performance rating"
    },
    {
      title: "Sessions This Week",
      value: 0,
      trend: "neutral",
      icon: <Activity className="h-5 w-5" />,
      color: "text-blue-400",
      description: "Training sessions completed"
    },
    {
      title: "Skill Level",
      value: "Beginner",
      trend: "neutral",
      icon: <Target className="h-5 w-5" />,
      color: "text-green-400",
      description: "Current assessed skill level"
    },
    {
      title: "Days Active",
      value: daysActive,
      change: daysActive,
      trend: "up",
      icon: <Flame className="h-5 w-5" />,
      color: "text-orange-400",
      description: "Days since joining BallersPak"
    }
  ];

  const recentSessions: TrainingSession[] = [
    // This would be populated from API when training system launches
  ];

  const achievements = [
    {
      title: "Early Bird",
      description: "Joined before official launch",
      icon: <Star className="h-6 w-6" />,
      earned: true,
      rarity: "legendary" as const,
      earnedDate: "July 2025"
    },
    {
      title: "Week One Warrior",
      description: "Active for 7 consecutive days",
      icon: <Flame className="h-6 w-6" />,
      earned: daysActive >= 7,
      rarity: "common" as const,
      earnedDate: daysActive >= 7 ? "Recently" : undefined
    },
    {
      title: "Dedicated Member",
      description: "Active for 30 consecutive days",
      icon: <Calendar className="h-6 w-6" />,
      earned: daysActive >= 30,
      rarity: "rare" as const,
      earnedDate: daysActive >= 30 ? "Recently" : undefined
    },
    {
      title: "Premium Player",
      description: "Upgraded to paid plan",
      icon: <Medal className="h-6 w-6" />,
      earned: playerTier !== "Free",
      rarity: "epic" as const
    },
    {
      title: "First Goal",
      description: "Score your first training goal",
      icon: <Target className="h-6 w-6" />,
      earned: false,
      rarity: "common" as const
    },
    {
      title: "Team Player",
      description: "Join your first team session",
      icon: <Users className="h-6 w-6" />,
      earned: false,
      rarity: "rare" as const
    },
    {
      title: "Champion",
      description: "Win a tournament",
      icon: <Trophy className="h-6 w-6" />,
      earned: false,
      rarity: "legendary" as const
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "from-gray-500 to-gray-600 border-gray-500/30";
      case "rare": return "from-blue-500 to-blue-600 border-blue-500/30";
      case "epic": return "from-purple-500 to-purple-600 border-purple-500/30";
      case "legendary": return "from-yellow-500 to-orange-500 border-yellow-500/30";
      default: return "from-gray-500 to-gray-600 border-gray-500/30";
    }
  };

  const earnedCount = achievements.filter(a => a.earned).length;
  const progressPercentage = Math.round((earnedCount / achievements.length) * 100);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Progress & Stats</h1>
        <p className="text-gray-400">Track your performance, achievements, and training progress</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800/70 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={cn("p-3 rounded-lg bg-neutral-700/50", stat.color)}>
                  {stat.icon}
                </div>
                {stat.change !== undefined && (
                  <div className={cn(
                    "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
                    stat.trend === "up" 
                      ? "bg-green-500/20 text-green-400" 
                      : stat.trend === "down" 
                      ? "bg-red-500/20 text-red-400"
                      : "bg-gray-500/20 text-gray-400"
                  )}>
                    {stat.trend === "up" && <ArrowUp className="h-3 w-3" />}
                    {stat.trend === "down" && <ArrowDown className="h-3 w-3" />}
                    {stat.trend === "neutral" && <Minus className="h-3 w-3" />}
                    {stat.change > 0 ? `+${stat.change}` : stat.change}
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.title}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.description}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievement Progress */}
        <Card className="border-neutral-700 bg-neutral-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievement Progress
            </CardTitle>
            <CardDescription>
              {earnedCount} of {achievements.length} achievements unlocked
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{progressPercentage}%</span>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  Level {Math.floor(earnedCount / 2) + 1}
                </Badge>
              </div>
              <div className="w-full bg-neutral-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="grid grid-cols-6 gap-2">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={cn(
                      "aspect-square rounded-lg border-2 flex items-center justify-center transition-all",
                      achievement.earned
                        ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} hover:scale-110`
                        : "bg-neutral-800 border-neutral-700 opacity-40"
                    )}
                    title={achievement.title}
                  >
                    <div className="text-sm">
                      {achievement.earned ? achievement.icon : <Lock className="h-4 w-4 text-neutral-600" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card className="border-neutral-700 bg-neutral-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest training sessions and milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSessions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-neutral-700/50 mb-4">
                    <Calendar className="h-8 w-8 text-neutral-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No sessions yet</h3>
                  <p className="text-gray-400 mb-4">Training sessions will appear here when the program launches.</p>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    Coming September 2025
                  </Badge>
                </div>
              ) : (
                recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center gap-3 p-3 bg-neutral-900/50 rounded-lg">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      session.completed ? "bg-green-400" : "bg-yellow-400"
                    )} />
                    <div className="flex-1">
                      <p className="font-medium text-white">{session.type}</p>
                      <p className="text-sm text-gray-400">{session.date} • {session.duration}</p>
                    </div>
                    {session.score && (
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                        {session.score}%
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Achievements */}
      <Card className="border-neutral-700 bg-neutral-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievement Gallery
          </CardTitle>
          <CardDescription>
            Unlock achievements by participating in training and reaching milestones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={cn(
                  "relative p-4 rounded-lg border-2 transition-all duration-200 group",
                  achievement.earned
                    ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} hover:scale-[1.02]`
                    : "bg-neutral-900/50 border-neutral-700 opacity-60"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-3 rounded-lg flex items-center justify-center transition-transform",
                    achievement.earned 
                      ? "bg-white/10 group-hover:scale-110" 
                      : "bg-neutral-800"
                  )}>
                    {achievement.earned ? achievement.icon : <Lock className="h-6 w-6 text-neutral-600" />}
                  </div>
                  <div className="flex-1">
                    <h4 className={cn(
                      "font-semibold mb-1",
                      achievement.earned ? "text-white" : "text-gray-500"
                    )}>
                      {achievement.title}
                    </h4>
                    <p className={cn(
                      "text-sm mb-2",
                      achievement.earned ? "text-gray-200" : "text-gray-600"
                    )}>
                      {achievement.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge className={cn(
                        "text-xs",
                        achievement.rarity === "legendary" 
                          ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30"
                          : achievement.rarity === "epic"
                          ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                          : achievement.rarity === "rare"
                          ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                          : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                      )}>
                        {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                      </Badge>
                      {achievement.earned && achievement.earnedDate && (
                        <span className="text-xs text-gray-400">
                          Earned {achievement.earnedDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Analytics Preview */}
      <Card className="border-neutral-700 bg-gradient-to-br from-blue-900/10 to-purple-900/10 border-blue-700/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Analytics
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 ml-2">
              Coming Soon
            </Badge>
          </CardTitle>
          <CardDescription>
            Detailed performance tracking and analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-blue-500/20 mb-6">
              <BarChart3 className="h-10 w-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Advanced Analytics Dashboard</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              Track your technical skills, physical performance, and tactical understanding with detailed charts and insights.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="p-4 bg-neutral-800/50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-gray-300">Performance Trends</p>
              </div>
              <div className="p-4 bg-neutral-800/50 rounded-lg">
                <Target className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-gray-300">Skill Breakdowns</p>
              </div>
              <div className="p-4 bg-neutral-800/50 rounded-lg">
                <Users className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-gray-300">Team Comparisons</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Free User Upgrade CTA */}
      {playerTier === "Free" && (
        <Card className="border-yellow-500/30 bg-gradient-to-br from-yellow-900/20 to-orange-900/10">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Trophy className="h-16 w-16 text-yellow-400" />
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-white mb-2">
                  Unlock Premium Progress Tracking
                </h3>
                <p className="text-gray-300 mb-4">
                  Get detailed performance analytics, exclusive achievements, and personalized progress reports.
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                    ✓ Advanced Stats
                  </Badge>
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                    ✓ Custom Goals
                  </Badge>
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                    ✓ Progress Reports
                  </Badge>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold">
                Upgrade to Elite
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Lock icon component
const Lock = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);