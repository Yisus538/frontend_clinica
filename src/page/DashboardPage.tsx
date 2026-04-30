import { MetricCard } from "../features/dashboard/components/MetricCard";
import { PatientTable } from "../features/dashboard/components/PatientTable";
import { AgendaPanel } from "../features/dashboard/components/AgendaPanel";
import type {
  MetricCardData,
  PatientRow,
  AgendaItemData,
} from "../features/dashboard/types/dashboard.types";

/* ── Static Data (will be replaced by API calls) ── */

const METRICS: MetricCardData[] = [
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

const PATIENTS: PatientRow[] = [
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

const AGENDA: AgendaItemData[] = [
  {
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

/* ── Helpers ── */

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos Días";
  if (hour < 18) return "Buenas Tardes";
  return "Buenas Noches";
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).replace(/^\w/, (c) => c.toUpperCase());
}

/* ── Page Component ── */

export const DashboardPage = () => {
  const greeting = getGreeting();
  const today = getFormattedDate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
      {/* ── Left Column ── */}
      <div className="md:col-span-8 flex flex-col gap-10">
        {/* Header */}
        <section>
          <h1 className="font-h1 text-h1 text-on-surface mb-1">
            {greeting}, Dra. Moore
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">{today}</p>
        </section>

        {/* Metrics */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {METRICS.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </section>

        {/* Patients Table */}
        <PatientTable patients={PATIENTS} />
      </div>

      {/* ── Right Column ── */}
      <div className="md:col-span-4">
        <AgendaPanel items={AGENDA} />
      </div>
    </div>
  );
};
