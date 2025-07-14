import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
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
    const csvPath = path.join(dataDir, "signups.csv");
    const xlsxPath = path.join(dataDir, "signups.xlsx");

    // -------- Delete from CSV --------
    try {
      await fs.access(csvPath);
      const csvContent = await fs.readFile(csvPath, "utf8");
      const lines = csvContent.split("\n");
      
      if (lines.length <= 1) {
        return NextResponse.json({ success: false, error: "No accounts found" }, { status: 404 });
      }

      const headers = lines[0].split(",");
      const emailIndex = headers.findIndex(h => h.includes("email"));
      
      if (emailIndex === -1) {
        return NextResponse.json({ success: false, error: "Email column not found" }, { status: 500 });
      }

      // Filter out the row with matching email
      const filteredLines = lines.filter((line, index) => {
        if (index === 0) return true; // Keep header
        if (line.trim() === "") return false; // Remove empty lines
        
        const columns = line.split(",");
        const rowEmail = columns[emailIndex]?.replace(/"/g, "").trim();
        return rowEmail !== email;
      });

      // Check if any row was actually deleted
      if (filteredLines.length === lines.length) {
        return NextResponse.json({ success: false, error: "Account not found" }, { status: 404 });
      }

      // Write the filtered content back to CSV
      await fs.writeFile(csvPath, filteredLines.join("\n"), "utf8");
    } catch (error) {
      console.error("Error deleting from CSV:", error);
      // Continue to Excel deletion even if CSV fails
    }

    // -------- Delete from Excel --------
    try {
      await fs.access(xlsxPath);
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(xlsxPath);
      const worksheet = workbook.getWorksheet("Signups") ?? workbook.worksheets[0];
      
      if (!worksheet) {
        return NextResponse.json({ success: false, error: "Excel worksheet not found" }, { status: 500 });
      }

      const headers = (worksheet.getRow(1).values as string[]).slice(1);
      const emailIndex = headers.findIndex(h => h?.includes("email"));
      
      if (emailIndex === -1) {
        return NextResponse.json({ success: false, error: "Email column not found in Excel" }, { status: 500 });
      }

      let rowDeleted = false;
      // Iterate through rows from bottom to top to avoid index shifting
      for (let rowNum = worksheet.rowCount; rowNum >= 2; rowNum--) {
        const row = worksheet.getRow(rowNum);
        const values = row.values as (string | number | undefined)[];
        const rowEmail = String(values[emailIndex + 1] ?? "").trim();
        
        if (rowEmail === email) {
          worksheet.spliceRows(rowNum, 1);
          rowDeleted = true;
          break;
        }
      }

      if (!rowDeleted) {
        return NextResponse.json({ success: false, error: "Account not found in Excel" }, { status: 404 });
      }

      await workbook.xlsx.writeFile(xlsxPath);
    } catch (error) {
      console.error("Error deleting from Excel:", error);
      return NextResponse.json({ success: false, error: "Error deleting from Excel file" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
} 