import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightSlot?: React.ReactNode;
  leftSlot?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  rightSlot,
  leftSlot,
  id,
  className = "",
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1 w-full max-w-sm">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold" style={{ color: "var(--color-text-main)" }}>
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {leftSlot && (
          <div className="absolute left-3 flex items-center justify-center h-full" style={{ color: "var(--color-text-placeholder)" }}>
            {leftSlot}
          </div>
        )}
        <input
          id={id}
          style={{
            height: "var(--height-control)",
            borderRadius: "var(--radius-md)",
            borderColor: error ? "var(--color-error)" : "var(--color-border)",
            color: "var(--color-text-main)",
            fontFamily: "var(--font-base)",
          }}
          className={`
            w-full border bg-white text-base placeholder:text-[color:var(--color-text-placeholder)]
            transition-colors focus:outline-none focus:ring-1
            ${error ? "focus:border-[var(--color-error)] focus:ring-[var(--color-error)]"
              : "focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"}
            ${leftSlot ? "pl-12" : "pl-4"}
            ${rightSlot ? "pr-12" : "pr-4"}
            ${className}
          `}
          {...props}
        />
        {rightSlot && (
          <div className="absolute right-2 flex items-center justify-center h-full">
            {rightSlot}
          </div>
        )}
      </div>
      {error && (
        <span className="text-xs" style={{ color: "var(--color-error)" }}>
          {error}
        </span>
      )}
    </div>
  );
};