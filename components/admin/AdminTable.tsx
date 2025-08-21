"use client";

import { useMemo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, ArrowUp, ArrowDown, Filter, Users, Search, Download, Trash2, Mail, Phone, MapPin, Calendar, UserCheck, CheckCircle, UserPlus, Tag, X, Shield, Cake, Loader2 } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { SignupData } from "@/lib/csv-data-manager";

interface AdminTableProps {
  data: SignupData[];
}

interface AdminUser {
  id: string;
  username: string;
  role: 'controller' | 'ambassador';
}

export default function AdminTable({ data }: AdminTableProps) {
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState<string>("timestamp");
  const [asc, setAsc] = useState<boolean>(false);
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  // Bulk assignment state
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [controllers, setControllers] = useState<Array<{id: string, username: string}>>([]);
  const [ambassadors, setAmbassadors] = useState<Array<{id: string, username: string}>>([]);
  const [selectedController, setSelectedController] = useState<string>("");
  const [selectedAmbassador, setSelectedAmbassador] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);

  // Admin users for name resolution
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);

  const headers = useMemo(() => (data[0] ? Object.keys(data[0]) : []), [data]);
  const label = (key: string) =>
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase());

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Get experience level badge
  const getExperienceBadge = (level: string) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return <Badge className="bg-green-500 text-white text-xs">🟢 Beginner</Badge>;
      case "intermediate":
        return <Badge className="bg-yellow-500 text-black text-xs">🟡 Intermediate</Badge>;
      case "advanced":
        return <Badge className="bg-red-500 text-white text-xs">🔴 Advanced</Badge>;
      case "professional":
        return <Badge className="bg-purple-500 text-white text-xs">🏆 Professional</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white text-xs">❓ {level || "Unknown"}</Badge>;
    }
  };

  // Get gender badge
  const getGenderBadge = (gender: string) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return <Badge className="bg-blue-500 text-white text-xs">♂️ Male</Badge>;
      case "female":
        return <Badge className="bg-pink-500 text-white text-xs">♀️ Female</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white text-xs">❓ N/A</Badge>;
    }
  };

  // Format phone number
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "N/A";
    if (phone.startsWith("+92")) {
      return phone.replace("+92", "+92 ").replace(/(\d{3})(\d{7})/, "$1-$2");
    }
    return phone;
  };

  // Format birthday and calculate age
  const formatBirthdayAndAge = (birthday: string) => {
    if (!birthday) return { formatted: "N/A", age: "N/A" };
    
    const birthDate = new Date(birthday);
    if (isNaN(birthDate.getTime())) return { formatted: "N/A", age: "N/A" };
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    const formatted = birthDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    
    return { formatted, age: age.toString() };
  };

  // Get assignment badge with resolved names
  const getAssignmentBadge = (row: SignupData) => {
    const controllerId = row.processedBy; // Controller assignment (new)
    const ambassadorAssigneeId = row.assignedTo; // Ambassador assignment (new)
    const referredBy = row.referredBy || row.ambassadorId; // Original referral (legacy)
    
    const badges: React.ReactNode[] = [];
    const pushedKeys = new Set<string>();
    
    // Controller assignment via processedBy
    if (controllerId) {
      const controllerUser = adminUsers.find(user => user.id === controllerId);
      if (controllerUser?.role === 'controller') {
        badges.push(
          <Badge key={`controller-${controllerUser.id}`} className="bg-blue-500 text-white text-xs mr-1">
            <UserCheck className="h-3 w-3 mr-1" />
            Controller: {controllerUser.username}
          </Badge>
        );
        pushedKeys.add(`controller-${controllerUser.id}`);
      } else if (!controllerUser) {
        badges.push(
          <Badge key={`controller-unknown-${controllerId}`} className="bg-gray-500 text-white text-xs mr-1">
            <UserCheck className="h-3 w-3 mr-1" />
            Controller: {controllerId}
          </Badge>
        );
        pushedKeys.add(`controller-unknown-${controllerId}`);
      }
    }
    
    // Ambassador assignment via assignedTo
    if (ambassadorAssigneeId) {
      const assignedUser = adminUsers.find(user => user.id === ambassadorAssigneeId);
      if (assignedUser?.role === 'ambassador') {
        const key = `assigned-ambassador-${assignedUser.id}`;
        if (!pushedKeys.has(key)) {
          badges.push(
            <Badge key={key} className="bg-purple-500 text-white text-xs mr-1">
              <Shield className="h-3 w-3 mr-1" />
              Assigned to: {assignedUser.username}
            </Badge>
          );
          pushedKeys.add(key);
        }
      } else if (assignedUser?.role === 'controller' && !controllerId) {
        // Legacy: assignedTo used to hold controller; show it if processedBy not set
        const key = `controller-${assignedUser.id}`;
        if (!pushedKeys.has(key)) {
          badges.push(
            <Badge key={key} className="bg-blue-500 text-white text-xs mr-1">
              <UserCheck className="h-3 w-3 mr-1" />
              Controller: {assignedUser.username}
            </Badge>
          );
          pushedKeys.add(key);
        }
      } else if (!assignedUser) {
        const key = `assigned-unknown-${ambassadorAssigneeId}`;
        if (!pushedKeys.has(key)) {
          badges.push(
            <Badge key={key} className="bg-gray-500 text-white text-xs mr-1">
              <Shield className="h-3 w-3 mr-1" />
              Assigned: {ambassadorAssigneeId}
            </Badge>
          );
          pushedKeys.add(key);
        }
      }
    }
    
    // Original referral (separate from assignments)
    if (referredBy) {
      const referringAmbassador = adminUsers.find(user => user.id === referredBy && user.role === 'ambassador');
      if (referringAmbassador) {
        const key = `referral-${referringAmbassador.id}`;
        if (!pushedKeys.has(key)) {
          badges.push(
            <Badge key={key} className="bg-green-500 text-white text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Referred by: {referringAmbassador.username}
            </Badge>
          );
          pushedKeys.add(key);
        }
      } else {
        // Legacy or unknown referral id
        const referringController = adminUsers.find(user => user.id === referredBy && user.role === 'controller');
        if (referringController) {
          const key = `legacy-referral-${referringController.id}`;
          if (!pushedKeys.has(key)) {
            badges.push(
              <Badge key={key} className="bg-yellow-500 text-black text-xs">
                <UserCheck className="h-3 w-3 mr-1" />
                Legacy Ref: {referringController.username}
              </Badge>
            );
            pushedKeys.add(key);
          }
        } else {
          const key = `ref-unknown-${referredBy}`;
          if (!pushedKeys.has(key)) {
            badges.push(
              <Badge key={key} className="bg-gray-500 text-white text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Ref: {referredBy}
              </Badge>
            );
            pushedKeys.add(key);
          }
        }
      }
    }
    
    if (badges.length === 0) {
      badges.push(
        <Badge key="unassigned" className="bg-gray-500 text-white text-xs">
          Unassigned
        </Badge>
      );
    }
    
    return <div className="flex flex-wrap gap-1">{badges}</div>;
  };



  const handleDelete = async (email: string) => {
    setDeletingEmail(email);
    try {
      const response = await fetch('/api/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      
      if (result.success) {
        window.location.reload();
      } else {
        alert(`Error deleting account: ${result.error}`);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Error deleting account. Please try again.');
    } finally {
      setDeletingEmail(null);
      setConfirmDelete(null);
    }
  };



  // expanded row
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (!filter) return data;

    const query = filter.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((v) => v.toLowerCase().includes(query))
    );
  }, [data, filter]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      const va = (a as any)[sortKey] ?? "";
      const vb = (b as any)[sortKey] ?? "";
      return asc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
    return arr;
  }, [filtered, sortKey, asc]);

  // Load controllers and admin users for assignment and name resolution
  useEffect(() => {
    const loadAdminUsers = async () => {
      try {
        const response = await fetch("/api/admin-users");
        if (response.ok) {
          const data = await response.json();
          const controllerUsers = data.users.filter((user: any) => user.role === 'controller');
          const ambassadorUsers = data.users.filter((user: any) => user.role === 'ambassador');
          const allAdminUsers = data.users.map((user: any) => ({
            id: user.id,
            username: user.username,
            role: user.role
          }));
          setControllers(controllerUsers);
          setAmbassadors(ambassadorUsers);
          setAdminUsers(allAdminUsers); // Store all admin users for name resolution
        }
      } catch (error) {
        console.error("Error loading admin users:", error);
      }
    };
    loadAdminUsers();
  }, []);

  // Handle email selection for bulk assignment
  const toggleEmailSelection = (email: string) => {
    const newSelected = new Set(selectedEmails);
    if (newSelected.has(email)) {
      newSelected.delete(email);
    } else {
      newSelected.add(email);
    }
    setSelectedEmails(newSelected);
  };

  const selectAllEmails = () => {
    const currentPageEmails = new Set(sorted.map(row => row.email));
    const selectedOnCurrentPage = Array.from(selectedEmails).filter(email => 
      currentPageEmails.has(email)
    );
    
    if (selectedOnCurrentPage.length === sorted.length && sorted.length > 0) {
      // Unselect all on current page
      const newSelected = new Set(selectedEmails);
      sorted.forEach(row => newSelected.delete(row.email));
      setSelectedEmails(newSelected);
    } else {
      // Select all on current page
      const newSelected = new Set(selectedEmails);
      sorted.forEach(row => newSelected.add(row.email));
      setSelectedEmails(newSelected);
    }
  };

  // Handle bulk controller assignment
  const handleBulkControllerAssignment = async () => {
    if (selectedEmails.size === 0) {
      toast.error("Please select at least one player");
      return;
    }
    
    if (!selectedController) {
      toast.error("Please select a controller");
      return;
    }

    setIsAssigning(true);
    try {
      const response = await fetch("/api/assign-players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerEmails: Array.from(selectedEmails),
          controllerId: selectedController
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setSelectedEmails(new Set());
        setSelectedController("");
        // Refresh data instead of full page reload
        if (typeof window !== 'undefined') {
          setTimeout(() => window.location.reload(), 500);
        }
      } else {
        toast.error(data.error || "Failed to assign players");
      }
    } catch (error) {
      console.error("Error assigning players:", error);
      toast.error("An error occurred while assigning players");
    } finally {
      setIsAssigning(false);
    }
  };

  // Handle bulk ambassador assignment
  const handleBulkAmbassadorAssignment = async () => {
    if (selectedEmails.size === 0) {
      toast.error("Please select at least one player");
      return;
    }
    
    if (!selectedAmbassador) {
      toast.error("Please select an ambassador");
      return;
    }

    setIsAssigning(true);
    try {
      const response = await fetch("/api/assign-players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerEmails: Array.from(selectedEmails),
          ambassadorId: selectedAmbassador
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setSelectedEmails(new Set());
        setSelectedAmbassador("");
        // Refresh data instead of full page reload
        if (typeof window !== 'undefined') {
          setTimeout(() => window.location.reload(), 500);
        }
      } else {
        toast.error(data.error || "Failed to assign players");
      }
    } catch (error) {
      console.error("Error assigning players:", error);
      toast.error("An error occurred while assigning players");
    } finally {
      setIsAssigning(false);
    }
  };

  // Statistics
  const stats = useMemo(() => {
    const total = data.length;
    const male = data.filter(row => row.gender?.toLowerCase() === "male").length;
    const female = data.filter(row => row.gender?.toLowerCase() === "female").length;
    const hasPhone = data.filter(row => row.phone && row.phone.length > 5).length;
    const hasExperience = data.filter(row => row.playedBefore?.toLowerCase() === "true").length;
    const hasBirthday = data.filter(row => row.birthday && row.birthday.length > 0).length;
    
    return { total, male, female, hasPhone, hasExperience, hasBirthday };
  }, [data]);

  return (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 border border-blue-500 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-100 mb-2">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">Total Players</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-700 border border-green-500 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-100 mb-2">
            <UserCheck className="h-4 w-4" />
            <span className="text-sm font-medium">With Experience</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.hasExperience}</div>
          <div className="text-xs text-green-100">{stats.total > 0 ? Math.round((stats.hasExperience / stats.total) * 100) : 0}% of total</div>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 border border-purple-500 rounded-lg p-4">
          <div className="flex items-center gap-2 text-purple-100 mb-2">
            <Cake className="h-4 w-4" />
            <span className="text-sm font-medium">Login Ready</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.hasBirthday}</div>
          <div className="text-xs text-purple-100">Have birthday password</div>
        </div>
        <div className="bg-gradient-to-br from-orange-600 to-orange-700 border border-orange-500 rounded-lg p-4">
          <div className="flex items-center gap-2 text-orange-100 mb-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filtered Results</span>
          </div>
          <div className="text-2xl font-bold text-white">{sorted.length}</div>
          <div className="text-xs text-orange-100">Male: {stats.male} | Female: {stats.female}</div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center gap-4 flex-wrap mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search players..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-10 bg-neutral-800 text-white placeholder:text-gray-400 border-neutral-700 focus-visible:ring-emerald-500"
          />
        </div>
        
        <div className="text-sm text-gray-400">
          Showing {sorted.length} of {data.length} players
        </div>

        {selectedEmails.size > 0 && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                const csvHeaders = headers.map(label).join(",") + "\n";
                const csvRows = Array.from(selectedEmails)
                  .map((email) => {
                    const row = sorted.find(r => r.email === email);
                    return row ? headers.map((h) => `"${(row as any)[h] || ""}"`).join(",") : "";
                  })
                  .filter(row => row)
                  .join("\n");
                const csvContent = csvHeaders + csvRows;
                const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `players_export_${Date.now()}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Download className="h-4 w-4 mr-1" />
              Export ({selectedEmails.size})
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const ballersHeaders = [
                  "Team Name",
                  "First Name",
                  "Last Name",
                  "Gender",
                  "Age",
                  "Birthday",
                  "Email",
                  "Phone",
                  "Experience Level",
                  "Position",
                  "Location",
                ];

                const mapRowToTemplate = (row: SignupData): string[] => [
                  "BallersPak Free",
                  row.firstName || "N/A",
                  row.lastName || "N/A",
                  row.gender || "N/A",
                  row.birthday ? formatBirthdayAndAge(row.birthday).age : "N/A",
                  row.birthday ? formatBirthdayAndAge(row.birthday).formatted : "N/A",
                  row.email || "N/A",
                  row.phone || "N/A",
                  row.experienceLevel || "N/A",
                  row.position || "N/A",
                  row.location || "N/A",
                ];

                const csvHeaders = ballersHeaders.join(",") + "\n";
                const csvRows = Array.from(selectedEmails)
                  .map((email) => {
                    const row = sorted.find(r => r.email === email);
                    return row ? mapRowToTemplate(row).map((v) => `"${v}"`).join(",") : "";
                  })
                  .filter(row => row)
                  .join("\n");

                const csvContent = csvHeaders + csvRows;
                const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `ballers_template_export_${Date.now()}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              <Download className="h-4 w-4 mr-1" />
              Export Template ({selectedEmails.size})
            </Button>
          </div>
        )}
      </div>

      {/* Bulk Assignment Controls */}
      {selectedEmails.size > 0 && (
        <div className="bg-blue-950 border border-blue-700 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-white font-medium">
              {selectedEmails.size} player{selectedEmails.size !== 1 ? 's' : ''} selected
            </span>
            
            {/* Controller Assignment */}
            <div className="flex items-center gap-2">
              <select
                value={selectedController}
                onChange={(e) => setSelectedController(e.target.value)}
                className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-white text-sm"
                disabled={isAssigning}
              >
                <option value="">Select Controller</option>
                {controllers.map((controller) => (
                  <option key={controller.id} value={controller.id}>
                    {controller.username}
                  </option>
                ))}
              </select>
              
              <Button
                onClick={handleBulkControllerAssignment}
                disabled={!selectedController || isAssigning}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isAssigning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign to Controller
                  </>
                )}
              </Button>
            </div>

            {/* Ambassador Assignment */}
            <div className="flex items-center gap-2">
              <select
                value={selectedAmbassador}
                onChange={(e) => setSelectedAmbassador(e.target.value)}
                className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-white text-sm"
                disabled={isAssigning}
              >
                <option value="">Select Ambassador</option>
                {ambassadors.map((ambassador) => (
                  <option key={ambassador.id} value={ambassador.id}>
                    {ambassador.username}
                  </option>
                ))}
              </select>
              
              <Button
                onClick={handleBulkAmbassadorAssignment}
                disabled={!selectedAmbassador || isAssigning}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isAssigning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Assign to Ambassador
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-neutral-700 bg-neutral-800">
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    sorted.length > 0 && 
                    sorted.every(row => selectedEmails.has(row.email))
                  }
                  onCheckedChange={selectAllEmails}
                />
              </TableHead>
              <TableHead className="text-white">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSortKey("timestamp");
                    setAsc(sortKey === "timestamp" ? !asc : false);
                  }}
                  className="h-auto p-0 font-semibold text-white hover:text-emerald-400"
                >
                  Joined
                  {sortKey === "timestamp" && (
                    asc ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
                  )}
                </Button>
              </TableHead>
              <TableHead className="text-white">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSortKey("firstName");
                    setAsc(sortKey === "firstName" ? !asc : true);
                  }}
                  className="h-auto p-0 font-semibold text-white hover:text-emerald-400"
                >
                  Name
                  {sortKey === "firstName" && (
                    asc ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
                  )}
                </Button>
              </TableHead>
              <TableHead className="text-white">Gender</TableHead>
              <TableHead className="text-white">Age</TableHead>
              <TableHead className="text-white">Experience</TableHead>
              <TableHead className="text-white">Position</TableHead>
              <TableHead className="text-white">Contact</TableHead>
              <TableHead className="text-white">Assignment</TableHead>
              <TableHead className="text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-gray-400">
                  No players found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((row, idx) => (
                <React.Fragment key={idx}>
                  <TableRow 
                    className={cn(
                      "border-b border-neutral-700 hover:bg-neutral-800/50 cursor-pointer",
                      expanded === idx && "bg-neutral-800/30",
                      selectedEmails.has(row.email) && "bg-emerald-900/20"
                    )}
                    onClick={() => setExpanded(expanded === idx ? null : idx)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedEmails.has(row.email)}
                        onCheckedChange={() => toggleEmailSelection(row.email)}
                      />
                    </TableCell>
                    <TableCell className="text-gray-300">{formatTimestamp(row.timestamp)}</TableCell>
                    <TableCell className="text-white font-medium">
                      {`${row.firstName || ""} ${row.lastName || ""}`.trim() || "N/A"}
                    </TableCell>
                    <TableCell>{getGenderBadge(row.gender || "")}</TableCell>
                    <TableCell className="text-gray-300">
                      {row.birthday ? (
                        <div className="flex flex-col">
                          <span className="text-xs text-white">{formatBirthdayAndAge(row.birthday).age}</span>
                          <span className="text-xs text-blue-300">🔑</span>
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>{getExperienceBadge(row.experienceLevel || "")}</TableCell>
                    <TableCell className="text-gray-300">{row.position || "N/A"}</TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span className="text-xs">{row.email || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getAssignmentBadge(row)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {confirmDelete === row.email ? (
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(row.email);
                              }}
                              disabled={deletingEmail === row.email}
                              className="h-6 px-2 text-xs"
                            >
                              {deletingEmail === row.email ? "..." : "Confirm"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDelete(null);
                              }}
                              className="h-6 px-2 text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDelete(row.email);
                            }}
                            className="h-6 px-2 text-xs text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  {expanded === idx && (
                    <TableRow className="border-b border-neutral-700 bg-neutral-800/30">
                      <TableCell colSpan={9} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Personal Info</h4>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-300">Email:</span>
                                <span className="text-sm text-white">{row.email || "N/A"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-300">Phone:</span>
                                <span className="text-sm text-white">{formatPhoneNumber(row.phone || "")}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-300">Location:</span>
                                <span className="text-sm text-white">{row.location || "N/A"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-300">Joined:</span>
                                <span className="text-sm text-white">{formatTimestamp(row.timestamp)}</span>
                              </div>
                              {row.birthday && (
                                <div className="flex items-center gap-2">
                                  <Cake className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-300">Birthday:</span>
                                  <div className="flex flex-col">
                                    <span className="text-sm text-white">
                                      {formatBirthdayAndAge(row.birthday).formatted} (Age: {formatBirthdayAndAge(row.birthday).age})
                                    </span>
                                    <span className="text-xs text-blue-300">🔑 Profile Password</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Football Experience</h4>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <UserCheck className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-300">Played Before:</span>
                                <Badge className={row.playedBefore?.toLowerCase() === "true" ? "bg-green-500" : "bg-gray-500"}>
                                  {row.playedBefore?.toLowerCase() === "true" ? "Yes" : "No"}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-300">Experience Level:</span>
                                {getExperienceBadge(row.experienceLevel || "")}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-300">Position:</span>
                                <span className="text-sm text-white">{row.position || "N/A"}</span>
                              </div>
                              {row.playedClub?.toLowerCase() === "true" && (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-300">Club:</span>
                                  <span className="text-sm text-white">{row.clubName || "N/A"}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Goals & Additional Info</h4>
                            <div className="space-y-3">
                              <div className="flex items-start gap-2">
                                <span className="text-sm text-gray-300">Goal:</span>
                                <span className="text-sm text-white">{row.goal || "N/A"}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-sm text-gray-300">Why Join:</span>
                                <span className="text-sm text-white">{row.whyJoin || "N/A"}</span>
                              </div>
                              {row.hasDisability && row.hasDisability.toLowerCase() !== "false" && (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-300">Disability:</span>
                                  <Badge className="bg-orange-500 text-white text-xs">Special Needs</Badge>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>


    </div>
  );
} 