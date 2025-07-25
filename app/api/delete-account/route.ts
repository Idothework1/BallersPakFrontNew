import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import ExcelJS from "exceljs";

// Force dynamic because we rely on filesystem operations
export const dynamic = "force-dynamic";

export async function DELETE(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const dataDir = path.join(process.cwd(), "data");
    const xlsxPath = path.join(dataDir, "signups.xlsx");

    // Check if Excel file exists
    try {
      await fs.access(xlsxPath);
    } catch {
      return NextResponse.json({ success: false, error: "Data file not found" }, { status: 404 });
    }

    // Load Excel workbook
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(xlsxPath);
    const worksheet = workbook.getWorksheet("Signups") ?? workbook.worksheets[0];
    
    if (!worksheet) {
      return NextResponse.json({ success: false, error: "Worksheet not found" }, { status: 500 });
    }

    const headers = (worksheet.getRow(1).values as string[]).slice(1);
    const emailIndex = headers.findIndex(h => h?.includes("email"));
    
    if (emailIndex === -1) {
      return NextResponse.json({ success: false, error: "Email column not found" }, { status: 500 });
    }

    let rowDeleted = false;
    // Iterate through rows from bottom to top to avoid index shifting
    for (let rowNum = worksheet.rowCount; rowNum >= 2; rowNum--) {
      const row = worksheet.getRow(rowNum);
      const values = row.values as (string | number | undefined)[];
      const rowEmail = String(values[emailIndex + 1] ?? "").trim();
      
      if (rowEmail === email) {
        console.log(`🗑️ Deleting account: ${email} from row ${rowNum}`);
        worksheet.spliceRows(rowNum, 1);
        rowDeleted = true;
        break;
      }
    }

    if (!rowDeleted) {
      return NextResponse.json({ success: false, error: "Account not found" }, { status: 404 });
    }

    // Save the updated Excel file
    await workbook.xlsx.writeFile(xlsxPath);
    
    // Force file system sync
    try {
      const fd = await fs.open(xlsxPath, 'r+');
      await fd.sync();
      await fd.close();
    } catch (syncError) {
      console.warn("File sync warning:", syncError);
    }

    console.log(`✅ Successfully deleted account: ${email}`);
    return NextResponse.json({ success: true, message: "Account deleted successfully" });

  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
} 