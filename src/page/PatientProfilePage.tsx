import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { toast } from "sonner";
import { ClinicalHistoryModal } from "../features/patients/components/clinical-history/ClinicalHistoryModal";
import { RegisterPaymentModal } from "../features/finances/components/RegisterPaymentModal";
import { TreatmentPlansSection } from "../features/treatments/components/TreatmentPlansSection";
import { patientsApi, type ApiPatient } from "../features/patients/api/patients.api";
import {
  financesApi,
  getPaidAmount,
  type ApiInvoice,
  type BackendInvoiceStatus,
} from "../features/finances/api/finances.api";
import { appointmentsApi, type ApiAppointment } from "../features/agenda/api/appointments.api";
import { formatDate } from "../shared/utils/date";

const INVOICE_STATUS_LABEL: Record<BackendInvoiceStatus, string> = {
  draft: "Borrador",
  issued: "Pendiente",
  paid: "Pagado",
  partially_paid: "Parcial",
  cancelled: "Cancelado",
  overdue: "Vencido",
};

const INVOICE_STATUS_CLASS: Record<BackendInvoiceStatus, string> = {
  draft: "bg-surface-container text-on-surface-variant",
  issued: "bg-primary-container text-on-primary-container",
  paid: "bg-secondary-container text-on-secondary-container",
  partially_paid: "bg-tertiary-container text-on-tertiary-container",
  cancelled: "bg-surface-container text-on-surface-variant",
  overdue: "bg-error-container text-on-error-container",
};

const APPT_STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  in_progress: "En curso",
  completed: "Completada",
  cancelled: "Cancelada",
  no_show: "No asistió",
};

const APPT_STATUS_CLASS: Record<string, string> = {
  pending: "bg-primary-container text-on-primary-container",
  confirmed: "bg-secondary-container text-on-secondary-container",
  in_progress: "bg-secondary-container text-on-secondary-container",
  completed: "bg-tertiary-container text-on-tertiary-container",
  cancelled: "bg-error-container text-on-error-container",
  no_show: "bg-error-container text-on-error-container",
};

const STATUS_LABEL: Record<ApiPatient["status"], string> = {
  active: "Activo",
  in_treatment: "En Tratamiento",
  inactive: "Inactivo",
};

const STATUS_CLASS: Record<ApiPatient["status"], string> = {
  active: "bg-secondary-container text-on-secondary-container",
  in_treatment: "bg-surface-container-high text-primary",
  inactive: "bg-tertiary-fixed-dim text-on-tertiary-fixed-variant",
};

interface PatientForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  address: string;
  status: ApiPatient["status"];
  notes: string;
}

function patientToForm(p: ApiPatient): PatientForm {
  return {
    firstName: p.firstName,
    lastName: p.lastName,
    phone: p.phone ?? "",
    email: p.email ?? "",
    dateOfBirth: p.dateOfBirth ?? "",
    address: p.address ?? "",
    status: p.status,
    notes: p.notes ?? "",
  };
}

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-md text-body-md text-on-surface disabled:bg-surface-container disabled:text-on-surface-variant disabled:cursor-default";

