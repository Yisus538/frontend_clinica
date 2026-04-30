import type { SummaryCard, Patient, Appointment } from "../types/dashboard.types";

export const SUMMARY_CARDS: SummaryCard[] = [
  {
    id: "appointments",
    icon: "event",
    label: "Citas de Hoy",
    value: "14",
    badge: { text: "+2 Adiciones", variant: "default" },
    iconStyle: {
      background: "var(--color-primary-fixed)",
      color: "var(--color-primary-fixed-text)",
    },
  },
  {
    id: "patients",
    icon: "groups",
    label: "Total de Pacientes Activos",
    value: "1,204",
    badge: { text: "↑ 5% esta semana", variant: "success" },
    iconStyle: {
      background: "var(--color-secondary-light)",
      color: "var(--color-secondary-text)",
    },
  },
  {
    id: "payments",
    icon: "account_balance_wallet",
    label: "Pagos Pendientes",
    value: "$4,320",
    badge: { text: "Requiere Revisión", variant: "error" },
    iconStyle: {
      background: "var(--color-error-light)",
      color: "var(--color-error-container-text)",
    },
  },
];

export const RECENT_PATIENTS: Patient[] = [
  {
    id: "1",
    name: "Sarah Jenkins",
    treatment: "Prep. Endodoncia",
    status: "completed",
    date: "Hoy, 09:00 AM",
  },
  {
    id: "2",
    name: "Michael Chang",
    treatment: "Limpieza de Rutina",
    status: "registered",
    date: "Hoy, 10:30 AM",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    treatment: "Consulta Blanqueamiento",
    status: "upcoming",
    date: "Hoy, 01:00 PM",
  },
  {
    id: "4",
    name: "David Smith",
    treatment: "Ajuste de Corona",
    status: "upcoming",
    date: "Hoy, 03:15 PM",
  },
];

export const UPCOMING_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    time: "10:30",
    period: "AM",
    patient: "Michael Chang",
    treatment: "Limpieza de Rutina",
    icon: "dentistry",
    isActive: true,
  },
  {
    id: "2",
    time: "01:00",
    period: "PM",
    patient: "Emily Rodriguez",
    treatment: "Consulta Blanqueamiento",
    icon: "medication",
  },
  {
    id: "3",
    time: "03:15",
    period: "PM",
    patient: "David Smith",
    treatment: "Ajuste de Corona",
    icon: "healing",
  },
];
