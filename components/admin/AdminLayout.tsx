"use client";

import { cn } from "@/lib/utils";
import { UsersIcon, CreditCard, UserCheck, Clock, Shield, Users, LogOut, Settings, XCircle, Database } from "lucide-react";
import { Inter } from "next/font/google";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

const inter = Inter({ subsets: ["latin"] });

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
}

interface MigrationStatus {
  needsMigration: boolean;
  currentStatus?: {
    hasReferredBy: boolean;
    hasAssignedTo: boolean;
    recordsNeedingMigration: number;
    totalRecords: number;
  };
}

function NavItem({ href, icon, children, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-neutral-800",
        active ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white"
      )}
    >
      {icon}
      {children}
    </Link>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" })
      });
      
      toast.success("Logged out successfully");
      router.push("/admin-login");
    } catch {
      toast.error("Error logging out");
    }
  };

  const checkMigrationStatus = async () => {
    try {
      const response = await fetch("/api/cleanup-data");
      if (response.ok) {
        const data = await response.json();
        setMigrationStatus(data);
      }
    } catch (error) {
      console.error("Error checking migration status:", error);
    }
  };

  const handleMigration = async () => {
    if (isMigrating) return;
    
    setIsMigrating(true);
    try {
      const response = await fetch("/api/cleanup-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "migrate-ambassador-data" })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success(`Migration completed: ${data.details.migratedRecords} records migrated`);
        await checkMigrationStatus(); // Refresh status
      } else {
        toast.error(data.error || "Migration failed");
      }
    } catch (error) {
      console.error("Migration error:", error);
      toast.error("Error during migration");
    } finally {
      setIsMigrating(false);
    }
  };

  useEffect(() => {
    checkMigrationStatus();
  }, []);
  
  return (
    <div className={cn(inter.className, "flex min-h-screen bg-neutral-900 text-white")}>
      <aside className="w-64 flex-shrink-0 border-r border-neutral-800 bg-neutral-950 sticky top-0 h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-neutral-800">
          <Shield className="h-6 w-6 text-blue-400" />
          <h2 className="text-lg font-bold">BallersPak Admin</h2>
        </div>
        
        {/* Navigation Content - Scrollable */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {/* Main Admin Sections */}
          <div>
            <h3 className="px-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Player Management
            </h3>
            <div className="space-y-1">
              <NavItem 
                href="/admin" 
                icon={<Clock className="h-4 w-4" />}
                active={pathname === "/admin"}
              >
                Sign Ups / Waitlisted
              </NavItem>
              <NavItem 
                href="/admin/approved-members" 
                icon={<UserCheck className="h-4 w-4" />}
                active={pathname === "/admin/approved-members"}
              >
                Approved Members
              </NavItem>
              <NavItem 
                href="/admin/paid-players" 
                icon={<CreditCard className="h-4 w-4" />}
                active={pathname === "/admin/paid-players"}
              >
                Premium Members
              </NavItem>
              <NavItem 
                href="/admin/rejected-players" 
                icon={<UsersIcon className="h-4 w-4 text-red-400" />}
                active={pathname === "/admin/rejected-players"}
              >
                Rejected Players
              </NavItem>
            </div>
          </div>

          {/* Controllers and Ambassadors Section */}
          <div>
            <h3 className="px-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Staff Management
            </h3>
            <div className="space-y-1">
              <NavItem 
                href="/admin/controllers" 
                icon={<Users className="h-4 w-4" />}
                active={pathname === "/admin/controllers"}
              >
                Controllers
              </NavItem>
              <NavItem 
                href="/admin/ambassadors" 
                icon={<UsersIcon className="h-4 w-4" />}
                active={pathname === "/admin/ambassadors"}
              >
                Ambassadors
              </NavItem>
              <NavItem 
                href="/admin/create-account" 
                icon={<Settings className="h-4 w-4" />}
                active={pathname === "/admin/create-account"}
              >
                Create Account
              </NavItem>
            </div>
          </div>

          {/* Data Management Section */}
          {migrationStatus?.needsMigration && (
            <div>
              <h3 className="px-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Data Management
              </h3>
              <div className="space-y-1">
                <button
                  onClick={handleMigration}
                  disabled={isMigrating}
                  className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm transition-colors hover:bg-orange-900/20 text-orange-400 hover:text-orange-300 disabled:opacity-50"
                >
                  <Database className="h-4 w-4" />
                  {isMigrating ? "Migrating..." : "Migrate Ambassador Data"}
                </button>
                {migrationStatus.currentStatus && (
                  <div className="px-3 py-1 text-xs text-neutral-500">
                    {migrationStatus.currentStatus.recordsNeedingMigration} records need migration
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>

        {/* Logout Button - Fixed at Bottom */}
        <div className="border-t border-neutral-800 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm transition-colors hover:bg-red-900/20 text-red-400 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
      
      <main className="flex-1 overflow-auto bg-neutral-900">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-800 bg-neutral-950/80 px-6 py-3 backdrop-blur-lg">
          <div className="font-semibold">
            {pathname === "/admin/paid-players" 
              ? "Premium Members" 
              : pathname === "/admin/approved-members" 
              ? "Approved Members" 
              : "Sign Ups / Waitlisted Players"}
          </div>
          {/* Migration Status Indicator */}
          {migrationStatus?.needsMigration && (
            <div className="flex items-center gap-2 text-xs text-orange-400">
              <Database className="h-3 w-3" />
              Data migration needed
            </div>
          )}
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
} 