"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
  User,
  Mail,
  Calendar,
  Sparkles,
  Coins,
  Shield,
  LogOut,
  ArrowUpRight,
  TrendingUp,
  Share2,
  Lock,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function getProfileData() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          router.push("/login");
          return;
        }
        setUser(user);

        // Fetch user profile info
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(prof);

        // Fetch credit ledger history
        const { data: txs } = await supabase
          .from("credit_transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);
        setTransactions(txs || []);

      } catch (err) {
        console.error("Profile page load error:", err);
      } finally {
        setLoading(false);
      }
    }

    getProfileData();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: "32px", height: "32px", border: "3px solid var(--border-color)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>Loading Profile...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const userName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const userPlan = profile?.plan ? `${profile.plan.charAt(0).toUpperCase()}${profile.plan.slice(1)}` : "Free";
  const currentCredits = profile?.credits ?? 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "900px", margin: "0 auto" }} className="animate-fade-in">
      
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>My Profile</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Manage your personal details, subscription plan, and credit ledgers.
        </p>
      </div>

      {/* Main Split Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
        
        {/* Left Side: Avatar & Main Credentials */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <Card
            glow
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "2.5rem 1.5rem",
              textAlign: "center",
              border: "1px solid var(--border-color)",
            }}
          >
            {/* Custom Aesthetic Avatar */}
            <div
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                background: "var(--grad-primary)",
                padding: "3px",
                boxShadow: "0 0 25px rgba(157, 78, 221, 0.3)",
                marginBottom: "1.25rem",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: "var(--bg-surface)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                <User size={38} style={{ color: "var(--primary)" }} />
              </div>
            </div>

            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.35rem" }}>{userName}</h2>
            <Badge variant="primary" style={{ marginBottom: "1.5rem" }}>{userPlan} Active</Badge>

            {/* Fields list */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.85rem", borderTop: "1px solid var(--border-color)", paddingTop: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                <Mail size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{user.email}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                <Calendar size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <Button
              variant="secondary"
              loading={loggingOut}
              onClick={handleLogout}
              style={{ width: "100%", marginTop: "2rem", border: "1px solid rgba(239, 71, 111, 0.25)", color: "var(--error)" }}
            >
              <LogOut size={16} style={{ marginRight: "6px" }} /> Log Out
            </Button>
          </Card>

          {/* Social connections panel */}
          <Card padding="md" style={{ display: "flex", flexDirection: "column", gap: "1rem", border: "1px solid var(--border-color)" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Share2 size={16} style={{ color: "var(--accent-cyan)" }} /> Linked Channels
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {["YouTube Shorts", "TikTok Ads", "Instagram Reels"].map((ch) => (
                <div key={ch} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--text-secondary)" }}>{ch}</span>
                  <Badge variant="success">Connected</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Side: Billing Status & Credits Ledger */}
        <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Credits Box */}
          <Card
            style={{
              padding: "1.75rem",
              background: "linear-gradient(135deg, rgba(255, 209, 102, 0.06) 0%, rgba(157, 78, 221, 0.04) 100%)",
              border: "1px solid rgba(255, 209, 102, 0.2)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "rgba(255, 209, 102, 0.15)", display: "flex", alignItems: "center", justifyBox: "center", color: "var(--warning)" }}>
                <Coins size={22} style={{ margin: "auto" }} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Available Balance</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Used for high fidelity voice & video generation</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
              <span style={{ fontSize: "2.25rem", fontWeight: 850, color: "var(--warning)", fontFamily: "var(--font-display)" }}>{currentCredits}</span>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Credits</span>
            </div>
          </Card>

          {/* Transaction Ledger */}
          <Card style={{ padding: "1.5rem", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <TrendingUp size={18} style={{ color: "var(--primary)" }} /> Credits Ledger Logs
              </h3>
              <Link href="/pricing" style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: "2px" }}>
                Add Credits <ArrowUpRight size={14} />
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {transactions.length > 0 ? (
                transactions.map((tx) => {
                  const isPositive = tx.amount > 0;
                  return (
                    <div
                      key={tx.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.75rem",
                        borderRadius: "var(--radius-sm)",
                        background: "rgba(255,255,255,0.01)",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem", minWidth: 0 }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {tx.description || "Credit Adjustments"}
                        </span>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                          {new Date(tx.created_at).toLocaleString()} · Type: {tx.type}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: "0.95rem",
                          fontWeight: 800,
                          color: isPositive ? "var(--success)" : "var(--error)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isPositive ? `+${tx.amount}` : tx.amount}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: "2.5rem 1.5rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                  No transaction ledger logs recorded yet.
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
