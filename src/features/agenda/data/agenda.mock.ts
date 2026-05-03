import type { Appointment, WeekDay } from "../types/agenda.types";

export const WEEK_DAYS: WeekDay[] = [
  { abbr: "LUN", number: 10 },
  { abbr: "MAR", number: 11 },
  { abbr: "MIÉ", number: 12, isToday: true },
  { abbr: "JUE", number: 13 },
  { abbr: "VIE", number: 14 },
  { abbr: "SÁB", number: 15, isWeekend: true },
  { abbr: "DOM", number: 16, isWeekend: true },
];

export const APPOINTMENTS: Appointment[] = [
  {
    id: "apt-1",
    patient: "Michael Chang",
    treatment: "Limpieza",
    startHour: 9,
    startMinute: 0,
    durationMinutes: 60,
    dayIndex: 2, // Miércoles
    variant: "primary",
    status: "Confirmada",
  },
  {
    id: "apt-2",
    patient: "Sarah Jenkins",
    treatment: "Revisión",
    startHour: 10,
    startMinute: 0,
    durationMinutes: 45,
    dayIndex: 1, // Martes
    variant: "secondary",
    status: "Pendiente",
  },
  {
    id: "apt-3",
    patient: "Emily Rodriguez",
    treatment: "Consulta Especialista",
    doctor: "Dra. Moore",
    startHour: 11,
    startMinute: 0,
    durationMinutes: 90,
    dayIndex: 3, // Jueves
    variant: "neutral",
    status: "Confirmada",
  },
  {
    id: "apt-4",
    patient: "Carlos Ruiz",
    treatment: "Urgencia - Dolor",
    startHour: 15,
    startMinute: 30,
    durationMinutes: 60,
    dayIndex: 4, // Viernes
    variant: "error",
    isUrgent: true,
    status: "Pendiente",
  },
  {
    id: "apt-5",
    patient: "Laura Martínez",
    treatment: "Ortodoncia",
    startHour: 14,
    startMinute: 0,
    durationMinutes: 60,
    dayIndex: 0, // Lunes
    variant: "primary",
    status: "Confirmada",
  },
  {
    id: "apt-6",
    patient: "Javier Soto",
    treatment: "Endodoncia",
    doctor: "Dr. García",
    startHour: 16,
    startMinute: 0,
    durationMinutes: 90,
    dayIndex: 2, // Miércoles
    variant: "secondary",
    status: "Cancelada",
  },
];


export const LUNCH_HOUR = 13;
