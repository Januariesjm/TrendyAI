"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Coins, Zap, Shield, Sparkles, CreditCard, ChevronRight } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const SUBSCRIPTION_PLANS = [
  {
    id: "free",
    name: "Free Tier",
    priceUsd: 0,
    credits: 20,
    desc: "Test the waters of AI generation",
    features: [
      "Speed Generation model only",
      "20 Monthly credits included",
      "1 Social account link",
      "Watermarked output files",
      "Standard community support",
    ],
    popular: false,
    color: "var(--text-muted)",
  },
  {
    id: "starter",
    name: "Starter Tier",
    priceUsd: 19,
    credits: 250,
    desc: "Perfect for single creators and reels builders",
    features: [
      "Speed & Balanced models",
      "250 Monthly credits included",
      "1 Custom Voice clone profile",
      "1 Connected account per platform",
      "No watermarks on videos",
      "Email support (24h SLA)",
    ],
    popular: false,
    color: "var(--accent-cyan)",
  },
  {
    id: "pro",
    name: "Pro Tier",
    priceUsd: 49,
    credits: 800,
    desc: "Our most popular package for active builders",
    features: [
      "Access to all premium AI models",
      "800 Monthly credits included",
      "5 Custom Voice clone profiles",
      "3 Connected accounts per platform",
      "No watermarks on videos",
      "Priority email support (4h SLA)",
      "Standard campaign scheduling",
    ],
    popular: true,
    color: "var(--primary)",
  },
  {
    id: "business",
    name: "Business Tier",
    priceUsd: 99,
    credits: 2000,
    desc: "For agencies and high volume production teams",
    features: [
      "All models + Priority rendering queue",
      "2,000 Monthly credits included",
      "Unlimited custom Voice clones",
      "10 Connected accounts per platform",
      "No watermarks on videos",
      "Dedicated account manager support",
      "Custom brand style templates",
      "Unlimited campaign scheduling",
    ],
    popular: false,
    color: "var(--accent-pink)",
  },
];

const TOPUP_PACKS = [
  { id: "starter_pack", name: "Starter Pack", credits: 100, priceUsd: 9, savings: "10% off" },
  { id: "creator_pack", name: "Creator Pack", credits: 500, priceUsd: 39, savings: "22% off" },
  { id: "agency_pack", name: "Agency Pack", credits: 2000, priceUsd: 129, savings: "35% off" },
  { id: "enterprise_pack", name: "Enterprise Pack", credits: 10000, priceUsd: 499, savings: "50% off" },
];

