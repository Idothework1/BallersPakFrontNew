import { NextRequest, NextResponse } from "next/server";
import { dataManager } from "@/lib/data-manager";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find the player
    const player = await dataManager.findSignupByEmail(email);
    
    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    // Update status to "approved"
    const updated = await dataManager.updateSignup(email, {
      status: "approved"
    });

    if (!updated) {
      return NextResponse.json({ 
        error: "Failed to update player status" 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Player ${email} has been approved successfully` 
    });

  } catch (error) {
    console.error("Error approving player:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}