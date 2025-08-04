import { NextRequest, NextResponse } from "next/server";
import { dataManager } from "@/lib/data-manager";

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

    // Check if email already exists
    const existingUser = await dataManager.findSignupByEmail(data.email);
    if (existingUser) {
      console.log("⚠️ Email already exists:", data.email);
      return NextResponse.json({ 
        success: false, 
        error: "This email is already registered" 
      }, { status: 400 });
    }

    // Determine status - ALL free signups are waitlisted, paid signups are approved
    const planType = data.planType ?? "free";
    const status = planType === "free" ? "waitlisted" : "approved";
    
    // Handle ambassador referral tracking
    const referredBy = data.ambassadorId || "";  // Original referrer (permanent)
    const assignedTo = "";  // Not assigned initially

    // Create signup object
    const newSignup = {
      timestamp: new Date().toISOString(),
      planType: planType,
      paymentStatus: data.paymentStatus || "n/a",
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      fullName: data.fullName || `${data.firstName} ${data.lastName}`.trim(),
      age: data.age || "",
      playedBefore: data.playedBefore !== undefined ? String(data.playedBefore) : "",
      experienceLevel: data.experienceLevel || "Beginner",
      playedClub: data.playedClub !== undefined ? String(data.playedClub) : "",
      clubName: data.clubName || "",
      gender: data.gender || "Male",
      hasDisability: data.hasDisability !== undefined ? String(data.hasDisability) : "",
      location: data.location || "",
      email: data.email,
      phone: data.phone || "",
      position: data.position || "",
      goal: data.goal || "",
      whyJoin: data.whyJoin || "",
      whyJoinReason: data.whyJoinReason || "",
      birthday: data.birthday || "",
      status: status,
      referredBy: referredBy,           // Use the original referral value
      assignedTo: assignedTo,          // Start empty
      ambassadorId: referredBy,        // Keep for backward compatibility
      processedBy: "",
      paymentId: "",
      amount: "",
      currency: "",
      billing: ""
    };

    console.log("📊 Status & Referral Logic:", {
      planType,
      status,
      referredBy: referredBy || "none",
      assignedTo: assignedTo || "none",
      legacyAmbassadorId: referredBy || "none"
    });

    // Save to CSV
    await dataManager.addSignup(newSignup);
    console.log("✅ Signup data saved to CSV successfully");

    // Check if ambassador was provided and exists
    if (data.ambassadorId) {
      console.log("🔍 Checking ambassador validity:", data.ambassadorId);
      // Note: Ambassador validation would be done here if needed
    }

    return NextResponse.json({ 
      success: true, 
      message: "Signup successful",
      status: status,
      ambassadorReferral: !!referredBy
    });

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to process signup" 
    }, { status: 500 });
  }
}