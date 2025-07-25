import { redirect } from 'next/navigation';
import { promises as fs } from "fs";
import path from "path";
import ExcelJS from "exceljs";

async function getAmbassadorByUsername(username: string) {
  const dataDir = path.join(process.cwd(), "data");
  const xlsxPath = path.join(dataDir, "admin-users.xlsx");
  
  try {
    await fs.access(xlsxPath);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(xlsxPath);
    const worksheet = workbook.getWorksheet("AdminUsers") ?? workbook.worksheets[0];
    
    if (!worksheet || worksheet.rowCount <= 1) return null;
    
    const headers = (worksheet.getRow(1).values as string[]).slice(1);
    const rows = worksheet.getRows(2, worksheet.rowCount - 1) ?? [];
    
    for (const row of rows) {
      const values = row.values as (string | number | undefined)[];
      const obj: Record<string, string> = {};
      headers.forEach((header, idx) => {
        obj[header] = String(values[idx + 1] ?? "");
      });
      
      if (obj.role === 'ambassador' && obj.username === username) {
        return {
          id: obj.id,
          username: obj.username,
          role: obj.role
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error looking up ambassador:", error);
    return null;
  }
}

interface Props {
  params: { username: string };
}

export default async function AmbassadorVanityPage({ params }: Props) {
  const { username } = params;
  
  // Check if this username corresponds to an ambassador
  const ambassador = await getAmbassadorByUsername(username);
  
  if (ambassador) {
    // Redirect to signup with referral - use ambassador ID not username
    redirect(`/signup?ref=${ambassador.id}`);
  }
  
  // If no ambassador found, redirect to home page
  redirect('/');
} 