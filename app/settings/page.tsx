"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Settings, Shield, Key, Sparkles, LogOut } from "lucide-react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("fal_key_••••••••••••••••");
  const [elevenKey, setElevenKey] = useState("eleven_key_••••••••••••••••");
  const [tier] = useState("Creator Pro");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("API configurations and profile changes updated successfully.");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "800px" }}>
      <div>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>Settings</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Configure API credentials, subscription tier levels, and security tokens.
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Tier Details */}
        <Card padding="lg" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(157, 78, 221, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
              <Sparkles size={22} style={{ margin: "auto" }} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Current Subscription</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Charged monthly via safe M-Pesa / Local gateways.</p>
            </div>
          </div>
          <Badge variant="success">{tier}</Badge>
        </Card>

        {/* API Keys */}
        <Card padding="lg" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Key size={18} /> API Configuration
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>fal.ai API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="form-input"
            />
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Used to authenticate custom Kling, Veo, and MiniMax requests.</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>ElevenLabs API Key</label>
            <input
              type="password"
              value={elevenKey}
              onChange={(e) => setElevenKey(e.target.value)}
              className="form-input"
            />
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Used for custom TTS and voice clone generation.</span>
          </div>
        </Card>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="submit">Save Configurations</Button>
        </div>
      </form>
    </div>
  );
}
