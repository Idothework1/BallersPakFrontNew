import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import ExcelJS from "exceljs";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const dataDir = path.join(process.cwd(), "data");
    const xlsxPath = path.join(dataDir, "signups.xlsx");

    // Check if file exists
    try {
      await fs.access(xlsxPath);
    } catch {
      return NextResponse.json({ error: "Data file not found" }, { status: 404 });
    }

    // Read existing data
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(xlsxPath);
    const worksheet = workbook.getWorksheet("Signups") ?? workbook.worksheets[0];
    
    if (!worksheet) {
      return NextResponse.json({ error: "Worksheet not found" }, { status: 404 });
    }

    // Get headers
    const headers = (worksheet.getRow(1).values as string[]).slice(1);
    const emailColumnIndex = headers.indexOf("email") + 1;
    const statusColumnIndex = headers.indexOf("status") + 1;

    if (emailColumnIndex === 0) {
      return NextResponse.json({ error: "Email column not found" }, { status: 400 });
    }

    // Find the player row
    let playerRowIndex = -1;
    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      if (row.getCell(emailColumnIndex).value === email) {
        playerRowIndex = i;
        break;
      }
    }

    if (playerRowIndex === -1) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    // Update status to "approved"
    const playerRow = worksheet.getRow(playerRowIndex);
    
    // If status column doesn't exist, add it
    if (statusColumnIndex === 0) {
      // Add status header if it doesn't exist
      const headerRow = worksheet.getRow(1);
      const newColumnIndex = headers.length + 1;
      headerRow.getCell(newColumnIndex).value = "status";
      
      // Update the status for this player
      playerRow.getCell(newColumnIndex).value = "approved";
    } else {
      // Update existing status column
      playerRow.getCell(statusColumnIndex).value = "approved";
    }

    // Save the file
    await workbook.xlsx.writeFile(xlsxPath);

    return NextResponse.json({ 
      success: true, 
      message: `Player ${email} has been approved successfully` 
    });

  } catch (error) {
    console.error("Error approving player:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
} 