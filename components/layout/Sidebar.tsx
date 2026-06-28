"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Video,
  FolderHeart,
  Mic,
  Library,
  Send,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Create Studio", path: "/create", icon: Video },
    { name: "Video Library", path: "/library", icon: FolderHeart },
    { name: "Voice Library", path: "/voices", icon: Mic },
    { name: "Templates", path: "/templates", icon: Library },
    { name: "Social Hub", path: "/social", icon: Send },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: collapsed ? "var(--sidebar-collapsed-width)" : "var(--sidebar-width)",
        height: "100vh",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        background: "rgba(10, 10, 15, 0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRight: "1px solid var(--border-color)",
        overflow: "hidden",
      }}
    >
      {/* ── Brand Header ── */}
      <div
        style={{
          height: "var(--topbar-height)",
          display: "flex",
          alignItems: "center",
          padding: collapsed ? "0 0 0 1.35rem" : "0 1.5rem",
          borderBottom: "1px solid var(--border-color)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
          <div
            style={{
              background: "var(--grad-primary)",
              width: "34px",
              height: "34px",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 16px rgba(157,78,221,0.3)",
              flexShrink: 0,
            }}
          >
            <Sparkles size={18} color="#fff" />
          </div>
          {!collapsed && (
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "1.2rem",
                letterSpacing: "-0.03em",
                color: "var(--text-primary)",
              }}
            >
              Trendy<span className="gradient-text">AI</span>
            </span>
          )}
        </Link>
      </div>

      {/* ── Navigation ── */}
      <nav
        style={{
          flex: 1,
          padding: "1.25rem 0.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          overflowY: "auto",
        }}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.85rem",
                padding: collapsed ? "0.75rem 0" : "0.75rem 1rem",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: "var(--radius-sm)",
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                background: isActive ? "rgba(157, 78, 221, 0.12)" : "transparent",
                border: isActive ? "1px solid rgba(157, 78, 221, 0.25)" : "1px solid transparent",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: isActive ? 600 : 500,
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }
              }}
              onMouseOut={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }
              }}
            >
              <Icon
                size={19}
                style={{
                  color: isActive ? "var(--primary)" : "var(--text-muted)",
                  flexShrink: 0,
                }}
              />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* ── Collapse Toggle ── */}
      <div
        style={{
          padding: "0.85rem 0.75rem",
          borderTop: "1px solid var(--border-color)",
          display: "flex",
          justifyContent: collapsed ? "center" : "flex-end",
        }}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-sm)",
            width: "34px",
            height: "34px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--text-muted)",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.color = "var(--text-muted)"; }}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
