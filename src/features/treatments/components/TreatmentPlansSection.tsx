import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  treatmentPlansApi,
  type ApiTreatmentPlan,
  type SessionStatus,
} from "../api/treatment-plans.api";
import { treatmentsApi, type ApiTreatment } from "../api/treatments.api";
import { formatDate } from "../../../shared/utils/date";
import type { ApiAppointment } from "../../agenda/api/appointments.api";

const SESSION_STATUS_LABEL: Record<SessionStatus, string> = {
  scheduled: "Pendiente",
  in_progress: "En curso",
  completed: "Completada",
  cancelled: "Cancelada",
};

const SESSION_STATUS_CLASS: Record<SessionStatus, string> = {
  scheduled: "bg-surface-container border border-outline-variant text-on-surface-variant",
  in_progress: "bg-primary-container text-on-primary-container",
  completed: "bg-secondary-container text-on-secondary-container",
  cancelled: "bg-error-container text-on-error-container line-through",
};

interface NewPlanForm {
  appointmentId: string;
  catalogId: string;
  agreedPrice: string;
  toothNumber: string;
  notes: string;
  sessionCount: string;
}

const EMPTY_FORM: NewPlanForm = {
  appointmentId: "",
  catalogId: "",
  agreedPrice: "",
  toothNumber: "",
  notes: "",
  sessionCount: "1",
};

interface Props {
  patientId: string;
  appointments: ApiAppointment[];
}

