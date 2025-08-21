import { NextRequest, NextResponse } from "next/server";
import { dataManager } from "@/lib/data-manager";

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

    console.log(`📧 Processing action: ${action} for email: ${email}`);

    // Find the player
    const player = await dataManager.findSignupByEmail(email);
    
    if (!player) {
      return NextResponse.json(
        { error: `Player with email ${email} not found` },
        { status: 404 }
      );
    }

    console.log(`✅ Found player: ${email}, current status: ${player.status}`);

    // Update status based on action
    let updates: any = {};
    
    switch (action) {
      case "approve":
        updates.status = "approved";
        console.log(`✅ Approving player: ${email}`);
        break;
      case "reject":
        updates.status = "rejected";
        if (reason) {
          // Add rejection reason to whyJoinReason field or similar
          updates.whyJoinReason = `[REJECTED: ${reason}] ${player.whyJoinReason || ''}`;
        }
        console.log(`❌ Rejecting player: ${email} - Reason: ${reason || "No reason provided"}`);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    // Update the player
    const updated = await dataManager.updateSignup(email, updates);
    
    if (!updated) {
      return NextResponse.json(
        { error: "Failed to update player status" },
        { status: 500 }
      );
    }

    console.log(`💾 Successfully updated player ${email} to ${action}`);

    return NextResponse.json({
      success: true,
      message: `Player ${action === "approve" ? "approved" : "rejected"} successfully`,
      email: email,
      action: action
    });

  } catch (error) {
    console.error("Error in controller-actions:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}