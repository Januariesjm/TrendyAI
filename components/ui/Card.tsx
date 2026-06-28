import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  glow?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export default function Card({
  children,
  interactive = false,
  glow = false,
  padding = "md",
  style,
  ...props
}: CardProps) {
  const getPadding = () => {
    switch (padding) {
      case "none": return "0";
      case "sm": return "1rem";
      case "lg": return "2rem";
      default: return "1.5rem";
    }
  };

  const cardStyle: React.CSSProperties = {
    padding: getPadding(),
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-md)",
    background: "var(--bg-surface)",
    backdropFilter: "var(--glass-blur)",
    WebkitBackdropFilter: "var(--glass-blur)",
    boxShadow: glow ? "var(--shadow-glow)" : "var(--shadow-md)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
    ...style,
  };

  return (
    <div
      style={cardStyle}
      className={interactive ? "glass-panel-interactive" : ""}
      {...props}
      onMouseOver={(e) => {
        if (!interactive) return;
        const target = e.currentTarget;
        target.style.borderColor = "var(--border-hover)";
        target.style.boxShadow = glow 
          ? "0 0 25px rgba(157, 78, 221, 0.4), var(--shadow-lg)" 
          : "var(--shadow-lg)";
        target.style.transform = "translateY(-2px)";
      }}
      onMouseOut={(e) => {
        if (!interactive) return;
        const target = e.currentTarget;
        target.style.borderColor = "var(--border-color)";
        target.style.boxShadow = glow ? "var(--shadow-glow)" : "var(--shadow-md)";
        target.style.transform = "translateY(0)";
      }}
    >
      {/* Decorative Glow inside */}
      {glow && (
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "var(--grad-primary)",
            filter: "blur(40px)",
            opacity: 0.15,
            pointerEvents: "none",
          }}
        />
      )}
      {children}
    </div>
  );
}
