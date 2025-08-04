import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { csvManager } from "@/lib/csv-data-manager";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export const dynamic = 'force-dynamic';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

async function addPaidUser(session: Stripe.Checkout.Session) {
  try {
    // Parse user data from session metadata
    const timestamp = new Date().toISOString();
    const fullName = session.metadata?.fullName || "";
    let firstName = "";
    let lastName = "";
    
    // Parse names only if fullName is not empty
    if (fullName && fullName.trim()) {
      const nameParts = fullName.trim().split(" ");
      firstName = nameParts[0] || "";
      lastName = nameParts.slice(1).join(" ") || "";
    }
    
    const email = session.metadata?.email || session.customer_email || "";
    
    // Log the metadata for debugging
    console.log(`📋 Webhook metadata received:`, {
      fullName: session.metadata?.fullName || "NOT PROVIDED",
      email: session.metadata?.email || "NOT PROVIDED",
      customerEmail: session.customer_email || "NOT PROVIDED",
      firstName: firstName || "NOT PROVIDED",
      lastName: lastName || "NOT PROVIDED",
      plan: session.metadata?.plan || "NOT PROVIDED"
    });
    
    // Check if user already exists to prevent duplicates
    const existingUser = await csvManager.findSignupByPaymentId(session.id);
    if (existingUser) {
      console.log(`✅ Webhook: User already exists for session ${session.id}, updating payment status...`);
      
      // Update payment status
      await csvManager.updateSignup(existingUser.email, {
        paymentStatus: session.mode === "subscription" ? "subscription" : "paid",
        status: "approved", // Auto-approve paid users
        paymentId: session.id,
        amount: session.amount_total ? String(session.amount_total / 100) : "0", // Convert from cents
        currency: session.currency?.toUpperCase() || "USD",
        billing: session.metadata?.billing || "annual"
      });
      
      return true;
    }
    
    // Check if user exists by email (might have signed up but not paid yet)
    const existingUserByEmail = await csvManager.findSignupByEmail(email);
    if (existingUserByEmail) {
      console.log(`✅ Webhook: Found existing user by email ${email}, updating to paid status...`);
      
      // Update existing user to paid
      await csvManager.updateSignup(email, {
        planType: session.metadata?.plan || "elite",
        paymentStatus: session.mode === "subscription" ? "subscription" : "paid",
        status: "approved", // Auto-approve paid users
        paymentId: session.id,
        amount: session.amount_total ? String(session.amount_total / 100) : "0",
        currency: session.currency?.toUpperCase() || "USD",
        billing: session.metadata?.billing || "annual",
        // Update name fields if they were provided
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(fullName && { fullName }),
        birthday: session.metadata?.birthday || existingUserByEmail.birthday,
        position: session.metadata?.position || existingUserByEmail.position,
        experienceLevel: session.metadata?.currentLevel || existingUserByEmail.experienceLevel,
        whyJoinReason: session.metadata?.whyJoinReason || existingUserByEmail.whyJoinReason,
      });
      
      return true;
    }
    
    // Create new paid user
    const newSignup = {
      timestamp,
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
      paymentStatus: session.mode === "subscription" ? "subscription" : "paid",
      paymentId: session.id,
      amount: session.amount_total ? String(session.amount_total / 100) : "0", // Convert from cents
      currency: session.currency?.toUpperCase() || "USD",
      billing: session.metadata?.billing || "annual",
      // Default values for other fields
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
    };
    
    // Add the new user
    await csvManager.addSignup(newSignup);
    
    console.log(`✅ Webhook: Added paid user: ${email} - Plan: ${session.metadata?.plan} - Amount: $${session.amount_total ? session.amount_total / 100 : 0}`);
    return true;
    
  } catch (error) {
    console.error("Webhook: Error adding paid user:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      console.error("No Stripe signature found");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.payment_status === "paid" || session.status === "complete") {
          console.log(`💰 Webhook: Payment/Subscription completed for session ${session.id}`);
          console.log(`💳 Payment details:`, {
            sessionId: session.id,
            email: session.customer_email,
            amount: session.amount_total ? session.amount_total / 100 : 0,
            currency: session.currency,
            mode: session.mode,
            metadata: session.metadata
          });
          
          const added = await addPaidUser(session);
          
          if (!added) {
            console.error(`❌ Failed to add user for session ${session.id}`);
          }
        }
        break;
        
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`💳 Webhook: Payment intent succeeded: ${paymentIntent.id}`);
        break;

      case "invoice.payment_succeeded":
        const invoice = event.data.object as any;
        if (invoice.subscription) {
          console.log(`🔄 Webhook: Subscription payment succeeded: ${invoice.subscription}`);
          // Handle recurring subscription payments here if needed
          // You might want to update the user's last payment date or similar
        }
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}