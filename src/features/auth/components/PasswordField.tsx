import React from "react";
import { InputField } from "./InputField";

interface Props {
  name: string;
  value: string;
  showPassword: boolean;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggle: () => void;
}

export const PasswordField: React.FC<Props> = ({
  name, value, showPassword, error, onChange, onToggle,
}) => (
  <div className="flex flex-col gap-1">
    <div className="flex justify-between items-center">
      <label htmlFor={name} className="text-sm font-semibold text-[#0d1c2e]">
        Contraseña
      </label>
      <a href="#" className="text-xs text-[#004ac6] hover:underline hover:text-[#003ea8] transition-colors">        
        ¿Olvidaste tu contraseña?
      </a>
    </div>
    <InputField
      id={name}
      name={name}
      label=""
      type={showPassword ? "text" : "password"}
      value={value}
      placeholder="••••••••"
      error={error}
      required
      onChange={onChange}
      rightSlot={
        <button
          type="button"
          onClick={onToggle}
          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="text-[#737686] hover:text-[#0d1c2e] transition-colors focus:outline-none"
        >
          <span className="material-symbols-outlined text-[22px]">
            {showPassword ? "visibility" : "visibility_off"}
          </span>
        </button>
      }
    />
  </div>
);