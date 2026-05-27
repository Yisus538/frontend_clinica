import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { toast } from "sonner";
import { patientsApi, toPatientRecord } from "../features/patients/api/patients.api";
import { appointmentsApi } from "../features/agenda/api/appointments.api";
import { settingsApi } from "../features/settings/api/settings.api";
import type { PatientRecord } from "../features/patients/types/patients.types";

interface PatientRouteState {
  patientId?: string;
  patientName?: string;
  patientDni?: string;
}

interface FieldErrors {
  patient?: string;
  date?: string;
  time?: string;
}

function buildInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const inputBase =
  "w-full py-3 rounded-lg border bg-surface outline-none transition-all font-body-sm text-body-sm text-on-surface";
const inputNormal = `${inputBase} border-outline-variant focus:border-primary-container focus:ring-2 focus:ring-primary-fixed-dim`;
const inputError = `${inputBase} border-error focus:border-error focus:ring-2 focus:ring-error/20`;

export const NewAppointmentPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: PatientRouteState | null };

  const [searchQuery, setSearchQuery] = useState<string>(() => state?.patientName ?? "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(() => {
    if (!state?.patientId) return null;
    return {
      id: state.patientId,
      name: state.patientName ?? "",
      dni: state.patientDni ?? "",
      initials: buildInitials(state.patientName ?? ""),
      lastVisit: "—",
      status: "Activo",
    };
  });
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [dentistId, setDentistId] = useState("");
  const [dentistName, setDentistName] = useState("");
  const [dentistLoading, setDentistLoading] = useState(true);
  const [dentistError, setDentistError] = useState(false);

  const [form, setForm] = useState({
    scheduledDate: "",
    scheduledTime: "09:00",
    durationMinutes: "30",
    notes: "",
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    patientsApi
      .findAll()
      .then((data) => setPatients(data.map(toPatientRecord)))
      .catch(() => setPatients([]));
  }, []);

  useEffect(() => {
    settingsApi
      .getProfile()
      .then((p) => {
        if (!p.dentistId) {
          setDentistError(true);
          setDentistName("Sin odontólogo vinculado");
        } else {
          setDentistId(p.dentistId);
          setDentistName(`${p.firstName} ${p.lastName}`);
        }
      })
      .catch(() => {
        setDentistError(true);
        setDentistName("No disponible");
      })
      .finally(() => setDentistLoading(false));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredPatients = patients.filter(
    (p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.dni.includes(searchQuery)
  );

  const handleSelectPatient = (patient: PatientRecord) => {
    setSelectedPatient(patient);
    setSearchQuery(patient.name);
    setIsDropdownOpen(false);
    setFieldErrors((prev) => ({ ...prev, patient: undefined }));
  };

  const handleClearSelection = () => {
    setSelectedPatient(null);
    setSearchQuery("");
    setIsDropdownOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "scheduledDate" || name === "scheduledTime") {
      setFieldErrors((prev) => ({
        ...prev,
        [name === "scheduledDate" ? "date" : "time"]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: FieldErrors = {};

    if (!selectedPatient) {
      errors.patient = "Seleccioná un paciente para continuar.";
    }
    if (!form.scheduledDate) {
      errors.date = "Elegí una fecha para la cita.";
    }
    if (!form.scheduledTime) {
      errors.time = "Ingresá la hora de la cita.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error("Completá los campos requeridos.", {
        description: Object.values(errors).join(" "),
      });
      return;
    }

    if (!dentistId) {
      toast.error("Tu cuenta no tiene un odontólogo vinculado.", {
        description: "Contactá al administrador para configurar tu perfil.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const scheduledAt = new Date(`${form.scheduledDate}T${form.scheduledTime}:00`);
      if (isNaN(scheduledAt.getTime())) {
        toast.error("La fecha y hora ingresadas no son válidas.");
        return;
      }
      await appointmentsApi.create({
        patientId: selectedPatient!.id,
        dentistId,
        scheduledAt: scheduledAt.toISOString(),
        durationMinutes: parseInt(form.durationMinutes, 10),
        status: "pending",
        notes: form.notes || undefined,
      });
      toast.success("Cita agendada correctamente.");
      navigate("/dashboard/agenda");
    } catch {
      toast.error("No se pudo agendar la cita.", {
        description: "Verificá que no haya una cita en el mismo horario e intentá nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-10 w-full">
      <div className="mb-8">
        <h2 className="font-h1 text-h1 text-on-surface mb-2">Nueva Cita</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Programe una nueva consulta para un paciente existente o registre uno nuevo.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-8">
        <form onSubmit={handleSubmit} noValidate>
          {/* Section 1: Patient Info */}
          <div className="mb-10">
            <h3 className="font-h3 text-h3 text-on-surface border-b border-outline-variant pb-2 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">person</span>
              Información del Paciente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {/* Patient search */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2">
                  Paciente <span className="text-error">*</span>
                </label>
                <div className="relative" ref={dropdownRef}>
                  <span
                    className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] ${fieldErrors.patient ? "text-error" : "text-outline"}`}
                  >
                    search
                  </span>
                  <input
                    className={`${fieldErrors.patient ? inputError : inputNormal} pl-10 pr-10`}
                    placeholder="Nombre o DNI"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (selectedPatient) setSelectedPatient(null);
                      setIsDropdownOpen(true);
                      if (fieldErrors.patient) {
                        setFieldErrors((prev) => ({ ...prev, patient: undefined }));
                      }
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClearSelection}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface cursor-pointer flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  )}
                  {isDropdownOpen && !selectedPatient && (
                    <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg z-50 overflow-hidden max-h-60 overflow-y-auto">
                      {filteredPatients.length > 0 ? (
                        <div className="py-1">
                          {filteredPatients.map((p) => (
                            <div
                              key={p.id}
                              onClick={() => handleSelectPatient(p)}
                              className="px-4 py-3 hover:bg-surface-container-low cursor-pointer flex items-center gap-3 transition-colors"
                            >
                              <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-xs font-semibold text-on-surface-variant">
                                {p.initials}
                              </div>
                              <div>
                                <div className="font-body-sm text-body-sm text-on-surface font-medium">
                                  {p.name}
                                </div>
                                <div className="font-caption text-caption text-outline">
                                  DNI: {p.dni}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center">
                          <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
                            No se encontraron pacientes.
                          </p>
                          <button
                            type="button"
                            onClick={() => navigate("/dashboard/pacientes/nuevo")}
                            className="px-4 py-2.5 bg-primary-container text-on-primary-container rounded-lg font-body-sm text-body-sm font-medium hover:bg-primary transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              person_add
                            </span>
                            Registrar nuevo paciente
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {selectedPatient ? (
                  <div className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-primary-fixed/20 border border-primary/20 rounded-lg">
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      check_circle
                    </span>
                    <span className="font-body-sm text-body-sm text-primary font-medium">
                      {selectedPatient.name}
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant ml-1">
                      DNI: {selectedPatient.dni}
                    </span>
                  </div>
                ) : fieldErrors.patient ? (
                  <p className="mt-1.5 flex items-center gap-1 font-caption text-caption text-error">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {fieldErrors.patient}
                  </p>
                ) : null}
              </div>

              {/* Dentist (read-only) */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2">
                  Odontólogo
                </label>
                <div
                  className={`w-full px-4 py-3 rounded-lg border font-body-sm text-body-sm flex items-center gap-2 min-h-[50px] ${
                    dentistError
                      ? "border-error/50 bg-error-container/20 text-error"
                      : "border-outline-variant bg-surface-container text-on-surface"
                  }`}
                >
                  {dentistLoading ? (
                    <span className="text-on-surface-variant animate-pulse">Cargando...</span>
                  ) : (
                    <>
                      <span
                        className={`material-symbols-outlined text-[18px] ${dentistError ? "text-error" : "text-primary"}`}
                      >
                        {dentistError ? "warning" : "stethoscope"}
                      </span>
                      <span>{dentistName}</span>
                    </>
                  )}
                </div>
                {!dentistLoading && dentistError && (
                  <p className="mt-1.5 flex items-center gap-1 font-caption text-caption text-error">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    Contactá al administrador para vincular tu cuenta a un odontólogo.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Schedule */}
          <div className="mb-10">
            <h3 className="font-h3 text-h3 text-on-surface border-b border-outline-variant pb-2 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">
                calendar_month
              </span>
              Horario
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {/* Date */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2">
                  Fecha <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <span
                    className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] ${fieldErrors.date ? "text-error" : "text-outline"}`}
                  >
                    calendar_today
                  </span>
                  <input
                    name="scheduledDate"
                    value={form.scheduledDate}
                    onChange={handleChange}
                    className={`${fieldErrors.date ? inputError : inputNormal} pl-10 pr-4`}
                    type="date"
                  />
                </div>
                {fieldErrors.date && (
                  <p className="mt-1.5 flex items-center gap-1 font-caption text-caption text-error">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {fieldErrors.date}
                  </p>
                )}
              </div>

              {/* Time */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2">
                  Hora <span className="text-error">*</span>
                </label>
                <input
                  name="scheduledTime"
                  value={form.scheduledTime}
                  onChange={handleChange}
                  className={`${fieldErrors.time ? inputError : inputNormal} px-4`}
                  type="time"
                />
                {fieldErrors.time && (
                  <p className="mt-1.5 flex items-center gap-1 font-caption text-caption text-error">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {fieldErrors.time}
                  </p>
                )}
              </div>

              {/* Duration */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2">
                  Duración (min)
                </label>
                <select
                  name="durationMinutes"
                  value={form.durationMinutes}
                  onChange={handleChange}
                  className={`${inputNormal} px-4 appearance-none`}
                >
                  <option value="15">15 min</option>
                  <option value="30">30 min</option>
                  <option value="45">45 min</option>
                  <option value="60">60 min</option>
                  <option value="90">90 min</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Notes */}
          <div className="mb-10">
            <label className="block font-label-md text-label-md text-on-surface mb-2">
              Notas / Motivo de consulta
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full p-4 rounded-lg border border-outline-variant bg-surface focus:border-primary-container focus:ring-2 focus:ring-primary-fixed-dim outline-none transition-all font-body-sm text-body-sm text-on-surface resize-none"
              placeholder="Añade cualquier detalle relevante para la consulta..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-outline-variant">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-lg font-label-md text-label-md text-error hover:bg-error-container transition-colors cursor-pointer"
              type="button"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || dentistLoading}
              className="px-6 py-3 rounded-lg font-label-md text-label-md bg-primary-container text-on-primary-container hover:bg-primary transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">
                    progress_activity
                  </span>
                  Agendando...
                </>
              ) : (
                <>
                  Confirmar Cita
                  <span className="material-symbols-outlined text-[18px]">event_available</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
