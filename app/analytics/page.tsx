"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { BarChart3, TrendingUp, Users, Play, Calendar } from "lucide-react";

export default function AnalyticsPage() {
  const [metrics] = useState({
    totalViews: "17,700",
    avgWatchTime: "82%",
    ctr: "5.4%",
    shares: "1,240"
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>Analytics</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Track views, completion rates, and conversion performance for your published shorts and reels.
        </p>
      </div>

      {/* Overview Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
        <Card style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>AGGREGATE VIEWS</span>
          <span style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--accent-cyan)" }}>{metrics.totalViews}</span>
          <span style={{ fontSize: "0.75rem", color: "var(--success)" }}>+12.4% vs last week</span>
        </Card>

        <Card style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>AVG. WATCH TIME</span>
          <span style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--primary)" }}>{metrics.avgWatchTime}</span>
          <span style={{ fontSize: "0.75rem", color: "var(--success)" }}>+4.1% optimization</span>
        </Card>

        <Card style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>CLICK-THROUGH RATE</span>
          <span style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--warning)" }}>{metrics.ctr}</span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Target threshold: &gt; 5.0%</span>
        </Card>

        <Card style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>TOTAL SHARES</span>
          <span style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--accent-pink)" }}>{metrics.shares}</span>
          <span style={{ fontSize: "0.75rem", color: "var(--success)" }}>High engagement signal</span>
        </Card>
      </div>

      {/* Visual Mock Chart */}
      <Card padding="lg" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.25rem" }}>Conversion Engagement Pipeline</h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Viewer retention drops across video timeline (seconds).</p>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", height: "180px", gap: "1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
          <div style={{ flex: 1, background: "var(--grad-primary)", height: "100%", borderRadius: "var(--radius-sm) var(--radius-sm) 0 0" }} />
          <div style={{ flex: 1, background: "var(--grad-primary)", height: "92%", borderRadius: "var(--radius-sm) var(--radius-sm) 0 0" }} />
          <div style={{ flex: 1, background: "var(--grad-primary)", height: "85%", borderRadius: "var(--radius-sm) var(--radius-sm) 0 0" }} />
          <div style={{ flex: 1, background: "var(--grad-primary)", height: "78%", borderRadius: "var(--radius-sm) var(--radius-sm) 0 0" }} />
          <div style={{ flex: 1, background: "var(--grad-primary)", height: "65%", borderRadius: "var(--radius-sm) var(--radius-sm) 0 0" }} />
          <div style={{ flex: 1, background: "var(--grad-primary)", height: "54%", borderRadius: "var(--radius-sm) var(--radius-sm) 0 0" }} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)" }}>
          <span>Hook (0s)</span>
          <span>Story (15s)</span>
          <span>Detail (30s)</span>
          <span>Climax (45s)</span>
          <span>CTA (60s)</span>
        </div>
      </Card>
    </div>
  );
}
