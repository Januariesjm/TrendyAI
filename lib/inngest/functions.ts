import { inngest } from "./client";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase admin client for backend operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Scene {
  visualPrompt: string;
  voiceScript: string;
}

export const generateVideoPipeline = inngest.createFunction(
  {
    id: "generate-video-pipeline",
    triggers: [{ event: "video/generate" }]
  },
  async ({ event, step }) => {
    const { jobId, userId, scenes, voiceId, modelType, aspect, duration } = event.data;

    // Helper to update job status
    const updateJobStatus = async (status: string, data: Record<string, unknown>) => {
      await supabaseAdmin
        .from("jobs")
        .update({ status, ...data, completed_at: status === "completed" || status === "failed" ? new Date().toISOString() : null })
        .eq("id", jobId);
    };

    try {
      // 1. Mark job as processing
      await step.run("mark-processing", async () => {
        await updateJobStatus("processing", { error_message: null });
      });

      // 2. Step 1: Generate Audio / Voiceover via ElevenLabs
      const audioUrls = await step.run("generate-voiceovers", async () => {
        // Check if API key is set
        const apiKey = process.env.ELEVENLABS_API_KEY;
        const isMock = !apiKey || apiKey.includes("mock");

        if (isMock) {
          // Simulate API delay and return placeholders
          await new Promise((resolve) => setTimeout(resolve, 1500));
          return (scenes as Scene[]).map((_, idx) => `https://example.com/mock-audio-scene-${idx + 1}.mp3`);
        }

        // Call ElevenLabs API for each scene script
        const urls: string[] = [];
        for (let i = 0; i < (scenes as Scene[]).length; i++) {
          const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
            {
              method: "POST",
              headers: {
                "xi-api-key": apiKey,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                text: (scenes as Scene[])[i].voiceScript,
                model_id: "eleven_monolingual_v1",
                voice_settings: {
                  stability: 0.5,
                  similarity_boost: 0.75,
                },
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`ElevenLabs audio generation failed for scene ${i + 1}`);
          }

          // In production, upload the buffer to Supabase Storage Bucket 'audio-files'
          // For now we get blob and mock the upload url
          const blob = await response.blob();
          const fileName = `${userId}/${jobId}/scene-${i + 1}.mp3`;
          
          const { error } = await supabaseAdmin.storage
            .from("audio-files")
            .upload(fileName, blob, { contentType: "audio/mpeg", upsert: true });

          if (error) {
            throw new Error(`Failed to upload scene ${i + 1} audio to storage: ${error.message}`);
          }

          const { data: { publicUrl } } = supabaseAdmin.storage
            .from("audio-files")
            .getPublicUrl(fileName);

          urls.push(publicUrl);
        }
        return urls;
      });

      // 3. Step 2: Generate Video clips via fal.ai in parallel
      const videoUrls = await step.run("generate-video-clips", async () => {
        const apiKey = process.env.FAL_KEY;
        const isMock = !apiKey || apiKey.includes("mock");

        if (isMock) {
          await new Promise((resolve) => setTimeout(resolve, 2500));
          // High quality Unsplash placeholder images matching the topic
          return [
            "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop"
          ];
        }

        // Determine which model endpoint to call on fal.ai
        let endpoint = "fal-ai/minimax/video-01"; // Default
        if (modelType === "kling") {
          endpoint = "fal-ai/kling-video/v1/standard/text-to-video";
        } else if (modelType === "veo") {
          endpoint = "fal-ai/veo";
        }

        const urls: string[] = [];
        for (let i = 0; i < (scenes as Scene[]).length; i++) {
          // Dynamic call via fetch to fal.ai queue API
          const response = await fetch(`https://queue.fal.run/${endpoint}`, {
            method: "POST",
            headers: {
              "Authorization": `Key ${apiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              prompt: (scenes as Scene[])[i].visualPrompt,
              aspect_ratio: aspect,
              duration: duration === 15 ? "5s" : "10s", // mapped durations
            })
          });

          if (!response.ok) {
            throw new Error(`fal.ai video endpoint request failed for scene ${i + 1}`);
          }

          const result = await response.json();
          // Keep polling or check status if queued, for simplicity we assume direct result or webhook
          // In real production we use fal.subscribe or queue status checking loop
          const videoUrl = result.video?.url || result.output?.video?.url || result.data?.video?.url;
          
          if (!videoUrl) {
            throw new Error(`Could not retrieve video URL for scene ${i + 1}`);
          }
          urls.push(videoUrl);
        }
        return urls;
      });

      // 4. Step 3: Mux Audio and Video together
      const finalVideoUrl = await step.run("mux-audio-video", async () => {
        // In fully hosted code, this runs FFmpeg to merge the scene clips & voiceover tracks.
        // We will output a finalized compilation video url.
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        // Return a mock output rendering url for demonstration, or the first video clip url
        return videoUrls[0] || "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4";
      });

      // 5. Success! Mark job as completed
      await step.run("mark-success", async () => {
        await updateJobStatus("completed", {
          output_url: finalVideoUrl,
          thumbnail_url: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=300&auto=format&fit=crop",
          duration: duration,
          model_used: modelType
        });
      });

    } catch (err: unknown) {
      // 6. Handle Failures & Refund Credits
      await step.run("handle-failure", async () => {
        const errorMsg = (err as Error).message || "An unexpected error occurred during generation";
        await updateJobStatus("failed", { error_message: errorMsg });

        // Calculate credits to refund
        let refundAmount = 0;
        if (modelType === "minimax") refundAmount = 30;
        else if (modelType === "kling") refundAmount = 60;
        else if (modelType === "veo") refundAmount = 80;

        if (duration === 30) refundAmount += 10;
        if (duration === 60) refundAmount += 25;

        // Refund atomically in database
        const { error } = await supabaseAdmin.rpc("deduct_credits", {
          p_user_id: userId,
          p_amount: -refundAmount, // Negative amount adds credits back!
          p_description: `Refund for failed video generation job: ${jobId}`,
          p_reference_id: jobId
        });

        if (error) {
          console.error("Failed to refund credits for job:", jobId, error.message);
        }
      });
    }
  }
);
