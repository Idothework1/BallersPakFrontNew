import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import ExcelJS from "exceljs";

async function verifyAdminSession(request: NextRequest): Promise<boolean> {
  try {
    const sessionCookie = request.cookies.get('admin-session');
    if (!sessionCookie) return false;

    const sessionData = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());
    return sessionData.exp > Date.now() && sessionData.role === 'admin';
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action } = await request.json();

    if (action === "migrate-ambassador-data") {
      return await migrateAmbassadorData();
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Error in data cleanup:", error);
    return NextResponse.json({
      error: "Internal server error"
    }, { status: 500 });
  }
}

async function migrateAmbassadorData() {
  const dataDir = path.join(process.cwd(), "data");
  const xlsxPath = path.join(dataDir, "signups.xlsx");

  try {
    await fs.access(xlsxPath);
  } catch {
    return NextResponse.json({ error: "Signups file not found" }, { status: 404 });
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(xlsxPath);
  const worksheet = workbook.getWorksheet("Signups") ?? workbook.worksheets[0];

  if (!worksheet) {
    return NextResponse.json({ error: "Worksheet not found" }, { status: 404 });
  }

  const headers = (worksheet.getRow(1).values as string[]).slice(1);
  const ambassadorIdIndex = headers.indexOf("ambassadorId") + 1;
  let referredByIndex = headers.indexOf("referredBy") + 1;
  let assignedToIndex = headers.indexOf("assignedTo") + 1;

  console.log("📊 Starting ambassador data migration...");
  console.log("Current headers:", headers);

  let migratedCount = 0;
  let addedColumns = [];

  // Add missing columns if they don't exist
  const headerRow = worksheet.getRow(1);
  let nextColumnIndex = headers.length + 1;

  if (referredByIndex === 0) {
    headerRow.getCell(nextColumnIndex).value = "referredBy";
    headerRow.getCell(nextColumnIndex).font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.getCell(nextColumnIndex).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4CAF50" },
    };
    referredByIndex = nextColumnIndex;
    addedColumns.push("referredBy");
    nextColumnIndex++;
  }

  if (assignedToIndex === 0) {
    headerRow.getCell(nextColumnIndex).value = "assignedTo";
    headerRow.getCell(nextColumnIndex).font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.getCell(nextColumnIndex).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4CAF50" },
    };
    assignedToIndex = nextColumnIndex;
    addedColumns.push("assignedTo");
    nextColumnIndex++;
  }

  // Migrate existing data
  if (ambassadorIdIndex > 0) {
    console.log("📊 Migrating ambassador referral data...");
    
    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      const existingAmbassadorId = String(row.getCell(ambassadorIdIndex).value || "").trim();
      const existingReferredBy = String(row.getCell(referredByIndex).value || "").trim();
      
      // If there's an ambassadorId but no referredBy, migrate it
      if (existingAmbassadorId && !existingReferredBy) {
        row.getCell(referredByIndex).value = existingAmbassadorId;
        migratedCount++;
        
        console.log(`📊 Migrated row ${i}:`, {
          email: String(row.getCell(headers.indexOf("email") + 1).value || ""),
          ambassadorId: existingAmbassadorId,
          referredBy: existingAmbassadorId
        });
      }
      
      // Initialize assignedTo as empty if not set
      if (!row.getCell(assignedToIndex).value) {
        row.getCell(assignedToIndex).value = "";
      }
    }
  }

  // Save the migrated data
  await workbook.xlsx.writeFile(xlsxPath);

  // Force file system sync
  try {
    const fd = await fs.open(xlsxPath, 'r+');
    await fd.sync();
    await fd.close();
  } catch (syncError) {
    console.warn("File sync warning:", syncError);
  }

  console.log("✅ Ambassador data migration complete:", {
    addedColumns,
    migratedCount,
    referredByIndex,
    assignedToIndex
  });

  return NextResponse.json({
    success: true,
    message: "Ambassador data migration completed successfully",
    details: {
      addedColumns,
      migratedRecords: migratedCount,
      newColumns: {
        referredBy: referredByIndex,
        assignedTo: assignedToIndex
      }
    }
  });
}

// GET endpoint for checking migration status
export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dataDir = path.join(process.cwd(), "data");
    const xlsxPath = path.join(dataDir, "signups.xlsx");

    try {
      await fs.access(xlsxPath);
    } catch {
      return NextResponse.json({ 
        needsMigration: true,
        reason: "Signups file not found"
      });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(xlsxPath);
    const worksheet = workbook.getWorksheet("Signups") ?? workbook.worksheets[0];

    if (!worksheet) {
      return NextResponse.json({ 
        needsMigration: true,
        reason: "Worksheet not found"
      });
    }

    const headers = (worksheet.getRow(1).values as string[]).slice(1);
    const hasReferredBy = headers.includes("referredBy");
    const hasAssignedTo = headers.includes("assignedTo");
    const hasAmbassadorId = headers.includes("ambassadorId");

    // Check if migration is needed
    const needsMigration = !hasReferredBy || !hasAssignedTo;

    // Count records that need migration
    let recordsNeedingMigration = 0;
    if (hasAmbassadorId && hasReferredBy) {
      const ambassadorIdIndex = headers.indexOf("ambassadorId") + 1;
      const referredByIndex = headers.indexOf("referredBy") + 1;

      for (let i = 2; i <= worksheet.rowCount; i++) {
        const row = worksheet.getRow(i);
        const ambassadorId = String(row.getCell(ambassadorIdIndex).value || "").trim();
        const referredBy = String(row.getCell(referredByIndex).value || "").trim();
        
        if (ambassadorId && !referredBy) {
          recordsNeedingMigration++;
        }
      }
    }

    return NextResponse.json({
      needsMigration,
      currentStatus: {
        hasReferredBy,
        hasAssignedTo,
        hasAmbassadorId,
        recordsNeedingMigration,
        totalRecords: worksheet.rowCount - 1
      }
    });

  } catch (error) {
    console.error("Error checking migration status:", error);
    return NextResponse.json({
      error: "Error checking migration status"
    }, { status: 500 });
  }
} 