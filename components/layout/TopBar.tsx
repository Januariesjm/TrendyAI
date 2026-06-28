"use client";

import React, { useState, useEffect } from "react";
import { Bell, Coins, Plus, Search, User, LogIn, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface TopBarProps {
  collapsed: boolean;
}

export default function TopBar({ collapsed }: TopBarProps) {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState<number>(0);
  const [plan, setPlan] = useState<string>("Free Tier");
  const [loading, setLoading] = useState<boolean>(true);
  const [notificationsCount, setNotificationsCount] = useState<number>(0);

  // Sync auth state
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          // Fetch user credits & plan details
          const response = await fetch("/api/user/credits");
          if (response.ok) {
            const data = await response.json();
            setCredits(data.credits ?? 0);
            setPlan(data.plan ? `${data.plan.charAt(0).toUpperCase()}${data.plan.slice(1)} Tier` : "Free Tier");
          }
          // Mock notifications count
          setNotificationsCount(3);
        }
      } catch (err) {
        console.error("TopBar auth sync error:", err);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        // Refresh balance
        const response = await fetch("/api/user/credits");
        if (response.ok) {
          const data = await response.json();
          setCredits(data.credits ?? 0);
          setPlan(data.plan ? `${data.plan.charAt(0).toUpperCase()}${data.plan.slice(1)} Tier` : "Free Tier");
        }
      } else {
        setUser(null);
        setCredits(0);
        setPlan("Free Tier");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Determine left margin based on auth & collapsed states
  const leftPosition = !user 
    ? "0" 
    : collapsed 
      ? "var(--sidebar-collapsed-width)" 
      : "var(--sidebar-width)";

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        left: leftPosition,
        height: "var(--topbar-height)",
        zIndex: 90,
        background: "rgba(7, 7, 10, 0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-color)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.75rem",
        transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Left section: Logo & Brand for guest / Search for authenticated */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {!user ? (
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.65rem", textDecoration: "none" }}>
            <div
              style={{
                background: "var(--grad-primary)",
                width: "30px",
                height: "30px",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 12px rgba(157,78,221,0.25)",
                flexShrink: 0,
              }}
            >
              <Sparkles size={16} color="#fff" />
            </div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "1.1rem",
                letterSpacing: "-0.03em",
                color: "var(--text-primary)",
              }}
            >
              Trendy<span className="gradient-text">AI</span>
            </span>
          </Link>
        ) : (
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <Search size={16} style={{ position: "absolute", left: "12px", color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search videos, templates..."
              className="form-input"
              style={{ paddingLeft: "2.25rem", width: "260px", height: "36px", fontSize: "0.85rem" }}
            />
          </div>
        )}
      </div>

      {/* Right controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
        {loading ? (
          <div style={{ width: "24px", height: "24px", border: "2px solid var(--border-color)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        ) : user ? (
          /* AUTHENTICATED USER CONTROLS */
          <>
            {/* Credits */}
            <Link
              href="/pricing"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(255,209,102,0.06)",
                border: "1px solid rgba(255,209,102,0.2)",
                padding: "0.35rem 0.85rem",
                borderRadius: "var(--radius-full)",
                color: "var(--warning)",
                fontSize: "0.82rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255,209,102,0.12)"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255,209,102,0.06)"; }}
            >
              <Coins size={14} />
              <span>{credits}</span>
              <div style={{ background: "var(--warning)", color: "#000", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Plus size={9} strokeWidth={3} />
              </div>
            </Link>

            {/* Notifications */}
            <button
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-secondary)",
                cursor: "pointer",
                position: "relative",
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Bell size={18} />
              {notificationsCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    background: "var(--accent-pink)",
                    color: "#fff",
                    borderRadius: "50%",
                    width: "15px",
                    height: "15px",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 8px var(--accent-pink)",
                  }}
                >
                  {notificationsCount}
                </span>
              )}
            </button>

            <div style={{ height: "22px", width: "1px", background: "var(--border-color)" }} />

            {/* Profile Avatar / Link */}
            <Link
              href="/profile"
              style={{ display: "flex", alignItems: "center", gap: "0.65rem", cursor: "pointer", textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(157,78,221,0.2), rgba(247,37,133,0.15))",
                  border: "1px solid rgba(157,78,221,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-primary)",
                }}
              >
                <User size={16} />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }} className="mobile-hide">
                <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                  {user.user_metadata?.full_name || user.email?.split("@")[0] || "User"}
                </span>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{plan}</span>
              </div>
            </Link>
          </>
        ) : (
          /* GUEST (UNAUTHENTICATED) CONTROLS */
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link
              href="/login"
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--text-secondary)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                transition: "color 0.2s",
              }}
              onMouseOver={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
              onMouseOut={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; }}
            >
              <LogIn size={15} /> Sign In
            </Link>

            <Link href="/signup" style={{ textDecoration: "none" }}>
              <button
                style={{
                  background: "var(--grad-primary)",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  color: "#fff",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  padding: "0.5rem 1.1rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  boxShadow: "0 4px 15px rgba(157, 78, 221, 0.3)",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(157, 78, 221, 0.45)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(157, 78, 221, 0.3)";
                }}
              >
                <Sparkles size={14} /> Get Started
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
