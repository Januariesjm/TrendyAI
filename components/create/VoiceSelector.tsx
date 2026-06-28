"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import FileUpload from "@/components/ui/FileUpload";
import { Play, Pause, Mic, Sparkles, Check } from "lucide-react";

export interface Voice {
  id: string;
  name: string;
  type: "preset" | "cloned";
  gender: "male" | "female";
  desc: string;
  sampleUrl?: string;
}

interface VoiceSelectorProps {
  selectedVoiceId: string;
  onSelect: (voiceId: string) => void;
}

export default function VoiceSelector({ selectedVoiceId, onSelect }: VoiceSelectorProps) {
  const [activeTab, setActiveTab] = useState<"presets" | "clone">("presets");
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  
  // Custom voice cloning state
  const [cloneName, setCloneName] = useState("");
  const [clonedVoices, setClonedVoices] = useState<Voice[]>([]);
  const [uploading, setUploading] = useState(false);

  const presetVoices: Voice[] = [
    { id: "v1", name: "Rachel", type: "preset", gender: "female", desc: "Warm and engaging narrator, perfect for explainers." },
    { id: "v2", name: "Adam", type: "preset", gender: "male", desc: "Deep and authoritative, ideal for corporate or documentary narration." },
    { id: "v3", name: "Bella", type: "preset", gender: "female", desc: "Energetic and friendly voice, optimized for TikTok & reels." },
    { id: "v4", name: "Josh", type: "preset", gender: "male", desc: "Conversational and casual explainer host, relatable." },
  ];

  const handlePlayPreview = (voiceId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card selection
    if (playingVoiceId === voiceId) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(voiceId);
      // Mock playing effect timeout
      setTimeout(() => {
        setPlayingVoiceId((curr) => (curr === voiceId ? null : curr));
      }, 3000);
    }
  };

  const handleVoiceCloneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloneName) return;
    setUploading(true);

    // Mock API call delay
    setTimeout(() => {
      const newClone: Voice = {
        id: "clone_" + Date.now(),
        name: cloneName + " (Clone)",
        type: "cloned",
        gender: "male",
        desc: "Custom cloned voice sample.",
      };
      setClonedVoices([...clonedVoices, newClone]);
      onSelect(newClone.id);
      setCloneName("");
      setActiveTab("presets");
      setUploading(false);
    }, 2000);
  };

  const allVoices = [...presetVoices, ...clonedVoices];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", width: "100%" }}>
      {/* Tabs Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem" }}>
        <h2 style={{ fontSize: "1.35rem" }}>Voice Narration</h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button
            size="sm"
            variant={activeTab === "presets" ? "primary" : "ghost"}
            onClick={() => setActiveTab("presets")}
          >
            Narrator Library
          </Button>
          <Button
            size="sm"
            variant={activeTab === "clone" ? "primary" : "ghost"}
            onClick={() => setActiveTab("clone")}
            icon={<Mic size={14} />}
          >
            Clone My Voice
          </Button>
        </div>
      </div>

      {activeTab === "presets" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
          {allVoices.map((voice) => {
            const isSelected = selectedVoiceId === voice.id;
            const isPlaying = playingVoiceId === voice.id;

            return (
              <Card
                key={voice.id}
                interactive
                onClick={() => onSelect(voice.id)}
                style={{
                  border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem",
                  position: "relative"
                }}
              >
                {/* Audio Preview Trigger */}
                <button
                  onClick={(e) => handlePlayPreview(voice.id, e)}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: isPlaying ? "rgba(157, 78, 221, 0.2)" : "rgba(255,255,255,0.04)",
                    border: isPlaying ? "1px solid var(--primary)" : "1px solid var(--border-color)",
                    color: isPlaying ? "var(--primary)" : "var(--text-secondary)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: "2px" }} />}
                </button>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{voice.name}</span>
                    <Badge variant={voice.type === "cloned" ? "success" : "secondary"}>
                      {voice.gender.toUpperCase()}
                    </Badge>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {voice.desc}
                  </span>
                </div>

                {isSelected && (
                  <div
                    style={{
                      background: "var(--primary)",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff"
                    }}
                  >
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card padding="lg" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>Instant Voice Cloning</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              Upload a 10+ second audio file of your voice (clear of background noise). Our ElevenLabs pipeline will create a custom voice profile.
            </p>
          </div>

          <form onSubmit={handleVoiceCloneSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                Cloned Voice Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. My Narrator Voice"
                value={cloneName}
                onChange={(e) => setCloneName(e.target.value)}
                className="form-input"
              />
            </div>

            <FileUpload
              accept="audio/*"
              maxSizeMB={5}
              label="Drop audio sample (mp3, wav, m4a)"
              onFilesSelected={() => {}}
            />

            <Button type="submit" loading={uploading} icon={<Mic size={16} />}>
              Create Cloned Voice (Costs 50 Credits)
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
