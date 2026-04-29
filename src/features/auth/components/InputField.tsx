import React from "react";

interface Props {
  id: string;
  name: string;
  label: string;
  type: string;
  value: string;
  placeholder: string;
  error?: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rightSlot?: React.ReactNode;
}

export const InputField: React.FC<Props> = ({
  id, name, label, type, value,
  placeholder, error, required = false,
  onChange, rightSlot,
}) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label htmlFor={id} className="text-sm font-semibold text-[#0d1c2e]">
        {label}
      </label>
    )}
    <div className="relative flex items-center">
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        className={`w-full h-12 pl-3 ${rightSlot ? "pr-12" : "pr-3"}
          rounded-lg border text-base text-[#0d1c2e] placeholder-[#737686]
          bg-white transition-colors focus:outline-none focus:ring-1
          ${error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-[#c3c6d7] focus:border-[#004ac6] focus:ring-[#004ac6]"
          }`}
      />
      {rightSlot && (
        <div className="absolute right-3 flex items-center">{rightSlot}</div>
      )}
    </div>
    {error && <span className="text-xs text-red-600">{error}</span>}
  </div>
);