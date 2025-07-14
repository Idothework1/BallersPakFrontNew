import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import ExcelJS from "exceljs";

// Force dynamic because we rely on filesystem writes
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Define CSV columns in desired intuitive order
    const headers = [
      "timestamp",
      "planType", // free, elite, pro
      "paymentStatus", // completed, pending, failed
      "firstName",
      "lastName",
      "fullName", // for paid plans
      "age", // for paid plans
      "playedBefore",
      "experienceLevel",
      "playedClub",
      "clubName",
      "gender",
      "hasDisability",
      "location",
      "email",
      "phone",
      "position",
      "goal",
      "whyJoin",
      "whyJoinReason", // for pro plans
      "birthday", // for login authentication
      "status", // for approval workflow
    ];

    const values = [
      new Date().toISOString(),
      data.planType ?? "free", // default to free plan
      data.paymentStatus ?? "n/a", // payment status for paid plans
      data.firstName ?? "",
      data.lastName ?? "",
      data.fullName ?? "", // for paid plans
      data.age ?? "", // for paid plans
      data.playedBefore ?? "",
      data.experienceLevel ?? "",
      data.playedClub ?? "",
      data.clubName ?? "",
      data.gender ?? "",
      data.hasDisability ?? "",
      data.location ?? "",
      data.email ?? "",
      data.phone ?? "",
      data.position ?? "",
      data.goal ?? "",
      data.whyJoin ?? "",
      data.whyJoinReason ?? "", // for pro plans
      data.birthday ?? "", // for login authentication
      data.status ?? (data.planType === "free" ? "waitlisted" : "approved"), // default status based on plan type
    ];

    // Escape double quotes and wrap each value in quotes to be CSV-safe
    const escapedRow = values
      .map((val) => `"${String(val).replace(/"/g, '""')}"`)
      .join(",") + "\n";

    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "signups.csv");

    // Ensure directory exists
    await fs.mkdir(dataDir, { recursive: true });

    // If CSV file doesn't exist, create it with header row first
    try {
      await fs.access(filePath);
    } catch {
      const headerRow = headers.join(",") + "\n";
      await fs.writeFile(filePath, headerRow, "utf8");
    }

    // Append the new row
    await fs.appendFile(filePath, escapedRow, "utf8");

    // -------- XLSX ----------
    const xlsxPath = path.join(dataDir, "signups.xlsx");
    const workbook = new ExcelJS.Workbook();
    let worksheet;
    try {
      await fs.access(xlsxPath);
      await workbook.xlsx.readFile(xlsxPath);
      worksheet = workbook.getWorksheet("Signups") ?? workbook.worksheets[0];
    } catch {
      // File doesn't exist; create new workbook & sheet
      worksheet = workbook.addWorksheet("Signups");
      worksheet.columns = headers.map((h) => ({ header: h, key: h, width: 20 }));
      // Style header row
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4CAF50" }, // green header background
      };
      worksheet.views = [{ state: "frozen", ySplit: 1 }];
    }

    worksheet.addRow(values);
    await workbook.xlsx.writeFile(xlsxPath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving signup data:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
} 