"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Play, Calendar, Eye, Share2, Video, Search, Download, Trash2 } from "lucide-react";

interface VideoJob {
  id: string;
  title: string;
  type: string;
  model: string;
  status: "completed" | "processing" | "failed";
  date: string;
  thumbnail: string;
  views: number;
}

export default function VideoLibrary() {
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState<VideoJob[]>([
    {
      id: "1",
      title: "Sleek Coffee Promo Ad",
      type: "Promo Ad (30s)",
      model: "Google Veo 3.1",
      status: "completed",
      date: "Just now",
      thumbnail: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=300&auto=format&fit=crop",
      views: 14500
    },
    {
      id: "2",
      title: "Future of AI explainer reel",
      type: "Short / Reel (15s)",
      model: "MiniMax Hailuo 2.3",
      status: "completed",
      date: "2 hours ago",
      thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop",
      views: 3200
    },
    {
      id: "3",
      title: "Cyberpunk Street Cinematic",
      type: "Cinematic (60s)",
      model: "Kling 3.0 Pro",
      status: "processing",
      date: "10 mins ago",
      thumbnail: "https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=300&auto=format&fit=crop",
      views: 0
    }
  ]);

  const filtered = jobs.filter(j => j.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>Video Library</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Manage and export your generated video clips, reels, and product ads.
          </p>
        </div>
        <div style={{ position: "relative", width: "100%", maxWidth: "300px" }}>
          <Search size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search generations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem 1rem 0.5rem 2.25rem",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-primary)",
              fontSize: "0.85rem",
              outline: "none"
            }}
          />
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
        {filtered.map((video) => (
          <Card key={video.id} padding="none" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {/* Thumbnail */}
            <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "rgba(0,0,0,0.2)" }}>
              <img
                src={video.thumbnail}
                alt={video.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "0.75rem",
                  left: "0.75rem",
                  display: "flex",
                  gap: "0.5rem"
                }}
              >
                <Badge variant={video.status === "completed" ? "success" : video.status === "processing" ? "primary" : "error"}>
                  {video.status.toUpperCase()}
                </Badge>
              </div>

              {video.status === "completed" && (
                <button
                  style={{
                    position: "absolute",
                    bottom: "0.75rem",
                    right: "0.75rem",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "rgba(10, 10, 15, 0.75)",
                    backdropFilter: "blur(4px)",
                    border: "1px solid var(--border-color)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer"
                  }}
                >
                  <Play size={16} fill="#fff" />
                </button>
              )}
            </div>

            {/* Meta */}
            <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1 }}>
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.25rem" }}>{video.title}</h3>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{video.type}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", borderTop: "1px solid var(--border-color)", paddingTop: "0.75rem", marginTop: "auto" }}>
                <span>Model: {video.model}</span>
                <span>{video.date}</span>
              </div>

              {video.status === "completed" && (
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <Button size="sm" variant="secondary" style={{ flex: 1 }} icon={<Download size={14} />}>
                    Download
                  </Button>
                  <Button size="sm" variant="secondary" style={{ flex: 1 }} icon={<Share2 size={14} />}>
                    Share
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
