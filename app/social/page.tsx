"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Film, ShieldAlert, CheckCircle2, AlertCircle, Share2, Plus } from "lucide-react";

const YoutubeIcon = ({ size = 20, color = "#FF0000" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none" style={{ display: "inline-block" }}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.387.51a3.002 3.002 0 0 0-2.11 2.108C0 8.028 0 12 0 12s0 3.972.503 5.837a3.002 3.002 0 0 0 2.11 2.108c1.862.51 9.387.51 9.387.51s7.525 0 9.387-.51a3.002 3.002 0 0 0 2.11-2.108C24 15.972 24 12 24 12s0-3.972-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const InstagramIcon = ({ size = 20, color = "#E1306C" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

interface SocialChannel {
  platform: "youtube" | "tiktok" | "instagram";
  connected: boolean;
  username: string | null;
}

interface PublishJob {
  id: string;
  videoTitle: string;
  platform: "youtube" | "tiktok" | "instagram";
  status: "pending" | "processing" | "success" | "failed";
  publishUrl: string | null;
  createdAt: string;
  errorMessage: string | null;
}

export default function SocialHub() {
  const [channels, setChannels] = useState<SocialChannel[]>([
    { platform: "youtube", connected: false, username: null },
    { platform: "tiktok", connected: false, username: null },
    { platform: "instagram", connected: false, username: null },
  ]);

  const [campaigns, setCampaigns] = useState<PublishJob[]>([
    { id: "1", videoTitle: "VoltRun Sneaker Commercial", platform: "tiktok", status: "success", publishUrl: "https://tiktok.com/@trendyai/video/123", createdAt: "2026-06-27T10:15:00Z", errorMessage: null },
    { id: "2", videoTitle: "Futuristic Coffee Brew Explainer", platform: "youtube", status: "success", publishUrl: "https://youtube.com/watch?v=coffee", createdAt: "2026-06-26T18:40:00Z", errorMessage: null },
  ]);

  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);

  // Mock OAuth linkage
  const handleConnect = (platform: "youtube" | "tiktok" | "instagram") => {
    setConnectingPlatform(platform);
    setTimeout(() => {
      setChannels(prev => prev.map(ch => 
        ch.platform === platform 
          ? { ...ch, connected: true, username: `@trendyai_${platform}` }
          : ch
      ));
      setConnectingPlatform(null);
    }, 1500);
  };

  const handleDisconnect = (platform: "youtube" | "tiktok" | "instagram") => {
    setChannels(prev => prev.map(ch => 
      ch.platform === platform 
        ? { ...ch, connected: false, username: null }
        : ch
    ));
  };

  const getPlatformIcon = (platform: string, size = 20) => {
    switch (platform) {
      case "youtube": return <YoutubeIcon size={size} color="#FF0000" />;
      case "tiktok": return <Film size={size} color="#00F2FE" />;
      case "instagram": return <InstagramIcon size={size} color="#E1306C" />;
      default: return <Share2 size={size} />;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>Social Publishing Hub</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Link accounts and publish campaigns to YouTube, TikTok, and Instagram with one click.
        </p>
      </div>

      {/* Grid of Platforms */}
      <div>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Linked Channels</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {channels.map((ch) => (
            <Card key={ch.platform} style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  {getPlatformIcon(ch.platform, 28)}
                  <span style={{ fontWeight: 700, fontSize: "1.1rem", textTransform: "capitalize" }}>
                    {ch.platform}
                  </span>
                </div>
                <Badge variant={ch.connected ? "success" : "secondary"}>
                  {ch.connected ? "Active" : "Inactive"}
                </Badge>
              </div>

              {ch.connected ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    Connected as <strong style={{ color: "var(--text-primary)" }}>{ch.username}</strong>
                  </span>
                  <button
                    onClick={() => handleDisconnect(ch.platform)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--error)",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      textAlign: "left",
                      padding: 0,
                      fontWeight: 600,
                      marginTop: "0.5rem"
                    }}
                  >
                    Disconnect Channel
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: "1.4" }}>
                    Authenticate securely to authorize one-click publishing pipelines.
                  </p>
                  <Button
                    size="sm"
                    loading={connectingPlatform === ch.platform}
                    onClick={() => handleConnect(ch.platform)}
                    icon={<Plus size={14} />}
                  >
                    Link Channel
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Campaigns History */}
      <div>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Campaign History</h2>
        <Card padding="none">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", background: "rgba(255,255,255,0.02)" }}>
                  <th style={{ padding: "1rem" }}>Video Campaign</th>
                  <th style={{ padding: "1rem" }}>Platform</th>
                  <th style={{ padding: "1rem" }}>Publish Date</th>
                  <th style={{ padding: "1rem" }}>Status</th>
                  <th style={{ padding: "1rem" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((camp) => (
                  <tr key={camp.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "1rem", fontWeight: 600 }}>{camp.videoTitle}</td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {getPlatformIcon(camp.platform, 16)}
                        <span style={{ textTransform: "capitalize" }}>{camp.platform}</span>
                      </div>
                    </td>
                    <td style={{ padding: "1rem", color: "var(--text-secondary)" }}>
                      {new Date(camp.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <Badge variant={camp.status === "success" ? "success" : camp.status === "failed" ? "error" : "primary"}>
                        {camp.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      {camp.publishUrl ? (
                        <a href={camp.publishUrl} target="_blank" rel="noreferrer" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
                          View Post
                        </a>
                      ) : (
                        <span style={{ color: "var(--text-muted)" }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
