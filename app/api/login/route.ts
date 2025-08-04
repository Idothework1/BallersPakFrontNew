import { NextRequest, NextResponse } from "next/server";
import { dataManager } from "@/lib/data-manager";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ 
        success: false, 
        error: "Email is required" 
      }, { status: 400 });
    }

    console.log("🔍 Attempting login for:", email);

    // Find user by email
    const userData = await dataManager.findSignupByEmail(email);
    
    if (!userData) {
      console.log("❌ User not found:", email);
      return NextResponse.json({ 
        success: false, 
        error: "No account found with this email. Please sign up first." 
      }, { status: 404 });
    }

    console.log("✅ User found:", {
      email: userData.email,
      status: userData.status,
      planType: userData.planType,
      paymentStatus: userData.paymentStatus
    });

    const userStatus = userData.status?.toLowerCase() || "waitlisted";
    const planType = userData.planType || "free";

    // If user is waitlisted and not a premium member, they need approval
    if (planType === "free" && (userStatus === "waitlisted" || userStatus === "pending")) {
      return NextResponse.json({ 
        success: false, 
        error: "pending_approval",
        message: "Your application is still being reviewed. Please wait for admin approval to access your profile."
      }, { status: 403 });
    }

    // If user is rejected
    if (userStatus === "rejected") {
      return NextResponse.json({ 
        success: false, 
        error: "application_rejected",
        message: "Your application has been rejected. Please contact support if you believe this is an error."
      }, { status: 403 });
    }

    // User is approved or is a premium member - allow login
    const userProfile = {
      id: userData.email, // Use email as ID for CSV
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      fullName: userData.fullName,
      age: userData.age,
      birthday: userData.birthday,
      planType: planType,
      paymentStatus: userData.paymentStatus || "n/a",
      position: userData.position,
      currentLevel: userData.experienceLevel,
      location: userData.location,
      goal: userData.goal,
      timestamp: userData.timestamp,
      status: userStatus,
    };

    // Set cookie for server-side auth
    const response = NextResponse.json({ success: true, user: userProfile });
    
    // Set a secure httpOnly cookie for session management
    response.cookies.set('ballerspak_session', JSON.stringify({
      id: userProfile.id,
      email: userProfile.email,
      planType: userProfile.planType,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24 hours
    });
    
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal Server Error" 
    }, { status: 500 });
  }
}