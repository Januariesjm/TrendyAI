"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { Sparkles, Mail, Lock, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(searchParams.get("error") || "");
  const supabase = createClient();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <Card
      glow
      padding="lg"
      style={{
        width: "100%",
        maxWidth: "420px",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        background: "rgba(15, 15, 22, 0.8)",
      }}
    >
      {/* Brand Header */}
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
        <div
          style={{
            background: "var(--grad-primary)",
            width: "48px",
            height: "48px",
            borderRadius: "var(--radius-sm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-glow)",
            marginBottom: "0.5rem"
          }}
        >
          <Sparkles size={24} color="#fff" />
        </div>
        <h1 style={{ fontSize: "1.75rem", fontFamily: "var(--font-display)" }}>
          Welcome to Trendy<span className="gradient-text">AI</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
          Sign in to start generating & auto-posting videos
        </p>
      </div>

      {/* Error notice */}
      {errorMsg && (
        <div
          style={{
            background: "rgba(239, 71, 111, 0.08)",
            border: "1px solid rgba(239, 71, 111, 0.2)",
            borderRadius: "var(--radius-sm)",
            padding: "0.75rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            color: "var(--error)",
            fontSize: "0.85rem",
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleEmailSignIn} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 500 }}>
            Email Address
          </label>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <Mail size={16} style={{ position: "absolute", left: "12px", color: "var(--text-muted)" }} />
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              style={{ paddingLeft: "2.5rem" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 500 }}>
              Password
            </label>
            <a href="#" style={{ fontSize: "0.75rem", color: "var(--primary)", textDecoration: "none", fontWeight: 500 }}>
              Forgot?
            </a>
          </div>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <Lock size={16} style={{ position: "absolute", left: "12px", color: "var(--text-muted)" }} />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              style={{ paddingLeft: "2.5rem" }}
            />
          </div>
        </div>

        <Button type="submit" loading={loading} style={{ width: "100%", marginTop: "0.5rem" }}>
          Sign In with Email
        </Button>
      </form>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }} />
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>OR</span>
        <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }} />
      </div>

      {/* Google OAuth Button */}
      <button
        onClick={handleGoogleSignIn}
        className="glass-panel-interactive"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-sm)",
          padding: "0.65rem 1.25rem",
          color: "var(--text-primary)",
          fontWeight: 600,
          cursor: "pointer",
          width: "100%",
          fontSize: "0.9rem",
          transition: "all 0.2s ease"
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
          e.currentTarget.style.borderColor = "var(--border-hover)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
          e.currentTarget.style.borderColor = "var(--border-color)";
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5.04c1.62 0 3.06.56 4.2 1.66l3.12-3.12C17.43 1.84 14.92 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.86 3C6.27 7.58 8.87 5.04 12 5.04z"
          />
          <path
            fill="#4285F4"
            d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2 3.7-4.98 3.7-8.62z"
          />
          <path
            fill="#FBBC05"
            d="M5.36 14.5c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3L1.5 6.9C.54 8.82 0 10.96 0 13.2s.54 4.38 1.5 6.3l3.86-3z"
          />
          <path
            fill="#34A853"
            d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.73-2.89c-1.04.7-2.37 1.12-3.96 1.12-3.13 0-5.73-2.54-6.64-5.46L1.5 15.86C3.4 19.71 7.35 22.36 12 22.36z"
          />
        </svg>
        Continue with Google
      </button>

      {/* Footer text */}
      <p style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
        Don&apos;t have an account?{" "}
        <Link href="/signup" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
          Sign up
        </Link>
      </p>
    </Card>
  );
}

export default function Login() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 999,
        background: "var(--bg-main)",
        backgroundImage: 
          "radial-gradient(at 10% 10%, rgba(123, 44, 191, 0.15) 0px, transparent 50%), " +
          "radial-gradient(at 90% 85%, rgba(247, 37, 133, 0.12) 0px, transparent 50%)",
        padding: "1rem",
      }}
    >
      <Suspense fallback={
        <Card style={{ width: "100%", maxWidth: "420px", padding: "2.5rem", display: "flex", justifyContent: "center", background: "rgba(15, 15, 22, 0.8)" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <span style={{ width: "24px", height: "24px", border: "2.5px solid var(--primary)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Loading Login...</span>
          </div>
        </Card>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
