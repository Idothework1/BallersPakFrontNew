import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import ExcelJS from "exceljs";

export async function POST(request: NextRequest) {
  try {
    const { email, reason } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const dataDir = path.join(process.cwd(), "data");
    const xlsxPath = path.join(dataDir, "signups.xlsx");

    // Ensure file exists
    try {
      await fs.access(xlsxPath);
    } catch {
      return NextResponse.json({ error: "Data file not found" }, { status: 404 });
    }

    // Load workbook
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(xlsxPath);
    const worksheet = workbook.getWorksheet("Signups") ?? workbook.worksheets[0];

    if (!worksheet) {
      return NextResponse.json({ error: "Worksheet not found" }, { status: 404 });
    }

    // Determine column indices
    const headers = (worksheet.getRow(1).values as string[]).slice(1);
    const emailIdx = headers.indexOf("email") + 1;
    let statusIdx = headers.indexOf("status") + 1;
    let rejectReasonIdx = headers.indexOf("rejectReason") + 1;

    if (emailIdx === 0) {
      return NextResponse.json({ error: "Email column not found" }, { status: 400 });
    }

    // Add columns if missing
    if (statusIdx === 0) {
      const newCol = headers.length + 1;
      worksheet.getRow(1).getCell(newCol).value = "status";
      statusIdx = newCol;
    }
    if (rejectReasonIdx === 0 && reason) {
      const newCol = headers.length + (statusIdx > 0 ? 0 : 1) + 1;
      worksheet.getRow(1).getCell(newCol).value = "rejectReason";
      rejectReasonIdx = newCol;
    }

    // Locate player row
    let foundRow: ExcelJS.Row | null = null;
    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      if (row.getCell(emailIdx).value === email) {
        foundRow = row;
        break;
      }
    }

    if (!foundRow) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    // Update status and reason
    foundRow.getCell(statusIdx).value = "rejected";
    if (reason && rejectReasonIdx > 0) {
      foundRow.getCell(rejectReasonIdx).value = reason;
    }

    await workbook.xlsx.writeFile(xlsxPath);

    return NextResponse.json({ success: true, message: `Player ${email} rejected successfully.` });
  } catch (error) {
    console.error("Error rejecting player:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 