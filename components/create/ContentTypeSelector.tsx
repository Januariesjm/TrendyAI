import React from "react";
import Card from "@/components/ui/Card";
import { Film, MonitorPlay, Sparkles } from "lucide-react";

export type ContentType = "short" | "ad" | "video";

interface ContentTypeSelectorProps {
  selected: ContentType;
  onChange: (type: ContentType) => void;
}

export default function ContentTypeSelector({ selected, onChange }: ContentTypeSelectorProps) {
  const options = [
    {
      id: "short" as ContentType,
      title: "Short / Reel / Tiktok",
      desc: "Fast-paced vertical videos optimized for maximum engagement on mobile feeds.",
      icon: Film,
      color: "var(--accent-pink)",
      aspect: "9:16 Aspect Ratio",
    },
    {
      id: "ad" as ContentType,
      title: "Promotional Ad",
      desc: "Ad copy optimized with hooks, benefit blocks, and strong calls-to-action.",
      icon: Sparkles,
      color: "var(--accent-cyan)",
      aspect: "1:1 or 9:16 Aspect Ratio",
    },
    {
      id: "video" as ContentType,
      title: "Explainer / Long Video",
      desc: "Cinematic narrative sequences with deep explanations, perfect for YouTube.",
      icon: MonitorPlay,
      color: "var(--primary)",
      aspect: "16:9 Aspect Ratio",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", width: "100%" }}>
      <h2 style={{ fontSize: "1.35rem", marginBottom: "0.25rem" }}>Select Video Format</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selected === opt.id;

          return (
            <Card
              key={opt.id}
              interactive
              onClick={() => onChange(opt.id)}
              style={{
                border: isSelected ? `2.5px solid ${opt.color}` : "1px solid var(--border-color)",
                background: isSelected ? "rgba(255,255,255,0.02)" : "var(--bg-surface)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                padding: "1.5rem",
              }}
            >
              <div
                style={{
                  background: isSelected ? opt.color : "rgba(255,255,255,0.04)",
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-sm)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isSelected ? "#000" : opt.color,
                  transition: "all 0.25s ease",
                }}
              >
                <Icon size={24} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  {opt.title}
                </span>
                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                  {opt.desc}
                </span>
              </div>

              <div
                style={{
                  marginTop: "auto",
                  paddingTop: "0.75rem",
                  borderTop: "1px solid var(--border-color)",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                }}
              >
                {opt.aspect}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
