"use client";

import PlayerStatus from "./PlayerStatus";
import PlayerSettings from "./PlayerSettings";
import React from "react";

interface PlayerStatusSettingsProps {
  playerName?: string;
  playerEmail?: string;
  playerTier?: "Pro" | "Elite" | "Free";
  status?: "Active" | "Inactive" | "Pending";
  joinDate?: string;
  region?: string;
  onLogout?: () => void;
}

export default function PlayerStatusSettings({
  playerName = "Ibrahim",
  playerEmail = "ibrahim@example.com",
  playerTier = "Pro",
  status = "Active",
  joinDate = "June 2025",
  region = "Punjab Region",
  onLogout
}: PlayerStatusSettingsProps) {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        {/* Status Column */}
        <div className="flex flex-col min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-800">
          <PlayerStatus
            playerTier={playerTier}
            joinDate={joinDate}
          />
        </div>

        {/* Settings Column */}
        <div className="flex flex-col min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-800">
          <PlayerSettings
            playerName={playerName}
            playerEmail={playerEmail}
            playerTier={playerTier}
            onLogout={onLogout}
            compact={true}
          />
        </div>
      </div>
    </div>
  );
} 