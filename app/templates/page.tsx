"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Library, Layout, Sparkles, Wand2 } from "lucide-react";
import Link from "next/link";

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: string;
  ratio: string;
}

export default function TemplatesPage() {
  const [templates] = useState<Template[]>([
    { id: "1", name: "Product Feature Showcase", category: "E-Commerce", description: "Highlights product value proposition, visual close-ups, and a strong call-to-action.", duration: "15s", ratio: "9:16" },
    { id: "2", name: "Modern App Explainer", category: "SaaS", description: "Ideal for walking through screen captures, features, and dashboard integrations.", duration: "30s", ratio: "16:9" },
    { id: "3", name: "Seasonal Promo Offer", category: "Marketing", description: "High impact visual flow designed for discount promotions and flash sales.", duration: "15s", ratio: "1:1" },
    { id: "4", name: "Quick Tutorial Reel", category: "Social Media", description: "Step by step narration template with fast transitions and subtitles.", duration: "60s", ratio: "9:16" },
  ]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>Preset Templates</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Kickstart your video campaigns with structured scenes built for high engagement.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
        {templates.map((tpl) => (
          <Card key={tpl.id} style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Badge variant="primary">{tpl.category}</Badge>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>{tpl.ratio}</span>
            </div>

            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>{tpl.name}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                {tpl.description}
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "0.75rem", marginTop: "auto" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Target: {tpl.duration}</span>
              <Link href={`/create?template=${tpl.id}`} style={{ textDecoration: "none" }}>
                <Button size="sm" icon={<Wand2 size={12} />}>Use Preset</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
