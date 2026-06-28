import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const getStyles = () => {
    const baseStyles: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      fontFamily: "var(--font-sans)",
      fontWeight: 600,
      borderRadius: "var(--radius-sm)",
      border: "1px solid transparent",
      cursor: disabled || loading ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      outline: "none",
      textDecoration: "none",
    };

    // Sizes
    const sizes = {
      sm: { padding: "0.45rem 0.9rem", fontSize: "0.8rem" },
      md: { padding: "0.65rem 1.25rem", fontSize: "0.9rem" },
      lg: { padding: "0.85rem 1.75rem", fontSize: "1rem" },
    };

    // Variants
    const variants = {
      primary: {
        background: "var(--grad-primary)",
        color: "#ffffff",
        boxShadow: "0 4px 15px rgba(123, 44, 191, 0.3)",
      },
      secondary: {
        background: "rgba(255, 255, 255, 0.04)",
        color: "var(--text-primary)",
        border: "1px solid var(--border-color)",
      },
      accent: {
        background: "var(--grad-cyan-blue)",
        color: "#07070a",
        boxShadow: "0 4px 15px rgba(0, 245, 212, 0.2)",
      },
      danger: {
        background: "rgba(239, 71, 111, 0.1)",
        color: "var(--error)",
        border: "1px solid rgba(239, 71, 111, 0.2)",
      },
      ghost: {
        background: "transparent",
        color: "var(--text-secondary)",
      },
    };

    return {
      ...baseStyles,
      ...sizes[size],
      ...variants[variant],
      ...style,
    };
  };

  return (
    <button
      disabled={disabled || loading}
      style={getStyles()}
      {...props}
      onMouseOver={(e) => {
        if (disabled || loading) return;
        const target = e.currentTarget;
        if (variant === "primary") {
          target.style.boxShadow = "0 6px 20px rgba(123, 44, 191, 0.5)";
          target.style.transform = "translateY(-1px)";
        } else if (variant === "secondary") {
          target.style.background = "rgba(255, 255, 255, 0.08)";
          target.style.borderColor = "var(--border-hover)";
        } else if (variant === "accent") {
          target.style.boxShadow = "0 6px 20px rgba(0, 245, 212, 0.4)";
          target.style.transform = "translateY(-1px)";
        } else if (variant === "danger") {
          target.style.background = "rgba(239, 71, 111, 0.2)";
        } else if (variant === "ghost") {
          target.style.background = "rgba(255, 255, 255, 0.03)";
          target.style.color = "var(--text-primary)";
        }
      }}
      onMouseOut={(e) => {
        if (disabled || loading) return;
        const target = e.currentTarget;
        target.style.transform = "translateY(0)";
        if (variant === "primary") {
          target.style.boxShadow = "0 4px 15px rgba(123, 44, 191, 0.3)";
        } else if (variant === "secondary") {
          target.style.background = "rgba(255, 255, 255, 0.04)";
          target.style.borderColor = "var(--border-color)";
        } else if (variant === "accent") {
          target.style.boxShadow = "0 4px 15px rgba(0, 245, 212, 0.2)";
        } else if (variant === "danger") {
          target.style.background = "rgba(239, 71, 111, 0.1)";
        } else if (variant === "ghost") {
          target.style.background = "transparent";
          target.style.color = "var(--text-secondary)";
        }
      }}
      onMouseDown={(e) => {
        if (disabled || loading) return;
        e.currentTarget.style.transform = "translateY(1px) scale(0.98)";
      }}
      onMouseUp={(e) => {
        if (disabled || loading) return;
        e.currentTarget.style.transform = "translateY(-1px) scale(1)";
      }}
    >
      {loading ? (
        <span 
          style={{
            width: "16px",
            height: "16px",
            border: `2px solid ${variant === "accent" ? "#07070a" : "#fff"}`,
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            display: "inline-block"
          }}
        />
      ) : (
        <>
          {icon && <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>}
          {children}
        </>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}
