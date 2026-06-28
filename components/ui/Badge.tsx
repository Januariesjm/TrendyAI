import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  style?: React.CSSProperties;
}

export default function Badge({
  children,
  variant = "primary",
  style,
}: BadgeProps) {
  const getStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.25rem",
      padding: "0.25rem 0.65rem",
      borderRadius: "var(--radius-full)",
      fontSize: "0.75rem",
      fontWeight: 600,
      width: "fit-content",
      fontFamily: "var(--font-sans)",
      ...style,
    };

    const variants = {
      primary: {
        background: "rgba(157, 78, 221, 0.12)",
        color: "var(--primary)",
        border: "1px solid rgba(157, 78, 221, 0.25)",
      },
      secondary: {
        background: "rgba(255, 255, 255, 0.04)",
        color: "var(--text-secondary)",
        border: "1px solid var(--border-color)",
      },
      success: {
        background: "rgba(6, 214, 160, 0.12)",
        color: "var(--success)",
        border: "1px solid rgba(6, 214, 160, 0.25)",
      },
      warning: {
        background: "rgba(255, 209, 102, 0.12)",
        color: "var(--warning)",
        border: "1px solid rgba(255, 209, 102, 0.25)",
      },
      error: {
        background: "rgba(239, 71, 111, 0.12)",
        color: "var(--error)",
        border: "1px solid rgba(239, 71, 111, 0.25)",
      },
      info: {
        background: "rgba(17, 138, 178, 0.12)",
        color: "var(--info)",
        border: "1px solid rgba(17, 138, 178, 0.25)",
      },
    };

    return {
      ...baseStyles,
      ...variants[variant],
    };
  };

  return <span style={getStyles()}>{children}</span>;
}
