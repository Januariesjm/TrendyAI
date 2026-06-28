/**
 * Smart Model Router
 * ------------------
 * Maps user-selected model types to the correct fal.ai endpoint configuration.
 * Handles aspect ratio normalization and duration mapping per model.
 */

export type ModelId = "minimax" | "kling" | "veo";

interface ModelConfig {
  endpoint: string;
  displayName: string;
  maxDurationSec: number;
  supportedAspects: string[];
  mapDuration: (userDuration: number) => string;
  mapAspect: (aspect: string) => string;
  creditCost: number;
}

const MODEL_CONFIGS: Record<ModelId, ModelConfig> = {
  minimax: {
    endpoint: "fal-ai/minimax/video-01",
    displayName: "MiniMax Hailuo 2.3",
    maxDurationSec: 6,
    supportedAspects: ["16:9", "9:16", "1:1"],
    mapDuration: (d) => (d <= 15 ? "5s" : "6s"),
    mapAspect: (a) => a, // native support
    creditCost: 30,
  },
  kling: {
    endpoint: "fal-ai/kling-video/v1/standard/text-to-video",
    displayName: "Kling 3.0 Pro",
    maxDurationSec: 10,
    supportedAspects: ["16:9", "9:16", "1:1"],
    mapDuration: (d) => (d <= 15 ? "5s" : "10s"),
    mapAspect: (a) => a,
    creditCost: 60,
  },
  veo: {
    endpoint: "fal-ai/veo",
    displayName: "Google Veo 3.1",
    maxDurationSec: 8,
    supportedAspects: ["16:9", "9:16"],
    mapDuration: (d) => (d <= 15 ? "5s" : "8s"),
    mapAspect: (a) => (a === "1:1" ? "16:9" : a), // Veo doesn't support 1:1
    creditCost: 80,
  },
};

/**
 * Resolves the model configuration and returns a ready-to-use config
 * for the fal.ai API call.
 */
export function resolveModel(modelId: ModelId) {
  const config = MODEL_CONFIGS[modelId];
  if (!config) {
    throw new Error(`Unknown model: ${modelId}`);
  }
  return config;
}

/**
 * Calculates the total credit cost for a generation job.
 */
export function calculateCreditCost(modelId: ModelId, durationSec: number): number {
  const base = MODEL_CONFIGS[modelId]?.creditCost || 30;
  let extra = 0;
  if (durationSec === 30) extra = 10;
  if (durationSec === 60) extra = 25;
  return base + extra;
}

/**
 * Builds the fal.ai request payload for a single scene.
 */
export function buildFalPayload(
  modelId: ModelId,
  prompt: string,
  aspect: string,
  duration: number
) {
  const config = resolveModel(modelId);
  return {
    endpoint: config.endpoint,
    body: {
      prompt,
      aspect_ratio: config.mapAspect(aspect),
      duration: config.mapDuration(duration),
    },
  };
}
