import { promises as fs } from "fs";
import path from "path";
import ExcelJS from "exceljs";
import nextDynamic from "next/dynamic";

const PaidPlayersTable = nextDynamic(() => import("@/components/admin/PaidPlayersTable"), { ssr: false });

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
    return obj;
  });
}

export default async function PaidPlayersPage() {
  const allSignups = await getSignups();
  
  // Filter for paid players only
  const paidPlayers = allSignups.filter((player) => {
    const planType = player.planType || "free";
    return planType === "elite" || planType === "pro";
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