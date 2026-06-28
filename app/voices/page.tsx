"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import FileUpload from "@/components/ui/FileUpload";
import { Play, Pause, Mic, Music, Trash2, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

interface VoiceItem {
  id: string;
  name: string;
  type: "preset" | "cloned";
  gender: "male" | "female";
  desc: string;
  elevenLabsId?: string;
  created_at?: string;
}

export default function VoiceLibrary() {
  const [activeTab, setActiveTab] = useState<"library" | "clone">("library");
  const [clonedVoices, setClonedVoices] = useState<VoiceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  // Cloning State
  const [cloneName, setCloneName] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [cloning, setCloning] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const presetVoices: VoiceItem[] = [
    { id: "v1", name: "Rachel", type: "preset", gender: "female", desc: "Warm, professional narrator, excellent for documentaries and brand ads." },
    { id: "v2", name: "Adam", type: "preset", gender: "male", desc: "Deep, authoritative narration, ideal for explainer videos and pitches." },
    { id: "v3", name: "Bella", type: "preset", gender: "female", desc: "Friendly, upbeat voice, perfect for casual TikTok reviews or product reels." },
    { id: "v4", name: "Josh", type: "preset", gender: "male", desc: "Conversational explainer host voice, clear and engaging." },
  ];

  const fetchClonedVoices = async () => {
    await Promise.resolve();
    setLoading(true);
    try {
      const res = await fetch("/api/jobs");
      if (res.ok) {
        // ...
      }
      setTimeout(() => {
        setClonedVoices([]);
        setLoading(false);
      }, 800);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClonedVoices().catch(() => {});
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handlePlayPreview = (voiceId: string) => {
    if (playingVoiceId === voiceId) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(voiceId);
      // Simulate play time
      setTimeout(() => {
        setPlayingVoiceId((curr) => (curr === voiceId ? null : curr));
      }, 3000);
    }
  };

  const handleCloneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloneName || !audioFile) {
      setErrorMsg("Please provide a name and upload a voice recording sample.");
      return;
    }
    setCloning(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("name", cloneName);
      formData.append("audio", audioFile);

      const response = await fetch("/api/voices/clone", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMsg(data.error || "Cloning failed");
        setCloning(false);
      } else {
        alert("Voice cloned successfully! Added to your library.");
        // Add to list
        const newVoice: VoiceItem = {
          id: data.voice.id,
          name: data.voice.name,
          type: "cloned",
          gender: "female", // default mock gender
          desc: `Custom ElevenLabs cloned voice: ${data.voice.elevenLabsId}`,
          elevenLabsId: data.voice.elevenLabsId
        };
        setClonedVoices([newVoice, ...clonedVoices]);
        setCloneName("");
        setAudioFile(null);
        setActiveTab("library");
        setCloning(false);
      }
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || "An unexpected error occurred during cloning.");
      setCloning(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>Voice Library & Cloning</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Select narrator presets or generate high-fidelity clones of your own voice.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Button
            variant={activeTab === "library" ? "primary" : "secondary"}
            onClick={() => setActiveTab("library")}
            icon={<Music size={16} />}
          >
            Voice Library
          </Button>
          <Button
            variant={activeTab === "clone" ? "primary" : "secondary"}
            onClick={() => setActiveTab("clone")}
            icon={<Mic size={16} />}
          >
            Clone New Voice
          </Button>
        </div>
      </div>

      {activeTab === "library" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Presets Section */}
          <div>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              Preset Narrators
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {presetVoices.map((voice) => {
                const isPlaying = playingVoiceId === voice.id;
                return (
                  <Card key={voice.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem" }}>
                    <button
                      onClick={() => handlePlayPreview(voice.id)}
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        background: isPlaying ? "rgba(157, 78, 221, 0.2)" : "rgba(255, 255, 255, 0.04)",
                        border: isPlaying ? "1px solid var(--primary)" : "1px solid var(--border-color)",
                        color: isPlaying ? "var(--primary)" : "var(--text-secondary)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}
                    >
                      {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: "2px" }} />}
                    </button>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", minWidth: 0, flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontWeight: 700, fontSize: "1rem" }}>{voice.name}</span>
                        <Badge variant="secondary">{voice.gender.toUpperCase()}</Badge>
                      </div>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                        {voice.desc}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Cloned Voices Section */}
          <div style={{ marginTop: "1rem" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              My Cloned Voices
              <button 
                onClick={fetchClonedVoices} 
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "inline-flex" }}
              >
                <RefreshCw size={14} className={loading ? "spin" : ""} />
              </button>
            </h2>

            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
                <span className="spinner" />
              </div>
            ) : clonedVoices.length === 0 ? (
              <Card padding="lg" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", textAlign: "center", borderStyle: "dashed" }}>
                <Mic size={36} style={{ color: "var(--text-muted)" }} />
                <div>
                  <h3 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>No Cloned Voices Yet</h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Clone your voice to narrator videos with custom cloned profiles.
                  </p>
                </div>
                <Button size="sm" onClick={() => setActiveTab("clone")}>Clone Voice Now</Button>
              </Card>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
                {clonedVoices.map((voice) => {
                  const isPlaying = playingVoiceId === voice.id;
                  return (
                    <Card key={voice.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem" }}>
                      <button
                        onClick={() => handlePlayPreview(voice.id)}
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "50%",
                          background: isPlaying ? "rgba(46, 196, 182, 0.2)" : "rgba(255, 255, 255, 0.04)",
                          border: isPlaying ? "1px solid var(--success)" : "1px solid var(--border-color)",
                          color: isPlaying ? "var(--success)" : "var(--text-secondary)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0
                        }}
                      >
                        {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: "2px" }} />}
                      </button>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", minWidth: 0, flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontWeight: 700, fontSize: "1rem" }}>{voice.name}</span>
                          <Badge variant="success">CLONED</Badge>
                        </div>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          ID: {voice.elevenLabsId}
                        </span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <Card padding="lg" style={{ maxWidth: "600px", margin: "0 auto", width: "100%" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Instant Voice Cloning</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
            Submit a 10-second vocal sample. Our ElevenLabs integration builds custom synthetic profiles.
          </p>

          {errorMsg && (
            <div style={{ background: "rgba(239, 71, 111, 0.08)", border: "1px solid rgba(239, 71, 111, 0.2)", borderRadius: "var(--radius-sm)", padding: "0.75rem 1rem", color: "var(--error)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleCloneSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Voice Name</label>
              <input
                type="text"
                required
                placeholder="e.g. My Premium voice"
                value={cloneName}
                onChange={(e) => setCloneName(e.target.value)}
                className="form-input"
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Audio Sample (MP3 or WAV)</label>
              <FileUpload
                accept="audio/*"
                maxSizeMB={10}
                label="Click or drag clear vocal recording (mp3, wav)"
                onFilesSelected={(files) => setAudioFile(files[0] || null)}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.5rem", borderTop: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--warning)", fontWeight: 600 }}>
                Cost: 50 Credits
              </span>
              <Button type="submit" loading={cloning} icon={<Mic size={16} />}>
                Clone Voice Now
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
