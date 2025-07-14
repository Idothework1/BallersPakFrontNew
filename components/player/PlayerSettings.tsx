"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Camera, Lock, Globe, LogOut, Save } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface PlayerSettingsProps {
  playerName?: string;
  playerEmail?: string;
  playerTier?: "Pro" | "Elite" | "Free";
  onLogout?: () => void;
  compact?: boolean;
}

export default function PlayerSettings({ 
  playerName = "Ibrahim",
  playerEmail = "ibrahim@example.com",
  playerTier = "Pro",
  onLogout,
  compact = false
}: PlayerSettingsProps) {
  
  const [name, setName] = useState(playerName);
  const [email, setEmail] = useState(playerEmail);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [language, setLanguage] = useState("English");
  const [isLoading, setIsLoading] = useState(false);

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "Pro":
        return <Badge className="bg-red-500 text-white">🔴 Pro</Badge>;
      case "Elite":
        return <Badge className="bg-yellow-500 text-black">🟡 Elite</Badge>;
      case "Free":
        return <Badge className="bg-blue-500 text-white">🆓 Free</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{tier}</Badge>;
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert("Profile updated successfully!");
    }, 1000);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert("Password changed successfully!");
    }, 1000);
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      if (onLogout) {
        onLogout();
      } else {
        // Fallback logout logic
        alert("Logging out...");
        // In real app, this would redirect to login page
      }
    }
  };

  if (compact) {
    return (
      <div className="space-y-4">
        {/* Compact Profile Information */}
        <Card className="border-neutral-700 bg-neutral-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <User className="h-5 w-5 text-blue-400" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {/* Profile Photo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-neutral-700 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-neutral-400" />
                </div>
                <button className="absolute -bottom-0.5 -right-0.5 bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700 transition-colors">
                  <Camera className="h-2.5 w-2.5" />
                </button>
              </div>
              <div>
                <h3 className="font-medium text-white text-sm">{name}</h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-neutral-400 text-xs">Plan:</span>
                  {getTierBadge(playerTier)}
                </div>
              </div>
            </div>

            {/* Name and Email */}
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-white text-sm">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400 focus:border-blue-500 h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email" className="text-white text-sm">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400 focus:border-blue-500 h-8 text-sm"
                />
              </div>
            </div>

            <Button 
              onClick={handleSaveProfile}
              disabled={isLoading}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white w-full"
            >
              <Save className="h-3 w-3 mr-2" />
              {isLoading ? "Saving..." : "Save Profile"}
            </Button>
          </CardContent>
        </Card>

        {/* Compact Password & Security */}
        <Card className="border-neutral-700 bg-neutral-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-400" />
              Security & Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {/* Password Change */}
            <div className="space-y-2">
              <Label className="text-white text-sm">Change Password</Label>
              <div className="space-y-2">
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current password"
                  className="bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400 focus:border-blue-500 h-8 text-sm"
                />
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  className="bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400 focus:border-blue-500 h-8 text-sm"
                />
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400 focus:border-blue-500 h-8 text-sm"
                />
              </div>
              <Button 
                onClick={handleChangePassword}
                disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white w-full"
              >
                <Lock className="h-3 w-3 mr-2" />
                Update Password
              </Button>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label htmlFor="language" className="text-white text-sm">Language</Label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2 bg-neutral-700 border border-neutral-600 rounded-md text-white text-sm h-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="English">English</option>
                <option value="Urdu">اردو (Urdu)</option>
                <option value="Punjabi">ਪੰਜਾਬੀ (Punjabi)</option>
                <option value="Arabic">العربية (Arabic)</option>
              </select>
            </div>

            {/* Logout */}
            <div className="pt-2 border-t border-neutral-700">
              <Button 
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-red-600 text-red-400 hover:bg-red-900/30 hover:text-red-300 w-full"
              >
                <LogOut className="h-3 w-3 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Original full layout for standalone use
  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card className="border-neutral-700 bg-neutral-800/50">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <User className="h-5 w-5 text-blue-400" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Photo */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 bg-neutral-700 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-neutral-400" />
              </div>
              <button className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1.5 hover:bg-blue-700 transition-colors">
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div>
              <h3 className="font-medium text-white">{name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-neutral-400 text-sm">Current Plan:</span>
                {getTierBadge(playerTier)}
              </div>
            </div>
          </div>

          {/* Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400 focus:border-blue-500"
              />
            </div>
          </div>

          <Button 
            onClick={handleSaveProfile}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="border-neutral-700 bg-neutral-800/50">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Lock className="h-5 w-5 text-red-400" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-white">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400 focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-white">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400 focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400 focus:border-blue-500"
            />
          </div>

          <Button 
            onClick={handleChangePassword}
            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Lock className="h-4 w-4 mr-2" />
            {isLoading ? "Updating..." : "Change Password"}
          </Button>
        </CardContent>
      </Card>

      {/* Language Selection */}
      <Card className="border-neutral-700 bg-neutral-800/50">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-green-400" />
            Language & Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language" className="text-white">Language</Label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 bg-neutral-700 border border-neutral-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="English">English</option>
              <option value="Urdu">اردو (Urdu)</option>
              <option value="Punjabi">ਪੰਜਾਬੀ (Punjabi)</option>
              <option value="Arabic">العربية (Arabic)</option>
            </select>
          </div>

          <div className="bg-neutral-700 border border-neutral-600 p-4 rounded-lg">
            <p className="text-neutral-400 text-sm">
              <strong>Note:</strong> Language changes will take effect after refreshing the page. 
              Full localization support is coming in future updates.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="border-neutral-700 bg-neutral-800/50">
        <CardHeader>
          <CardTitle className="text-xl text-white">Account Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-yellow-900/30 border border-yellow-700 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-yellow-400">⚠️</div>
                <div>
                  <h4 className="font-medium text-yellow-400">Important</h4>
                  <p className="text-yellow-300 text-sm">
                    Make sure your email is correct as this is how we&apos;ll contact you about program updates and training sessions.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-neutral-700">
              <div>
                <h4 className="font-medium text-white">Sign Out</h4>
                <p className="text-neutral-400 text-sm">Sign out of your account on this device</p>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-900/30 hover:text-red-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 