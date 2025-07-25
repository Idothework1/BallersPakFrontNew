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
    return obj;
  });
}

export default async function ApprovedMembersPage() {
  const allSignups = await getSignups();
  
  // Filter for approved players
  const approvedMembers = allSignups.filter((player) => {
    const status = player.status || "";
    return status === "approved";
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Approved Members</h1>
          <p className="text-gray-400 mt-2">
            Players approved by controllers ({approvedMembers.length} total) • Ambassador referrals tracked separately
          </p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-700 rounded-lg">
        <AdminTable data={approvedMembers} />
      </div>
    </div>
  );
} 