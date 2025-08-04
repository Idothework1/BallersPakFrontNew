"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Camera, 
  Lock, 
  Save,
  Mail,
  Phone,
  MapPin,
  Shield,
  Bell,
  CreditCard,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Trophy,
  Crown,
  Star,
  LogOut,
  HelpCircle,
  Globe,
  Smartphone,
  Calendar
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface PlayerSettingsProps {
  playerName?: string;
  playerEmail?: string;
  playerTier?: "Pro" | "Elite" | "Free";
  onLogout?: () => void;
  compact?: boolean;
}

export default function PlayerSettings({ 
  playerName = "Player",
  playerEmail = "player@example.com",
  playerTier = "Free",
  onLogout,
  compact = false
}: PlayerSettingsProps) {
  
  const [formData, setFormData] = useState({
    name: playerName,
    email: playerEmail,
    phone: "",
    location: "",
    birthday: "",
    bio: ""
  });
  
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    emailMarketing: false,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    eventReminders: true
  });
  
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    statsVisible: false,
    achievementsVisible: true
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case "Pro":
        return {
          badge: <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
            <Trophy className="h-3 w-3 mr-1" />
            PRO ACADEMY
          </Badge>,
          color: "from-red-500/10 to-red-600/10",
          nextBilling: "September 1, 2025",
          benefits: ["Personal Coach", "Pro Training", "Priority Support", "Exclusive Events"]
        };
      case "Elite":
        return {
          badge: <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
            <Crown className="h-3 w-3 mr-1" />
            ELITE PLAN
          </Badge>,
          color: "from-yellow-500/10 to-orange-500/10",
          nextBilling: "September 1, 2025",
          benefits: ["Advanced Training", "Group Sessions", "Premium Content", "Monthly Camps"]
        };
      case "Free":
        return {
          badge: <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <Star className="h-3 w-3 mr-1" />
            FREE MEMBER
          </Badge>,
          color: "from-blue-500/10 to-blue-600/10",
          nextBilling: null,
          benefits: ["Basic Training", "Community Access", "Monthly Newsletter"]
        };
      default:
        return {
          badge: <Badge className="bg-gray-500 text-white">{tier}</Badge>,
          color: "from-gray-500/10 to-gray-600/10",
          nextBilling: null,
          benefits: []
        };
    }
  };

  const tierInfo = getTierInfo(playerTier);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setSaveStatus("saving");
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSaveStatus("saved");
      
      // Update localStorage if email is saved
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          user.email = formData.email;
          user.firstName = formData.name.split(' ')[0];
          user.fullName = formData.name;
          localStorage.setItem('user', JSON.stringify(user));
        } catch (err) {
          console.error("Error updating user data:", err);
        }
      }
      
      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus("idle"), 3000);
    }, 1000);
  };

  return (
    <div className={cn("space-y-6", compact ? "pb-4" : "pb-8")}>
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Account Settings</h1>
        <p className="text-gray-400">Manage your profile, preferences, and account security</p>
      </div>

      {/* Account Overview */}
      <Card className={cn("border-neutral-700 bg-gradient-to-br", tierInfo.color)}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {formData.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <Button 
                size="icon"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-neutral-800 hover:bg-neutral-700 border-2 border-neutral-900"
              >
                <Camera className="h-4 w-4 text-white" />
              </Button>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">{formData.name}</h2>
              <p className="text-gray-300 mb-3">{formData.email}</p>
              <div className="flex flex-wrap items-center gap-3">
                {tierInfo.badge}
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified Account
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Member since</p>
              <p className="text-lg font-semibold text-white">July 2025</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card className="border-neutral-700 bg-neutral-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-neutral-900 border-neutral-700 text-white focus:border-blue-500"
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-neutral-900 border-neutral-700 text-white focus:border-blue-500"
                placeholder="your@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="bg-neutral-900 border-neutral-700 text-white focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-300">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, Country"
                className="bg-neutral-900 border-neutral-700 text-white focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthday" className="text-gray-300">Birthday</Label>
              <Input
                id="birthday"
                type="date"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                className="bg-neutral-900 border-neutral-700 text-white focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-gray-300">Bio</Label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about your football journey..."
              className="w-full min-h-[100px] bg-neutral-900 border border-neutral-700 text-white rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500">{formData.bio.length}/500 characters</p>
          </div>
          
          <div className="flex items-center gap-3 pt-4">
            <Button 
              onClick={handleSaveProfile}
              disabled={isLoading}
              className={cn(
                "bg-gradient-to-r text-white font-semibold transition-all",
                saveStatus === "saved" 
                  ? "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  : "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              )}
            >
              {saveStatus === "saving" ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                  Saving...
                </>
              ) : saveStatus === "saved" ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            {saveStatus === "saved" && (
              <span className="text-sm text-green-400">Profile updated successfully!</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security & Privacy */}
      <Card className="border-neutral-700 bg-neutral-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Privacy
          </CardTitle>
          <CardDescription>
            Manage your account security and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Password Section */}
          <div className="bg-neutral-900/50 p-4 rounded-lg border border-neutral-700">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-blue-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-white mb-1">Password</h4>
                <p className="text-sm text-gray-400 mb-3">
                  Your birthday serves as your password for BallersPak. Contact support to update it.
                </p>
                <Button variant="outline" size="sm" className="border-neutral-600 text-gray-300 hover:bg-neutral-800">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </div>
          </div>

          {/* Privacy Controls */}
          <div className="space-y-4">
            <h4 className="font-medium text-white">Privacy Controls</h4>
            {[
              {
                id: "profileVisible",
                label: "Public Profile",
                description: "Allow other players to see your profile",
                icon: <User className="h-4 w-4" />,
                checked: privacy.profileVisible
              },
              {
                id: "statsVisible",
                label: "Statistics Visibility",
                description: "Show your stats on leaderboards",
                icon: <Trophy className="h-4 w-4" />,
                checked: privacy.statsVisible
              },
              {
                id: "achievementsVisible",
                label: "Achievement Display",
                description: "Display your achievements publicly",
                icon: <Star className="h-4 w-4" />,
                checked: privacy.achievementsVisible
              }
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-neutral-900/50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-gray-400 mt-0.5">{item.icon}</div>
                  <div>
                    <Label htmlFor={item.id} className="text-white font-medium cursor-pointer">
                      {item.label}
                    </Label>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                </div>
                <Switch
                  id={item.id}
                  checked={item.checked}
                  onCheckedChange={(checked) => 
                    setPrivacy({ ...privacy, [item.id]: checked })
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="border-neutral-700 bg-neutral-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose how and when you want to receive updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: "emailUpdates",
                label: "Email Updates",
                description: "Training updates and important announcements",
                icon: <Mail className="h-4 w-4" />,
                checked: notifications.emailUpdates
              },
              {
                id: "emailMarketing",
                label: "Marketing Emails",
                description: "Special offers and promotional content",
                icon: <CreditCard className="h-4 w-4" />,
                checked: notifications.emailMarketing
              },
              {
                id: "smsNotifications",
                label: "SMS Notifications",
                description: "Text messages for urgent updates",
                icon: <Smartphone className="h-4 w-4" />,
                checked: notifications.smsNotifications
              },
              {
                id: "pushNotifications",
                label: "Push Notifications",
                description: "Browser notifications for real-time updates",
                icon: <Bell className="h-4 w-4" />,
                checked: notifications.pushNotifications
              },
              {
                id: "weeklyReports",
                label: "Weekly Progress Reports",
                description: "Summary of your weekly performance",
                icon: <Calendar className="h-4 w-4" />,
                checked: notifications.weeklyReports
              },
              {
                id: "eventReminders",
                label: "Event Reminders",
                description: "Reminders for upcoming training and events",
                icon: <Calendar className="h-4 w-4" />,
                checked: notifications.eventReminders
              }
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-neutral-900/50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-gray-400 mt-0.5">{item.icon}</div>
                  <div>
                    <Label htmlFor={item.id} className="text-white font-medium cursor-pointer">
                      {item.label}
                    </Label>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                </div>
                <Switch
                  id={item.id}
                  checked={item.checked}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, [item.id]: checked })
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subscription Management */}
      <Card className="border-neutral-700 bg-neutral-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription & Billing
          </CardTitle>
          <CardDescription>
            Manage your plan and payment information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="p-4 bg-neutral-900/50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-white mb-2">Current Plan</h4>
                  {tierInfo.badge}
                </div>
                {playerTier === "Free" && (
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                    Upgrade Plan
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
              
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-300">Plan Benefits:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {tierInfo.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-400">
                      <CheckCircle className="h-3 w-3 text-green-400 flex-shrink-0" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Billing Information */}
            {playerTier !== "Free" && tierInfo.nextBilling && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-900/50 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Next Billing Date</h4>
                  <p className="text-gray-300">{tierInfo.nextBilling}</p>
                  <p className="text-sm text-gray-500 mt-1">Auto-renewal enabled</p>
                </div>
                <div className="p-4 bg-neutral-900/50 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Payment Method</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">•••• •••• •••• 4242</span>
                  </div>
                  <Button variant="outline" size="sm" className="border-neutral-600 text-gray-300 hover:bg-neutral-800">
                    Update Payment
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Support */}
        <Card className="border-neutral-700 bg-neutral-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Help & Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start border-neutral-600 text-gray-300 hover:bg-neutral-800">
              <Mail className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
            <Button variant="outline" className="w-full justify-start border-neutral-600 text-gray-300 hover:bg-neutral-800">
              <Globe className="h-4 w-4 mr-2" />
              Help Center
            </Button>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="border-neutral-700 bg-neutral-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={onLogout}
              variant="outline" 
              className="w-full justify-start border-neutral-600 text-gray-300 hover:bg-neutral-800"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-red-700 text-red-400 hover:bg-red-950/50"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}