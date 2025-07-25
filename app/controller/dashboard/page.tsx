"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, CheckCircle, XCircle, Clock, Calendar, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface UserSession {
  id: string;
  username: string;
  role: string;
}

interface AssignedUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  experienceLevel: string;
  goal: string;
  timestamp: string;
  status: 'assigned' | 'approved' | 'rejected';
}

interface ControllerStats {
  totalAssigned: number;
  approved: number;
  rejected: number;
  pending: number;
  successRate: number;
}

export default function ControllerDashboard() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [assignedUsers, setAssignedUsers] = useState<AssignedUser[]>([]);
  const [stats, setStats] = useState<ControllerStats>({
    totalAssigned: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
    successRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [actioningUserId, setActioningUserId] = useState<string | null>(null);

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
          
          // Load real data from API
          const statsResponse = await fetch("/api/controller-stats");
          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            setAssignedUsers(statsData.assignedUsers);
            setStats(statsData.stats);
          } else {
            // Fallback to empty data if API fails
            setAssignedUsers([]);
            setStats({
              totalAssigned: 0,
              approved: 0,
              rejected: 0,
              pending: 0,
              successRate: 0
            });
          }
        }
      } catch (error) {
        console.error("Session verification failed:", error);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const handleApproveUser = async (userId: string, userEmail: string) => {
    setActioningUserId(userId);
    
    try {
      const response = await fetch("/api/controller-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          action: "approve"
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Update local state
        setAssignedUsers(prev => 
          prev.map(user => 
            user.id === userId ? { ...user, status: 'approved' as const } : user
          )
        );
        
        // Update stats
        setStats(prev => ({
          ...prev,
          approved: prev.approved + 1,
          pending: prev.pending - 1,
          successRate: Math.round(((prev.approved + 1) / prev.totalAssigned) * 100)
        }));
        
        toast.success(result.message || `User ${userEmail} has been approved successfully!`);
      } else {
        toast.error(result.error || "Failed to approve user. Please try again.");
      }
    } catch (error) {
      console.error("Error approving user:", error);
      toast.error("Failed to approve user. Please try again.");
    } finally {
      setActioningUserId(null);
    }
  };

  const handleRejectUser = async (userId: string, userEmail: string) => {
    const reason = prompt("Please provide a reason for rejection (optional):") || "";
    
    setActioningUserId(userId);
    
    try {
      const response = await fetch("/api/controller-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          action: "reject",
          reason: reason
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Update local state
        setAssignedUsers(prev => 
          prev.map(user => 
            user.id === userId ? { ...user, status: 'rejected' as const } : user
          )
        );
        
        // Update stats
        setStats(prev => ({
          ...prev,
          rejected: prev.rejected + 1,
          pending: prev.pending - 1
        }));
        
        toast.success(result.message || `User ${userEmail} has been rejected.`);
      } else {
        toast.error(result.error || "Failed to reject user. Please try again.");
      }
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast.error("Failed to reject user. Please try again.");
    } finally {
      setActioningUserId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-600 text-white">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-600 text-white">Rejected</Badge>;
      case 'assigned':
        return <Badge className="bg-blue-600 text-white">Pending Review</Badge>;
      default:
        return <Badge className="bg-gray-600 text-white">Unknown</Badge>;
    }
  };

  const getExperienceBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return <Badge variant="outline" className="border-green-600 text-green-400">🟢 Beginner</Badge>;
      case "intermediate":
        return <Badge variant="outline" className="border-yellow-600 text-yellow-400">🟡 Intermediate</Badge>;
      case "advanced":
        return <Badge variant="outline" className="border-red-600 text-red-400">🔴 Advanced</Badge>;
      default:
        return <Badge variant="outline" className="border-gray-600 text-gray-400">❓ Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-neutral-400">Loading dashboard...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">Session expired. Please log in again.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Controller Dashboard</h1>
            <p className="text-neutral-400 mt-1">
              Welcome back, {session.username}! Manage your assigned users.
            </p>
          </div>
          <Badge variant="outline" className="text-blue-400 border-blue-600">
            Controller
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Assigned
              </CardTitle>
              <div className="text-2xl font-bold text-blue-400">{stats.totalAssigned}</div>
            </CardHeader>
          </Card>

          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Approved
              </CardTitle>
              <div className="text-2xl font-bold text-green-400">{stats.approved}</div>
            </CardHeader>
          </Card>

          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending
              </CardTitle>
              <div className="text-2xl font-bold text-orange-400">{stats.pending}</div>
            </CardHeader>
          </Card>

          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Success Rate
              </CardTitle>
              <div className="text-2xl font-bold text-purple-400">{stats.successRate}%</div>
            </CardHeader>
          </Card>
        </div>

        {/* Assigned Users Table */}
        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Assigned Users
            </CardTitle>
            <CardDescription>
              Review and manage your assigned waitlist users
            </CardDescription>
          </CardHeader>
          <CardContent>
            {assignedUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-300 mb-2">No assigned users</h3>
                <p className="text-neutral-500">You&apos;ll see assigned users here when the admin assigns them to you.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-neutral-800">
                      <TableHead className="text-neutral-300">Name</TableHead>
                      <TableHead className="text-neutral-300">Contact</TableHead>
                      <TableHead className="text-neutral-300">Location</TableHead>
                      <TableHead className="text-neutral-300">Experience</TableHead>
                      <TableHead className="text-neutral-300">Goal</TableHead>
                      <TableHead className="text-neutral-300">Applied</TableHead>
                      <TableHead className="text-neutral-300">Status</TableHead>
                      <TableHead className="text-neutral-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignedUsers.map((user) => (
                      <TableRow key={user.id} className="border-neutral-800">
                        <TableCell className="text-white font-medium">
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell className="text-neutral-400">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3" />
                              {user.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-neutral-400">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {user.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getExperienceBadge(user.experienceLevel)}
                        </TableCell>
                        <TableCell className="text-neutral-300 max-w-xs">
                          <div className="truncate" title={user.goal}>
                            {user.goal}
                          </div>
                        </TableCell>
                        <TableCell className="text-neutral-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">{formatDate(user.timestamp)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(user.status)}
                        </TableCell>
                        <TableCell>
                          {user.status === 'assigned' ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApproveUser(user.id, user.email)}
                                disabled={actioningUserId === user.id}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                {actioningUserId === user.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectUser(user.id, user.email)}
                                disabled={actioningUserId === user.id}
                                className="border-red-600 text-red-400 hover:bg-red-900/20"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-neutral-500 text-sm">
                              {user.status === 'approved' ? 'Approved' : 'Rejected'}
                            </span>
                          )}
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
    </div>
  );
} 