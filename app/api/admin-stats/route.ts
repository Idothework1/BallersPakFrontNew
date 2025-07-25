import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import ExcelJS from "exceljs";

// GET /api/admin-stats
export async function GET(_request: NextRequest) {
  try {
    const dataDir = path.join(process.cwd(), "data");

    // ---------- Load signups sheet ---------- //
    const signupsPath = path.join(dataDir, "signups.xlsx");
    const signupsWorkbook = new ExcelJS.Workbook();
    await signupsWorkbook.xlsx.readFile(signupsPath);
    const signupsSheet = signupsWorkbook.getWorksheet("Signups") ?? signupsWorkbook.worksheets[0];

    // Bail out if sheet missing
    if (!signupsSheet) {
      return NextResponse.json(
        { error: "Signups worksheet not found" },
        { status: 500 }
      );
    }

    const signupHeaders = (signupsSheet.getRow(1).values as string[]).slice(1);
    const hIndex = (h: string) => signupHeaders.indexOf(h) + 1; // -> 0 means not found

    const emailIdx = hIndex("email");
    const planIdx = hIndex("planType");
    const statusIdx = hIndex("status");
    const processedByIdx = hIndex("processedBy");
    
    // Use new referredBy field for accurate ambassador referral tracking
    let referralFieldIdx = hIndex("referredBy");
    
    // Fallback to legacy ambassadorId if referredBy doesn't exist yet
    if (referralFieldIdx === 0) {
      console.log("⚠️ referredBy field not found in admin stats, falling back to legacy ambassadorId");
      referralFieldIdx = hIndex("ambassadorId");
    }

    // Default counts
    let totalSignups = 0;
    let waitlistedUsers = 0;
    let approvedUsers = 0;
    let premiumUsers = 0;
    let ambassadorReferrals = 0; // Renamed for clarity - these are actual referrals, not assignments
    let controllerAssignments = 0;

    for (let i = 2; i <= signupsSheet.rowCount; i++) {
      const row = signupsSheet.getRow(i);
      if (!row || !row.getCell(emailIdx).value) continue; // skip empty rows

      totalSignups++;

      const planType = String(row.getCell(planIdx).value || "free").toLowerCase();
      const status = String(row.getCell(statusIdx).value || "waitlisted").toLowerCase();
      const referralId = String(row.getCell(referralFieldIdx).value || "").trim();

      if (planType === "paid" || planType === "premium") {
        premiumUsers++;
      }

      if (planType === "free" && (status === "waitlisted" || status === "pending")) {
        waitlistedUsers++;
      }

      if (planType === "free" && status === "approved") {
        approvedUsers++;
      }

      // Count ambassador referrals (actual referrals, not assignments)
      if (referralId && referralId !== "") {
        ambassadorReferrals++;
      }

      if (processedByIdx > 0 && row.getCell(processedByIdx).value) {
        controllerAssignments++;
      }
    }

    // ---------- Load admin-users sheet and update stats ---------- //
    const adminPath = path.join(dataDir, "admin-users.xlsx");
    const adminWorkbook = new ExcelJS.Workbook();
    await adminWorkbook.xlsx.readFile(adminPath);
    const adminSheet = adminWorkbook.getWorksheet("AdminUsers") ?? adminWorkbook.worksheets[0];

    let totalControllers = 0;
    let totalAmbassadors = 0;
    const ambassadorStats = new Map();

    if (adminSheet) {
      const adminHeaders = (adminSheet.getRow(1).values as string[]).slice(1);
      const roleIdx = adminHeaders.indexOf("role") + 1;
      const idIdx = adminHeaders.indexOf("id") + 1;
      const statsIdx = adminHeaders.indexOf("stats") + 1;

      // First pass: count and collect ambassador IDs
      for (let i = 2; i <= adminSheet.rowCount; i++) {
        const row = adminSheet.getRow(i);
        const role = String(row.getCell(roleIdx).value || "").toLowerCase();
        const id = String(row.getCell(idIdx).value || "");
        
        if (role === "controller") totalControllers++;
        if (role === "ambassador") {
          totalAmbassadors++;
          ambassadorStats.set(id, { signups: 0, conversions: 0 });
        }
      }

      // Second pass: calculate ambassador stats from signups using referral data
      for (let i = 2; i <= signupsSheet.rowCount; i++) {
        const row = signupsSheet.getRow(i);
        if (!row || !row.getCell(emailIdx).value) continue;

        const referralId = String(row.getCell(referralFieldIdx).value || "").trim();
        const status = String(row.getCell(statusIdx).value || "waitlisted").toLowerCase();

        if (referralId && ambassadorStats.has(referralId)) {
          const stats = ambassadorStats.get(referralId);
          stats.signups++;
          if (status === "approved") {
            stats.conversions++;
          }
          ambassadorStats.set(referralId, stats);
        }
      }

      // Third pass: update ambassador stats in admin file
      for (let i = 2; i <= adminSheet.rowCount; i++) {
        const row = adminSheet.getRow(i);
        const role = String(row.getCell(roleIdx).value || "").toLowerCase();
        const id = String(row.getCell(idIdx).value || "");
        
        if (role === "ambassador" && ambassadorStats.has(id)) {
          const stats = ambassadorStats.get(id);
          const statsJson = JSON.stringify({
            signups: stats.signups,
            conversions: stats.conversions,
            assignments: 0,
            completed: 0
          });
          row.getCell(statsIdx).value = statsJson;
        }
      }

      // Save updated admin file
      try {
        await adminWorkbook.xlsx.writeFile(adminPath);
      } catch (error) {
        console.warn("Could not update ambassador stats:", error);
      }
    }

    console.log("📊 Admin stats calculated:", {
      totalSignups,
      ambassadorReferrals,
      controllerAssignments,
      usingReferralField: referralFieldIdx === hIndex("referredBy") ? "referredBy" : "ambassadorId (legacy)"
    });

    return NextResponse.json({
      totalSignups,
      waitlistedUsers,
      approvedUsers,
      premiumUsers,
      totalControllers,
      totalAmbassadors,
      ambassadorSignups: ambassadorReferrals, // Keep the original field name for API compatibility
      controllerAssignments,
      meta: {
        referralTrackingField: referralFieldIdx === hIndex("referredBy") ? "referredBy" : "ambassadorId",
        note: referralFieldIdx === hIndex("referredBy") 
          ? "Using new referral tracking system"
          : "Using legacy tracking - referrals and assignments may be mixed"
      }
    });

  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 