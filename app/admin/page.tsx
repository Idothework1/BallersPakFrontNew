import { dataManager } from "@/lib/data-manager";
import nextDynamic from "next/dynamic";

const AdminTable = nextDynamic(() => import("@/components/admin/AdminTable"), { ssr: false });

// Allow dynamic rendering so we read fresh data on each request
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const allSignups = await dataManager.getSignups();
  
  // Filter for waitlisted players (previously free players)
  const waitlistedSignups = allSignups.filter((player) => {
    const planType = player.planType || "free";
    const status = player.status || "waitlisted";
    const paymentStatus = player.paymentStatus || "n/a";
    
    // Only show free players that are waitlisted/pending and not paid
    return planType === "free" && 
           (status === "waitlisted" || status === "pending") &&
           paymentStatus !== "paid" && 
           paymentStatus !== "subscription";
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Sign Ups / Waitlisted Players</h1>
          <p className="text-gray-400 mt-1">
            All free signups (including ambassador referrals) require controller approval
          </p>
        </div>
        <div className="text-sm text-gray-400">
          Manage player applications and approvals
        </div>
      </div>
      
      {waitlistedSignups.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-4">No pending applications.</p>
          <p className="text-gray-500">Player sign-ups and applications will appear here for review and approval.</p>
        </div>
      ) : (
        <AdminTable data={waitlistedSignups} />
      )}
    </div>
  );
} 