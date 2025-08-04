import { NextRequest, NextResponse } from "next/server";
import { dataManager } from "@/lib/data-manager";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const ambassadorId = request.nextUrl.searchParams.get("ambassadorId");

    if (!ambassadorId) {
      return NextResponse.json(
        { error: "Ambassador ID is required" },
        { status: 400 }
      );
    }

    console.log(`📊 Calculating stats for ambassador ${ambassadorId}`);

    // Get all signups
    const allSignups = await dataManager.getSignups();
    console.log(`📊 Total signups found: ${allSignups.length}`);

    // Collect signups for this ambassador based on referrals (not assignments)
    const ambassadorSignups = allSignups.filter(signup => {
      // Use referredBy field for accurate referral tracking, fallback to ambassadorId
      const referralId = signup.referredBy || signup.ambassadorId || "";
      return referralId === ambassadorId;
    });

    console.log(`📊 Found ${ambassadorSignups.length} signups for ambassador ${ambassadorId}`);

    // Calculate stats
    let totalSignups = 0;
    let approvedSignups = 0;
    let rejectedSignups = 0;
    let waitlistedSignups = 0;
    let paidSignups = 0;

    const signups = ambassadorSignups.map(signup => {
      totalSignups++;
      
      const status = (signup.status || "waitlisted").toLowerCase().trim();
      const paymentStatus = (signup.paymentStatus || "n/a").toLowerCase();
      
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

      // Count paid users
      if (paymentStatus === "paid" || paymentStatus === "subscription") {
        paidSignups++;
      }

      // Return cleaned signup data for display
      return {
        timestamp: signup.timestamp || "",
        firstName: signup.firstName || "",
        lastName: signup.lastName || "",
        status: status || "waitlisted",
        // Only include username, not email for privacy
        username: `${signup.firstName || ""} ${signup.lastName || ""}`.trim() || "Unknown",
        isPaid: paymentStatus === "paid" || paymentStatus === "subscription"
      };
    });

    // Sort signups by timestamp (newest first)
    signups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    console.log(`📊 Ambassador ${ambassadorId} final stats:`, {
      totalSignups,
      approvedSignups,
      rejectedSignups,
      waitlistedSignups,
      paidSignups
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalSignups,
        approvedSignups,
        rejectedSignups,
        waitlistedSignups,
        paidSignups,
        conversionRate: totalSignups > 0 ? Math.round((paidSignups / totalSignups) * 100) : 0
      },
      signups: signups.map(signup => ({
        timestamp: signup.timestamp,
        username: signup.username, // Only username, no email/personal info
        status: signup.status,
        isPaid: signup.isPaid
      })),
      meta: {
        trackingField: "referredBy",
        note: "Using CSV-based tracking system"
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