import { DashboardLayout } from "../shared/layout/DashboardLayout";
import {
  SUMMARY_CARDS,
  RECENT_PATIENTS,
  UPCOMING_APPOINTMENTS,
} from "../features/dashboard/data/dashboard.data";
import type {
  AppointmentStatus,
  SummaryCard,
  Patient,
  Appointment,
} from "../features/dashboard/types/dashboard.types";

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; bg: string; color: string }
> = {
  completed: {
    label: "Completado",
    bg: "var(--color-secondary-light)",
    color: "var(--color-secondary-text)",
  },
  registered: {
    label: "Registrado",
    bg: "var(--color-surface-container-high)",
    color: "var(--color-text-main)",
  },
  upcoming: {
    label: "Próximo",
    bg: "var(--color-primary-border)",
    color: "var(--color-text-muted)",
  },
};

const StatusBadge = ({ status }: { status: AppointmentStatus }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
};

// ─── Summary Card ─────────────────────────────────────────────────────────────

const SummaryCardItem = ({ card }: { card: SummaryCard }) => {
  const badgeColor =
    card.badge.variant === "success"
      ? "var(--color-secondary)"
      : card.badge.variant === "error"
        ? "var(--color-error)"
        : "var(--color-text-muted)";

  return (
    <div
      className="flex flex-col justify-between p-6 rounded-lg border transition-shadow hover:shadow-[0_4px_20px_rgba(0,74,198,0.08)]"
      style={{
        background: "var(--color-white)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <div
          className="p-3 rounded"
          style={card.iconStyle}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {card.icon}
          </span>
        </div>
        <span
          className="text-xs font-medium"
          style={{ color: badgeColor }}
        >
          {card.badge.text}
        </span>
      </div>
      <div>
        <p
          className="text-sm mb-1"
          style={{ color: "var(--color-text-muted)" }}
        >
          {card.label}
        </p>
        <p
          className="text-4xl font-bold tracking-tight"
          style={{ color: "var(--color-text-main)" }}
        >
          {card.value}
        </p>
      </div>
    </div>
  );
};

// ─── Patients Table ───────────────────────────────────────────────────────────

const PatientsTable = ({ patients }: { patients: Patient[] }) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2
        className="text-2xl font-semibold"
        style={{ color: "var(--color-text-main)" }}
      >
        Pacientes Recientes
      </h2>
      <button
        type="button"
        className="text-sm font-semibold hover:underline transition-colors"
        style={{ color: "var(--color-primary)" }}
      >
        Ver Todos
      </button>
    </div>

    <div
      className="rounded-lg border overflow-hidden"
      style={{
        background: "var(--color-white)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr
              style={{
                background: "var(--color-primary-light)",
                borderBottom: `1px solid var(--color-border)`,
              }}
            >
              {["Nombre del Paciente", "Tratamiento", "Estado", "Fecha"].map(
                (h) => (
                  <th
                    key={h}
                    className="py-3 px-6 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {patients.map((p, i) => (
              <tr
                key={p.id}
                className="transition-colors hover:bg-[var(--color-primary-light)] cursor-pointer group"
                style={{
                  borderBottom:
                    i < patients.length - 1
                      ? `1px solid var(--color-border)`
                      : undefined,
                }}
              >
                <td
                  className="py-3 px-6 text-sm font-semibold group-hover:text-[var(--color-primary)] transition-colors"
                  style={{ color: "var(--color-text-main)" }}
                >
                  {p.name}
                </td>
                <td
                  className="py-3 px-6 text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {p.treatment}
                </td>
                <td className="py-3 px-6">
                  <StatusBadge status={p.status} />
                </td>
                <td
                  className="py-3 px-6 text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {p.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ─── Appointments Timeline ────────────────────────────────────────────────────

const AppointmentItem = ({ appt }: { appt: Appointment }) => {
  if (appt.isActive) {
    return (
      <div
        className="flex gap-3 p-3 rounded-lg border"
        style={{
          background: "var(--color-primary-fixed)",
          borderColor: "var(--color-primary-fixed-dim)",
        }}
      >
        <div className="flex flex-col items-center min-w-[56px]">
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--color-primary-fixed-text)" }}
          >
            {appt.time}
          </span>
          <span className="text-xs" style={{ color: "var(--color-primary)" }}>
            {appt.period}
          </span>
        </div>
        <div
          className="border-l-2 pl-3 flex-1"
          style={{ borderColor: "var(--color-primary)" }}
        >
          <p
            className="text-sm font-semibold mb-0.5"
            style={{ color: "var(--color-primary-fixed-text)" }}
          >
            {appt.patient}
          </p>
          <p
            className="text-xs flex items-center gap-0.5"
            style={{ color: "var(--color-primary)" }}
          >
            <span
              className="material-symbols-outlined text-sm"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              {appt.icon}
            </span>
            {appt.treatment}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 p-3 rounded-lg border border-transparent hover:bg-[var(--color-primary-light)] transition-colors cursor-pointer">
      <div className="flex flex-col items-center min-w-[56px]">
        <span
          className="text-sm font-semibold"
          style={{ color: "var(--color-text-main)" }}
        >
          {appt.time}
        </span>
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          {appt.period}
        </span>
      </div>
      <div
        className="border-l-2 pl-3 flex-1"
        style={{ borderColor: "var(--color-border)" }}
      >
        <p
          className="text-sm font-semibold mb-0.5"
          style={{ color: "var(--color-text-main)" }}
        >
          {appt.patient}
        </p>
        <p
          className="text-xs flex items-center gap-0.5"
          style={{ color: "var(--color-text-muted)" }}
        >
          <span
            className="material-symbols-outlined text-sm"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            {appt.icon}
          </span>
          {appt.treatment}
        </p>
      </div>
    </div>
  );
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export const DashboardPage = () => (
  <DashboardLayout>
    {/* Saludo */}
    <div className="mb-10">
      <h1
        className="text-4xl font-bold tracking-tight mb-1"
        style={{ color: "var(--color-text-main)" }}
      >
        Buenos Días, Dra. Moore
      </h1>
      <p className="text-base" style={{ color: "var(--color-text-muted)" }}>
        Aquí está su resumen clínico para hoy.
      </p>
    </div>

    {/* Cards de resumen */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      {SUMMARY_CARDS.map((card) => (
        <SummaryCardItem key={card.id} card={card} />
      ))}
    </div>

    {/* Sección inferior */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-16">
      {/* Tabla de pacientes */}
      <div className="lg:col-span-2">
        <PatientsTable patients={RECENT_PATIENTS} />
      </div>

      {/* Timeline de citas */}
      <div className="lg:col-span-1">
        <h2
          className="text-2xl font-semibold mb-6"
          style={{ color: "var(--color-text-main)" }}
        >
          Próximos
        </h2>

        <div
          className="rounded-lg border p-3 flex flex-col gap-3"
          style={{
            background: "var(--color-white)",
            borderColor: "var(--color-border)",
          }}
        >
          {UPCOMING_APPOINTMENTS.map((appt) => (
            <AppointmentItem key={appt.id} appt={appt} />
          ))}

          <button
            type="button"
            className="mt-1 w-full py-3 text-sm font-semibold rounded border transition-colors hover:bg-[var(--color-primary-light)]"
            style={{
              color: "var(--color-primary)",
              borderColor: "var(--color-border)",
            }}
          >
            Abrir Agenda Completa
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
);
