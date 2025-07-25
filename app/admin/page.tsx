import { promises as fs } from "fs";
import path from "path";
import ExcelJS from "exceljs";
import nextDynamic from "next/dynamic";

const AdminTable = nextDynamic(() => import("@/components/admin/AdminTable"), { ssr: false });

// Allow dynamic rendering so we read fresh data on each request
export const dynamic = "force-dynamic";

async function getSignups() {
  const dataDir = path.join(process.cwd(), "data");
  const xlsxPath = path.join(dataDir, "signups.xlsx");
  try {
    await fs.access(xlsxPath);
  } catch {
    return [];
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(xlsxPath);
  const worksheet = workbook.getWorksheet("Signups") ?? workbook.worksheets[0];
  if (!worksheet) return [];

  const headers = (worksheet.getRow(1).values as string[]).slice(1);
  const rows = worksheet.getRows(2, worksheet.rowCount - 1) ?? [];

  return rows.map((row) => {
    const values = row.values as (string | number | undefined)[];
    const obj: Record<string, string> = {};
    headers.forEach((header, idx) => {
      obj[header] = String(values[idx + 1] ?? "");
    });
    
    // Add status field if not present (for existing free players)
    if (!obj.status && obj.planType === "free") {
      obj.status = "waitlisted";
    }
    
    return obj;
  });
}

export default async function AdminPage() {
  const allSignups = await getSignups();
  
  // Filter for waitlisted players (previously free players)
  const waitlistedSignups = allSignups.filter((player) => {
    const planType = player.planType || "free";
    const status = player.status || "waitlisted";
    return planType === "free" && (status === "waitlisted" || status === "pending");
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