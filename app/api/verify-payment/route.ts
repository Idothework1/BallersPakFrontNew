import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { dataManager } from "@/lib/data-manager";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");
    
    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }
    
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    const isSubscription = session.mode === "subscription";
    
    if (session.payment_status === "paid" || session.status === "complete") {
      // Check if the payment has already been processed
      const existingPayment = await dataManager.findSignupByPaymentId(sessionId);
      
      if (existingPayment) {
        console.log(`✅ Payment already processed for session ${sessionId}`);
        return NextResponse.json({
          success: true,
          message: "Payment already verified",
          plan: existingPayment.planType,
          billing: existingPayment.billing || "annual",
          amount: existingPayment.amount || 0,
          currency: existingPayment.currency || "USD",
          subscription: isSubscription,
          alreadyProcessed: true
        });
      }
      
      // Get user email
      const email = session.metadata?.email || session.customer_email || "";
      
      if (!email) {
        return NextResponse.json({
          success: false,
          error: "No email found in payment session"
        });
      }
      
      // Parse user data
      const fullName = session.metadata?.fullName || "";
      let firstName = "";
      let lastName = "";
      
      if (fullName && fullName.trim()) {
        const nameParts = fullName.trim().split(" ");
        firstName = nameParts[0] || "";
        lastName = nameParts.slice(1).join(" ") || "";
      }
      
      // Check if user exists by email
      const existingUser = await dataManager.findSignupByEmail(email);
      
      if (existingUser) {
        // Update existing user to paid status
        console.log(`✅ Updating existing user ${email} to paid status`);
        
        await dataManager.updateSignup(email, {
          planType: session.metadata?.plan || "elite",
          paymentStatus: isSubscription ? "subscription" : "paid",
          status: "approved", // Auto-approve paid users
          paymentId: sessionId,
          amount: session.amount_total ? String(session.amount_total / 100) : "0",
          currency: session.currency?.toUpperCase() || "USD",
          billing: session.metadata?.billing || "annual",
          // Update name fields if they were provided
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(fullName && { fullName }),
          // Update other fields if provided
          birthday: session.metadata?.birthday || existingUser.birthday,
          position: session.metadata?.position || existingUser.position,
          experienceLevel: session.metadata?.currentLevel || existingUser.experienceLevel,
          whyJoinReason: session.metadata?.whyJoinReason || existingUser.whyJoinReason,
        });
      } else {
        // Create new paid user (edge case - shouldn't normally happen)
        console.log(`⚠️ Creating new paid user for ${email} (no existing signup found)`);
        
        await dataManager.addSignup({
          timestamp: new Date().toISOString(),
          firstName: firstName || "",
          lastName: lastName || "",
          fullName: fullName || `${firstName} ${lastName}`.trim() || "",
          email: email,
          birthday: session.metadata?.birthday || "",
          position: session.metadata?.position || "",
          experienceLevel: session.metadata?.currentLevel || "",
          goal: session.metadata?.whyJoinReason || "",
          whyJoinReason: session.metadata?.whyJoinReason || "",
          planType: session.metadata?.plan || "elite",
          status: "approved", // Auto-approve paid users
          paymentStatus: isSubscription ? "subscription" : "paid",
          paymentId: sessionId,
          amount: session.amount_total ? String(session.amount_total / 100) : "0",
          currency: session.currency?.toUpperCase() || "USD",
          billing: session.metadata?.billing || "annual",
          // Default values
          age: "",
          playedBefore: "",
          playedClub: "",
          clubName: "",
          gender: "",
          hasDisability: "",
          location: "",
          phone: "",
          whyJoin: "",
          referredBy: "",
          assignedTo: "",
          ambassadorId: "",
          processedBy: ""
        });
      }
      
      return NextResponse.json({
        success: true,
        message: isSubscription 
          ? "Subscription verified and user updated to paid status" 
          : "Payment verified and user updated to paid status",
        plan: session.metadata?.plan,
        billing: session.metadata?.billing || "annual",
        amount: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency?.toUpperCase(),
        subscription: isSubscription
      });
      
    } else {
      return NextResponse.json({
        success: false,
        error: isSubscription 
          ? "Subscription not completed" 
          : "Payment not completed"
      });
    }
    
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}