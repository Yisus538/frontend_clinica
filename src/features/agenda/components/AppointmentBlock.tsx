import type { AppointmentBlockProps, AppointmentStatus } from "../types/agenda.types";

/** Color maps per appointment variant (fallback when no status is set) */
const VARIANT_STYLES: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  primary: {
    bg: "bg-primary-container",
    text: "text-on-primary-container",
    border: "border-primary/20",
    dot: "bg-primary",
  },
  secondary: {
    bg: "bg-secondary-container",
    text: "text-on-secondary-container",
    border: "border-secondary/20",
    dot: "bg-secondary",
  },
  error: {
    bg: "bg-error-container",
    text: "text-on-error-container",
    border: "border-error/20",
    dot: "bg-error",
  },
  neutral: {
    bg: "bg-surface-variant",
    text: "text-on-surface",
    border: "border-outline-variant",
    dot: "bg-outline",
  },
};

/** Status overrides the variant — updated automatically when the edit modal saves */
const STATUS_STYLES: Record<
  AppointmentStatus,
  { bg: string; text: string; border: string; dot: string }
> = {
  Confirmada: {
    bg: "bg-secondary-container",
    text: "text-on-secondary-container",
    border: "border-secondary/20",
    dot: "bg-secondary",
  },
  Pendiente: {
    bg: "bg-primary-container",
    text: "text-on-primary-container",
    border: "border-primary/20",
    dot: "bg-primary",
  },
  Cancelada: {
    bg: "bg-surface-variant",
    text: "text-on-surface-variant",
    border: "border-outline-variant",
    dot: "bg-outline",
  },
  Completada: {
    bg: "bg-tertiary-container",
    text: "text-on-tertiary-container",
    border: "border-tertiary/20",
    dot: "bg-tertiary",
  },
};

export const AppointmentBlock = ({
  appointment,
  slotHeight,
  startHour,
  onClick,
}: AppointmentBlockProps) => {
  const {
    patient,
    treatment,
    doctor,
    startHour: aptStart,
    startMinute,
    durationMinutes,
    variant,
    isUrgent,
    status,
  } = appointment;

  /* Status takes visual priority over the static variant */
  const style = status
    ? STATUS_STYLES[status]
    : (VARIANT_STYLES[variant] ?? VARIANT_STYLES.neutral);

  /* Position & sizing */
  const topPx = ((aptStart - startHour) * 60 + startMinute) * (slotHeight / 60);
  const heightPx = durationMinutes * (slotHeight / 60);

  /* Format time label */
  const endTotalMin = aptStart * 60 + startMinute + durationMinutes;
  const endH = Math.floor(endTotalMin / 60);
  const endM = endTotalMin % 60;
  const fmt = (h: number, m: number) => `${h > 12 ? h - 12 : h}:${String(m).padStart(2, "0")}`;
  const timeLabel = `${fmt(aptStart, startMinute)} - ${fmt(endH, endM)}`;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", appointment.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(appointment);
      }}
      className={`absolute left-1 right-1 ${style.bg} ${style.text} rounded-md border ${style.border} p-2 overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer z-30`}
      style={{ top: topPx, height: heightPx }}
    >
      {/* Patient name row */}
      <div className="font-label-sm text-label-sm font-semibold truncate flex items-center gap-1">
        {isUrgent && (
          <span
            className="material-symbols-outlined text-[14px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            warning
          </span>
        )}
        <span className="truncate">{patient}</span>

        {/* Status dot — reflects changes from the edit modal instantly */}
        <span title={status} className={`ml-auto shrink-0 w-2 h-2 rounded-full ${style.dot}`} />
      </div>

      <div className="font-caption text-caption opacity-90 truncate mt-0.5">{treatment}</div>

      {heightPx >= 60 && (
        <div className="font-caption text-caption opacity-75 mt-1 text-[10px]">{timeLabel}</div>
      )}

      {doctor && heightPx >= 80 && (
        <div className="mt-1.5 inline-flex items-center gap-1 bg-surface-container px-1.5 py-0.5 rounded text-[10px] text-on-surface-variant font-medium">
          <span className="material-symbols-outlined text-[12px]">medical_services</span>
          {doctor}
        </div>
      )}
    </div>
  );
};