export const PatientProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<ApiPatient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [form, setForm] = useState<PatientForm | null>(null);
  const [isClinicalHistoryModalOpen, setIsClinicalHistoryModalOpen] = useState(false);
  const [invoices, setInvoices] = useState<ApiInvoice[]>([]);
  const [paymentInvoice, setPaymentInvoice] = useState<ApiInvoice | null>(null);
  const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
  const [showAllAppointments, setShowAllAppointments] = useState(false);

  useEffect(() => {
    if (!id) return;
    patientsApi
      .findOne(id)
      .then((p) => {
        setPatient(p);
        setForm(patientToForm(p));
      })
      .catch(() => setPatient(null))
      .finally(() => setIsLoading(false));
  }, [id]);

  const loadInvoices = () => {
    if (!id) return;
    financesApi
      .findInvoicesByPatient(id)
      .then(setInvoices)
      .catch(() => setInvoices([]));
  };

  useEffect(() => {
    loadInvoices();
    if (!id) return;
    appointmentsApi
      .findByPatient(id)
      .then((data) => {
        const sorted = [...data].sort(
          (a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
        );
        setAppointments(sorted);
      })
      .catch(() => setAppointments([]));
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">
          progress_activity
        </span>
      </div>
    );
  }

  if (!patient || !form) {
    return (
      <div className="flex flex-col items-center py-16 gap-4">
        <span className="material-symbols-outlined text-error text-5xl">error</span>
        <p className="text-on-surface-variant">Paciente no encontrado.</p>
        <Link to="/dashboard/pacientes" className="text-primary hover:underline">
          Volver a Pacientes
        </Link>
      </div>
    );
  }

  const fullName = isEditing
    ? `${form.firstName} ${form.lastName}`.trim()
    : `${patient.firstName} ${patient.lastName}`;
  const initials =
    `${(isEditing ? form.firstName : patient.firstName)[0] ?? ""}${(isEditing ? form.lastName : patient.lastName)[0] ?? ""}`.toUpperCase();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => prev && { ...prev, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    setForm(patientToForm(patient));
  };

  const handleSave = async () => {
    if (!form) return;
    setIsSaving(true);
    try {
      const updated = await patientsApi.update(id!, {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone || undefined,
        email: form.email || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        address: form.address || undefined,
        status: form.status,
        notes: form.notes || undefined,
        dni: patient.dni,
      });
      setPatient(updated);
      setForm(patientToForm(updated));
      setIsEditing(false);
      toast.success("Datos del paciente actualizados");
    } catch {
      toast.error("No se pudo actualizar el paciente");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setIsDeleting(true);
    patientsApi
      .remove(id!)
      .then(() => {
        toast.success(`Paciente ${fullName} eliminado`);
        navigate("/dashboard/pacientes");
      })
      .catch(() => {
        toast.error("No se pudo eliminar el paciente");
        setIsDeleting(false);
        setConfirmDelete(false);
      });
  };

  return (
    <div className="flex-1 w-full mx-auto pb-10">
      {/* Page Header */}
      <div className="mb-10">
        <nav className="flex text-on-surface-variant font-caption text-caption mb-1">
          <Link to="/dashboard/pacientes" className="hover:text-primary transition-colors">
            Pacientes
          </Link>
          <span className="mx-2">/</span>
          <span className="text-on-surface font-medium">{fullName}</span>
        </nav>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="font-h1 text-h1 text-on-surface">{fullName}</h1>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider ${STATUS_CLASS[isEditing ? form.status : patient.status]}`}
            >
              <span className="w-2 h-2 rounded-full bg-current mr-2" />
              {STATUS_LABEL[isEditing ? form.status : patient.status]}
            </span>
          </div>

          {/* Delete button */}
          <div className="flex items-center gap-2 shrink-0">
            {confirmDelete ? (
              <>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="h-9 px-4 rounded-lg border border-outline-variant font-label-sm text-label-sm text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteClick}
                  disabled={isDeleting}
                  className="h-9 px-4 rounded-lg bg-error text-on-error font-label-sm text-label-sm flex items-center gap-1.5 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">warning</span>
                  {isDeleting ? "Eliminando..." : "¿Confirmar eliminación?"}
                </button>
              </>
            ) : (
              <button
                onClick={handleDeleteClick}
                className="h-9 px-4 rounded-lg border border-error/40 text-error font-label-sm text-label-sm flex items-center gap-1.5 hover:bg-error-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                Eliminar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column */}
        <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-6">
          {/* Profile Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
            <div className="w-24 h-24 rounded-full bg-primary text-on-primary flex items-center justify-center text-3xl font-bold mb-4 border-2 border-surface-container">
              {initials}
            </div>
            <h2 className="font-h3 text-h3 text-on-surface mb-1">{fullName}</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
              DNI: {patient.dni}
            </p>
            <div className="w-full border-t border-outline-variant pt-4 flex flex-col gap-3 text-left">
              {(patient.dateOfBirth || isEditing) && (
                <div className="flex justify-between items-center">
                  <span className="font-label-sm text-label-sm text-outline">F. NAC.</span>
                  <span className="font-body-md text-body-md text-on-surface font-medium">
                    {form.dateOfBirth ? formatDate(form.dateOfBirth) : "—"}
                  </span>
                </div>
              )}
              {(patient.phone || isEditing) && (
                <div className="flex justify-between items-center">
                  <span className="font-label-sm text-label-sm text-outline">TELÉFONO</span>
                  <span className="font-body-md text-body-md text-on-surface font-medium text-primary">
                    {form.phone || "—"}
                  </span>
                </div>
              )}
              {(patient.email || isEditing) && (
                <div className="flex justify-between items-center">
                  <span className="font-label-sm text-label-sm text-outline">EMAIL</span>
                  <span className="font-body-sm text-body-sm text-on-surface truncate max-w-[160px]">
                    {form.email || "—"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-3 pl-1">
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() =>
                  navigate("/dashboard/agenda/nueva-cita", {
                    state: {
                      patientId: patient.id,
                      patientName: fullName,
                      patientDni: patient.dni,
                    },
                  })
                }
                className="bg-surface-container-lowest border border-outline-variant hover:border-primary hover:bg-surface-container-low transition-all duration-200 rounded-lg aspect-square flex flex-col items-center justify-center p-2 text-primary group cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined mb-2 group-hover:scale-110 transition-transform">
                  calendar_add_on
                </span>
                <span className="text-xs text-on-surface-variant text-center leading-tight">
                  Nueva Cita
                </span>
              </button>
              <button
                onClick={() =>
                  toast.info("Módulo de recetas en desarrollo - próximamente disponible")
                }
                className="bg-surface-container-lowest border border-outline-variant hover:border-primary hover:bg-surface-container-low transition-all duration-200 rounded-lg aspect-square flex flex-col items-center justify-center p-2 text-primary group cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined mb-2 group-hover:scale-110 transition-transform">
                  prescriptions
                </span>
                <span className="text-xs text-on-surface-variant text-center leading-tight">
                  Nueva Receta
                </span>
              </button>
              <button
                onClick={() =>
                  toast.info("Módulo de documentos en desarrollo - próximamente disponible")
                }
                className="bg-surface-container-lowest border border-outline-variant hover:border-primary hover:bg-surface-container-low transition-all duration-200 rounded-lg aspect-square flex flex-col items-center justify-center p-2 text-primary group cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined mb-2 group-hover:scale-110 transition-transform">
                  upload_file
                </span>
                <span className="text-xs text-on-surface-variant text-center leading-tight">
                  Subir Doc
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-6">
          {/* Clinical History Button */}
          <button
            onClick={() => setIsClinicalHistoryModalOpen(true)}
            className="w-full bg-primary hover:opacity-90 transition-opacity duration-200 rounded-xl p-6 flex items-center justify-between text-on-primary group shadow-md cursor-pointer"
          >
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-on-primary/20 flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-3xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  medical_information
                </span>
              </div>
              <div className="text-left">
                <h2 className="font-h3 text-h3 font-bold mb-1">Abrir Historial Clínico Médico</h2>
                <p className="font-body-sm text-body-sm text-primary-fixed-dim">
                  Ver odontograma, periodontograma y notas clínicas completas.
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-3xl group-hover:translate-x-2 transition-transform">
              arrow_forward
            </span>
          </button>

          {/* Personal Information */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-outline-variant">
              <h3 className="font-h3 text-h3 text-on-surface">Información Personal</h3>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="h-9 px-4 rounded-lg border border-outline-variant font-label-sm text-label-sm text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-9 px-4 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm flex items-center gap-1.5 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <span className="material-symbols-outlined text-[16px] animate-spin">
                          progress_activity
                        </span>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[16px]">save</span>
                        Guardar
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="h-9 px-4 rounded-lg border border-outline-variant font-label-sm text-label-sm text-on-surface flex items-center gap-1.5 hover:bg-surface-container hover:border-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  Editar
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Nombre */}
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-outline uppercase">Nombre</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputClass}
                />
              </div>

              {/* Apellido */}
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-outline uppercase">
                  Apellido
                </label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputClass}
                />
              </div>

              {/* DNI — siempre read-only */}
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-outline uppercase">DNI</label>
                <input
                  value={patient.dni}
                  disabled
                  className={inputClass}
                  title="El DNI no puede modificarse"
                />
              </div>

              {/* Teléfono */}
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-outline uppercase">
                  Teléfono
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder={isEditing ? "Ej: 3515200058" : "—"}
                  className={inputClass}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-outline uppercase">
                  Correo Electrónico
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder={isEditing ? "ejemplo@correo.com" : "—"}
                  className={inputClass}
                />
              </div>

              {/* Fecha de Nacimiento */}
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-outline uppercase">
                  Fecha de Nacimiento
                </label>
                {isEditing ? (
                  <input
                    name="dateOfBirth"
                    type="date"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                    className={inputClass}
                  />
                ) : (
                  <input
                    value={
                      form.dateOfBirth
                        ? formatDate(form.dateOfBirth, {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "—"
                    }
                    disabled
                    className={inputClass}
                  />
                )}
              </div>

              {/* Dirección */}
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="font-label-sm text-label-sm text-outline uppercase">
                  Dirección
                </label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder={isEditing ? "Calle, número, ciudad" : "—"}
                  className={inputClass}
                />
              </div>

              {/* Estado */}
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-outline uppercase">Estado</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`${inputClass} appearance-none`}
                >
                  <option value="active">Activo</option>
                  <option value="in_treatment">En Tratamiento</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>

              {/* Notas */}
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="font-label-sm text-label-sm text-outline uppercase">Notas</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={3}
                  placeholder={isEditing ? "Observaciones, alergias, notas relevantes..." : "—"}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </div>
          {/* Appointment History */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-outline-variant">
              <h3 className="font-h3 text-h3 text-on-surface">Historial de Citas</h3>
              <button
                onClick={() =>
                  navigate("/dashboard/agenda/nueva-cita", {
                    state: {
                      patientId: patient.id,
                      patientName: fullName,
                      patientDni: patient.dni,
                    },
                  })
                }
                className="h-9 px-3 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Nueva Cita
              </button>
            </div>

            {appointments.length === 0 ? (
              <div className="flex flex-col items-center py-8 gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl">calendar_month</span>
                <p className="font-body-sm text-body-sm">Sin citas registradas</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  {(showAllAppointments ? appointments : appointments.slice(0, 10)).map((apt) => {
                    const date = new Date(apt.scheduledAt);
                    const dateStr = formatDate(apt.scheduledAt, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });
                    const timeStr = date.toLocaleTimeString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return (
                      <div
                        key={apt.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 rounded-lg bg-surface-container border border-outline-variant"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex flex-col items-center shrink-0 w-10 text-center">
                            <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight">
                              {dateStr}
                            </span>
                            <span className="font-caption text-caption text-outline">
                              {timeStr}
                            </span>
                          </div>
                          <div className="w-px h-8 bg-outline-variant shrink-0" />
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <p className="font-body-md text-body-md text-on-surface font-medium truncate">
                              {apt.notes ?? "Consulta"}
                            </p>
                            <p className="font-caption text-caption text-on-surface-variant">
                              {apt.durationMinutes} min
                            </p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full font-label-sm text-label-sm shrink-0 ${APPT_STATUS_CLASS[apt.status] ?? "bg-surface-container text-on-surface-variant"}`}
                        >
                          {APPT_STATUS_LABEL[apt.status] ?? apt.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {appointments.length > 10 && (
                  <button
                    onClick={() => setShowAllAppointments((v) => !v)}
                    className="mt-4 w-full py-2 text-primary font-label-sm text-label-sm hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
                  >
                    {showAllAppointments ? "Mostrar menos" : `Ver todas (${appointments.length})`}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Treatment Plans */}
          <TreatmentPlansSection patientId={patient.id} appointments={appointments} />

          {/* Payment History */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-outline-variant">
              <h3 className="font-h3 text-h3 text-on-surface">Historial de Pagos</h3>
              {invoices.some(
                (inv) => inv.status === "issued" || inv.status === "partially_paid"
              ) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Deuda pendiente
                </span>
              )}
            </div>

            {invoices.length === 0 ? (
              <div className="flex flex-col items-center py-8 gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl">receipt_long</span>
                <p className="font-body-sm text-body-sm">Sin comprobantes registrados</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {invoices.map((inv) => {
                  const paid = getPaidAmount(inv);
                  const remaining = Math.max(0, Number(inv.total) - paid);
                  const treatment = inv.appointment?.notes ?? "Consulta";
                  const canPay = inv.status === "issued" || inv.status === "partially_paid";
                  return (
                    <div
                      key={inv.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-lg bg-surface-container border border-outline-variant"
                    >
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-label-sm ${INVOICE_STATUS_CLASS[inv.status]}`}
                          >
                            {INVOICE_STATUS_LABEL[inv.status]}
                          </span>
                          <span className="font-caption text-caption text-on-surface-variant truncate">
                            {inv.number}
                          </span>
                        </div>
                        <p className="font-body-md text-body-md text-on-surface font-medium truncate">
                          {treatment}
                        </p>
                        <p className="font-caption text-caption text-on-surface-variant">
                          {formatDate(inv.createdAt, {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          {remaining > 0 ? (
                            <>
                              <p className="font-body-md text-body-md text-error font-semibold">
                                Falta $
                                {remaining.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                              </p>
                              <p className="font-caption text-caption text-on-surface-variant">
                                Total $
                                {Number(inv.total).toLocaleString("es-AR", {
                                  minimumFractionDigits: 2,
                                })}
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="font-body-md text-body-md text-secondary font-semibold">
                                $
                                {Number(inv.total).toLocaleString("es-AR", {
                                  minimumFractionDigits: 2,
                                })}
                              </p>
                              <p className="font-caption text-caption text-secondary">Pagado ✓</p>
                            </>
                          )}
                        </div>
                        {canPay && (
                          <button
                            onClick={() => setPaymentInvoice(inv)}
                            className="h-9 px-3 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                          >
                            <span className="material-symbols-outlined text-[16px]">payments</span>
                            Abonar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <ClinicalHistoryModal
        isOpen={isClinicalHistoryModalOpen}
        onClose={() => setIsClinicalHistoryModalOpen(false)}
        patientId={patient.id}
      />

      {paymentInvoice && (
        <RegisterPaymentModal
          key={paymentInvoice.id}
          mode="existing"
          isOpen={paymentInvoice !== null}
          invoice={paymentInvoice}
          onClose={() => setPaymentInvoice(null)}
          onSuccess={() => {
            setPaymentInvoice(null);
            loadInvoices();
          }}
        />
      )}
    </div>
  );
};
