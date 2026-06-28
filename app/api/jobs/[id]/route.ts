import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/jobs/[id]
 * Returns the current status and output of a generation job.
 * Used by the frontend to poll for completion.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    // 1. Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // 2. Fetch the job
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id) // Ensure user owns this job
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: job.id,
      status: job.status,
      type: job.type,
      prompt: job.prompt,
      output_url: job.output_url,
      thumbnail_url: job.thumbnail_url,
      error_message: job.error_message,
      model_used: job.model_used,
      duration: job.duration,
      created_at: job.created_at,
      completed_at: job.completed_at,
    });

  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Internal error" }, { status: 500 });
  }
}
