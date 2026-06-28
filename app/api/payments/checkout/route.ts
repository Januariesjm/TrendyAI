import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { PaystackClient } from "@/lib/paystack/client";

const TOPUP_PACKS = {
  starter_pack: { name: "Starter Pack", credits: 100, priceUsd: 9 },
  creator_pack: { name: "Creator Pack", credits: 500, priceUsd: 39 },
  agency_pack: { name: "Agency Pack", credits: 2000, priceUsd: 129 },
  enterprise_pack: { name: "Enterprise Pack", credits: 10000, priceUsd: 499 },
};

const SUBSCRIPTION_PLANS = {
  starter: { name: "Starter Plan", credits: 250, priceUsd: 19 },
  pro: { name: "Pro Plan", credits: 800, priceUsd: 49 },
  business: { name: "Business Plan", credits: 2000, priceUsd: 99 },
};

// Admin client bypassing RLS for system log inserts
const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 1. Authenticate user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, planId, packId } = body;

    let amountUsd = 0;
    let creditsGranted = 0;
    let planCode = "";

    if (type === "subscription") {
      const plan = SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS];
      if (!plan) {
        return NextResponse.json({ error: "Invalid subscription plan selected" }, { status: 400 });
      }
      amountUsd = plan.priceUsd;
      creditsGranted = plan.credits;
      planCode = planId;
    } else if (type === "topup") {
      const pack = TOPUP_PACKS[packId as keyof typeof TOPUP_PACKS];
      if (!pack) {
        return NextResponse.json({ error: "Invalid top-up pack selected" }, { status: 400 });
      }
      amountUsd = pack.priceUsd;
      creditsGranted = pack.credits;
    } else {
      return NextResponse.json({ error: "Invalid checkout request type" }, { status: 400 });
    }

    // Paystack takes amount in sub-units. For USD, 1 USD = 100 cents.
    const amountCents = amountUsd * 100;

    // Initialize Paystack client
    const paystack = new PaystackClient();
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pricing?status=success`;

    const checkoutResponse = await paystack.initializeTransaction({
      email: user.email || "user@trendy.ai",
      amountCents,
      currency: "USD",
      callbackUrl,
      metadata: {
        userId: user.id,
        planId: planCode || undefined,
        credits: creditsGranted,
        type,
      },
    });

    if (!checkoutResponse.status) {
      return NextResponse.json({ error: "Failed to initialize payment gateway" }, { status: 500 });
    }

    // 2. Ensure user profile exists using admin client (satisfies payments_user_id_fkey constraint)
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!profile) {
      const { error: profileInsertError } = await supabaseAdmin.from("profiles").insert({
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email,
        avatar_url: user.user_metadata?.avatar_url,
        plan: "free",
        credits: 20,
      });
      if (profileInsertError) {
        console.error("Profile auto-creation error:", profileInsertError.message);
      }
    }

    // 3. Insert pending payment into database using admin client
    const { error: paymentError } = await supabaseAdmin
      .from("payments")
      .insert({
        user_id: user.id,
        amount_cents: amountCents,
        currency: "USD",
        type,
        status: "pending",
        paystack_reference: checkoutResponse.data.reference,
        credits_granted: creditsGranted,
      });

    if (paymentError) {
      console.error("Failed to insert pending payment:", paymentError.message);
      return NextResponse.json({ error: "Failed to log transaction" }, { status: 500 });
    }

    return NextResponse.json({
      authorizationUrl: checkoutResponse.data.authorization_url,
      reference: checkoutResponse.data.reference,
    });

  } catch (err: unknown) {
    console.error("Checkout initialization error:", err);
    return NextResponse.json({ error: (err as Error).message || "Internal server error" }, { status: 500 });
  }
}
