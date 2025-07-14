import PlayerOverview from "@/components/player/PlayerOverview";

export default function PlayerPage() {
  // In a real app, you would fetch this data from your API or session
  const playerData = {
    playerName: "Ibrahim",
    playerTier: "Pro" as const,
    joinDate: "July 2025",
    assignedAdmin: "Not yet assigned"
  };

  return (
    <PlayerOverview 
      playerName={playerData.playerName}
      playerTier={playerData.playerTier}
      joinDate={playerData.joinDate}
      assignedAdmin={playerData.assignedAdmin}
    />
  );
} 