import React from "react";

interface Props {
  isLoading: boolean;
  label?: string;
  loadingLabel?: string;
}

export const SubmitButton: React.FC<Props> = ({
  isLoading,
  label = "Iniciar Sesión",
  loadingLabel = "Iniciando...",
}) => (
  <button
    type="submit"
    disabled={isLoading}
    className="w-full h-12 mt-6 bg-[#004ac6] text-white rounded-lg text-sm font-semibold
      hover:bg-[#003ea8] disabled:opacity-60 disabled:cursor-not-allowed
      transition-colors flex items-center justify-center gap-2
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#004ac6]"
  >
    {isLoading && (
      <span className="material-symbols-outlined text-lg animate-spin">
        progress_activity
      </span>
    )}
    {isLoading ? loadingLabel : label}
  </button>
);