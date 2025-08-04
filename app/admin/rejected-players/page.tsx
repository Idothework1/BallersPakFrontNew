import { dataManager } from "@/lib/data-manager";
import nextDynamic from "next/dynamic";

const AdminTable = nextDynamic(() => import("@/components/admin/AdminTable"), { ssr: false });

// Allow dynamic rendering so we read fresh data on each request
export const dynamic = "force-dynamic";

export default async function RejectedPlayersPage() {
  const allSignups = await dataManager.getSignups();
  
  // Filter for rejected players
  const rejectedPlayers = allSignups.filter((player) => {
    const status = player.status || "";
    return status === "rejected";
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Rejected Players</h1>
          <p className="text-gray-400 mt-2">
            Players who have been rejected by controllers ({rejectedPlayers.length} total)
          </p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-700 rounded-lg">
        <AdminTable data={rejectedPlayers} />
      </div>
    </div>
  );
} 