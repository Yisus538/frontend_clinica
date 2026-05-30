import type { FinanceMetric } from "../types/finances.types";

export const FinanceMetricCard = ({
  label,
  value,
  icon,
  iconColorClass,
  trend,
  isHighlighted,
}: FinanceMetric) => {
  return (
    <div
      className={`bg-surface-container-lowest rounded-lg border border-outline-variant p-6 flex flex-col justify-between h-32 hover:shadow-[0px_4px_20px_rgba(37,99,235,0.08)] transition-shadow ${
        isHighlighted
          ? "bg-gradient-to-br from-surface-container-lowest to-surface-container-low"
          : ""
      }`}
    >
      <div className="flex justify-between items-start">
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
          {label}
        </span>
        <span className={`material-symbols-outlined ${iconColorClass}`}>{icon}</span>
      </div>
      <div className="flex items-end justify-between">
        <span
          className={`font-h2 text-h2 ${
            isHighlighted ? "text-primary font-bold" : "text-on-surface"
          }`}
        >
          {value}
        </span>
        {trend && (
          <span
            className={`font-caption text-caption flex items-center px-2 py-1 rounded-full ${trend.colorClass} ${trend.bgClass}`}
          >
            <span className="material-symbols-outlined text-[14px] mr-1">{trend.icon}</span>
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
};
