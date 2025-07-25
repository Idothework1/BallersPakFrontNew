import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import ExcelJS from "exceljs";

// Force dynamic because we rely on filesystem writes
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { email, action, reason } = await request.json();

    if (!email || !action) {
      return NextResponse.json(
        { error: "Email and action are required" },
        { status: 400 }
      );
    }

    const dataDir = path.join(process.cwd(), "data");
    const xlsxPath = path.join(dataDir, "signups.xlsx");
    
    // Load workbook
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(xlsxPath);
    const worksheet = workbook.getWorksheet("Signups");

    if (!worksheet) {
      return NextResponse.json(
        { error: "Worksheet not found" },
        { status: 404 }
      );
    }

    // Get headers to find column indices
    const headers = (worksheet.getRow(1).values as string[]).slice(1);
    const emailIndex = headers.indexOf("email") + 1;
    const statusIndex = headers.indexOf("status") + 1;
    
    if (emailIndex === 0 || statusIndex === 0) {
      return NextResponse.json(
        { error: "Required columns not found in worksheet" },
        { status: 500 }
      );
    }

    console.log(`📧 Looking for email: ${email} in column ${emailIndex}`);
    console.log(`📊 Headers found:`, headers);

    // Find the row with matching email
    let targetRow: ExcelJS.Row | undefined;
    let targetRowNumber = 0;
    
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row
      const rowEmail = row.getCell(emailIndex).value;
      console.log(`📧 Row ${rowNumber}: email="${rowEmail}", target="${email}", match=${rowEmail === email}`);
      if (rowEmail === email) {
        targetRow = row;
        targetRowNumber = rowNumber;
      }
    });

    if (!targetRow) {
      return NextResponse.json(
        { error: `Player with email ${email} not found` },
        { status: 404 }
      );
    }

    console.log(`✅ Found target row ${targetRowNumber} for email: ${email}`);

    // Update status based on action
    const statusCell = targetRow.getCell(statusIndex);

    switch (action) {
      case "approve":
        statusCell.value = "approved";
        console.log(`✅ Approved player: ${email}`);
        break;
      case "reject":
        statusCell.value = "rejected";
        console.log(`❌ Rejected player: ${email} - Reason: ${reason || "No reason provided"}`);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    // Save changes
    await workbook.xlsx.writeFile(xlsxPath);
    console.log(`💾 Saved changes to Excel file for ${email}`);

    return NextResponse.json({
      success: true,
      message: `Player ${action === "approve" ? "approved" : "rejected"} successfully`,
      email: email,
      action: action,
      rowNumber: targetRowNumber
    });

  } catch (error) {
    console.error("Error in controller-actions:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
} 