import { NextRequest, NextResponse } from "next/server";
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
  } catch {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;
    
    // Look up ambassador by username
    const ambassador = await getAmbassadorByUsername(username);
    
    if (!ambassador) {
      return NextResponse.json(
        { error: "Ambassador not found" },
        { status: 404 }
      );
    }
    
    // Redirect to signup page with ambassador reference
    const signupUrl = new URL('/signup', request.url);
    signupUrl.searchParams.set('ref', ambassador.id);
    
    return NextResponse.redirect(signupUrl);
    
  } catch (error) {
    console.error("Error handling ambassador redirect:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 