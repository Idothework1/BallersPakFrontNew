"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, ExternalLink, Link2, Users, TrendingUp, Clock, UserCheck, XCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface UserSession {
  id: string;
  username: string;
  role: string;
}

interface AmbassadorStats {
  totalSignups: number;
  approvedSignups: number;
  rejectedSignups: number;
  waitlistedSignups: number;
  conversionRate: number;
  recentSignups: Array<{
    username: string;
    timestamp: string;
    status: string;
  }>;
  assignedUsers?: Array<{
    email: string;
    firstName: string;
    lastName: string;
    timestamp: string;
    status: string;
  }>;
}

export default function AmbassadorDashboard() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [stats, setStats] = useState<AmbassadorStats>({
    totalSignups: 0,
    approvedSignups: 0,
    rejectedSignups: 0,
    waitlistedSignups: 0,
    conversionRate: 0,
    recentSignups: []
  });
  const [referralLink, setReferralLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch("/api/admin-auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "verify" })
        });

        if (response.ok) {
          const data = await response.json();
          setSession(data.user);
          
          // Generate referral link
          const link = `${window.location.origin}/signup?ref=${data.user.id}`;
          setReferralLink(link);
          
          // Load real stats from API
          await loadStats(data.user.id);
        }
      } catch (error) {
        console.error("Session verification failed:", error);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const loadStats = async (ambassadorId: string) => {
    try {
      const statsResponse = await fetch(`/api/ambassador-stats?ambassadorId=${ambassadorId}`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats({
          totalSignups: statsData.stats.totalSignups,
          approvedSignups: statsData.stats.approvedSignups,
          rejectedSignups: statsData.stats.rejectedSignups,
          waitlistedSignups: statsData.stats.waitlistedSignups,
          conversionRate: statsData.stats.totalSignups > 0 ? 
            Math.round((statsData.stats.approvedSignups / statsData.stats.totalSignups) * 100) : 0,
          recentSignups: statsData.signups.slice(0, 10).map((signup: any) => ({
            username: signup.username,
            timestamp: signup.timestamp,
            status: signup.status
          })),
          assignedUsers: statsData.assignedUsers || []
        });
      } else {
        // Fallback to empty stats if API fails
        setStats({
          totalSignups: 0,
          approvedSignups: 0,
          rejectedSignups: 0,
          waitlistedSignups: 0,
          conversionRate: 0,
          recentSignups: [],
          assignedUsers: []
        });
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const refreshStats = async () => {
    if (!session) return;
    
    setRefreshing(true);
    try {
      await loadStats(session.id);
      toast.success("Stats refreshed successfully");
    } catch (error) {
      console.error("Error refreshing stats:", error);
      toast.error("Error refreshing stats");
    } finally {
      setRefreshing(false);
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied to clipboard!");
  };

  const shareOnWhatsApp = () => {
    const message = `Join BallersPak and take your football skills to the next level! Use my referral link: ${referralLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareOnTwitter = () => {
    const message = `Join BallersPak and take your football skills to the next level! 🏈⚽ ${referralLink}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(twitterUrl, '_blank');
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <Badge className="bg-green-500 text-white text-xs"><UserCheck className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500 text-white text-xs"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case "waitlisted":
      default:
        return <Badge className="bg-yellow-500 text-black text-xs"><Clock className="h-3 w-3 mr-1" />Waitlisted</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-white">Please log in to access your ambassador dashboard.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Ambassador Dashboard</h1>
            <p className="text-neutral-400 mt-1">Welcome back, {session.username}!</p>
          </div>
          <Button
            onClick={refreshStats}
            disabled={refreshing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? "Refreshing..." : "Refresh Stats"}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Signups
              </CardTitle>
              <div className="text-2xl font-bold text-blue-400">{stats.totalSignups}</div>
            </CardHeader>
          </Card>

          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Waitlisted
              </CardTitle>
              <div className="text-2xl font-bold text-yellow-400">{stats.waitlistedSignups}</div>
            </CardHeader>
          </Card>

          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Approved
              </CardTitle>
              <div className="text-2xl font-bold text-green-400">{stats.approvedSignups}</div>
            </CardHeader>
          </Card>

          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Conversion Rate
              </CardTitle>
              <div className="text-2xl font-bold text-purple-400">{stats.conversionRate}%</div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Referral Link Card */}
          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-blue-400" />
                Your Referral Link
              </CardTitle>
              <CardDescription>
                Share this link to track signups. Controllers will review and approve players.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={referralLink}
                  readOnly
                  className="bg-neutral-900 border-neutral-700 text-white"
                />
                <Button
                  onClick={copyReferralLink}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={shareOnWhatsApp}
                  variant="outline"
                  className="border-green-600 text-green-400 hover:bg-green-900/20"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Share on WhatsApp
                </Button>
                <Button
                  onClick={shareOnTwitter}
                  variant="outline"
                  className="border-blue-600 text-blue-400 hover:bg-blue-900/20"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Share on Twitter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Signups */}
          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-400" />
                Recent Signups
              </CardTitle>
              <CardDescription>
                Latest people who signed up using your referral link
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.recentSignups.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  No signups yet. Share your referral link to get started!
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.recentSignups.map((signup, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg">
                      <div>
                        <div className="font-medium text-white">{signup.username}</div>
                        <div className="text-xs text-neutral-400">{formatTimestamp(signup.timestamp)}</div>
                      </div>
                      {getStatusBadge(signup.status)}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assigned Users */}
          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" />
                Your Assigned Players
              </CardTitle>
              <CardDescription>
                Players currently assigned to you by admins
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!stats.assignedUsers || stats.assignedUsers.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  No players currently assigned to you.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-neutral-800">
                      <TableHead className="text-neutral-300">Name</TableHead>
                      <TableHead className="text-neutral-300">Email</TableHead>
                      <TableHead className="text-neutral-300">Assigned</TableHead>
                      <TableHead className="text-neutral-300">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.assignedUsers!.map((u, idx) => (
                      <TableRow key={idx} className="border-neutral-800">
                        <TableCell className="text-white font-medium">{u.firstName} {u.lastName}</TableCell>
                        <TableCell className="text-neutral-400">{u.email}</TableCell>
                        <TableCell className="text-neutral-400">{formatTimestamp(u.timestamp)}</TableCell>
                        <TableCell>{getStatusBadge(u.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Breakdown */}
        {stats.totalSignups > 0 && (
          <Card className="bg-neutral-950 border-neutral-800 mt-8">
            <CardHeader>
              <CardTitle>Signup Status Breakdown</CardTitle>
              <CardDescription>
                Detailed view of all your referrals by status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-neutral-800">
                    <TableHead className="text-neutral-300">Username</TableHead>
                    <TableHead className="text-neutral-300">Date</TableHead>
                    <TableHead className="text-neutral-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentSignups.map((signup, index) => (
                    <TableRow key={index} className="border-neutral-800">
                      <TableCell className="text-white font-medium">{signup.username}</TableCell>
                      <TableCell className="text-neutral-400">{formatTimestamp(signup.timestamp)}</TableCell>
                      <TableCell>{getStatusBadge(signup.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 