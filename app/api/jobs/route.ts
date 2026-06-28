import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/jobs
 * Returns all generation jobs for the authenticated user,
 * ordered by most recent first. Supports optional status filter.
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    let query = supabase
      .from("jobs")
      .select("id, type, status, prompt, output_url, thumbnail_url, model_used, duration, created_at, completed_at, error_message")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (statusFilter) {
      query = query.eq("status", statusFilter);
    }

    const { data: jobs, error: jobsError } = await query;

    if (jobsError) {
      return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
    }

    return NextResponse.json({ jobs });

  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Internal error" }, { status: 500 });
  }
}
