import { NextRequest, NextResponse } from "next/server";
import { dataManager } from "@/lib/data-manager";

// Force dynamic because we rely on filesystem operations
export const dynamic = "force-dynamic";

export async function DELETE(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const deleted = await dataManager.deleteSignup(email);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Account not found" }, { status: 404 });
    }

    console.log(`✅ Successfully deleted account: ${email}`);
    return NextResponse.json({ success: true, message: "Account deleted successfully" });

  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
} 