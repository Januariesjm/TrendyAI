/**
 * ElevenLabs Voice Utilities
 * --------------------------
 * Helper functions for text-to-speech generation
 * and instant voice cloning via ElevenLabs API.
 */

const ELEVENLABS_BASE = "https://api.elevenlabs.io/v1";

// Preset voice IDs from ElevenLabs default library
export const PRESET_VOICES: Record<string, string> = {
  v1: "21m00Tcm4TlvDq8ikWAM",  // Rachel
  v2: "pNInz6obpgDQGcFmaJgB",  // Adam
  v3: "EXAVITQu4vr4xnSDxMaL",  // Bella
  v4: "TxGEqnHWrfWFTfGW9XjX",  // Josh
};

/**
 * Resolves a voice selector ID to an ElevenLabs voice ID.
 * Falls back to Rachel if the voice is unknown.
 */
export function resolveVoiceId(selectorId: string): string {
  // If it's a preset, map to the ElevenLabs ID
  if (PRESET_VOICES[selectorId]) {
    return PRESET_VOICES[selectorId];
  }
  // Otherwise it's a custom clone ID stored in our DB; return as-is
  return selectorId;
}

/**
 * Generates speech audio for a text string using ElevenLabs TTS.
 * Returns the audio as a Blob.
 */
export async function generateSpeech(
  voiceId: string,
  text: string,
  apiKey: string
): Promise<Blob> {
  const resolvedId = resolveVoiceId(voiceId);

  const response = await fetch(`${ELEVENLABS_BASE}/text-to-speech/${resolvedId}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`ElevenLabs TTS failed (${response.status}): ${errText}`);
  }

  return response.blob();
}

/**
 * Creates an instant voice clone via ElevenLabs.
 * Returns the new voice_id from ElevenLabs.
 */
export async function cloneVoice(
  name: string,
  audioFile: File,
  apiKey: string
): Promise<string> {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("files", audioFile, audioFile.name);

  const response = await fetch(`${ELEVENLABS_BASE}/voices/add`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`ElevenLabs clone failed (${response.status}): ${errText}`);
  }

  const result = await response.json();
  return result.voice_id;
}
