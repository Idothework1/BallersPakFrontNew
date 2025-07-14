import PlayerLayout from "@/components/player/PlayerLayout";

export default function PlayerLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PlayerLayout>{children}</PlayerLayout>;
} 