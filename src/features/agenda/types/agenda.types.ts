/* ── Agenda Feature Types ── */

export type ViewMode = "day" | "week" | "month";

export type AppointmentStatus = "Confirmada" | "Pendiente" | "Cancelada" | "Completada";

export type AppointmentVariant = "primary" | "secondary" | "error" | "neutral";

export interface Appointment {
  id: string;
  patientId?: string;
  patient: string;
  treatment: string;
  doctor?: string;
  /** Hour in 24h format (e.g. 9, 10, 15) */
  startHour: number;
  /** Minutes offset (0–59) */
  startMinute: number;
  /** Duration in minutes */
  durationMinutes: number;
  /** Day column index (0 = first day displayed) */
  dayIndex: number;
  variant: AppointmentVariant;
  isUrgent?: boolean;
  status?: AppointmentStatus;
}

export interface WeekDay {
  abbr: string;
  number: number;
  isToday?: boolean;
  isWeekend?: boolean;
}

export interface CalendarHeaderProps {
  monthYear: string;
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export interface CalendarGridProps {
  days: WeekDay[];
  appointments: Appointment[];
  startHour?: number;
  endHour?: number;
  onAppointmentMove?: (
    id: string,
    dayIndex: number,
    startHour: number,
    startMinute: number
  ) => void;
  onAppointmentClick?: (appointment: Appointment) => void;
}

export interface AppointmentBlockProps {
  appointment: Appointment;
  slotHeight: number;
  startHour: number;
  onClick?: (appointment: Appointment) => void;
}
