"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { AlertCircle, UserPlus, Loader2, CheckCircle, Users, Shield } from "lucide-react";
import { toast } from "sonner";

export default function CreateAccountPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"controller" | "ambassador" | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
          role
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to create account");
        return;
      }

      toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully!`);
      
      // Reset form
      setUsername("");
      setPassword("");
      setRole("");
      setErrors({});

    } catch (error) {
      console.error("Error creating account:", error);
      toast.error("An error occurred while creating the account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Create New Account</h1>
          <p className="text-neutral-400 mt-1">
            Add new Controllers and Ambassadors to your team
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Account Form */}
        <Card className="bg-neutral-950 border-neutral-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <UserPlus className="h-5 w-5" />
              Account Details
            </CardTitle>
            <CardDescription>
              Create a new Controller or Ambassador account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-neutral-200">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-400"
                  disabled={isLoading}
                />
                {errors.username && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.username}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-neutral-200">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-400"
                  disabled={isLoading}
                />
                {errors.password && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-neutral-200">
                  Role
                </Label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as "controller" | "ambassador")}
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border bg-neutral-900 border-neutral-700 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="" disabled>Select a role</option>
                  <option value="controller">Controller</option>
                  <option value="ambassador">Ambassador</option>
                </select>
                {errors.role && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.role}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Role Information */}
        <div className="space-y-4">
          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="h-5 w-5 text-blue-400" />
                Controller Role
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-neutral-300 text-sm">
                Controllers manage batches of waitlisted users and handle onboarding processes.
              </p>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  View assigned waitlist users
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  Accept or deny onboarding status
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  Track performance metrics
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-950 border-neutral-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="h-5 w-5 text-purple-400" />
                Ambassador Role
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-neutral-300 text-sm">
                Ambassadors promote sign-ups via referral links and track their performance.
              </p>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  Generate unique referral links
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  Track signup conversions
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  Monitor real-time stats
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 