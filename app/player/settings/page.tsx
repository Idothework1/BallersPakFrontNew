import PlayerSettings from "@/components/player/PlayerSettings";

export default function PlayerSettingsPage() {
  // In a real app, you would fetch this data from your API or session
  const playerData = {
    playerName: "Ibrahim",
    playerEmail: "ibrahim@example.com",
    playerTier: "Pro" as const
  };

  return (
    <PlayerSettings 
      playerName={playerData.playerName}
      playerEmail={playerData.playerEmail}
      playerTier={playerData.playerTier}
    />
  );
} 