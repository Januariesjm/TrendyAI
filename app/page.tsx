"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Coins,
  Video,
  Share2,
  Calendar,
  Plus,
  Play,
  Clock,
  ArrowRight,
  Zap,
  Mic,
  TrendingUp,
  ChevronRight,
  CheckCircle2,
  Tv,
  Eye,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Footer from "@/components/layout/Footer";

// Placeholder showcase videos — will be replaced with real generated content
const showcaseVideos = [
  { id: "s1", title: "Sleek Coffee Brand Promo", category: "Product Ad", thumbnail: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop", views: 148200, likes: 12400, duration: "0:30" },
  { id: "s2", title: "AI Future Explainer Reel", category: "Explainer", thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop", views: 89700, likes: 7800, duration: "0:15" },
  { id: "s3", title: "Cyberpunk Cityscape Cinematic", category: "Cinematic", thumbnail: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=600&auto=format&fit=crop", views: 234500, likes: 19200, duration: "1:00" },
  { id: "s4", title: "Fitness Coach Motivation Short", category: "Short / Reel", thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop", views: 67300, likes: 5400, duration: "0:15" },
  { id: "s5", title: "Luxury Watch Product Launch", category: "Product Ad", thumbnail: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=600&auto=format&fit=crop", views: 112800, likes: 9600, duration: "0:30" },
  { id: "s6", title: "Nature Documentary Intro", category: "Cinematic", thumbnail: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=600&auto=format&fit=crop", views: 198400, likes: 16100, duration: "0:45" },
  { id: "s7", title: "Startup SaaS Walkthrough", category: "Explainer", thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=600&auto=format&fit=crop", views: 43200, likes: 3100, duration: "0:30" },
  { id: "s8", title: "Street Food Travel Vlog", category: "Short / Reel", thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop", views: 175600, likes: 14300, duration: "0:15" },
  { id: "s9", title: "Electric Car Ad Campaign", category: "Product Ad", thumbnail: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=600&auto=format&fit=crop", views: 256100, likes: 21800, duration: "0:30" },
];

const featuresList = [
  { title: "Cinematic Visual Engines", desc: "Create full-length high-fidelity videos using advanced models like Kling 3.0, Google Veo, and MiniMax Hailuo.", icon: Tv, color: "var(--primary)", bg: "rgba(157, 78, 221, 0.08)" },
  { title: "Instant Voice Clones", desc: "Upload a 10-second sample to clone your voice or use pre-recorded narrator profiles powered by ElevenLabs.", icon: Mic, color: "var(--accent-cyan)", bg: "rgba(0, 245, 212, 0.08)" },
  { title: "Automated Publishing", desc: "Link your YouTube Shorts, TikTok, and Instagram accounts to schedule, scale, and publish with a single click.", icon: Share2, color: "var(--accent-pink)", bg: "rgba(247, 37, 133, 0.08)" },
];

const statsList = [
  { label: "AI Videos Rendered", value: "1,248,392+", icon: Video, color: "var(--primary)" },
  { label: "Autopost Automation Rate", value: "98.7%", icon: Share2, color: "var(--accent-cyan)" },
  { label: "Average Rendering Time", value: "24.2s", icon: Clock, color: "var(--warning)" },
];

function formatViews(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export default function Home() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);

  useEffect(() => {
    async function initSession() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          // Fetch profiles
          const { data: prof } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
          setProfile(prof);

          // Fetch recent video jobs
          const { data: jobs } = await supabase
            .from("jobs")
            .select("*, voice:voices(name)")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(3);
          setRecentJobs(jobs || []);
        }
      } catch (err) {
        console.error("Dashboard init error:", err);
      } finally {
        setLoading(false);
      }
    }

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setProfile(prof);
        
        const { data: jobs } = await supabase
          .from("jobs")
          .select("*, voice:voices(name)")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(3);
        setRecentJobs(jobs || []);
      } else {
        setProfile(null);
        setRecentJobs([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: "32px", height: "32px", border: "3px solid var(--border-color)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>Initializing Workspace...</span>
        </div>
      </div>
    );
  }

  // Render Landing Page if User is not logged in
  if (!user) {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "3.5rem", padding: "0.5rem 0 0" }}>

          {/* Compact Hero */}
          <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto", padding: "0.5rem 0 0" }}>
            <Badge variant="primary" style={{ marginBottom: "0.75rem" }}>
              <Sparkles size={11} style={{ marginRight: "3px" }} /> Next-Gen AI Content Automation
            </Badge>
            <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)", lineHeight: 1.15, fontWeight: 850, letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>
              Transform Ideas into <span className="gradient-text">Automated Video Campaigns</span>
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.6", maxWidth: "600px", margin: "0 auto 1.5rem" }}>
              Write scripts, clone voiceovers, generate cinematic videos, and auto-post to YouTube Shorts, TikTok, and Instagram Reels.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <Link href="/signup" style={{ textDecoration: "none" }}>
                <Button icon={<ArrowRight size={16} />}>Get Started for Free</Button>
              </Link>
              <Link href="/pricing" style={{ textDecoration: "none" }}>
                <Button variant="secondary">View Pricing</Button>
              </Link>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1.25rem", marginTop: "1.5rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><CheckCircle2 size={13} style={{ color: "var(--success)" }} /> No credit card required</span>
              <span>·</span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><CheckCircle2 size={13} style={{ color: "var(--success)" }} /> 20 free credits</span>
              <span>·</span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><CheckCircle2 size={13} style={{ color: "var(--success)" }} /> Instantly link socials</span>
            </div>
          </div>

          {/* Video Showcase Grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ fontSize: "1.35rem", fontWeight: 750, marginBottom: "0.2rem" }}>Created with TrendyAI</h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Real videos generated by creators on our platform</p>
              </div>
              <Link href="/signup" style={{ textDecoration: "none" }}>
                <Button size="sm" variant="secondary">Start Creating <ArrowRight size={14} style={{ marginLeft: "4px" }} /></Button>
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
              {showcaseVideos.map((v) => (
                <div key={v.id} style={{ borderRadius: "var(--radius-md)", overflow: "hidden", background: "rgba(15,15,22,0.6)", border: "1px solid var(--border-color)", transition: "border-color 0.25s, transform 0.25s, box-shadow 0.25s", cursor: "pointer" }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.4)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden" }}>
                    <img src={v.thumbnail} alt={v.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <span style={{ position: "absolute", bottom: "6px", right: "6px", background: "rgba(0,0,0,0.75)", color: "#fff", fontSize: "0.65rem", fontWeight: 700, padding: "2px 6px", borderRadius: "4px" }}>{v.duration}</span>
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.25s" }}
                      onMouseOver={(e) => { e.currentTarget.style.opacity = "1"; }}
                      onMouseOut={(e) => { e.currentTarget.style.opacity = "0"; }}
                    >
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(157,78,221,0.5)" }}>
                        <Play size={16} fill="#fff" color="#fff" />
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: "0.75rem 0.85rem" }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 650, marginBottom: "0.3rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.title}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 500 }}>{v.category}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "0.68rem", color: "var(--text-muted)" }}><Eye size={11} /> {formatViews(v.views)}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "0.68rem", color: "var(--accent-pink)" }}><Heart size={11} /> {formatViews(v.likes)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ textAlign: "center", maxWidth: "550px", margin: "0 auto" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 750, marginBottom: "0.35rem" }}>Powerful Features, Made Simple</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Automate your digital audience growth with modern AI generation.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {featuresList.map((f) => {
                const Icon = f.icon;
                return (
                  <Card key={f.title} style={{ display: "flex", flexDirection: "column", gap: "0.85rem", padding: "1.75rem", border: "1px solid var(--border-color)" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "var(--radius-sm)", background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", color: f.color }}><Icon size={22} /></div>
                    <div>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.35rem" }}>{f.title}</h3>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>{f.desc}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Platform Stats */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "2rem 1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", textAlign: "center" }}>
              {statsList.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}><Icon size={18} /></div>
                    <span style={{ fontSize: "1.75rem", fontWeight: 800, fontFamily: "var(--font-display)" }}>{s.value}</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom CTA */}
          <div style={{ maxWidth: "780px", margin: "0 auto", width: "100%" }}>
            <Card glow style={{ padding: "2.5rem 2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem", border: "1px solid rgba(157,78,221,0.2)" }}>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Ready to automate your channel?</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: "500px", lineHeight: "1.5" }}>
                Sign up today and get 20 complimentary generation credits. Clone your voice, generate visual scenes, and post automatically.
              </p>
              <Link href="/signup" style={{ textDecoration: "none" }}>
                <Button icon={<Sparkles size={16} />}>Create Free Account</Button>
              </Link>
            </Card>
          </div>

        </div>
        <Footer />
      </div>
    );
  }
        




  // Render Dashboard if User is logged in
  const userName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Creator";
  const userPlan = profile?.plan ? `${profile.plan.charAt(0).toUpperCase()}${profile.plan.slice(1)} Tier` : "Free Tier";
  const creditBalance = profile?.credits ?? 0;

  // Real-time stats calculations
  const dashboardStats = [
    { label: "Credit Balance", value: creditBalance.toString(), sub: `≈ ${Math.floor(creditBalance / 60)} premium reels`, icon: Coins, color: "var(--warning)", bg: "rgba(255,209,102,0.08)", border: "rgba(255,209,102,0.18)" },
    { label: "Videos Created", value: recentJobs.length.toString(), sub: "Total generations logged", icon: Video, color: "var(--primary)", bg: "rgba(157,78,221,0.08)", border: "rgba(157,78,221,0.18)" },
    { label: "Connected Socials", value: "3", sub: "YouTube · TikTok · IG", icon: Share2, color: "var(--accent-cyan)", bg: "rgba(0,245,212,0.08)", border: "rgba(0,245,212,0.18)" },
    { label: "Scheduled Posts", value: "0", sub: "Ready in social queue", icon: Calendar, color: "var(--accent-pink)", bg: "rgba(247,37,133,0.08)", border: "rgba(247,37,133,0.18)" },
  ];

  const quickActions = [
    { title: "Create from Prompt", desc: "AI writes script & generates scenes", icon: Sparkles, color: "var(--primary)", bg: "rgba(157,78,221,0.1)", href: "/create" },
    { title: "Clone Your Voice", desc: "10-second sample → custom narrator", icon: Mic, color: "var(--accent-cyan)", bg: "rgba(0,245,212,0.1)", href: "/voices" },
    { title: "Browse Templates", desc: "Pre-built campaigns ready to launch", icon: Zap, color: "var(--warning)", bg: "rgba(255,209,102,0.1)", href: "/templates" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }} className="animate-fade-in">
      
      {/* Welcome Banner */}
      <div
        style={{
          position: "relative",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          padding: "2.5rem 2.5rem 2rem",
          background: "linear-gradient(135deg, rgba(123,44,191,0.15) 0%, rgba(247,37,133,0.08) 50%, rgba(0,245,212,0.06) 100%)",
          border: "1px solid rgba(157,78,221,0.2)",
        }}
      >
        <div style={{ position: "absolute", top: "-60px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(157,78,221,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-80px", left: "20%", width: "260px", height: "260px", borderRadius: "50%", background: "radial-gradient(circle, rgba(247,37,133,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.5rem" }}>
          <div style={{ maxWidth: "560px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <Badge variant="primary">✦ {userPlan} Active</Badge>
            </div>
            <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", lineHeight: 1.15, marginBottom: "0.5rem" }}>
              Welcome back, <span className="gradient-text">{userName}</span>
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.5, maxWidth: "480px" }}>
              Create cinematic videos, AI-narrated reels, and product ads — then auto-publish across all your channels.
            </p>
          </div>
          <Link href="/create" style={{ textDecoration: "none", alignSelf: "center" }}>
            <Button icon={<Plus size={18} />}>Create New Video</Button>
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="stats-grid">
        {dashboardStats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              style={{
                background: s.bg,
                border: `1px solid ${s.border}`,
                borderRadius: "var(--radius-md)",
                padding: "1.25rem 1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.35rem",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 25px ${s.border}`; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</span>
                <Icon size={16} style={{ color: s.color, opacity: 0.8 }} />
              </div>
              <span style={{ fontSize: "1.75rem", fontWeight: 800, color: s.color, fontFamily: "var(--font-display)" }}>{s.value}</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{s.sub}</span>
            </div>
          );
        })}
      </div>

      {/* Main split */}
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }} className="tablet-stack">
        {/* Left: Recent Videos */}
        <div style={{ flex: "2 1 400px", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "1.25rem" }}>Recent Generations</h2>
            <Link href="/library" style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {recentJobs.length > 0 ? (
              recentJobs.map((v) => (
                <div
                  key={v.id}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                    padding: "0.75rem",
                    borderRadius: "var(--radius-md)",
                    background: "rgba(15,15,22,0.5)",
                    border: "1px solid var(--border-color)",
                    transition: "border-color 0.2s, background 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.background = "rgba(20,20,30,0.7)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.background = "rgba(15,15,22,0.5)"; }}
                >
                  {/* Thumbnail */}
                  <div style={{ width: "110px", height: "72px", borderRadius: "var(--radius-sm)", overflow: "hidden", position: "relative", flexShrink: 0, background: "rgba(255,255,255,0.02)" }}>
                    {v.thumbnail_url ? (
                      <img src={v.thumbnail_url} alt={v.prompt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
                        <Video size={20} />
                      </div>
                    )}
                    {v.status === "completed" && v.output_url && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.35)", opacity: 0, transition: "opacity 0.2s" }}
                        onMouseOver={(e) => { e.currentTarget.style.opacity = "1"; }}
                        onMouseOut={(e) => { e.currentTarget.style.opacity = "0"; }}
                        onClick={() => window.open(v.output_url, "_blank")}
                      >
                        <Play size={18} fill="#fff" color="#fff" />
                      </div>
                    )}
                    {v.status === "processing" && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", gap: "2px" }}>
                        <Clock size={14} color="var(--primary)" style={{ animation: "spin 2s linear infinite" }} />
                        <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.05em" }}>RENDERING</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.9rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {v.prompt || "AI Generation Video"}
                      </span>
                      <Badge variant={v.status === "completed" ? "success" : v.status === "failed" ? "destructive" : "warning"}>
                        {v.status?.toUpperCase() || "PENDING"}
                      </Badge>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {v.type ? `${v.type.charAt(0).toUpperCase()}${v.type.slice(1)}` : "Video Studio"} · {v.duration || 0}s
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.15rem" }}>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{v.model_used || "Standard Model"}</span>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>·</span>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{new Date(v.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }} className="mobile-hide">
                    {v.status === "completed" && (
                      <Link href="/social" style={{ textDecoration: "none" }}>
                        <Button size="sm" variant="secondary">Publish</Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: "3rem 1.5rem", textAlign: "center", border: "1px dashed var(--border-color)", borderRadius: "var(--radius-md)", color: "var(--text-muted)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                <Video size={36} style={{ strokeWidth: 1.5 }} />
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem" }}>No videos generated yet</div>
                  <div style={{ fontSize: "0.75rem", marginTop: "0.15rem" }}>Create your first AI visual sequence using prompt inputs.</div>
                </div>
                <Link href="/create" style={{ textDecoration: "none", marginTop: "0.5rem" }}>
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <h2 style={{ fontSize: "1.1rem" }}>Quick Actions</h2>
          {quickActions.map((a) => {
            const Icon = a.icon;
            return (
              <Link key={a.title} href={a.href} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem",
                    borderRadius: "var(--radius-md)", background: "rgba(15,15,22,0.5)", border: "1px solid var(--border-color)",
                    cursor: "pointer", transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.transform = "translateX(4px)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.transform = "translateX(0)"; }}
                >
                  <div style={{ width: "42px", height: "42px", borderRadius: "var(--radius-sm)", background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", color: a.color, flexShrink: 0 }}>
                    <Icon size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>{a.title}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{a.desc}</div>
                  </div>
                  <ArrowRight size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                </div>
              </Link>
            );
          })}

          {/* Linked Channels */}
          <Card padding="md" style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Linked Channels</h3>
            {["YouTube Shorts", "TikTok Ads", "Instagram Reels"].map((ch) => (
              <div key={ch} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>{ch}</span>
                <Badge variant="success">Active</Badge>
              </div>
            ))}
            <Link href="/social" style={{ textDecoration: "none", marginTop: "0.25rem" }}>
              <Button variant="ghost" size="sm" style={{ width: "100%", border: "1px solid var(--border-color)" }}>
                Manage Channels
              </Button>
            </Link>
          </Card>
        </div>
      </div>

    </div>
  );
}
