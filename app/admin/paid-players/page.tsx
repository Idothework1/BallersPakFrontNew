import { dataManager } from "@/lib/data-manager";
import nextDynamic from "next/dynamic";

const PaidPlayersTable = nextDynamic(() => import("@/components/admin/PaidPlayersTable"), { ssr: false });

// Allow dynamic rendering so we read fresh data on each request
export const dynamic = "force-dynamic";

export default async function PaidPlayersPage() {
  const allSignups = await dataManager.getSignups();
  
  // Filter for paid players only
  const paidPlayers = allSignups.filter((player) => {
    const planType = player.planType || "free";
    const paymentStatus = player.paymentStatus || "n/a";
    // Check both plan type and payment status for paid users
    return (planType === "elite" || planType === "pro") || 
           (paymentStatus === "paid" || paymentStatus === "subscription");
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Premium Members</h1>
        <div className="text-sm text-gray-400">
          Members with Elite or Pro subscriptions
        </div>
      </div>
      
      {paidPlayers.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-4">No premium members yet.</p>
          <p className="text-gray-500">Premium members will appear here once they sign up for Elite or Pro plans.</p>
        </div>
      ) : (
        <PaidPlayersTable data={paidPlayers} />
      )}
    </div>
  );
}