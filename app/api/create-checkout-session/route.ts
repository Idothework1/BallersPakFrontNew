import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, billing = "annual", formData } = body;

    // Validate required data
    if (!plan || !formData?.email || !formData?.fullName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Define plan pricing based on billing type
    const planConfig = {
      elite: billing === "monthly" ? {
        priceId: "price_elite_monthly",
        amount: 1500, // $15.00 in cents
        name: "Elite Plan - Monthly",
        description: "Full access to the entire program",
        recurring: true,
      } : {
        priceId: "price_elite_annual",
        amount: 11100, // $111.00 in cents
        name: "Elite Plan - Annual",
        description: "Full 12-month access to the entire program",
        recurring: false,
      },
      pro: {
        priceId: "price_pro_academy",
        amount: 29900, // $299.00 in cents
        name: "Pro Academy Track",
        description: "Go All-In. Get on the Radar.",
        recurring: false,
      },
    };

    const selectedPlan = planConfig[plan as keyof typeof planConfig];
    if (!selectedPlan) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const sessionConfig: any = {
      payment_method_types: ["card"],
      customer_email: formData.email,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/paid-plan/${plan}${billing === "monthly" ? "?billing=monthly" : ""}?payment=cancelled`,
      metadata: {
        plan: plan,
        billing: billing,
        fullName: formData.fullName,
        email: formData.email,
        birthday: formData.birthday || "",
        position: formData.position || "",
        currentLevel: formData.currentLevel || "",
        whyJoinReason: formData.whyJoinReason || "",
      },
    };

    if (selectedPlan.recurring) {
      // Monthly subscription
      sessionConfig.mode = "subscription";
      sessionConfig.line_items = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: selectedPlan.name,
              description: selectedPlan.description,
              images: [`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/Logo.png`],
            },
            unit_amount: selectedPlan.amount,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ];
    } else {
      // One-time payment
      sessionConfig.mode = "payment";
      sessionConfig.line_items = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: selectedPlan.name,
              description: selectedPlan.description,
              images: [`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/Logo.png`],
            },
            unit_amount: selectedPlan.amount,
          },
          quantity: 1,
        },
      ];
      sessionConfig.invoice_creation = {
        enabled: true,
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}