import { useState } from "react";
import { Modal } from "../../../shared/components/Modal";
import type { Appointment, AppointmentStatus } from "../types/agenda.types";
import { TREATMENTS_MOCK } from "../../treatments/data/treatments.mock";

/* ── Status button config ── */
const STATUS_OPTIONS: {
  value: AppointmentStatus;
  icon: string;
  activeClass: string;
}[] = [
  {
    value: "Confirmada",
    icon: "check_circle",
    activeClass: "border-secondary bg-secondary/10 text-secondary",
  },
  {
    value: "Pendiente",
    icon: "pending",
    activeClass: "border-primary bg-primary/10 text-primary",
  },
  {
    value: "Cancelada",
    icon: "cancel",
    activeClass: "border-error bg-error/10 text-error",
  },
];

/* ── Helpers ── */
const fmt2 = (n: number) => String(n).padStart(2, "0");

const formatTimeRange = (apt: Appointment): string => {
  const endTotal = apt.startHour * 60 + apt.startMinute + apt.durationMinutes;
  const endH = Math.floor(endTotal / 60);
  const endM = endTotal % 60;
  return `${fmt2(apt.startHour)}:${fmt2(apt.startMinute)} - ${fmt2(endH)}:${fmt2(endM)}`;
};

/* ── Props ── */
interface AppointmentEditModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Appointment) => void;
}

export const AppointmentEditModal = ({
  appointment,
  isOpen,
  onClose,
  onSave,
}: AppointmentEditModalProps) => {
  const [patient, setPatient] = useState(appointment?.patient ?? "");
  const [treatment, setTreatment] = useState(appointment?.treatment ?? "");
  const [timeRange, setTimeRange] = useState(appointment ? formatTimeRange(appointment) : "");
  const [status, setStatus] = useState<AppointmentStatus>(appointment?.status ?? "Pendiente");

  if (!appointment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...appointment, patient, treatment, status });
    // Note: onSave already calls setSelectedAppointment(null) in AgendaPage,
    // which unmounts this modal — no explicit onClose() needed here.
  };

  /* ── Footer ── */
  const footer = (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onClose}
        className="flex-1 py-2.5 px-4 border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
      >
        Cancelar
      </button>
      <button
        form="appointment-edit-form"
        type="submit"
        className="flex-1 py-2.5 px-4 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:bg-on-primary-fixed-variant transition-colors shadow-sm cursor-pointer"
      >
        Guardar Cambios
      </button>
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
              id="edit-patient"
              type="text"
              value={patient}
              onChange={(e) => setPatient(e.target.value)}
              placeholder="Buscar paciente..."
              className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* Treatment */}
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
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              className="w-full appearance-none px-4 py-3 bg-surface border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
            >
              {TREATMENTS_MOCK.filter((t) => t.status === "Activo").map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
              arrow_drop_down
            </span>
          </div>
        </div>

        {/* Date & Time — read-only display; date editing goes through the calendar */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface-variant">Horario</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none">
                schedule
              </span>
              <input
                type="text"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface-variant">Duración</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none">
                timer
              </span>
              <input
                type="text"
                readOnly
                value={`${appointment.durationMinutes} min`}
                className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface-variant cursor-default"
              />
            </div>
          </div>
        </div>

        {/* Doctor (read-only if present) */}
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

        {/* Status selector */}
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
                  className={`flex-1 py-2 px-3 rounded-lg border-2 font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? opt.activeClass
                      : "border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{opt.icon}</span>
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