export default function Pricing() {
  const searchParams = useSearchParams();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<{ type: "success" | "error" | "none"; message: string }>({
    type: "none",
    message: "",
  });

  useEffect(() => {
    const status = searchParams.get("status");
    const ref = searchParams.get("ref");
    const errorMsg = searchParams.get("error");

    if (status === "success") {
      setPaymentStatus({
        type: "success",
        message: `Success! Your transaction (${ref || "Payment"}) has been verified and credits have been credited to your wallet.`,
      });
    } else if (status === "error") {
      setPaymentStatus({
        type: "error",
        message: `Payment process was interrupted: ${errorMsg || "Transaction unverified. Please try again."}`,
      });
    }
  }, [searchParams]);

  const handleCheckout = async (itemId: string, itemType: "subscription" | "topup") => {
    setLoadingId(itemId);
    try {
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: itemType,
          planId: itemType === "subscription" ? itemId : undefined,
          packId: itemType === "topup" ? itemId : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.authorizationUrl) {
        throw new Error(data.error || "Failed to initiate payment");
      }

      // Redirect user to Paystack payment gateway page (USD Cards / local payment secure page)
      window.location.href = data.authorizationUrl;

    } catch (err: unknown) {
      alert((err as Error).message || "An unexpected error occurred. Please log in first.");
      setLoadingId(null);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }} className="animate-fade-in">
      
      {/* Title Header */}
      <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto", padding: "1rem 0" }}>
        <Badge variant="primary" style={{ marginBottom: "0.75rem" }}>
          <Coins size={14} style={{ marginRight: "4px" }} /> Flexible Credit Engine
        </Badge>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
          Simple, Transparent <span className="gradient-text">Pricing</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: "1.5" }}>
          Scale your automated content pipeline with credits. Pay securely with international cards, Apple Pay, Google Pay, or local mobile payments.
        </p>
      </div>

      {/* Payment Status Banner */}
      {paymentStatus.type !== "none" && (
        <div
          style={{
            background: paymentStatus.type === "success" ? "rgba(6, 214, 160, 0.08)" : "rgba(239, 71, 111, 0.08)",
            border: `1px solid ${paymentStatus.type === "success" ? "rgba(6, 214, 160, 0.25)" : "rgba(239, 71, 111, 0.25)"}`,
            borderRadius: "var(--radius-md)",
            padding: "1rem 1.5rem",
            color: paymentStatus.type === "success" ? "var(--success)" : "var(--error)",
            fontSize: "0.9rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: "900px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <span>{paymentStatus.message}</span>
          <button
            onClick={() => setPaymentStatus({ type: "none", message: "" })}
            style={{ background: "transparent", border: "none", color: "inherit", cursor: "pointer", fontWeight: 700 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Subscription Plans Grid */}
      <div>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1.25rem", textAlign: "center" }}>Monthly Plans</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isFree = plan.id === "free";
            const isLoading = loadingId === plan.id;

            return (
              <Card
                key={plan.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  position: "relative",
                  border: plan.popular ? "1px solid var(--primary)" : "1px solid var(--border-color)",
                  boxShadow: plan.popular ? "0 0 20px rgba(157, 78, 221, 0.2)" : "var(--shadow-md)",
                  padding: "1.75rem",
                }}
              >
                {plan.popular && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-12px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "var(--grad-primary)",
                      color: "#fff",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "0.25rem 0.75rem",
                      borderRadius: "var(--radius-full)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Most Popular
                  </span>
                )}

                <div style={{ marginBottom: "1.25rem" }}>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.35rem" }}>{plan.name}</h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", minHeight: "2.5rem" }}>{plan.desc}</p>
                  
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginTop: "0.5rem" }}>
                    <span style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "var(--font-display)" }}>
                      ${plan.priceUsd}
                    </span>
                    {!isFree && <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>/month</span>}
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1.5rem",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>Monthly Credits</span>
                  <Badge variant={plan.popular ? "primary" : "secondary"}>
                    <Coins size={12} style={{ marginRight: "3px" }} /> {plan.credits} Credits
                  </Badge>
                </div>

                {/* Features List */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                      <Check size={14} style={{ color: plan.popular ? "var(--primary)" : "var(--success)", flexShrink: 0, marginTop: "2px" }} />
                      <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.3" }}>{feat}</span>
                    </div>
                  ))}
                </div>

                <Button
                  style={{ width: "100%" }}
                  variant={plan.popular ? "primary" : "secondary"}
                  loading={isLoading}
                  disabled={isFree || (loadingId !== null && !isLoading)}
                  onClick={() => handleCheckout(plan.id, "subscription")}
                >
                  {isFree ? "Default Tier Active" : `Get Started`}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Top-up Packs Grid */}
      <div
        style={{
          borderTop: "1px solid var(--border-color)",
          paddingTop: "2.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>One-time Credit Top-ups</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Exceeded your plan limit? Instantly reload credits to your wallet. No expiration date.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
          {TOPUP_PACKS.map((pack) => {
            const isLoading = loadingId === pack.id;

            return (
              <Card
                key={pack.id}
                interactive
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "1.5rem",
                  textAlign: "center",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.5rem" }}>
                    <Badge variant="success">{pack.savings}</Badge>
                  </div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.25rem" }}>{pack.name}</h3>
                  
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem", margin: "0.75rem 0" }}>
                    <Coins size={16} style={{ color: "var(--warning)" }} />
                    <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--warning)", fontFamily: "var(--font-display)" }}>
                      {pack.credits}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Credits</span>
                  </div>

                  <p style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1rem", color: "var(--text-primary)" }}>
                    ${pack.priceUsd}
                  </p>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  style={{ width: "100%" }}
                  loading={isLoading}
                  disabled={loadingId !== null && !isLoading}
                  onClick={() => handleCheckout(pack.id, "topup")}
                >
                  Buy Pack
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Card Brands Visual Box & Trust Badges */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.25rem",
          background: "rgba(255, 255, 255, 0.02)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-color)",
          padding: "2rem",
          marginTop: "1rem",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-primary)", fontWeight: 600 }}>
            <CreditCard size={18} style={{ color: "var(--primary)" }} /> Accepted Global Payments
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            We accept all major global credit cards, local debit cards, and instant mobile money transfer.
          </p>
        </div>

        {/* Brand Logos */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.5rem", opacity: 0.85 }}>
          {["Visa", "Mastercard", "American Express", "Discover", "Apple Pay", "Google Pay", "M-Pesa"].map((brand) => (
            <div
              key={brand}
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid var(--border-color)",
                borderRadius: "6px",
                padding: "0.4rem 0.9rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {brand}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.5rem",
            width: "100%",
            borderTop: "1px solid var(--border-color)",
            paddingTop: "1.5rem",
            marginTop: "0.5rem",
          }}
        >
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Shield size={20} style={{ color: "var(--success)", flexShrink: 0, marginTop: "2px" }} />
            <div>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, display: "block", marginBottom: "0.15rem" }}>Secure Encryption</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: "1.4" }}>
                All transaction information is encrypted using 256-bit SSL protocols.
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Zap size={20} style={{ color: "var(--accent-cyan)", flexShrink: 0, marginTop: "2px" }} />
            <div>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, display: "block", marginBottom: "0.15rem" }}>Instant Delivery</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: "1.4" }}>
                Credits appear automatically in your active balance ledger immediately upon verification.
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Sparkles size={20} style={{ color: "var(--warning)", flexShrink: 0, marginTop: "2px" }} />
            <div>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, display: "block", marginBottom: "0.15rem" }}>Risk-free Refund</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: "1.4" }}>
                Automatic credit refunds in full if model rendering jobs fail or timeout.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
