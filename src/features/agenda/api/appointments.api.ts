import { apiClient } from "../../../shared/api/client";
import type { Appointment, AppointmentStatus, AppointmentVariant } from "../types/agenda.types";

export type BackendStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export interface ApiPatientRef {
  id: string;
  firstName: string;
  lastName: string;
}

export interface ApiDentistRef {
  id: string;
  user?: { firstName: string; lastName: string };
}

export interface ApiAppointment {
  id: string;
  patientId: string;
  dentistId: string;
  scheduledAt: string;
  durationMinutes: number;
  status: BackendStatus;
  isUrgent: boolean;
  notes: string | null;
  patient?: ApiPatientRef;
  dentist?: ApiDentistRef;
}

export interface CreateAppointmentDto {
  patientId: string;
  dentistId: string;
  scheduledAt: string;
  durationMinutes: number;
  status: BackendStatus;
  isUrgent?: boolean;
  notes?: string;
}

const STATUS_MAP: Record<BackendStatus, AppointmentStatus> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  in_progress: "Confirmada",
  completed: "Completada",
  cancelled: "Cancelada",
  no_show: "Cancelada",
};

export const REVERSE_STATUS_MAP: Record<AppointmentStatus, BackendStatus> = {
  Pendiente: "pending",
  Confirmada: "confirmed",
  Completada: "completed",
  Cancelada: "cancelled",
};

const VARIANT_MAP: Record<BackendStatus, AppointmentVariant> = {
  pending: "primary",
  confirmed: "secondary",
  in_progress: "secondary",
  completed: "neutral",
  cancelled: "error",
  no_show: "error",
};

export function toAppointment(a: ApiAppointment, weekStart: Date): Appointment {
  const date = new Date(a.scheduledAt);

  const mondayMs = weekStart.getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.floor((date.getTime() - mondayMs) / dayMs);
  const dayIndex = Math.max(0, Math.min(6, diffDays));

  const patientName = a.patient ? `${a.patient.firstName} ${a.patient.lastName}` : a.patientId;

  const dentistName = a.dentist?.user
    ? `Dr/a. ${a.dentist.user.firstName} ${a.dentist.user.lastName}`
    : undefined;

  return {
    id: a.id,
    patientId: a.patientId,
    patient: patientName,
    treatment: a.notes ?? "Consulta",
    doctor: dentistName,
    startHour: date.getHours(),
    startMinute: date.getMinutes(),
    durationMinutes: a.durationMinutes,
    dayIndex,
    variant: VARIANT_MAP[a.status],
    isUrgent: a.isUrgent,
    status: STATUS_MAP[a.status],
  };
}

export const appointmentsApi = {
  findAll: () => apiClient.get<ApiAppointment[]>("/appointments"),
  findOne: (id: string) => apiClient.get<ApiAppointment>(`/appointments/${id}`),
  findByPatient: (patientId: string) =>
    apiClient.get<ApiAppointment[]>(`/appointments/patient/${patientId}`),
  create: (dto: CreateAppointmentDto) => apiClient.post<ApiAppointment>("/appointments", dto),
  update: (id: string, dto: Partial<CreateAppointmentDto>) =>
    apiClient.patch<ApiAppointment>(`/appointments/${id}`, dto),
  remove: (id: string) => apiClient.delete(`/appointments/${id}`),
};