export const TreatmentPlansSection = ({ patientId, appointments }: Props) => {
  const [plans, setPlans] = useState<ApiTreatmentPlan[]>([]);
  const [catalog, setCatalog] = useState<ApiTreatment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NewPlanForm>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [togglingSessionId, setTogglingSessionId] = useState<string | null>(null);

  const loadPlans = useCallback(() => {
    treatmentPlansApi
      .findByPatient(patientId)
      .then(setPlans)
      .catch(() => setPlans([]))
      .finally(() => setIsLoading(false));
  }, [patientId]);

  useEffect(() => {
    loadPlans();
    treatmentsApi
      .findAll()
      .then(setCatalog)
      .catch(() => setCatalog([]));
  }, [loadPlans]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "catalogId") {
        const treatment = catalog.find((t) => t.id === value);
        if (treatment) next.agreedPrice = String(treatment.basePrice);
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (!form.appointmentId || !form.catalogId || !form.agreedPrice) {
      toast.error("Completá los campos obligatorios");
      return;
    }
    setIsSaving(true);
    try {
      const plan = await treatmentPlansApi.create({
        appointmentId: form.appointmentId,
        catalogId: form.catalogId,
        agreedPrice: Number(form.agreedPrice),
        toothNumber: form.toothNumber ? Number(form.toothNumber) : undefined,
        notes: form.notes || undefined,
      });

      const count = Math.max(1, Math.min(20, Number(form.sessionCount) || 1));
      for (let i = 1; i <= count; i++) {
        await treatmentPlansApi.createSession(plan.id, { sessionNumber: i });
      }

      toast.success("Plan de tratamiento creado");
      setShowModal(false);
      setForm(EMPTY_FORM);
      loadPlans();
    } catch {
      toast.error("No se pudo crear el plan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (planId: string) => {
    if (confirmDeleteId !== planId) {
      setConfirmDeleteId(planId);
      return;
    }
    setDeletingPlanId(planId);
    treatmentPlansApi
      .remove(planId)
      .then(() => {
        toast.success("Plan eliminado");
        setPlans((prev) => prev.filter((p) => p.id !== planId));
      })
      .catch(() => toast.error("No se pudo eliminar el plan"))
      .finally(() => {
        setDeletingPlanId(null);
        setConfirmDeleteId(null);
      });
  };

  const handleToggleSession = async (
    plan: ApiTreatmentPlan,
    sessionId: string,
    currentStatus: SessionStatus
  ) => {
    setTogglingSessionId(sessionId);
    const newStatus: SessionStatus = currentStatus === "completed" ? "scheduled" : "completed";
    const dto =
      newStatus === "completed"
        ? { status: newStatus, performedAt: new Date().toISOString() }
        : { status: newStatus };
    try {
      const updated = await treatmentPlansApi.updateSession(plan.id, sessionId, dto);
      setPlans((prev) =>
        prev.map((p) =>
          p.id === plan.id
            ? {
                ...p,
                sessions: p.sessions.map((s) => (s.id === sessionId ? { ...s, ...updated } : s)),
              }
            : p
        )
      );
    } catch {
      toast.error("No se pudo actualizar la sesión");
    } finally {
      setTogglingSessionId(null);
    }
  };

  const eligibleAppointments = appointments.filter(
    (a) => a.status !== "cancelled" && a.status !== "no_show"
  );

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <h3 className="font-h3 text-h3 text-on-surface">Planes de Tratamiento</h3>
          {plans.length > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm">
              {plans.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="h-9 px-3 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Nuevo Plan
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <span className="material-symbols-outlined animate-spin text-primary text-3xl">
            progress_activity
          </span>
        </div>
      ) : plans.length === 0 ? (
        <div className="flex flex-col items-center py-8 gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl">medical_services</span>
          <p className="font-body-sm text-body-sm">Sin planes de tratamiento registrados</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {plans.map((plan) => {
            const completed = plan.sessions.filter((s) => s.status === "completed").length;
            const total = plan.sessions.length;
            const apptDate = plan.appointment?.scheduledAt
              ? formatDate(plan.appointment.scheduledAt, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "—";

            return (
              <div
                key={plan.id}
                className="rounded-lg border border-outline-variant bg-surface-container p-4 flex flex-col gap-3"
              >
                {/* Plan header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-body-md text-body-md text-on-surface font-semibold">
                        {plan.treatmentCatalog?.name ?? "Tratamiento"}
                      </span>
                      {plan.toothNumber && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container font-label-sm text-label-sm">
                          Diente #{plan.toothNumber}
                        </span>
                      )}
                    </div>
                    <span className="font-caption text-caption text-on-surface-variant">
                      Cita del {apptDate} · $
                      {Number(plan.agreedPrice).toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                    {plan.notes && (
                      <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        {plan.notes}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteClick(plan.id)}
                    disabled={deletingPlanId === plan.id}
                    className={`shrink-0 h-8 px-2.5 rounded-lg font-label-sm text-label-sm flex items-center gap-1 transition-colors cursor-pointer ${
                      confirmDeleteId === plan.id
                        ? "bg-error text-on-error hover:opacity-90"
                        : "text-error hover:bg-error-container"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {deletingPlanId === plan.id ? "progress_activity" : "delete"}
                    </span>
                    {confirmDeleteId === plan.id && (
                      <span className="hidden sm:inline">¿Confirmar?</span>
                    )}
                  </button>
                </div>

                {/* Sessions */}
                {total > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        Sesiones ({completed}/{total} completadas)
                      </span>
                      {total > 0 && (
                        <div className="h-1.5 w-32 rounded-full bg-surface-container-high overflow-hidden">
                          <div
                            className="h-full rounded-full bg-secondary transition-all"
                            style={{ width: `${(completed / total) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[...plan.sessions]
                        .sort((a, b) => a.sessionNumber - b.sessionNumber)
                        .map((session) => (
                          <button
                            key={session.id}
                            onClick={() => handleToggleSession(plan, session.id, session.status)}
                            disabled={
                              togglingSessionId === session.id ||
                              session.status === "in_progress" ||
                              session.status === "cancelled"
                            }
                            title={`${SESSION_STATUS_LABEL[session.status]}${session.status === "scheduled" || session.status === "completed" ? " — clic para cambiar" : ""}`}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-sm text-label-sm transition-colors ${SESSION_STATUS_CLASS[session.status]} ${session.status === "scheduled" || session.status === "completed" ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}
                          >
                            {togglingSessionId === session.id ? (
                              <span className="material-symbols-outlined text-[12px] animate-spin">
                                progress_activity
                              </span>
                            ) : session.status === "completed" ? (
                              <span className="material-symbols-outlined text-[12px]">check</span>
                            ) : null}
                            {session.sessionNumber}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal nuevo plan */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isSaving && setShowModal(false)}
          />
          <div className="relative bg-surface rounded-2xl shadow-2xl w-full max-w-lg p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-h2 text-h2 text-on-surface">Nuevo Plan de Tratamiento</h2>
              <button
                onClick={() => setShowModal(false)}
                disabled={isSaving}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Cita */}
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant">
                  Cita <span className="text-error">*</span>
                </label>
                <select
                  name="appointmentId"
                  value={form.appointmentId}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body-md text-body-md text-on-surface"
                >
                  <option value="">Seleccionar cita…</option>
                  {eligibleAppointments.map((apt) => {
                    const d = formatDate(apt.scheduledAt, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });
                    return (
                      <option key={apt.id} value={apt.id}>
                        {d} — {apt.notes ?? "Consulta"}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Tratamiento */}
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant">
                  Tratamiento <span className="text-error">*</span>
                </label>
                <select
                  name="catalogId"
                  value={form.catalogId}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body-md text-body-md text-on-surface"
                >
                  <option value="">Seleccionar tratamiento…</option>
                  {catalog.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Precio + Diente */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">
                    Precio acordado (ARS) <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    name="agreedPrice"
                    value={form.agreedPrice}
                    onChange={handleFormChange}
                    min={0}
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body-md text-body-md text-on-surface"
                    placeholder="0.00"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">
                    N° de diente (opcional)
                  </label>
                  <input
                    type="number"
                    name="toothNumber"
                    value={form.toothNumber}
                    onChange={handleFormChange}
                    min={1}
                    max={52}
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body-md text-body-md text-on-surface"
                    placeholder="Ej: 11"
                  />
                </div>
              </div>

              {/* Sesiones */}
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant">
                  Cantidad de sesiones
                </label>
                <input
                  type="number"
                  name="sessionCount"
                  value={form.sessionCount}
                  onChange={handleFormChange}
                  min={1}
                  max={20}
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body-md text-body-md text-on-surface"
                />
              </div>

              {/* Notas */}
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant">
                  Notas (opcional)
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleFormChange}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body-md text-body-md text-on-surface resize-none"
                  placeholder="Observaciones del plan…"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-outline-variant">
              <button
                onClick={() => setShowModal(false)}
                disabled={isSaving}
                className="h-10 px-4 rounded-lg border border-outline-variant text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="h-10 px-5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60"
              >
                {isSaving && (
                  <span className="material-symbols-outlined text-[16px] animate-spin">
                    progress_activity
                  </span>
                )}
                Guardar Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
