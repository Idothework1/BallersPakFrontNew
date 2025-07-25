"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, TrendingUp, Calendar, Trash2, ExternalLink, Link2, Target, Eye, EyeOff, Copy, Clock, UserCheck, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Ambassador {
  id: string;
  username: string;
  password: string;
  created: string;
  stats: {
    totalSignups: number;
    approvedSignups: number;
    rejectedSignups: number;
    waitlistedSignups: number;
  };
}

export default function AmbassadorsPage() {
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [refreshing, setRefreshing] = useState(false);

  const fetchAmbassadors = async () => {
    try {
      const response = await fetch("/api/admin-users");
      const data = await response.json();
      
      if (response.ok) {
        const ambassadorUsers = data.users.filter((user: any) => user.role === 'ambassador');
        
        // Fetch real-time stats for each ambassador
        const ambassadorsWithStats = await Promise.all(
          ambassadorUsers.map(async (ambassador: any) => {
            try {
              const statsResponse = await fetch(`/api/ambassador-stats?ambassadorId=${ambassador.id}`);
              if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                return {
                  ...ambassador,
                  stats: statsData.stats
                };
              } else {
                // Fallback to stored stats if API fails
                return {
                  ...ambassador,
                  stats: {
                    totalSignups: ambassador.stats?.signups || 0,
                    approvedSignups: ambassador.stats?.conversions || 0,
                    rejectedSignups: 0,
                    waitlistedSignups: (ambassador.stats?.signups || 0) - (ambassador.stats?.conversions || 0)
                  }
                };
              }
            } catch (error) {
              console.error(`Error fetching stats for ambassador ${ambassador.id}:`, error);
              return {
                ...ambassador,
                stats: {
                  totalSignups: 0,
                  approvedSignups: 0,
                  rejectedSignups: 0,
                  waitlistedSignups: 0
                }
              };
            }
          })
        );
        
        setAmbassadors(ambassadorsWithStats);
      } else {
        toast.error("Failed to fetch ambassadors");
      }
    } catch (error) {
      console.error("Error fetching ambassadors:", error);
      toast.error("Error loading ambassadors");
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    setRefreshing(true);
    await fetchAmbassadors();
    setRefreshing(false);
    toast.success("Stats refreshed successfully");
  };

  const handleDeleteAmbassador = async (ambassadorId: string, username: string) => {
    if (!confirm(`Are you sure you want to delete ambassador "${username}"?`)) {
      return;
    }

    setDeletingId(ambassadorId);
    
    try {
      const response = await fetch(`/api/admin-users?id=${ambassadorId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        toast.success(`Ambassador "${username}" deleted successfully`);
        fetchAmbassadors(); // Refresh the list
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete ambassador");
      }
    } catch (error) {
      console.error("Error deleting ambassador:", error);
      toast.error("Error deleting ambassador");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchAmbassadors();
  }, []);

  const calculateConversionRate = (stats: Ambassador['stats']) => {
    if (stats.totalSignups === 0) return 0;
    return Math.round((stats.approvedSignups / stats.totalSignups) * 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const generateReferralLink = (ambassadorId: string) => {
    return `${window.location.origin}/signup?ref=${ambassadorId}`;
  };

  const copyReferralLink = (ambassadorId: string, username: string) => {
    const link = generateReferralLink(ambassadorId);
    navigator.clipboard.writeText(link);
    toast.success(`Referral link copied for ${username}`);
  };

  const togglePasswordVisibility = (ambassadorId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [ambassadorId]: !prev[ambassadorId]
    }));
  };

  const copyCredentials = (username: string, password: string) => {
    const credentials = `Username: ${username}\nPassword: ${password}`;
    navigator.clipboard.writeText(credentials);
    toast.success("Credentials copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-neutral-400">Loading ambassadors...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Ambassadors</h1>
          <p className="text-neutral-400 mt-1">
            Manage ambassadors and track their referral performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={refreshStats}
            disabled={refreshing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {refreshing ? "Refreshing..." : "Refresh Stats"}
          </Button>
          <Badge variant="outline" className="text-neutral-300 border-neutral-600">
            {ambassadors.length} Ambassadors
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-400">Total Ambassadors</CardTitle>
            <div className="text-2xl font-bold text-white">{ambassadors.length}</div>
          </CardHeader>
        </Card>

        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-400">Total Signups</CardTitle>
            <div className="text-2xl font-bold text-blue-400">
              {ambassadors.reduce((sum, a) => sum + a.stats.totalSignups, 0)}
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-400">Waitlisted</CardTitle>
            <div className="text-2xl font-bold text-yellow-400">
              {ambassadors.reduce((sum, a) => sum + a.stats.waitlistedSignups, 0)}
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-400">Approved</CardTitle>
            <div className="text-2xl font-bold text-green-400">
              {ambassadors.reduce((sum, a) => sum + a.stats.approvedSignups, 0)}
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-400">Avg. Conversion Rate</CardTitle>
            <div className="text-2xl font-bold text-purple-400">
              {ambassadors.length > 0 
                ? Math.round(ambassadors.reduce((sum, a) => sum + calculateConversionRate(a.stats), 0) / ambassadors.length)
                : 0}%
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Ambassadors Table */}
      <Card className="bg-neutral-950 border-neutral-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="h-5 w-5" />
            Ambassadors List
          </CardTitle>
          <CardDescription>
            Manage your ambassadors and view their real-time referral performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ambassadors.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-300 mb-2">No ambassadors found</h3>
              <p className="text-neutral-500">Create your first ambassador to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-neutral-800">
                    <TableHead className="text-neutral-300">Username</TableHead>
                    <TableHead className="text-neutral-300">Password</TableHead>
                    <TableHead className="text-neutral-300">Created</TableHead>
                    <TableHead className="text-neutral-300">Total</TableHead>
                    <TableHead className="text-neutral-300">Waitlisted</TableHead>
                    <TableHead className="text-neutral-300">Approved</TableHead>
                    <TableHead className="text-neutral-300">Rejected</TableHead>
                    <TableHead className="text-neutral-300">Conv. Rate</TableHead>
                    <TableHead className="text-neutral-300">Referral Link</TableHead>
                    <TableHead className="text-neutral-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ambassadors.map((ambassador) => (
                    <TableRow key={ambassador.id} className="border-neutral-800">
                      <TableCell className="text-white font-medium">
                        <div className="flex items-center gap-2">
                          {ambassador.username}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyCredentials(ambassador.username, ambassador.password)}
                            className="h-7 w-7 p-0 border-purple-600 text-purple-400 hover:bg-purple-900/20"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-neutral-400">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">
                            {showPasswords[ambassador.id] ? ambassador.password : '••••••••'}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePasswordVisibility(ambassador.id)}
                            className="h-7 w-7 p-0 text-neutral-400 hover:text-white"
                          >
                            {showPasswords[ambassador.id] ? 
                              <EyeOff className="h-3 w-3" /> : 
                              <Eye className="h-3 w-3" />
                            }
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-neutral-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(ambassador.created)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-blue-600 text-blue-400">
                          {ambassador.stats.totalSignups}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-yellow-600 text-yellow-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {ambassador.stats.waitlistedSignups}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-green-600 text-green-400">
                          <UserCheck className="h-3 w-3 mr-1" />
                          {ambassador.stats.approvedSignups}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-red-600 text-red-400">
                          <XCircle className="h-3 w-3 mr-1" />
                          {ambassador.stats.rejectedSignups}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-purple-400" />
                          <span className="text-white">
                            {calculateConversionRate(ambassador.stats)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyReferralLink(ambassador.id, ambassador.username)}
                          className="text-blue-400 border-blue-600 hover:bg-blue-900/20"
                        >
                          <Link2 className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAmbassador(ambassador.id, ambassador.username)}
                          disabled={deletingId === ambassador.id}
                          className="text-red-400 border-red-600 hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 