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

export default async function AdminPage() {
  const signups = await getSignups();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-white">Sign-ups</h1>
      {signups.length === 0 ? (
        <p className="text-gray-400">No sign-ups yet.</p>
      ) : (
        <AdminTable data={signups} />
      )}
    </div>
  );
} 