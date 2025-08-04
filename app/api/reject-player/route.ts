import { NextRequest, NextResponse } from "next/server";
import { dataManager } from "@/lib/data-manager";

export async function POST(request: NextRequest) {
  try {
    const { email, reason } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find the player
    const player = await dataManager.findSignupByEmail(email);
    
    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    // Update status to "rejected" and add reason if provided
    const updates: any = {
      status: "rejected"
    };
    
    if (reason) {
      // Add rejection reason to the whyJoinReason field or a new field
      updates.whyJoinReason = `[REJECTED: ${reason}] ${player.whyJoinReason || ''}`;
    }

    const updated = await dataManager.updateSignup(email, updates);

    if (!updated) {
      return NextResponse.json({ 
        error: "Failed to update player status" 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Player ${email} rejected successfully.` 
    });

  } catch (error) {
    console.error("Error rejecting player:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}