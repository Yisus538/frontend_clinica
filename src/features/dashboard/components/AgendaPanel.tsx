import type { AgendaItemData } from "../types/dashboard.types";

const ACCENT_COLORS = {
  primary: {
    border: "border-l-primary",
    text: "text-primary",
  },
  secondary: {
    border: "border-l-secondary",
    text: "text-secondary",
  },
} as const;

interface AgendaPanelProps {
  items: AgendaItemData[];
}

export const AgendaPanel = ({ items }: AgendaPanelProps) => {
  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-outline-variant pb-3">
        <h2 className="font-h3 text-h3 text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">today</span>
          Agenda de Hoy
        </h2>
        <button
          id="btn-agenda-more"
          className="p-1 rounded hover:bg-surface transition-colors cursor-pointer"
          aria-label="Más opciones"
        >
          <span className="material-symbols-outlined text-on-surface-variant">more_horiz</span>
        </button>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-4 overflow-y-auto pr-2 flex-1">
        {items.map((item, idx) => {
          const accent = ACCENT_COLORS[item.accentColor ?? "primary"];
          return (
            <div
              key={idx}
              className={`bg-surface border border-outline-variant border-l-4 ${accent.border} rounded p-3 flex flex-col gap-1`}
            >
              <div className={`font-label-sm text-label-sm ${accent.text} font-semibold`}>
                {item.time}
              </div>
              <div className="font-label-md text-label-md text-on-surface">{item.title}</div>
              <div className="font-caption text-caption text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">person</span>
                {item.patient}
              </div>
            </div>
          );
        })}

        {/* Break */}
        <div className="border border-dashed border-outline-variant rounded p-3 flex items-center justify-center bg-surface-bright opacity-70">
          <span className="font-caption text-caption text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">coffee</span>
            Descanso / Administrativo
          </span>
        </div>
      </div>

      {/* New Appointment */}
      <button
        id="btn-new-appointment"
        className="mt-6 w-full bg-primary text-on-primary font-label-md text-label-md h-[40px] rounded flex items-center justify-center gap-2 hover:bg-on-primary-fixed-variant transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        Nueva Cita
      </button>
    </section>
  );
};
