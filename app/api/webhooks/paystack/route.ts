import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature") || "";

    // 1. Verify webhook signature
    const secretKey = process.env.PAYSTACK_SECRET_KEY || "sk_test_mock_paystack_secret_key_trendy_ai";
    
    // Skip verification if we are in local sandbox environment with mock credentials
    const isMock = secretKey.startsWith("sk_test_mock");
    
    if (!isMock) {
      const hash = crypto
        .createHmac("sha512", secretKey)
        .update(rawBody)
        .digest("hex");

      if (hash !== signature) {
        return NextResponse.json({ error: "Invalid webhook signature verification" }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    console.log(`[Paystack Webhook Received]: event = ${event}`);

    // 2. Handle successful charge
    if (event === "charge.success") {
      const { reference, metadata, customer } = payload.data;
      const { userId, planId, credits, type } = metadata || {};

      if (!userId) {
        return NextResponse.json({ error: "Missing metadata user id context" }, { status: 400 });
      }

      // Check if payment is already processed
      const { data: existingPayment } = await supabaseAdmin
        .from("payments")
        .select("status")
        .eq("paystack_reference", reference)
        .single();

      if (existingPayment && existingPayment.status === "success") {
        return NextResponse.json({ message: "Already processed successfully" });
      }

      // Fetch user profile credits
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("credits")
        .eq("id", userId)
        .single();

      if (!profile) {
        return NextResponse.json({ error: "User profile record not found" }, { status: 404 });
      }

      const currentCredits = profile.credits || 0;
      const newCredits = currentCredits + credits;

      // Update profile credits balance and plan status
      const profileUpdate: Record<string, any> = { credits: newCredits };
      if (type === "subscription" && planId) {
        profileUpdate.plan = planId;
      }

      await supabaseAdmin
        .from("profiles")
        .update(profileUpdate)
        .eq("id", userId);

      // Update payment ledger log
      await supabaseAdmin
        .from("payments")
        .update({ status: "success" })
        .eq("paystack_reference", reference);

      // Insert credit ledger audit trail
      await supabaseAdmin
        .from("credit_transactions")
        .insert({
          user_id: userId,
          amount: credits,
          type: type === "subscription" ? "subscription" : "topup",
          description: type === "subscription" 
            ? `Paid Subscription: ${planId} plan via Paystack` 
            : `Paid Top-up package via Paystack`,
          balance_after: newCredits,
        });

      // Insert/update active subscription status
      if (type === "subscription" && planId) {
        const now = new Date();
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        await supabaseAdmin
          .from("subscriptions")
          .insert({
            user_id: userId,
            plan_id: planId,
            status: "active",
            paystack_subscription_code: payload.data.subscription_code || `sub_${reference}`,
            paystack_customer_code: customer?.customer_code || `cust_${userId.slice(0, 8)}`,
            current_period_start: now.toISOString(),
            current_period_end: nextMonth.toISOString(),
          });
      }
    }

    return NextResponse.json({ status: "success" });

  } catch (err: unknown) {
    console.error("[Paystack Webhook Processing Error]:", err);
    return NextResponse.json({ error: (err as Error).message || "Webhook handling failure" }, { status: 500 });
  }
}
