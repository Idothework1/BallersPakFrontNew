"use client";

import { cn } from "@/lib/utils";
import { Home, BarChart3, Settings, Menu, X } from "lucide-react";
import { Inter } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });

interface PlayerLayoutProps {
  children: React.ReactNode;
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  active?: boolean;
  mobile?: boolean;
}

function NavItem({ href, icon, label, description, active, mobile }: NavItemProps) {
  if (mobile) {
    return (
      <Link
        href={href}
        className={cn(
          "flex flex-col items-center gap-1 py-2 px-3 text-xs transition-colors rounded-lg",
          active ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-white hover:bg-neutral-800"
        )}
      >
        <div className="text-lg">{icon}</div>
        <span className="font-medium">{label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-4 rounded-lg px-4 py-3 text-sm transition-colors hover:bg-neutral-800",
        active ? "bg-neutral-800 text-white border-l-4 border-blue-500" : "text-neutral-400 hover:text-white"
      )}
    >
      <div className="text-lg">{icon}</div>
      <div className="flex-1">
        <div className="font-medium">{label}</div>
        <div className="text-xs text-neutral-500">{description}</div>
      </div>
    </Link>
  );
}

export default function PlayerLayout({ children }: PlayerLayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Determine if we're using /profile or /player routes
  const isProfileRoute = pathname.startsWith('/profile');
  const basePath = isProfileRoute ? '/profile' : '/player';
  
  const navItems = [
    {
      href: basePath,
      icon: "🏠",
      label: "Overview",
      description: "Main dashboard incl. status & news",
      active: pathname === basePath
    },
    {
      href: `${basePath}/status`,
      icon: "📊",
      label: "Status",
      description: "Status breakdown (e.g., Pro, Active)",
      active: pathname === `${basePath}/status`
    },
    {
      href: `${basePath}/settings`,
      icon: "⚙️",
      label: "Settings",
      description: "Account info and preferences",
      active: pathname === `${basePath}/settings`
    }
  ];

  const getPageTitle = () => {
    if (pathname === `${basePath}/status`) return "Player Status";
    if (pathname === `${basePath}/settings`) return "Settings";
    return "Player Overview";
  };

  // Check if we're on a combined status/settings page
  const isCombinedView = pathname === `${basePath}/status` || pathname === `${basePath}/settings`;

  return (
    <div className={cn(inter.className, "flex min-h-screen max-h-screen bg-neutral-900 text-white overflow-hidden")}>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen">
        <aside className="w-80 flex-shrink-0 border-r border-neutral-800 bg-neutral-950">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-6">PLAYERS</h2>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </nav>
          </div>
        </aside>
        
        <main className="flex-1 flex flex-col overflow-hidden h-screen">
          <header className="flex-shrink-0 border-b border-neutral-800 bg-neutral-950 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">{getPageTitle()}</h1>
          </header>
          <div className={cn(
            "flex-1 overflow-hidden",
            isCombinedView ? "p-6" : "p-6 overflow-y-auto"
          )}>
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-screen overflow-hidden">
        <header className="flex-shrink-0 border-b border-neutral-800 bg-neutral-950 px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-white">{getPageTitle()}</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:bg-neutral-800"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-30 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
            <div className="absolute top-0 left-0 right-0 bg-neutral-950 p-4 shadow-lg border-b border-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">PLAYERS</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:bg-neutral-800"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <div key={item.href} onClick={() => setMobileMenuOpen(false)}>
                    <NavItem {...item} />
                  </div>
                ))}
              </nav>
            </div>
          </div>
        )}

        <main className={cn(
          "flex-1 overflow-hidden",
          isCombinedView ? "p-4" : "p-4 overflow-y-auto pb-20"
        )}>
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="flex-shrink-0 border-t border-neutral-800 bg-neutral-950">
          <div className="flex justify-around py-2">
            {navItems.map((item) => (
              <NavItem key={item.href} {...item} mobile />
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
} 