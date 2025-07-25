"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, TrendingUp, CheckCircle, XCircle, Calendar, Trash2, AlertCircle, Eye, EyeOff, Copy } from "lucide-react";
import { toast } from "sonner";

interface Controller {
  id: string;
  username: string;
  password: string;
  created: string;
  stats: {
    assignments: number;
    completed: number;
    conversions?: number;
    signups?: number;
  };
}

export default function ControllersPage() {
  const [controllers, setControllers] = useState<Controller[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const fetchControllers = async () => {
    try {
      const response = await fetch("/api/admin-users");
      const data = await response.json();
      
      if (response.ok) {
        const controllerUsers = data.users.filter((user: any) => user.role === 'controller');
        setControllers(controllerUsers);
      } else {
        toast.error("Failed to fetch controllers");
      }
    } catch (error) {
      console.error("Error fetching controllers:", error);
      toast.error("Error loading controllers");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteController = async (controllerId: string, username: string) => {
    if (!confirm(`Are you sure you want to delete controller "${username}"?`)) {
      return;
    }

    setDeletingId(controllerId);
    
    try {
      const response = await fetch(`/api/admin-users?id=${controllerId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        toast.success(`Controller "${username}" deleted successfully`);
        fetchControllers(); // Refresh the list
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete controller");
      }
    } catch (error) {
      console.error("Error deleting controller:", error);
      toast.error("Error deleting controller");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchControllers();
  }, []);

  const calculateAcceptanceRate = (stats: Controller['stats']) => {
    if (stats.assignments === 0) return 0;
    return Math.round((stats.completed / stats.assignments) * 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const togglePasswordVisibility = (controllerId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [controllerId]: !prev[controllerId]
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
        <div className="text-neutral-400">Loading controllers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Controllers</h1>
          <p className="text-neutral-400 mt-1">
            Manage controllers and track their performance
          </p>
        </div>
        <Badge variant="outline" className="text-neutral-300 border-neutral-600">
          {controllers.length} Controllers
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-400">Total Controllers</CardTitle>
            <div className="text-2xl font-bold text-white">{controllers.length}</div>
          </CardHeader>
        </Card>

        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-400">Total Assignments</CardTitle>
            <div className="text-2xl font-bold text-white">
              {controllers.reduce((sum, c) => sum + c.stats.assignments, 0)}
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-400">Completed</CardTitle>
            <div className="text-2xl font-bold text-green-400">
              {controllers.reduce((sum, c) => sum + c.stats.completed, 0)}
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-400">Avg. Success Rate</CardTitle>
            <div className="text-2xl font-bold text-blue-400">
              {controllers.length > 0 
                ? Math.round(controllers.reduce((sum, c) => sum + calculateAcceptanceRate(c.stats), 0) / controllers.length)
                : 0}%
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Controllers Table */}
      <Card className="bg-neutral-950 border-neutral-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="h-5 w-5" />
            Controllers List
          </CardTitle>
          <CardDescription>
            Manage your controllers and view their performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {controllers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-300 mb-2">No controllers found</h3>
              <p className="text-neutral-500">Create your first controller to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
                              <Table>
                  <TableHeader>
                    <TableRow className="border-neutral-800">
                      <TableHead className="text-neutral-300">Username</TableHead>
                      <TableHead className="text-neutral-300">Password</TableHead>
                      <TableHead className="text-neutral-300">Created</TableHead>
                      <TableHead className="text-neutral-300">Assignments</TableHead>
                      <TableHead className="text-neutral-300">Completed</TableHead>
                      <TableHead className="text-neutral-300">Success Rate</TableHead>
                      <TableHead className="text-neutral-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {controllers.map((controller) => (
                                          <TableRow key={controller.id} className="border-neutral-800">
                        <TableCell className="text-white font-medium">
                          <div className="flex items-center gap-2">
                            {controller.username}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyCredentials(controller.username, controller.password)}
                              className="h-7 w-7 p-0 border-blue-600 text-blue-400 hover:bg-blue-900/20"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-neutral-400">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">
                              {showPasswords[controller.id] ? controller.password : '••••••••'}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePasswordVisibility(controller.id)}
                              className="h-7 w-7 p-0 text-neutral-400 hover:text-white"
                            >
                              {showPasswords[controller.id] ? 
                                <EyeOff className="h-3 w-3" /> : 
                                <Eye className="h-3 w-3" />
                              }
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-neutral-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatDate(controller.created)}
                          </div>
                        </TableCell>
                      <TableCell className="text-neutral-300">
                        <Badge variant="outline" className="border-blue-600 text-blue-400">
                          {controller.stats.assignments}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-neutral-300">
                        <Badge variant="outline" className="border-green-600 text-green-400">
                          {controller.stats.completed}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {calculateAcceptanceRate(controller.stats) >= 70 ? (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          ) : calculateAcceptanceRate(controller.stats) >= 50 ? (
                            <AlertCircle className="h-4 w-4 text-yellow-400" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-400" />
                          )}
                          <span className="text-white">
                            {calculateAcceptanceRate(controller.stats)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteController(controller.id, controller.username)}
                          disabled={deletingId === controller.id}
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