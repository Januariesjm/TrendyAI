import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Zap, Activity, Award, ShieldAlert } from "lucide-react";

export type AIModelType = "minimax" | "kling" | "veo";

interface ModelPickerProps {
  selected: AIModelType;
  onChange: (model: AIModelType) => void;
}

export default function ModelPicker({ selected, onChange }: ModelPickerProps) {
  const models = [
    {
      id: "minimax" as AIModelType,
      name: "MiniMax Hailuo 2.3",
      label: "Speed Priority",
      desc: "Fastest generation, excellent for high-volume video pipelines, social ads, and quick concepts.",
      latency: "1-2 minutes",
      cost: 30,
      icon: Zap,
      color: "var(--accent-cyan)",
      badgeVariant: "info" as const,
    },
    {
      id: "kling" as AIModelType,
      name: "Kling 3.0 Pro",
      label: "Balanced",
      desc: "High camera motions, excellent character consistency, best for storytelling reels and promos.",
      latency: "3-5 minutes",
      cost: 60,
      icon: Activity,
      color: "var(--primary)",
      badgeVariant: "primary" as const,
    },
    {
      id: "veo" as AIModelType,
      name: "Google Veo 3.1",
      label: "Quality Priority",
      desc: "Stunning cinematic output, rich details, high text fidelity, perfect for premium brand commercials.",
      latency: "5-8 minutes",
      cost: 80,
      icon: Award,
      color: "var(--accent-pink)",
      badgeVariant: "success" as const,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: "1.35rem" }}>Select Video Engine</h2>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <ShieldAlert size={14} /> Balances cost vs speed
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
        {models.map((mod) => {
          const Icon = mod.icon;
          const isSelected = selected === mod.id;

          return (
            <Card
              key={mod.id}
              interactive
              onClick={() => onChange(mod.id)}
              style={{
                border: isSelected ? `2.5px solid ${mod.color}` : "1px solid var(--border-color)",
                background: isSelected ? "rgba(255,255,255,0.02)" : "var(--bg-surface)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                padding: "1.5rem",
              }}
            >
              {/* Header row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div
                  style={{
                    background: isSelected ? mod.color : "rgba(255,255,255,0.04)",
                    width: "40px",
                    height: "40px",
                    borderRadius: "var(--radius-sm)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isSelected ? "#000" : mod.color,
                    transition: "all 0.25s ease",
                  }}
                >
                  <Icon size={20} />
                </div>
                <Badge variant={mod.badgeVariant}>{mod.label}</Badge>
              </div>

              {/* Title & Desc */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>{mod.name}</span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                  {mod.desc}
                </span>
              </div>

              {/* Footer stats */}
              <div
                style={{
                  marginTop: "auto",
                  paddingTop: "0.75rem",
                  borderTop: "1px solid var(--border-color)",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.75rem",
                  color: "var(--text-secondary)",
                  fontWeight: 600,
                }}
              >
                <span>Avg. Render: {mod.latency}</span>
                <span style={{ color: mod.color }}>{mod.cost} Credits</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
