import type { AgendaItemData, MetricCardData, PatientRow } from "../types/dashboard.types";

export const METRICS: MetricCardData[] = [
  {
    icon: "event",
    iconBg: "primary-fixed",
    iconColor: "on-primary-fixed",
    label: "Citas de Hoy",
    value: "14",
    badge: { text: "+2%", icon: "trending_up", variant: "success" },
  },
  {
    icon: "group",
    iconBg: "surface-variant",
    iconColor: "on-surface-variant",
    label: "Pacientes Activos",
    value: "1,204",
    badge: { text: "+5%", icon: "trending_up", variant: "success" },
  },
  {
    icon: "account_balance_wallet",
    iconBg: "error-container",
    iconColor: "on-error-container",
    label: "Pagos Pendientes",
    value: "$3.450",
    badge: { text: "Atención", icon: "warning", variant: "warning" },
  },
];

export const PATIENTS: PatientRow[] = [
  {
    id: "4892",
    initials: "CR",
    name: "Carlos Ramírez",
    treatment: "Implante Dental",
    status: "Planeado",
    lastVisit: "12 Oct 2024",
  },
  {
    id: "5103",
    initials: "LM",
    name: "Laura Martínez",
    treatment: "Limpieza Profunda",
    status: "Completado",
    lastVisit: "20 Oct 2024",
  },
  {
    id: "3291",
    initials: "JS",
    name: "Javier Soto",
    treatment: "Endodoncia",
    status: "Pendiente",
    lastVisit: "05 Sep 2024",
  },
  {
    id: "6722",
    initials: "AG",
    name: "Ana Gómez",
    treatment: "Blanqueamiento",
    status: "Completado",
    lastVisit: "22 Oct 2024",
  },
];

export const AGENDA: AgendaItemData[] = [  {
    time: "09:00 AM - 10:00 AM",
    title: "Consulta Inicial",
    patient: "Miguel Ángel Torres",
    accentColor: "primary",
  },
  {
    time: "10:30 AM - 11:15 AM",
    title: "Blanqueamiento Dental",
    patient: "Sofía Vergara",
    accentColor: "primary",
  },
  {
    time: "12:00 PM - 01:30 PM",
    title: "Extracción Molar",
    patient: "Roberto Silva",
    accentColor: "secondary",
  },
  {
    time: "03:00 PM - 04:00 PM",
    title: "Revisión de Ortodoncia",
    patient: "Valentina López",
    accentColor: "primary",
  },
];
