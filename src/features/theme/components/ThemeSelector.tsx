import { useTheme, type Theme } from "../context/ThemeContext";
import { settingsApi } from "../../settings/api/settings.api";

const OPTIONS: { value: Theme; label: string; icon: string }[] = [
  { value: "light", label: "Claro", icon: "light_mode" },
  { value: "dark", label: "Oscuro", icon: "dark_mode" },
  { value: "auto", label: "Automático", icon: "computer" },
];

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  const handleChange = (next: Theme) => {
    setTheme(next);
    settingsApi.updateProfile({ theme: next }).catch(() => {});
  };

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-container border border-outline-variant w-fit">
      {OPTIONS.map((opt) => {
        const active = theme === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => handleChange(opt.value)}
            aria-pressed={active}
            title={opt.label}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-label-sm text-label-sm transition-all cursor-pointer ${
              active
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
            }`}
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {opt.icon}
            </span>
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
