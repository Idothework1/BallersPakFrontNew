import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import ExcelJS from "exceljs";

export async function GET(request: NextRequest) {
  try {
    const ambassadorId = request.nextUrl.searchParams.get("ambassadorId");

    if (!ambassadorId) {
      return NextResponse.json(
        { error: "Ambassador ID is required" },
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

    // Get headers (slice(1) to remove empty first cell in Excel)
    const headers = (worksheet.getRow(1).values as string[]).slice(1);
    
    // Use the new referredBy field for accurate referral tracking
    let referralFieldIndex = headers.findIndex(h => h === "referredBy");
    
    // Fallback to legacy ambassadorId if referredBy doesn't exist yet
    if (referralFieldIndex === -1) {
      console.log("⚠️ referredBy field not found, falling back to legacy ambassadorId");
      referralFieldIndex = headers.findIndex(h => h === "ambassadorId");
    }
    
    const statusIndex = headers.findIndex(h => h === "status");
    const timestampIndex = headers.findIndex(h => h === "timestamp");
    const emailIndex = headers.findIndex(h => h === "email");
    const firstNameIndex = headers.findIndex(h => h === "firstName");
    const lastNameIndex = headers.findIndex(h => h === "lastName");

    if (referralFieldIndex === -1) {
      return NextResponse.json(
        { error: "Ambassador referral tracking not configured" },
        { status: 500 }
      );
    }

    console.log(`📊 Calculating stats for ambassador ${ambassadorId} using field index ${referralFieldIndex}`);
    console.log(`📊 Status field index: ${statusIndex}`);
    console.log(`📊 Total worksheet rows: ${worksheet.rowCount}`);

    // Collect signups for this ambassador based on referrals (not assignments)
    const signups: any[] = [];
    let totalSignups = 0;
    let approvedSignups = 0;
    let rejectedSignups = 0;
    let waitlistedSignups = 0;
    let rowsProcessed = 0;
    let matchingRows: number[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row
      
      rowsProcessed++;
      const rowValues = row.values as (string | number | undefined)[];
      // Add 1 to indices to account for Excel's 1-based indexing
      const rowReferralId = String(rowValues[referralFieldIndex + 1] ?? "").trim();
      
      // Log every row for debugging
      console.log(`📊 Row ${rowNumber}: referralId="${rowReferralId}", target="${ambassadorId}", match=${rowReferralId === ambassadorId}`);
      
      // Only count signups that were referred by this ambassador
      if (rowReferralId === ambassadorId) {
        matchingRows.push(rowNumber);
        totalSignups++;
        
        const status = String(rowValues[statusIndex + 1] ?? "").toLowerCase().trim();
        const email = String(rowValues[emailIndex + 1] ?? "");
        console.log(`📊 ✅ MATCH Row ${rowNumber}: email=${email}, status="${status}", rawStatus="${rowValues[statusIndex + 1]}"`);
        
        switch(status) {
          case "approved":
            approvedSignups++;
            break;
          case "rejected":
            rejectedSignups++;
            break;
          case "waitlisted":
          case "pending":
          case "":
          default:
            waitlistedSignups++;
            break;
        }

        // Add to detailed signups array - clean the data for display
        signups.push({
          timestamp: String(rowValues[timestampIndex + 1] ?? ""),
          firstName: String(rowValues[firstNameIndex + 1] ?? ""),
          lastName: String(rowValues[lastNameIndex + 1] ?? ""),
          status: status || "waitlisted",
          // Only include username, not email for privacy
          username: `${String(rowValues[firstNameIndex + 1] ?? "")} ${String(rowValues[lastNameIndex + 1] ?? "")}`.trim() || "Unknown"
        });
      }
    });

    console.log(`📊 Processing summary:`, {
      totalRows: worksheet.rowCount,
      rowsProcessed,
      matchingRows,
      ambassadorId,
      referralFieldIndex,
      statusIndex
    });

    // Sort signups by timestamp (newest first)
    signups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    console.log(`📊 Ambassador ${ambassadorId} final stats:`, {
      totalSignups,
      approvedSignups,
      rejectedSignups,
      waitlistedSignups,
      usingField: referralFieldIndex === headers.findIndex(h => h === "referredBy") ? "referredBy" : "ambassadorId (legacy)"
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalSignups,
        approvedSignups,
        rejectedSignups,
        waitlistedSignups,
      },
      signups: signups.map(signup => ({
        timestamp: signup.timestamp,
        username: signup.username, // Only username, no email/personal info
        status: signup.status
      })),
      meta: {
        trackingField: referralFieldIndex === headers.findIndex(h => h === "referredBy") ? "referredBy" : "ambassadorId",
        note: referralFieldIndex === headers.findIndex(h => h === "referredBy") 
          ? "Using new referral tracking system"
          : "Using legacy tracking - consider updating data schema"
      }
    });

  } catch (error) {
    console.error("Error fetching ambassador stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 