"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Shield, UserCheck, Clock, TrendingUp, Target, Calendar, ExternalLink, Settings, CheckCircle } from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalSignups: number;
  waitlistedUsers: number;
  approvedUsers: number;
  premiumUsers: number;
  totalControllers: number;
  totalAmbassadors: number;
  ambassadorSignups: number;
  controllerAssignments: number;
}

interface RecentActivity {
  id: string;
  type: 'signup' | 'approval' | 'referral' | 'assignment';
  message: string;
  timestamp: string;
  user?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSignups: 0,
    waitlistedUsers: 0,
    approvedUsers: 0,
    premiumUsers: 0,
    totalControllers: 0,
    totalAmbassadors: 0,
    ambassadorSignups: 0,
    controllerAssignments: 0
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load real stats from API
        const statsResponse = await fetch("/api/admin-stats");
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats({
            totalSignups: statsData.totalSignups,
            waitlistedUsers: statsData.waitlistedUsers,
            approvedUsers: statsData.approvedUsers,
            premiumUsers: statsData.premiumUsers,
            totalControllers: statsData.totalControllers,
            totalAmbassadors: statsData.totalAmbassadors,
            ambassadorSignups: statsData.ambassadorSignups,
            controllerAssignments: statsData.controllerAssignments
          });
        } else {
          // Fallback to empty stats if API fails
          setStats({
            totalSignups: 0,
            waitlistedUsers: 0,
            approvedUsers: 0,
            premiumUsers: 0,
            totalControllers: 0,
            totalAmbassadors: 0,
            ambassadorSignups: 0,
            controllerAssignments: 0
          });
        }

        // For now, use mock recent activity data since we don't have this API endpoint yet
        // In future, you could create a /api/recent-activity endpoint
        setRecentActivity([
          {
            id: "1",
            type: "referral",
            message: "New signup via ambassador referral",
            timestamp: "2024-01-15T10:30:00Z",
            user: "Recent User"
          },
          {
            id: "2",
            type: "assignment",
            message: "User assigned to controller",
            timestamp: "2024-01-15T09:15:00Z",
            user: "Recent Assignment"
          },
          {
            id: "3",
            type: "approval",
            message: "User approved by controller",
            timestamp: "2024-01-15T08:45:00Z",
            user: "Recent Approval"
          },
          {
            id: "4",
            type: "signup",
            message: "New premium signup",
            timestamp: "2024-01-14T16:20:00Z",
            user: "Recent Premium"
          }
        ]);

      } catch (error) {
        console.error("Error loading dashboard data:", error);
        // Set fallback empty data on error
        setStats({
          totalSignups: 0,
          waitlistedUsers: 0,
          approvedUsers: 0,
          premiumUsers: 0,
          totalControllers: 0,
          totalAmbassadors: 0,
          ambassadorSignups: 0,
          controllerAssignments: 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'signup':
        return <UserCheck className="h-4 w-4 text-blue-400" />;
      case 'approval':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'referral':
        return <ExternalLink className="h-4 w-4 text-purple-400" />;
      case 'assignment':
        return <Users className="h-4 w-4 text-orange-400" />;
      default:
        return <Clock className="h-4 w-4 text-neutral-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-neutral-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-neutral-400 mt-1">
            Overview of your BallersPak platform
          </p>
        </div>
        <Link href="/admin/create-account">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Settings className="h-4 w-4 mr-2" />
            Manage Staff
          </Button>
        </Link>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-400 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Signups
            </CardTitle>
            <div className="text-2xl font-bold text-white">{stats.totalSignups}</div>
          </CardHeader>
        </Card>

        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-400 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Waitlisted
            </CardTitle>
            <div className="text-2xl font-bold text-orange-400">{stats.waitlistedUsers}</div>
          </CardHeader>
        </Card>

        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-400 flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Approved
            </CardTitle>
            <div className="text-2xl font-bold text-green-400">{stats.approvedUsers}</div>
          </CardHeader>
        </Card>

        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-400 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Premium
            </CardTitle>
            <div className="text-2xl font-bold text-purple-400">{stats.premiumUsers}</div>
          </CardHeader>
        </Card>
      </div>

      {/* Staff Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="h-5 w-5 text-blue-400" />
              Controllers Performance
            </CardTitle>
            <CardDescription>
              Overview of controller assignments and success rates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{stats.totalControllers}</div>
                <div className="text-sm text-neutral-400">Active Controllers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{stats.controllerAssignments}</div>
                <div className="text-sm text-neutral-400">Total Assignments</div>
              </div>
            </div>
            <Link href="/admin/controllers">
              <Button variant="outline" className="w-full border-blue-600 text-blue-400 hover:bg-blue-900/20">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Controllers
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5 text-purple-400" />
              Ambassadors Performance
            </CardTitle>
            <CardDescription>
              Overview of ambassador referrals and conversion rates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{stats.totalAmbassadors}</div>
                <div className="text-sm text-neutral-400">Active Ambassadors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{stats.ambassadorSignups}</div>
                <div className="text-sm text-neutral-400">Referral Signups</div>
              </div>
            </div>
            <Link href="/admin/ambassadors">
              <Button variant="outline" className="w-full border-purple-600 text-purple-400 hover:bg-purple-900/20">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Ambassadors
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-neutral-950 border-neutral-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingUp className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest activities across your platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-300 mb-2">No recent activity</h3>
              <p className="text-neutral-500">Activity will appear here as users interact with your platform.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.message}</p>
                    {activity.user && (
                      <p className="text-neutral-400 text-xs">{activity.user}</p>
                    )}
                  </div>
                  <div className="text-neutral-400 text-xs">
                    {formatDate(activity.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-neutral-950 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/create-account">
              <Button variant="outline" className="w-full h-20 flex-col gap-2 border-blue-600 text-blue-400 hover:bg-blue-900/20">
                <Users className="h-6 w-6" />
                <span>Create Staff Account</span>
              </Button>
            </Link>
            
            <Link href="/admin">
              <Button variant="outline" className="w-full h-20 flex-col gap-2 border-orange-600 text-orange-400 hover:bg-orange-900/20">
                <Clock className="h-6 w-6" />
                <span>Review Waitlist</span>
              </Button>
            </Link>
            
            <Link href="/admin/paid-players">
              <Button variant="outline" className="w-full h-20 flex-col gap-2 border-purple-600 text-purple-400 hover:bg-purple-900/20">
                <Shield className="h-6 w-6" />
                <span>Manage Premium</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 