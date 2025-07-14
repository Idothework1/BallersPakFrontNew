import PlayerStatus from "@/components/player/PlayerStatus";

export default function PlayerStatusPage() {
  // In a real app, you would fetch this data from your API or session
  const playerData = {
    playerTier: "Pro" as const,
    status: "Active" as const,
    joinDate: "June 2025",
    region: "Punjab Region"
  };

  return (
    <PlayerStatus 
      playerTier={playerData.playerTier}
      status={playerData.status}
      joinDate={playerData.joinDate}
      region={playerData.region}
    />
  );
} 