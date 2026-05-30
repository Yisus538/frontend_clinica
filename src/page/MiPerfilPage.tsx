import { useState, useEffect } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import {
  dentistsApi,
  type ApiDentist,
  type DayOfWeek,
} from "../features/dentists/api/dentists.api";

const DAYS: { key: DayOfWeek; label: string }[] = [
  { key: "monday", label: "Lunes" },
  { key: "tuesday", label: "Martes" },
  { key: "wednesday", label: "Miércoles" },
  { key: "thursday", label: "Jueves" },
  { key: "friday", label: "Viernes" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" },
];

const DEFAULT_START = "08:00";
const DEFAULT_END = "17:00";

interface DayRow {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

type ScheduleState = Record<DayOfWeek, DayRow>;

function buildInitialSchedule(availabilities: ApiDentist["availabilities"]): ScheduleState {
  const base = Object.fromEntries(
    DAYS.map(({ key }) => [key, { enabled: false, startTime: DEFAULT_START, endTime: DEFAULT_END }])
  ) as ScheduleState;

  for (const av of availabilities) {
    base[av.dayOfWeek] = {
      enabled: av.isActive,
      startTime: av.startTime.slice(0, 5),
      endTime: av.endTime.slice(0, 5),
    };
  }
  return base;
}

export const MiPerfilPage = () => {
  const [dentist, setDentist] = useState<ApiDentist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [schedule, setSchedule] = useState<ScheduleState | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dentistsApi
      .getMe()
      .then((d) => {
        setDentist(d);
        setSchedule(buildInitialSchedule(d.availabilities));
      })
      .catch(() => toast.error("No se pudo cargar el perfil"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleToggleDay = (day: DayOfWeek) => {
    setSchedule((prev) =>
      prev ? { ...prev, [day]: { ...prev[day], enabled: !prev[day].enabled } } : prev
    );
  };

  const handleTimeChange = (day: DayOfWeek, field: "startTime" | "endTime", value: string) => {
    setSchedule((prev) => (prev ? { ...prev, [day]: { ...prev[day], [field]: value } } : prev));
  };

  const handleSave = async () => {
    if (!dentist || !schedule) return;

    const enabledDays = DAYS.filter(({ key }) => schedule[key].enabled);
    for (const { key, label } of enabledDays) {
      const { startTime, endTime } = schedule[key];
      if (startTime >= endTime) {
        toast.error(`${label}: el horario de inicio debe ser antes del de fin`);
        return;
      }
    }

    setIsSaving(true);
    try {
      await dentistsApi.setAvailability(
        dentist.id,
        enabledDays.map(({ key }) => ({
          dayOfWeek: key,
          startTime: schedule[key].startTime,
          endTime: schedule[key].endTime,
          isActive: true,
        }))
      );
      toast.success("Disponibilidad guardada");
    } catch {
      toast.error("No se pudo guardar la disponibilidad");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">
          progress_activity
        </span>
      </div>
    );
  }

  if (!dentist || !schedule) {
    return (
      <div className="flex flex-col items-center py-16 gap-3">
        <span className="material-symbols-outlined text-error text-5xl">error</span>
        <p className="text-on-surface-variant">No se pudo cargar el perfil del odontólogo.</p>
      </div>
    );
  }

  const fullName = `${dentist.user.firstName} ${dentist.user.lastName}`.trim();
  const initials =
    `${dentist.user.firstName[0] ?? ""}${dentist.user.lastName[0] ?? ""}`.toUpperCase();
  const enabledCount = DAYS.filter(({ key }) => schedule[key].enabled).length;

  return (
    <div className="flex-1 w-full mx-auto pb-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-h1 text-h1 text-on-surface">Mi Perfil</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Información personal y disponibilidad horaria
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Profile card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-outline-variant">
            <h2 className="font-h3 text-h3 text-on-surface">Datos personales</h2>
            <Link
              to="/dashboard/configuracion"
              className="h-9 px-3 rounded-lg border border-outline-variant text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1.5 hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              Editar
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="shrink-0">
              {dentist.user.avatarUrl ? (
                <img
                  src={dentist.user.avatarUrl}
                  alt={fullName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-surface-container"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary text-on-primary flex items-center justify-center text-2xl font-bold border-2 border-surface-container">
                  {initials}
                </div>
              )}
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 flex-1">
              <div className="flex flex-col gap-0.5">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Nombre completo
                </span>
                <span className="font-body-md text-body-md text-on-surface">{fullName}</span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Correo electrónico
                </span>
                <span className="font-body-md text-body-md text-on-surface">
                  {dentist.user.email}
                </span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Matrícula
                </span>
                <span className="font-body-md text-body-md text-on-surface">
                  {dentist.licenseNumber ? `MP-${dentist.licenseNumber}` : "—"}
                </span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Especialidad
                </span>
                <span className="font-body-md text-body-md text-on-surface">
                  {dentist.specialty ?? "—"}
                </span>
              </div>

              {dentist.bio && (
                <div className="flex flex-col gap-0.5 sm:col-span-2">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Biografía
                  </span>
                  <span className="font-body-md text-body-md text-on-surface">{dentist.bio}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Availability editor */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2 pb-4 border-b border-outline-variant">
            <div>
              <h2 className="font-h3 text-h3 text-on-surface">Disponibilidad horaria</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Días y horarios en los que atendés pacientes
              </p>
            </div>
            {enabledCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
                {enabledCount} día{enabledCount !== 1 ? "s" : ""} activo
                {enabledCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 mt-4">
            {DAYS.map(({ key, label }) => {
              const row = schedule[key];
              return (
                <div
                  key={key}
                  className={`flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
                    row.enabled
                      ? "bg-surface-container border-primary/30"
                      : "bg-surface-container-lowest border-outline-variant opacity-60"
                  }`}
                >
                  {/* Toggle + Day label */}
                  <div className="flex items-center gap-3 sm:w-32 shrink-0">
                    <button
                      role="switch"
                      aria-checked={row.enabled}
                      onClick={() => handleToggleDay(key)}
                      className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        row.enabled ? "bg-primary" : "bg-outline-variant"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                          row.enabled ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <span
                      className={`font-body-md text-body-md ${row.enabled ? "text-on-surface font-medium" : "text-on-surface-variant"}`}
                    >
                      {label}
                    </span>
                  </div>

                  {/* Time range */}
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="time"
                      value={row.startTime}
                      onChange={(e) => handleTimeChange(key, "startTime", e.target.value)}
                      disabled={!row.enabled}
                      className="px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body-md text-body-md text-on-surface disabled:bg-surface-container disabled:text-on-surface-variant disabled:cursor-default transition-all"
                    />
                    <span className="font-body-sm text-body-sm text-on-surface-variant shrink-0">
                      hasta
                    </span>
                    <input
                      type="time"
                      value={row.endTime}
                      onChange={(e) => handleTimeChange(key, "endTime", e.target.value)}
                      disabled={!row.enabled}
                      className="px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body-md text-body-md text-on-surface disabled:bg-surface-container disabled:text-on-surface-variant disabled:cursor-default transition-all"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t border-outline-variant">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="h-10 px-6 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60"
            >
              {isSaving && (
                <span className="material-symbols-outlined text-[16px] animate-spin">
                  progress_activity
                </span>
              )}
              Guardar disponibilidad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
