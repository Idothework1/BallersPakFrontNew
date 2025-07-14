"use client";

import { cn } from "@/lib/utils";
import { UsersIcon, CreditCard, UserCheck, Clock } from "lucide-react";
import { Inter } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

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
  
  return (
    <div className={cn(inter.className, "flex min-h-screen bg-neutral-900 text-white")}>
      <aside className="w-56 flex-shrink-0 border-r border-neutral-800 bg-neutral-950 p-4 space-y-2">
        <h2 className="px-2 text-lg font-bold mb-6">BallersPak Admin</h2>
        <nav className="space-y-1">
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
        </nav>
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
          {/* Placeholder for actions or user menu */}
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
} 