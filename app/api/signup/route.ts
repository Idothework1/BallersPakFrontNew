import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import ExcelJS from "exceljs";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log("📝 Signup Data Received:", {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      ambassadorId: data.ambassadorId,
      hasAmbassadorRef: !!data.ambassadorId,
      planType: data.planType,
      experienceLevel: data.experienceLevel,
    });

    // Add complete data logging for debugging
    console.log("🔍 Complete Payload:", JSON.stringify(data, null, 2));

    // Validate required fields
    if (!data.email || !data.firstName || !data.lastName) {
      return NextResponse.json({ 
        success: false, 
        error: "Email, first name, and last name are required" 
      }, { status: 400 });
    }

    // Define consistent headers with new referral tracking fields
    const headers = [
      "timestamp",
      "planType",
      "paymentStatus",
      "firstName",
      "lastName", 
      "fullName",
      "age",
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
      "whyJoinReason",
      "birthday",
      "status",
      "referredBy",        // NEW: Permanent field for original ambassador referral
      "assignedTo",        // NEW: Current assignment (can change)
      "ambassadorId",      // LEGACY: Keep for backward compatibility, use referredBy value
    ];

    // Determine status - ALL free signups are waitlisted, paid signups are approved
    const planType = data.planType ?? "free";
    const status = planType === "free" ? "waitlisted" : "approved";
    
    // Handle ambassador referral tracking
    const referredBy = data.ambassadorId || "";  // Original referrer (permanent)
    const assignedTo = "";                       // No initial assignment
    const legacyAmbassadorId = referredBy;       // Keep legacy field populated for compatibility
    
    console.log("📊 Status & Referral Logic:", {
      planType,
      status,
      referredBy: referredBy || "none",
      assignedTo: assignedTo || "none",
      legacyAmbassadorId: legacyAmbassadorId || "none"
    });

    const values = [
      new Date().toISOString(),
      planType,
      data.paymentStatus ?? "n/a",
      data.firstName ?? "",
      data.lastName ?? "",
      data.fullName ?? "",
      data.age ?? "",
      data.playedBefore ?? false,
      data.experienceLevel ?? "Beginner",
      data.playedClub ?? false,
      data.clubName ?? "",
      data.gender ?? "Male",
      data.hasDisability ?? false,
      data.location ?? "",
      data.email ?? "",
      data.phone ?? "",
      data.position ?? "",
      data.goal ?? "",
      data.whyJoin ?? "",
      data.whyJoinReason ?? "",
      data.birthday ?? "",
      status,
      referredBy,
      assignedTo,
      legacyAmbassadorId,
    ];

    const dataDir = path.join(process.cwd(), "data");
    await fs.mkdir(dataDir, { recursive: true });
    
    const xlsxPath = path.join(dataDir, "signups.xlsx");
    let workbook = new ExcelJS.Workbook();
    let worksheet;

    // Check if file exists and load it
    try {
      await fs.access(xlsxPath);
      await workbook.xlsx.readFile(xlsxPath);
      worksheet = workbook.getWorksheet("Signups") ?? workbook.worksheets[0];
    } catch {
      // File doesn't exist, we'll create it below
      worksheet = null;
    }

    // Create new workbook if needed
    if (!worksheet) {
      console.log("📊 Creating new Excel file with updated schema");
      worksheet = workbook.addWorksheet("Signups");
      worksheet.columns = headers.map((h) => ({ header: h, key: h, width: 20 }));
      
      // Style header row
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid", 
        fgColor: { argb: "FF4CAF50" },
      };
      worksheet.views = [{ state: "frozen", ySplit: 1 }];
    } else {
      // Update existing workbook - check if new columns exist and fix duplicates
      const existingHeaders = (worksheet.getRow(1).values as string[]).slice(1);
      console.log("📊 Current headers:", existingHeaders);
      
      // Check for duplicates and fix them
      const uniqueHeaders = Array.from(new Set(existingHeaders));
      if (uniqueHeaders.length !== existingHeaders.length) {
        console.log("📊 Found duplicate headers, rebuilding header row");
        
        // Clear the header row and rebuild it
        const headerRow = worksheet.getRow(1);
        headerRow.values = ["", ...headers]; // Empty first cell for Excel compatibility
        
        // Restyle header
        headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
        headerRow.fill = {
          type: "pattern",
          pattern: "solid", 
          fgColor: { argb: "FF4CAF50" },
        };
      }
      
      const needsUpdate = !existingHeaders.includes("referredBy") || !existingHeaders.includes("assignedTo");
      
      if (needsUpdate) {
        console.log("📊 Updating Excel schema with new referral tracking fields");
        
        // Ensure we have all required columns
        const headerRow = worksheet.getRow(1);
        headerRow.values = ["", ...headers]; // Rebuild entire header row
        
        // Migrate existing data: copy ambassadorId to referredBy for existing rows
        for (let i = 2; i <= worksheet.rowCount; i++) {
          const row = worksheet.getRow(i);
          const existingAmbassadorId = String(row.getCell(headers.indexOf("ambassadorId") + 1).value || "").trim();
          const existingReferredBy = String(row.getCell(headers.indexOf("referredBy") + 1).value || "").trim();
          
          // If there's an ambassadorId but no referredBy, migrate it
          if (existingAmbassadorId && !existingReferredBy) {
            row.getCell(headers.indexOf("referredBy") + 1).value = existingAmbassadorId;
            console.log(`📊 Migrated row ${i}: ${existingAmbassadorId}`);
          }
          
          // Initialize assignedTo as empty if not set
          if (!row.getCell(headers.indexOf("assignedTo") + 1).value) {
            row.getCell(headers.indexOf("assignedTo") + 1).value = "";
          }
        }
      }
      
      // Check for duplicates before adding
      const existingEmails = new Set();
      const emailColumnIndex = headers.indexOf("email") + 1;
      
      for (let i = 2; i <= worksheet.rowCount; i++) {
        const row = worksheet.getRow(i);
        const email = row.getCell(emailColumnIndex).value;
        if (email) {
          if (existingEmails.has(email)) {
            console.log("🚫 Found duplicate email, removing:", email);
            worksheet.spliceRows(i, 1);
            i--; // Adjust index after deletion
          } else {
            existingEmails.add(email);
          }
        }
      }

      // Check if this email already exists
      if (existingEmails.has(data.email)) {
        console.log("🚫 Email already exists:", data.email);
        return NextResponse.json({ 
          success: false, 
          error: "Email already registered" 
        }, { status: 400 });
      }
    }

    // Add the new row
    const newRow = worksheet.addRow(values);
    
    console.log("📊 Added new row:", {
      rowNumber: newRow.number,
      email: data.email,
      referredBy: referredBy || "none",
      status
    });
    
    // Save file
    await workbook.xlsx.writeFile(xlsxPath);
    
    // Force file system sync
    try {
      const fd = await fs.open(xlsxPath, 'r+');
      await fd.sync();
      await fd.close();
    } catch (syncError) {
      console.warn("File sync warning:", syncError);
    }

    console.log("💾 Data Saved Successfully:", {
      email: data.email,
      status,
      referredBy: referredBy || "none",
      assignedTo: assignedTo || "none",
      newRowNumber: newRow.number
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving signup data:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal Server Error" 
    }, { status: 500 });
  }
} 