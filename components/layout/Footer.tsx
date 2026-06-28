"use client";

import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-color)",
        background: "rgba(7, 7, 10, 0.6)",
        backdropFilter: "blur(12px)",
        padding: "3rem 2rem 2rem",
        marginTop: "4rem",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Top grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "2.5rem", marginBottom: "2.5rem" }}>
          {/* Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{ background: "var(--grad-primary)", width: "28px", height: "28px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sparkles size={14} color="#fff" />
              </div>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem" }}>
                Trendy<span className="gradient-text">AI</span>
              </span>
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.6, maxWidth: "220px" }}>
              AI-powered video creation and automated social media publishing platform.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: "0.85rem" }}>Product</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              {[
                { label: "Create Studio", href: "/create" },
                { label: "Voice Library", href: "/voices" },
                { label: "Templates", href: "/templates" },
                { label: "Pricing", href: "/pricing" },
              ].map((l) => (
                <Link key={l.href} href={l.href} style={{ fontSize: "0.8rem", color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseOver={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
                >{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: "0.85rem" }}>Company</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              {["About", "Blog", "Careers", "Contact"].map((l) => (
                <span key={l} style={{ fontSize: "0.8rem", color: "var(--text-muted)", cursor: "pointer", transition: "color 0.2s" }}
                  onMouseOver={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
                >{l}</span>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: "0.85rem" }}>Legal</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
                <span key={l} style={{ fontSize: "0.8rem", color: "var(--text-muted)", cursor: "pointer", transition: "color 0.2s" }}
                  onMouseOver={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
                >{l}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} TrendyAI. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: "1.25rem" }}>
            {["Twitter", "YouTube", "Discord"].map((s) => (
              <span key={s} style={{ fontSize: "0.75rem", color: "var(--text-muted)", cursor: "pointer", transition: "color 0.2s" }}
                onMouseOver={(e) => { e.currentTarget.style.color = "var(--primary)"; }}
                onMouseOut={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
              >{s}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
