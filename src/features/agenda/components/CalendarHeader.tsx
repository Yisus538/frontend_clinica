import type { ViewMode } from "../types/agenda.types";
import { Link } from "react-router";

interface CalendarHeaderProps {
  monthYear: string;
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

const VIEW_OPTIONS: { key: ViewMode; label: string }[] = [
  { key: "day", label: "Día" },
  { key: "week", label: "Semana" },
  { key: "month", label: "Mes" },
];

export const CalendarHeader = ({
  monthYear,
  viewMode,
  onViewChange,
  onPrev,
  onNext,
  onToday,
}: CalendarHeaderProps) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
    {/* Left — Month & Navigation */}
    <div className="flex items-center gap-4">
      <h1 className="font-h2 text-h2 text-on-surface">{monthYear}</h1>

      <div className="flex items-center gap-1 bg-surface-container-lowest border border-outline-variant rounded-lg p-1">
        <button
          onClick={onPrev}
          className="p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer"
          aria-label="Anterior"
        >
          <span className="material-symbols-outlined text-sm">chevron_left</span>
        </button>

        <button
          onClick={onToday}
          className="px-3 py-1.5 rounded-md text-sm font-medium hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer"
        >
          Hoy
        </button>

        <button
          onClick={onNext}
          className="p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer"
          aria-label="Siguiente"
        >
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
    </div>

    {/* Right — View Toggle + New Appointment */}
    <div className="flex items-center gap-4 w-full sm:w-auto">
      <div className="flex bg-surface-container-lowest border border-outline-variant rounded-lg p-1 w-full sm:w-auto">
        {VIEW_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onViewChange(opt.key)}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              viewMode === opt.key
                ? "bg-primary-container text-on-primary-container shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <Link 
        to="/dashboard/agenda/nueva-cita"
        className="hidden sm:flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-on-primary px-5 py-2.5 rounded-lg font-label-md transition-colors shadow-sm whitespace-nowrap cursor-pointer"
      >
        <span
          className="material-symbols-outlined text-sm"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          add
        </span>
        Nueva Cita
      </Link>
    </div>
  </div>
);
