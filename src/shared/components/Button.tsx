import type { ButtonProps } from "../types/button.type";

const VARIANTS = {
  primary: {
    background: "var(--color-primary)",
    color: "#fff",
    border: "transparent",
    hoverBg: "var(--color-primary-hover)",
  },
  outline: {
    background: "transparent",
    color: "var(--color-primary)",
    border: "var(--color-primary)",
    hoverBg: "var(--color-primary-light)",
  },
  ghost: {
    background: "transparent",
    color: "var(--color-text-main)",
    border: "transparent",
    hoverBg: "var(--color-surface)",
  },
};

export const Button = ({
  children,
  isLoading = false,
  loadingLabel = "Cargando...",
  variant = "primary",
  fullWidth = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) => {
  const v = VARIANTS[variant];

  return (
    <button
      disabled={disabled || isLoading}
      style={{
        height: "var(--height-control)",
        borderRadius: "var(--radius-md)",
        background: v.background,
        color: v.color,
        border: `1px solid ${v.border}`,
        fontFamily: "var(--font-base)",
      }}
      className={`
        flex items-center justify-center gap-2
        px-5 text-sm font-semibold tracking-wide
        transition-colors cursor-pointer
        disabled:opacity-60 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--color-primary)
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {isLoading && (
        <span className="material-symbols-outlined text-lg animate-spin">
          progress_activity
        </span>
      )}
      {isLoading ? loadingLabel : children}
    </button>
  );
};