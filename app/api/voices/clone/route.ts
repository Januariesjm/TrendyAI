import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/voices/clone
 * Creates a custom voice clone via ElevenLabs Instant Voice Cloning API.
 * Accepts FormData with:
 *   - name: string (voice name)
 *   - audio: File (audio sample, mp3/wav/m4a)
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 1. Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse multipart form data
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const audioFile = formData.get("audio") as File | null;

    if (!name || !audioFile) {
      return NextResponse.json({ error: "Name and audio sample are required" }, { status: 400 });
    }

    // 3. Deduct voice cloning credits (50 credits)
    const { error: creditError } = await supabase.rpc("deduct_credits", {
      p_user_id: user.id,
      p_amount: 50,
      p_description: `Voice clone: ${name}`,
      p_reference_id: "00000000-0000-0000-0000-000000000000"
    });

    if (creditError) {
      return NextResponse.json({ error: creditError.message || "Insufficient credits" }, { status: 400 });
    }

    // 4. Call ElevenLabs voice cloning API
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const isMock = !apiKey || apiKey.includes("mock");

    let elevenLabsVoiceId: string;

    if (isMock) {
      // Simulate a delay and return a mock voice ID
      await new Promise((r) => setTimeout(r, 1500));
      elevenLabsVoiceId = `mock_voice_${Date.now()}`;
    } else {
      // Build the form data for ElevenLabs
      const elFormData = new FormData();
      elFormData.append("name", name);
      elFormData.append("files", audioFile, audioFile.name);

      const elResponse = await fetch("https://api.elevenlabs.io/v1/voices/add", {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
        },
        body: elFormData,
      });

      if (!elResponse.ok) {
        const errBody = await elResponse.text();
        // Refund credits on failure
        await supabase.rpc("deduct_credits", {
          p_user_id: user.id,
          p_amount: -50,
          p_description: `Refund: voice clone failed`,
          p_reference_id: "00000000-0000-0000-0000-000000000000"
        });
        return NextResponse.json({ error: `ElevenLabs cloning failed: ${errBody}` }, { status: 502 });
      }

      const elResult = await elResponse.json();
      elevenLabsVoiceId = elResult.voice_id;
    }

    // 5. Store voice record in database
    const { data: voice, error: voiceError } = await supabase
      .from("voices")
      .insert({
        user_id: user.id,
        name: name,
        type: "cloned",
        eleven_labs_id: elevenLabsVoiceId,
        sample_url: null, // Could store uploaded audio URL here
      })
      .select()
      .single();

    if (voiceError) {
      return NextResponse.json({ error: "Failed to save voice record" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      voice: {
        id: voice.id,
        name: voice.name,
        elevenLabsId: elevenLabsVoiceId,
      }
    });

  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message || "Internal error" }, { status: 500 });
  }
}
