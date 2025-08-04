import { dataManager } from "@/lib/data-manager";
import nextDynamic from "next/dynamic";

const AdminTable = nextDynamic(() => import("@/components/admin/AdminTable"), { ssr: false });

// Allow dynamic rendering so we read fresh data on each request
export const dynamic = "force-dynamic";

export default async function ApprovedMembersPage() {
  const allSignups = await dataManager.getSignups();
  
  // Filter for approved FREE players only (not paid members)
  const approvedMembers = allSignups.filter((player) => {
    const status = player.status || "";
    const planType = player.planType || "free";
    const paymentStatus = player.paymentStatus || "n/a";
    
    // Only show approved FREE players - exclude paid members
    return status === "approved" && 
           planType === "free" && 
           paymentStatus !== "paid" && 
           paymentStatus !== "subscription";
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Approved Members</h1>
          <p className="text-gray-400 mt-2">
            Free players approved by controllers ({approvedMembers.length} total) • Paid members shown separately
          </p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-700 rounded-lg">
        <AdminTable data={approvedMembers} />
      </div>
    </div>
  );
}