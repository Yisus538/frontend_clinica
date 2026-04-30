import type { MetricCardData } from "../types/dashboard.types";

const BADGE_STYLES = {
  success: "bg-secondary-container text-on-secondary-container",
  warning: "bg-error-container text-on-error-container",
} as const;

export const MetricCard = ({ icon, iconBg, iconColor, label, value, badge }: MetricCardData) => {
  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-6 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-10">
        <div
          className="w-10 h-10 flex items-center justify-center rounded-lg"
          style={{ backgroundColor: `var(--color-${iconBg})`, color: `var(--color-${iconColor})` }}
        >
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-label-sm text-label-sm ${BADGE_STYLES[badge.variant]}`}
        >
          <span className="material-symbols-outlined text-[14px]">{badge.icon}</span>
          {badge.text}
        </span>
      </div>
      <div>
        <p className="font-label-md text-on-surface-variant mb-1">{label}</p>
        <p className="font-h1 text-h1 text-on-background">{value}</p>
      </div>
    </div>
  );
};
