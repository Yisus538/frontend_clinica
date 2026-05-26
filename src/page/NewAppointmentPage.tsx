import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { patientsApi, toPatientRecord } from "../features/patients/api/patients.api";
import { appointmentsApi } from "../features/agenda/api/appointments.api";
import type { PatientRecord } from "../features/patients/types/patients.types";

export const NewAppointmentPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    dentistId: "",
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
  };

  const handleClearSelection = () => {
    setSelectedPatient(null);
    setSearchQuery("");
    setIsDropdownOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) {
      toast.error("Seleccioná un paciente.");
      return;
    }
    if (!form.dentistId) {
      toast.error("Ingresá el ID del odontólogo.");
      return;
    }
    setIsSubmitting(true);
    try {
      const scheduledAt = new Date(`${form.scheduledDate}T${form.scheduledTime}:00`);
      await appointmentsApi.create({
        patientId: selectedPatient.id,
        dentistId: form.dentistId,
        scheduledAt: scheduledAt.toISOString(),
        durationMinutes: parseInt(form.durationMinutes, 10),
        status: "pending",
        notes: form.notes || undefined,
      });
      toast.success("Cita agendada correctamente");
      navigate("/dashboard/agenda");
    } catch {
      toast.error("Error al agendar la cita. Verificá los datos e intentá nuevamente.");
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
        <form onSubmit={handleSubmit}>
          {/* Section 1: Patient Info */}
          <div className="mb-10">
            <h3 className="font-h3 text-h3 text-on-surface border-b border-outline-variant pb-2 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">person</span>
              Información del Paciente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2">
                  Buscar Paciente
                </label>
                <div className="relative" ref={dropdownRef}>
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                    search
                  </span>
                  <input
                    className="w-full pl-10 pr-10 py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary-container focus:ring-2 focus:ring-primary-fixed-dim outline-none transition-all font-body-sm text-body-sm text-on-surface"
                    placeholder="Nombre o DNI"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (selectedPatient) setSelectedPatient(null);
                      setIsDropdownOpen(true);
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
                  {isDropdownOpen && (
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
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2">
                  ID del Odontólogo
                </label>
                <input
                  name="dentistId"
                  value={form.dentistId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary-container focus:ring-2 focus:ring-primary-fixed-dim outline-none transition-all font-body-sm text-body-sm text-on-surface"
                  placeholder="UUID del odontólogo"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Schedule */}
          <div className="mb-10">
            <h3 className="font-h3 text-h3 text-on-surface border-b border-outline-variant pb-2 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">
                medical_services
              </span>
              Horario
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2">
                  Fecha
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                    calendar_today
                  </span>
                  <input
                    name="scheduledDate"
                    value={form.scheduledDate}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary-container focus:ring-2 focus:ring-primary-fixed-dim outline-none transition-all font-body-sm text-body-sm text-on-surface"
                    type="date"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2">
                  Hora
                </label>
                <input
                  name="scheduledTime"
                  value={form.scheduledTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary-container outline-none transition-all font-body-sm text-body-sm text-on-surface"
                  type="time"
                  required
                />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2">
                  Duración (min)
                </label>
                <select
                  name="durationMinutes"
                  value={form.durationMinutes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary-container outline-none transition-all font-body-sm text-body-sm text-on-surface appearance-none"
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
              disabled={isSubmitting}
              className="px-6 py-3 rounded-lg font-label-md text-label-md bg-primary-container text-on-primary-container hover:bg-primary transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Agendando..." : "Confirmar Cita"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
