import { MetricCard } from "../features/dashboard/components/MetricCard";
import { PatientTable } from "../features/dashboard/components/PatientTable";
import { AgendaPanel } from "../features/dashboard/components/AgendaPanel";
import { METRICS, PATIENTS, AGENDA } from "../features/dashboard/data/dashboard.mock";

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
