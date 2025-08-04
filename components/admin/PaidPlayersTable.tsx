"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Crown, CreditCard, Trash2, Mail, Calendar, Download } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { SignupData } from "@/lib/csv-data-manager";

interface PaidPlayersTableProps {
  data: SignupData[];
}

export default function PaidPlayersTable({ data }: PaidPlayersTableProps) {
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState<string>("timestamp");
  const [asc, setAsc] = useState<boolean>(false);
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Plan badge function
  const getPlanBadge = (planType: string) => {
    switch (planType) {
      case "elite":
        return <Badge className="bg-yellow-500 text-black text-xs font-semibold">🟡 Elite Plan</Badge>;
      case "pro":
        return <Badge className="bg-red-500 text-white text-xs font-semibold">🔴 Pro Academy</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white text-xs">Unknown</Badge>;
    }
  };

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

  // Calculate age from birthday
  const calculateAge = (birthday: string) => {
    if (!birthday) return "N/A";
    const today = new Date();
    const birthDate = new Date(birthday);
    if (isNaN(birthDate.getTime())) return "N/A";
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age.toString();
  };

  // Selection state
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const toggleSelect = (idx: number) => {
    setSelected((prev) => {
      const set = new Set(prev);
      if (set.has(idx)) set.delete(idx); else set.add(idx);
      return set;
    });
  };

  const selectAll = () => {
    if (selected.size === sorted.length && sorted.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(sorted.map((_, i) => i)));
    }
  };

  // Handle delete
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

  // Statistics
  const stats = useMemo(() => {
    const total = data.length;
    const elite = data.filter(row => row.planType === "elite").length;
    const pro = data.filter(row => row.planType === "pro").length;
    const totalRevenue = elite * 111 + pro * 299; // Estimated revenue
    
    return { total, elite, pro, totalRevenue };
  }, [data]);

  return (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 border border-yellow-500 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-100 mb-2">
            <Crown className="h-4 w-4" />
            <span className="text-sm font-medium">Total Paid Players</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 border border-yellow-400 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-100 mb-2">
            <CreditCard className="h-4 w-4" />
            <span className="text-sm font-medium">Elite Players</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.elite}</div>
          <div className="text-xs text-yellow-100">$111/month each</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 border border-red-400 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-100 mb-2">
            <Crown className="h-4 w-4" />
            <span className="text-sm font-medium">Pro Players</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.pro}</div>
          <div className="text-xs text-red-100">$299 one-time each</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 border border-green-400 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-100 mb-2">
            <CreditCard className="h-4 w-4" />
            <span className="text-sm font-medium">Est. Revenue</span>
          </div>
          <div className="text-2xl font-bold text-white">${stats.totalRevenue}</div>
          <div className="text-xs text-green-100">Total potential</div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search paid players..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-10 bg-neutral-800 text-white placeholder:text-gray-400 border-neutral-700 focus-visible:ring-emerald-500"
          />
        </div>
        <div className="text-sm text-gray-400">
          Showing {sorted.length} of {data.length} paid players
        </div>

        {selected.size > 0 && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                const headers = Object.keys(data[0] || {});
                const csvHeaders = headers.map(h => h.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())).join(",") + "\n";
                const csvRows = Array.from(selected)
                  .map((idx) => headers.map((h) => `"${(sorted[idx] as any)[h] || ""}"`).join(","))
                  .join("\n");
                const csvContent = csvHeaders + csvRows;
                const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `paid_players_${Date.now()}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Download className="h-4 w-4 mr-1" />
              Export ({selected.size})
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const paidPlayersHeaders = [
                  "Team Name",
                  "Plan Type",
                  "Player Name",
                  "Age",
                  "Email",
                  "Position",
                  "Experience Level",
                  "Payment Status",
                  "Joined Date",
                  "Revenue Value",
                ];

                const mapRowToTemplate = (row: SignupData): string[] => [
                  "BallersPak Paid",
                  row.planType === "elite" ? "Elite Plan ($111)" : "Pro Academy ($299)",
                  row.fullName || "N/A",
                  calculateAge(row.birthday || "") || "N/A",
                  row.email || "N/A",
                  row.position || "N/A",
                  row.experienceLevel || "N/A",
                  row.paymentStatus || "Completed",
                  formatTimestamp(row.timestamp) || "N/A",
                  row.planType === "elite" ? "$111" : "$299",
                ];

                const csvHeaders = paidPlayersHeaders.join(",") + "\n";
                const csvRows = Array.from(selected)
                  .map((idx) => mapRowToTemplate(sorted[idx]).map((v) => `"${v}"`).join(","))
                  .join("\n");

                const csvContent = csvHeaders + csvRows;
                const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `paid_players_template_${Date.now()}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              <Download className="h-4 w-4 mr-1" />
              Export Template ({selected.size})
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-neutral-700 bg-neutral-800">
              <TableHead className="w-12">
                <Checkbox
                  checked={selected.size === sorted.length && sorted.length > 0}
                  onCheckedChange={selectAll}
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
              <TableHead className="text-white">Plan</TableHead>
              <TableHead className="text-white">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSortKey("fullName");
                    setAsc(sortKey === "fullName" ? !asc : true);
                  }}
                  className="h-auto p-0 font-semibold text-white hover:text-emerald-400"
                >
                  Player Name
                  {sortKey === "fullName" && (
                    asc ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
                  )}
                </Button>
              </TableHead>
              <TableHead className="text-white">Age</TableHead>
              <TableHead className="text-white">Position</TableHead>
              <TableHead className="text-white">Level</TableHead>
              <TableHead className="text-white">Contact</TableHead>
              <TableHead className="text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-400">
                  No paid players found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((row, idx) => (
                <React.Fragment key={idx}>
                  <TableRow 
                    className={cn(
                      "border-b border-neutral-700 hover:bg-neutral-800/50 cursor-pointer",
                      expanded === idx && "bg-neutral-800/30",
                      selected.has(idx) && "bg-emerald-900/20"
                    )}
                    onClick={() => setExpanded(expanded === idx ? null : idx)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selected.has(idx)}
                        onCheckedChange={() => toggleSelect(idx)}
                      />
                    </TableCell>
                    <TableCell className="text-gray-300">{formatTimestamp(row.timestamp)}</TableCell>
                    <TableCell>{getPlanBadge(row.planType)}</TableCell>
                    <TableCell className="text-white font-medium">{row.fullName || "N/A"}</TableCell>
                    <TableCell className="text-gray-300">{calculateAge(row.birthday || "")}</TableCell>
                    <TableCell className="text-gray-300">{row.position || "N/A"}</TableCell>
                    <TableCell className="text-gray-300">{row.experienceLevel || "N/A"}</TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span className="text-xs">{row.email || "N/A"}</span>
                      </div>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Player Details</h4>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-300">Email:</span>
                                <span className="text-sm text-white">{row.email || "N/A"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-300">Birthday:</span>
                                <span className="text-sm text-white">{row.birthday || "N/A"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Crown className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-300">Experience Level:</span>
                                <span className="text-sm text-white">{row.experienceLevel || "N/A"}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Plan Information</h4>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-300">Payment Status:</span>
                                <Badge className="bg-green-500 text-white text-xs">
                                  {row.paymentStatus || "Completed"}
                                </Badge>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-sm text-gray-300">Goal:</span>
                                <span className="text-sm text-white">{row.goal || "Pro-level training"}</span>
                              </div>
                              {row.whyJoinReason && (
                                <div className="flex items-start gap-2">
                                  <span className="text-sm text-gray-300">Why Join:</span>
                                  <span className="text-sm text-white">{row.whyJoinReason}</span>
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