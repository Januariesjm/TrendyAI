"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { Maximize2, Minimize2, Square, Compass } from "lucide-react";

export type AspectRatio = "9:16" | "16:9" | "1:1";
export type DurationOption = 15 | 30 | 60;
export type StylePreset = "cinematic" | "cyberpunk" | "anime" | "photorealistic" | "3d-render";

interface StyleConfiguratorProps {
  aspect: AspectRatio;
  duration: DurationOption;
  stylePreset: StylePreset;
  onChangeAspect: (aspect: AspectRatio) => void;
  onChangeDuration: (duration: DurationOption) => void;
  onChangePreset: (preset: StylePreset) => void;
}

export default function StyleConfigurator({
  aspect,
  duration,
  stylePreset,
  onChangeAspect,
  onChangeDuration,
  onChangePreset,
}: StyleConfiguratorProps) {
  const aspectOptions = [
    { id: "9:16" as AspectRatio, name: "Vertical (9:16)", desc: "Shorts, Reels, TikTok", icon: Minimize2 },
    { id: "16:9" as AspectRatio, name: "Widescreen (16:9)", desc: "YouTube, Website", icon: Maximize2 },
    { id: "1:1" as AspectRatio, name: "Square (1:1)", desc: "Instagram Posts, Ads", icon: Square },
  ];

  const durationOptions: { value: DurationOption; label: string }[] = [
    { value: 15, label: "15 Seconds" },
    { value: 30, label: "30 Seconds" },
    { value: 60, label: "60 Seconds" },
  ];

  const presets = [
    { id: "cinematic" as StylePreset, name: "Cinematic", desc: "Film look, dramatic lighting" },
    { id: "cyberpunk" as StylePreset, name: "Cyberpunk", desc: "Neon lights, futuristic atmosphere" },
    { id: "photorealistic" as StylePreset, name: "Photorealistic", desc: "Realistic textures, real camera look" },
    { id: "anime" as StylePreset, name: "Anime", desc: "Hand-drawn Japanese art look" },
    { id: "3d-render" as StylePreset, name: "3D Render", desc: "Octane, Unreal Engine 5 gloss" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", width: "100%" }}>
      {/* Aspect Ratio Row */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <h2 style={{ fontSize: "1.35rem" }}>Aspect Ratio</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          {aspectOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = aspect === opt.id;

            return (
              <Card
                key={opt.id}
                interactive
                onClick={() => onChangeAspect(opt.id)}
                style={{
                  border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem",
                }}
              >
                <div style={{ color: isSelected ? "var(--primary)" : "var(--text-secondary)" }}>
                  <Icon size={20} />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{opt.name}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{opt.desc}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Duration Row */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <h2 style={{ fontSize: "1.35rem" }}>Video Duration</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {durationOptions.map((opt) => {
            const isSelected = duration === opt.value;

            return (
              <button
                key={opt.value}
                onClick={() => onChangeDuration(opt.value)}
                className="glass-panel-interactive"
                style={{
                  flex: 1,
                  minWidth: "120px",
                  background: isSelected ? "var(--grad-primary)" : "rgba(255, 255, 255, 0.04)",
                  color: "#fff",
                  border: isSelected ? "none" : "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  padding: "0.75rem 1rem",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s ease",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Presets Row */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <h2 style={{ fontSize: "1.35rem" }}>Visual Style Presets</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
          {presets.map((preset) => {
            const isSelected = stylePreset === preset.id;

            return (
              <Card
                key={preset.id}
                interactive
                onClick={() => onChangePreset(preset.id)}
                style={{
                  border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                  padding: "1rem",
                  background: isSelected ? "rgba(157, 78, 221, 0.05)" : "var(--bg-surface)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Compass size={16} color={isSelected ? "var(--primary)" : "var(--text-muted)"} />
                  <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{preset.name}</span>
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{preset.desc}</span>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
