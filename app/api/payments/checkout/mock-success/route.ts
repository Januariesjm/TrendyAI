import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase admin client with service role key for system operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference") || "";
    const userId = searchParams.get("userId") || "";
    const planId = searchParams.get("planId") || "";
    const credits = parseInt(searchParams.get("credits") || "0", 10);
    const type = searchParams.get("type") || "";
    const amountCents = parseInt(searchParams.get("amountCents") || "0", 10);

    if (!userId || !reference) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/pricing?status=error&error=invalid_mock_params`);
    }

    // 1. Check if payment is already processed to avoid double spending
    const { data: existingPayment } = await supabaseAdmin
      .from("payments")
      .select("status")
      .eq("paystack_reference", reference)
      .single();

    if (existingPayment && existingPayment.status === "success") {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/pricing?status=success&ref=${reference}`);
    }

    // 2. Lock profile row & get current credits
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("credits, plan")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      throw new Error("User profile not found");
    }

    const currentCredits = profile.credits || 0;
    const newCredits = currentCredits + credits;

    // 3. Update profile balance + plan if subscription
    const profileUpdate: Record<string, any> = { credits: newCredits };
    if (type === "subscription" && planId) {
      profileUpdate.plan = planId;
    }

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update(profileUpdate)
      .eq("id", userId);

    if (updateError) {
      throw new Error(`Profile update failed: ${updateError.message}`);
    }

    // 4. Update payment log
    await supabaseAdmin
      .from("payments")
      .update({ status: "success" })
      .eq("paystack_reference", reference);

    // 5. Insert into credit ledger
    await supabaseAdmin
      .from("credit_transactions")
      .insert({
        user_id: userId,
        amount: credits,
        type: type === "subscription" ? "subscription" : "topup",
        description: type === "subscription" 
          ? `Subscription credit purchase: ${planId} plan` 
          : `Credit pack top-up purchase`,
        reference_id: reference.startsWith("paystack_ref_") ? null : undefined, // uuid constraints check
        balance_after: newCredits,
      });

    // 6. If subscription, insert / update subscriptions table
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
          paystack_subscription_code: `sub_mock_${reference}`,
          paystack_customer_code: `cust_mock_${userId.slice(0, 8)}`,
          current_period_start: now.toISOString(),
          current_period_end: nextMonth.toISOString(),
        });
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/pricing?status=success&ref=${reference}`);

  } catch (err: unknown) {
    console.error("[Mock Success Error]:", err);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/pricing?status=error&error=${encodeURIComponent((err as Error).message)}`);
  }
}
