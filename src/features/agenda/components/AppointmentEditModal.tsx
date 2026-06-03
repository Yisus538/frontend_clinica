import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Modal } from "../../../shared/components/Modal";
import type { Appointment, AppointmentStatus } from "../types/agenda.types";
import { treatmentsApi, type ApiTreatment } from "../../treatments/api/treatments.api";

const DURATION_OPTIONS = [15, 30, 45, 60, 90];

function closestDuration(minutes: number): number {
  return DURATION_OPTIONS.reduce((prev, curr) =>
    Math.abs(curr - minutes) < Math.abs(prev - minutes) ? curr : prev
  );
}

const STATUS_OPTIONS: {
  value: AppointmentStatus;
  icon: string;
  activeClass: string;
  inactiveHover: string;
}[] = [
  {
    value: "Confirmada",
    icon: "check_circle",
    activeClass: "bg-secondary text-on-secondary border-secondary shadow-sm",
    inactiveHover: "hover:border-secondary/50 hover:bg-secondary/5 hover:text-secondary",
  },
  {
    value: "Pendiente",
    icon: "pending",
    activeClass: "bg-primary text-on-primary border-primary shadow-sm",
    inactiveHover: "hover:border-primary/50 hover:bg-primary/5 hover:text-primary",
  },
  {
    value: "Cancelada",
    icon: "cancel",
    activeClass: "bg-error text-on-error border-error shadow-sm",
    inactiveHover: "hover:border-error/50 hover:bg-error/5 hover:text-error",
  },
];

const fmt2 = (n: number) => String(n).padStart(2, "0");

const formatTimeRange = (apt: Appointment): string => {
  const endTotal = apt.startHour * 60 + apt.startMinute + apt.durationMinutes;
  const endH = Math.floor(endTotal / 60);
  const endM = endTotal % 60;
  return `${fmt2(apt.startHour)}:${fmt2(apt.startMinute)} - ${fmt2(endH)}:${fmt2(endM)}`;
};

interface AppointmentEditModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Appointment) => void;
  onDelete?: (id: string) => void;
}

export const AppointmentEditModal = ({
  appointment,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: AppointmentEditModalProps) => {
  const patient = appointment?.patient ?? "";
  const [selectedTreatmentName, setSelectedTreatmentName] = useState(
    appointment?.treatment !== "Consulta" ? (appointment?.treatment ?? "") : ""
  );
  const [durationMinutes, setDurationMinutes] = useState(
    String(appointment?.durationMinutes ?? 30)
  );
  const [timeRange] = useState(appointment ? formatTimeRange(appointment) : "");
  const [status, setStatus] = useState<AppointmentStatus>(appointment?.status ?? "Pendiente");
  const [treatments, setTreatments] = useState<ApiTreatment[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    treatmentsApi
      .findAll()
      .then((data) => setTreatments(data.filter((t) => t.isActive)))
      .catch(() => setTreatments([]));
  }, []);

  if (!appointment) return null;

  const handleTreatmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    setSelectedTreatmentName(name);
    const found = treatments.find((t) => t.name === name);
    if (found?.estimatedDurationMinutes) {
      setDurationMinutes(String(closestDuration(found.estimatedDurationMinutes)));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...appointment,
      patient,
      treatment: selectedTreatmentName || "Consulta",
      status,
      durationMinutes: parseInt(durationMinutes, 10),
    });
  };

  const footer = showDeleteConfirm ? (
    <div className="flex flex-col gap-3 p-1">
      <p className="font-body-md text-body-md text-on-surface text-center">
        ¿Estás seguro de que querés eliminar esta cita?
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(false)}
          className="flex-1 py-2.5 px-4 border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
        >
          No, cancelar
        </button>
        <button
          type="button"
          onClick={() => {
            onDelete?.(appointment.id);
            onClose();
          }}
          className="flex-1 py-2.5 px-4 bg-error text-on-error font-label-md text-label-md rounded-lg hover:opacity-90 transition-opacity shadow-sm cursor-pointer flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">delete</span>
          Sí, eliminar
        </button>
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-2.5">
      {/* Actions row */}
      <div className="flex items-center gap-2">
        {onDelete && (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-error font-label-md text-label-md hover:bg-error/8 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
            Eliminar
          </button>
        )}
        <div className="flex-1" />
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          form="appointment-edit-form"
          type="submit"
          className="px-5 py-2.5 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
        >
          Guardar
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-outline-variant" />

      {/* Complete appointment — prominent full-width */}
      <Link
        to={`/dashboard/agenda/${appointment.id}/seguimiento`}
        onClick={onClose}
        className="w-full py-2.5 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
      >
        <span
          className="material-symbols-outlined text-[18px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          task_alt
        </span>
        Completar Cita
      </Link>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Cita" footer={footer}>
      <form id="appointment-edit-form" onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
        {/* Patient */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-md text-label-md text-on-surface-variant">Paciente</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none">
              search
            </span>
            <input
              type="text"
              readOnly
              value={patient}
              className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface cursor-default"
            />
          </div>
        </div>

        {/* Treatment — solo si hay tratamientos cargados */}
        {treatments.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-treatment"
              className="font-label-md text-label-md text-on-surface-variant"
            >
              Tratamiento
            </label>
            <div className="relative">
              <select
                id="edit-treatment"
                value={selectedTreatmentName}
                onChange={handleTreatmentChange}
                className="w-full appearance-none px-4 py-3 bg-surface border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
              >
                <option value="">Sin tratamiento</option>
                {treatments.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                    {t.estimatedDurationMinutes ? ` — ${t.estimatedDurationMinutes} min` : ""}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                arrow_drop_down
              </span>
            </div>
          </div>
        )}

        {/* Horario + Duración */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface-variant">Horario</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none">
                schedule
              </span>
              <input
                type="text"
                readOnly
                value={timeRange}
                className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface-variant cursor-default"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface-variant">
              Duración
              {selectedTreatmentName && (
                <span className="ml-1 font-caption text-caption text-secondary">
                  · auto-completado
                </span>
              )}
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none">
                timer
              </span>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer appearance-none"
              >
                {DURATION_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d} min
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Profesional (read-only) */}
        {appointment.doctor && (
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface-variant">
              Profesional
            </label>
            <div className="flex items-center gap-3 px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg">
              <span className="material-symbols-outlined text-on-surface-variant text-xl">
                medical_services
              </span>
              <span className="font-body-sm text-body-sm text-on-surface">
                {appointment.doctor}
              </span>
            </div>
          </div>
        )}

        {/* Estado */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-md text-label-md text-on-surface-variant">
            Estado de la Cita
          </label>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map((opt) => {
              const isActive = status === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={`flex-1 py-2.5 px-3 rounded-lg border-2 font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? opt.activeClass
                      : `border-outline-variant text-on-surface-variant bg-surface ${opt.inactiveHover}`
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {opt.icon}
                  </span>
                  {opt.value}
                </button>
              );
            })}
          </div>
        </div>
      </form>
    </Modal>
  );
};
