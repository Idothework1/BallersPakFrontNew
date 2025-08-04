"use client";

import { cn } from "@/lib/utils";
import { 
  Home, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  User,
  Trophy,
  Calendar,
  HelpCircle,
  Bell
} from "lucide-react";
import { Inter } from "next/font/google";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const inter = Inter({ subsets: ["latin"] });

interface PlayerLayoutProps {
  children: React.ReactNode;
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  description?: string;
  active?: boolean;
  mobile?: boolean;
  badge?: React.ReactNode;
}

function NavItem({ href, icon, label, description, active, mobile, badge }: NavItemProps) {
  if (mobile) {
    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 py-3 px-4 text-sm transition-all rounded-lg",
          active 
            ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-white border-l-4 border-blue-500" 
            : "text-neutral-400 hover:text-white hover:bg-neutral-800"
        )}
      >
        <div className="text-xl">{icon}</div>
        <span className="font-medium flex-1">{label}</span>
        {badge}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-4 rounded-lg px-4 py-3 text-sm transition-all",
        active 
          ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-white border-l-4 border-blue-500" 
          : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
      )}
    >
      <div className={cn(
        "text-lg transition-transform",
        !active && "group-hover:scale-110"
      )}>{icon}</div>
      <div className="flex-1">
        <div className="font-medium">{label}</div>
        {description && (
          <div className="text-xs text-neutral-500 group-hover:text-neutral-400 transition-colors">
            {description}
          </div>
        )}
      </div>
      {badge}
    </Link>
  );
}

export default function PlayerLayout({ children }: PlayerLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  
  // Determine if we're using /profile or /player routes
  const isProfileRoute = pathname.startsWith('/profile');
  const basePath = isProfileRoute ? '/profile' : '/player';
  
  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);
  
  const navItems = [
    {
      href: basePath,
      icon: <Home className="h-5 w-5" />,
      label: "Overview",
      description: "Dashboard & announcements",
      active: pathname === basePath
    },
    {
      href: `${basePath}/status`,
      icon: <Trophy className="h-5 w-5" />,
      label: "Progress",
      description: "Stats & achievements",
      active: pathname === `${basePath}/status`,
      badge: <Badge className="bg-green-500/20 text-green-400 text-xs">New</Badge>
    },
    {
      href: `${basePath}/settings`,
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      description: "Profile & preferences",
      active: pathname === `${basePath}/settings`
    }
  ];
  
  const secondaryNavItems = [
    {
      href: `${basePath}/events`,
      icon: <Calendar className="h-5 w-5" />,
      label: "Events",
      description: "Camps & training",
      badge: <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Soon</Badge>
    },
    {
      href: `${basePath}/help`,
      icon: <HelpCircle className="h-5 w-5" />,
      label: "Help",
      description: "Support center"
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const getUserTier = () => {
    if (!userData) return null;
    const plan = userData.planType?.toLowerCase();
    if (plan === 'pro') return { label: 'PRO', color: 'bg-red-500' };
    if (plan === 'elite') return { label: 'ELITE', color: 'bg-yellow-500' };
    return { label: 'FREE', color: 'bg-blue-500' };
  };

  const userTier = getUserTier();

  return (
    <div className={cn("min-h-screen bg-black", inter.className)}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-72 flex-col border-r border-neutral-800 bg-neutral-900/95 backdrop-blur">
        {/* Logo */}
        <div className="p-6 border-b border-neutral-800">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">BallersPak</h2>
              <p className="text-xs text-gray-400">Player Dashboard</p>
            </div>
          </Link>
        </div>

        {/* User Info */}
        {userData && (
          <div className="p-4 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white truncate">
                  {userData.firstName || userData.email.split('@')[0]}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-400">Member</p>
                  {userTier && (
                    <Badge className={cn(userTier.color, "text-white text-xs px-2 py-0")}>
                      {userTier.label}
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
              >
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </div>
          
          <div className="mt-8 pt-8 border-t border-neutral-800 space-y-1">
            <p className="text-xs font-semibold text-gray-500 px-4 mb-2">COMING SOON</p>
            {secondaryNavItems.map((item) => (
              <NavItem 
                key={item.href} 
                {...item} 
                href="#" 
                active={false}
              />
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-neutral-800">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-gray-400 hover:text-white hover:bg-neutral-800"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-50 border-b border-neutral-800 bg-neutral-900/95 backdrop-blur">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold">B</span>
            </div>
            <span className="font-bold text-white">BallersPak</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="fixed inset-y-0 right-0 w-full max-w-xs bg-neutral-900 border-l border-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="p-4 border-b border-neutral-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Menu</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* User Info Mobile */}
              {userData && (
                <div className="p-4 border-b border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {userData.firstName || userData.email.split('@')[0]}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-400">{userData.email}</p>
                        {userTier && (
                          <Badge className={cn(userTier.color, "text-white text-xs px-2 py-0")}>
                            {userTier.label}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Navigation */}
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                  <NavItem key={item.href} {...item} mobile />
                ))}
                
                <div className="mt-6 pt-6 border-t border-neutral-800 space-y-1">
                  <p className="text-xs font-semibold text-gray-500 px-4 mb-2">COMING SOON</p>
                  {secondaryNavItems.map((item) => (
                    <NavItem 
                      key={item.href} 
                      {...item} 
                      href="#" 
                      active={false}
                      mobile
                    />
                  ))}
                </div>
              </nav>

              {/* Mobile Logout */}
              <div className="p-4 border-t border-neutral-800">
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start text-gray-400 hover:text-white"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:pl-72">
        <main className="min-h-screen bg-black">
          <div className="pt-16 lg:pt-0">
            <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}