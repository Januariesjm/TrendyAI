import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { inngest } from "@/lib/inngest/client";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 1. Authenticate the user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // 2. Parse generation parameters
    const body = await request.json();
    const {
      contentType,
      inputMode,
      promptText,
      scenes,
      voiceId,
      modelType,
      aspect,
      duration,
      preset
    } = body;

    // Validate request structure
    if (!contentType || !modelType || !duration) {
      return NextResponse.json({ error: "Missing required generation fields" }, { status: 400 });
    }

    // 3. Calculate exact credit cost
    let cost = 0;
    if (modelType === "minimax") cost = 30;
    else if (modelType === "kling") cost = 60;
    else if (modelType === "veo") cost = 80;

    if (duration === 30) cost += 10;
    if (duration === 60) cost += 25;

    // 4. Atomic credit deduction from wallet
    const { data: creditResult, error: creditError } = await supabase.rpc("deduct_credits", {
      p_user_id: user.id,
      p_amount: cost,
      p_description: `Generation cost: ${contentType} (${modelType}, ${duration}s)`,
      p_reference_id: "00000000-0000-0000-0000-000000000000" // Temporary UUID, updated below
    });

    if (creditError) {
      return NextResponse.json({ error: creditError.message || "Insufficient credit balance" }, { status: 400 });
    }

    // 5. Insert pending job into generation queue
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .insert({
        user_id: user.id,
        type: contentType,
        status: "pending",
        prompt: promptText || (scenes && scenes[0]?.visualPrompt) || "",
        script: scenes || [],
        voice_id: voiceId && voiceId.startsWith("clone_") ? null : (voiceId || null),
        model_used: modelType,
        duration: duration,
        settings: { aspect, preset, inputMode }
      })
      .select()
      .single();

    if (jobError) {
      // Rollback credit transaction on insert failure
      await supabase.rpc("deduct_credits", {
        p_user_id: user.id,
        p_amount: -cost,
        p_description: `Refund: job registration failed`,
        p_reference_id: "00000000-0000-0000-0000-000000000000"
      });
      return NextResponse.json({ error: "Failed to queue generation job" }, { status: 500 });
    }

    // 6. Update reference ID in transaction ledger
    await supabase
      .from("credit_transactions")
      .update({ reference_id: job.id })
      .eq("user_id", user.id)
      .eq("reference_id", "00000000-0000-0000-0000-000000000000");

    // 7. Dispatch to Inngest background worker pipeline
    await inngest.send({
      name: "video/generate",
      data: {
        jobId: job.id,
        userId: user.id,
        scenes: scenes || [{ visualPrompt: promptText, voiceScript: "" }],
        voiceId,
        modelType,
        aspect,
        duration,
        preset
      }
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      newBalance: creditResult.new_balance
    });

  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Internal server failure" }, { status: 500 });
  }
}
