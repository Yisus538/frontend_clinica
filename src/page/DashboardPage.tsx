import { useState, useEffect } from "react";
import { MetricCard } from "../features/dashboard/components/MetricCard";
import { PatientTable } from "../features/dashboard/components/PatientTable";
import { AgendaPanel } from "../features/dashboard/components/AgendaPanel";
import { patientsApi, type ApiPatient } from "../features/patients/api/patients.api";
import { appointmentsApi, type ApiAppointment } from "../features/agenda/api/appointments.api";
import { financesApi, getPaidAmount, type ApiInvoice } from "../features/finances/api/finances.api";
import { useAuth } from "../features/auth/context/AuthContext";
import { useProfile } from "../features/settings/context/ProfileContext";
import type {
  PatientRow,
  AgendaItemData,
  MetricCardData,
} from "../features/dashboard/types/dashboard.types";

/* ── Helpers (outside component to avoid react-hooks/static-components) ── */

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "¡Trasnochador/a";
  if (hour < 12) return "Buenos Días";
  if (hour < 18) return "Buenas Tardes";
  return "Buenas Noches";
}

function getFormattedDate(): string {
  return new Date()
    .toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .replace(/^\w/, (c) => c.toUpperCase());
}

const PATIENT_STATUS_ROW: Record<ApiPatient["status"], PatientRow["status"]> = {
  active: "Planeado",
  in_treatment: "En progreso",
  inactive: "Pendiente",
};

function toPatientRow(p: ApiPatient): PatientRow {
  return {
    id: p.id.slice(-4),
    initials: `${p.firstName[0] ?? ""}${p.lastName[0] ?? ""}`.toUpperCase(),
    name: `${p.firstName} ${p.lastName}`,
    treatment: "—",
    status: PATIENT_STATUS_ROW[p.status],
    lastVisit: new Date(p.updatedAt).toLocaleDateString("es-AR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  };
}

function toAgendaItem(a: ApiAppointment): AgendaItemData {
  const start = new Date(a.scheduledAt);
  const end = new Date(start.getTime() + a.durationMinutes * 60_000);
  const fmt = (d: Date) => d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
  const patientName = a.patient ? `${a.patient.firstName} ${a.patient.lastName}` : a.patientId;
  return {
    time: `${fmt(start)} - ${fmt(end)}`,
    title: a.notes ?? "Consulta",
    patient: patientName,
    accentColor: a.status === "confirmed" || a.status === "in_progress" ? "secondary" : "primary",
  };
}

function isToday(isoDate: string): boolean {
  const d = new Date(isoDate);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function buildMetrics(
  todayCount: number,
  activeCount: number,
  pendingTotal: number
): MetricCardData[] {
  return [
    {
      icon: "event",
      iconBg: "primary-fixed",
      iconColor: "on-primary-fixed",
      label: "Citas de Hoy",
      value: String(todayCount),
      badge: { text: "hoy", icon: "today", variant: "success" },
    },
    {
      icon: "group",
      iconBg: "surface-variant",
      iconColor: "on-surface-variant",
      label: "Pacientes Activos",
      value: String(activeCount),
      badge: { text: "activos", icon: "check_circle", variant: "success" },
    },
    {
      icon: "account_balance_wallet",
      iconBg: "error-container",
      iconColor: "on-error-container",
      label: "Pagos Pendientes",
      value: `$${pendingTotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
      badge: {
        text: pendingTotal > 0 ? "Atención" : "Al día",
        icon: pendingTotal > 0 ? "warning" : "check",
        variant: pendingTotal > 0 ? "warning" : "success",
      },
    },
  ];
}

/* ── Page Component ── */

export const DashboardPage = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [patients, setPatients] = useState<ApiPatient[]>([]);
  const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
  const [invoices, setInvoices] = useState<ApiInvoice[]>([]);

  useEffect(() => {
    patientsApi
      .findAll()
      .then(setPatients)
      .catch(() => setPatients([]));
    appointmentsApi
      .findAll()
      .then(setAppointments)
      .catch(() => setAppointments([]));
    financesApi
      .findAllInvoices()
      .then(setInvoices)
      .catch(() => setInvoices([]));
  }, []);

  const greeting = getGreeting();
  const today = getFormattedDate();
  const doctorName = profile?.nickname || (user ? user.firstName : "Doctor/a");

  const todayAppointments = appointments.filter((a) => isToday(a.scheduledAt));
  const activePatients = patients.filter(
    (p) => p.status === "active" || p.status === "in_treatment"
  );
  const pendingTotal = invoices
    .filter(
      (inv) =>
        inv.status === "issued" || inv.status === "partially_paid" || inv.status === "overdue"
    )
    .reduce((sum, inv) => sum + Math.max(0, Number(inv.total) - getPaidAmount(inv)), 0);

  const metrics = buildMetrics(todayAppointments.length, activePatients.length, pendingTotal);
  const recentPatients = patients.slice(0, 5).map(toPatientRow);
  const agendaItems = todayAppointments
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 6)
    .map(toAgendaItem);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
      {/* ── Left Column ── */}
      <div className="md:col-span-8 flex flex-col gap-10">
        {/* Header */}
        <section>
          <h1 className="font-h1 text-h1 text-on-surface mb-1">
            {greeting}, {doctorName}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">{today}</p>
        </section>

        {/* Metrics */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </section>

        {/* Patients Table */}
        <PatientTable patients={recentPatients} />
      </div>

      {/* ── Right Column ── */}
      <div className="md:col-span-4">
        <AgendaPanel items={agendaItems} />
      </div>
    </div>
  );
};
