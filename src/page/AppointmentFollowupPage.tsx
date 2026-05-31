import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { toast } from "sonner";
import {
  appointmentsApi,
  type ApiAppointment,
  type ApiAppointmentPhoto,
} from "../features/agenda/api/appointments.api";
import { treatmentsApi, type ApiTreatment } from "../features/treatments/api/treatments.api";
import {
  financesApi,
  type ApiPaymentMethod,
  type ApiInvoice,
  getPaidAmount,
} from "../features/finances/api/finances.api";

/* ── helpers ── */
const inputCls =
  "w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest " +
  "focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all " +
  "font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant";

function fmtDateTime(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
  };
}

/* ── photo slot ── */
interface PhotoSlotProps {
  label: "before" | "after";
  photo: ApiAppointmentPhoto | undefined;
  isUploading: boolean;
  onUpload: (file: File, label: "before" | "after") => void;
  onDelete: (photo: ApiAppointmentPhoto) => void;
}

function PhotoSlot({ label, photo, isUploading, onUpload, onDelete }: PhotoSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const caption = label === "before" ? "Antes" : "Después";
  const accent =
    label === "before" ? "text-tertiary border-tertiary/30" : "text-secondary border-secondary/30";
  const accentBg = label === "before" ? "bg-tertiary/5" : "bg-secondary/5";

  return (
    <div className="flex flex-col gap-2">
      <div className={`flex items-center justify-between`}>
        <span className={`font-label-sm text-label-sm uppercase tracking-wide ${accent}`}>
          {caption}
        </span>
        {photo && (
          <button
            type="button"
            onClick={() => onDelete(photo)}
            className="text-error hover:bg-error-container rounded p-0.5 transition-colors cursor-pointer"
            title="Eliminar foto"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
          </button>
        )}
      </div>

      {photo ? (
        <div
          className="relative aspect-[4/3] rounded-xl overflow-hidden border border-outline-variant cursor-pointer group"
          onClick={() => inputRef.current?.click()}
        >
          <img src={photo.photoUrl} alt={caption} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className={`aspect-[4/3] rounded-xl border-2 border-dashed ${accent} ${accentBg} flex flex-col items-center justify-center gap-2 hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-50 w-full`}
        >
          {isUploading ? (
            <span className="material-symbols-outlined text-3xl animate-spin">
              progress_activity
            </span>
          ) : (
            <>
              <span className="material-symbols-outlined text-3xl">add_a_photo</span>
              <span className="font-label-sm text-label-sm">Subir foto</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file, label);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/* ── extra photo card ── */
function ExtraPhotoCard({
  photo,
  onDelete,
}: {
  photo: ApiAppointmentPhoto;
  onDelete: (p: ApiAppointmentPhoto) => void;
}) {
  return (
    <div className="relative aspect-square rounded-lg overflow-hidden border border-outline-variant group">
      <img src={photo.photoUrl} alt="Foto procedimiento" className="w-full h-full object-cover" />
      <button
        type="button"
        onClick={() => onDelete(photo)}
        className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        <span className="material-symbols-outlined text-[14px]">close</span>
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   Main Page
══════════════════════════════════════════════════ */
export const AppointmentFollowupPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  /* ── remote data ── */
  const [appointment, setAppointment] = useState<ApiAppointment | null>(null);
  const [treatments, setTreatments] = useState<ApiTreatment[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<ApiPaymentMethod[]>([]);
  const [existingInvoice, setExistingInvoice] = useState<ApiInvoice | null>(null);
  const [photos, setPhotos] = useState<ApiAppointmentPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* ── form state ── */
  const [evolutionNotes, setEvolutionNotes] = useState("");
  const [selectedTreatments, setSelectedTreatments] = useState<Set<string>>(new Set());

  /* ── payment ── */
  const [payTotal, setPayTotal] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payMethodId, setPayMethodId] = useState("");
  const [payReference, setPayReference] = useState("");

  /* ── next appointment ── */
  const [nextDate, setNextDate] = useState("");
  const [nextTime, setNextTime] = useState("09:00");
  const [nextTreatment, setNextTreatment] = useState("");

  /* ── photo upload ── */
  const [uploadingLabel, setUploadingLabel] = useState<string | null>(null);
  const extraPhotoRef = useRef<HTMLInputElement>(null);

  const [isSaving, setIsSaving] = useState(false);

  /* ── load data ── */
  useEffect(() => {
    if (!id) return;
    Promise.all([
      appointmentsApi.findOne(id),
      treatmentsApi.findAll(),
      financesApi.findPaymentMethods(),
      financesApi.findAllInvoices(),
      appointmentsApi.getPhotos(id),
    ])
      .then(([appt, txs, methods, invoices, existingPhotos]) => {
        setAppointment(appt);
        setEvolutionNotes(appt.notes ?? "");

        const active = txs.filter((t) => t.isActive);
        setTreatments(active);
        if (appt.notes) {
          const match = active.find((t) => t.name === appt.notes);
          if (match) {
            setSelectedTreatments(new Set([match.name]));
            setPayTotal(String(Number(match.basePrice)));
          }
        }

        setPaymentMethods(methods);
        if (methods.length > 0) setPayMethodId(methods[0].id);

        const inv = invoices.find((i) => i.appointmentId === id) ?? null;
        setExistingInvoice(inv);

        setPhotos(existingPhotos);
      })
      .catch(() => toast.error("No se pudo cargar la cita"))
      .finally(() => setIsLoading(false));
  }, [id]);

  /* ── treatment toggle ── */
  const toggleTreatment = (name: string) => {
    setSelectedTreatments((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  /* ── photo upload ── */
  const handlePhotoUpload = async (file: File, label: "before" | "after" | "other") => {
    if (!id) return;
    setUploadingLabel(label);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("label", label);
      const saved = await appointmentsApi.uploadPhoto(id, fd);
      setPhotos((prev) => [...prev, saved]);
      toast.success("Foto cargada correctamente");
    } catch {
      toast.error("No se pudo subir la foto");
    } finally {
      setUploadingLabel(null);
    }
  };

  const handlePhotoDelete = async (photo: ApiAppointmentPhoto) => {
    try {
      await appointmentsApi.deletePhoto(photo.id);
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    } catch {
      toast.error("No se pudo eliminar la foto");
    }
  };

  /* ── save ── */
  const handleSave = async () => {
    if (!id || !appointment) return;
    setIsSaving(true);
    try {
      const treatmentList = Array.from(selectedTreatments).join(", ");
      const fullNotes = [
        evolutionNotes.trim(),
        treatmentList ? `Tratamientos realizados: ${treatmentList}` : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      await appointmentsApi.update(id, {
        notes: fullNotes || undefined,
        status: "completed",
      });

      const amountNum = parseFloat(payAmount);
      if (!isNaN(amountNum) && amountNum > 0 && payMethodId) {
        const totalNum = parseFloat(payTotal) || amountNum;
        let inv = existingInvoice;
        if (!inv) {
          inv = await financesApi.createInvoice({
            appointmentId: id,
            patientId: appointment.patientId,
            subtotal: totalNum,
            total: totalNum,
          });
        }
        await financesApi.registerPayment(inv.id, {
          methodId: payMethodId,
          amount: amountNum,
          reference: payReference.trim() || undefined,
        });
      }

      if (nextDate && nextTime) {
        const scheduledAt = new Date(`${nextDate}T${nextTime}:00`);
        const treatmentMatch = treatments.find((t) => t.name === nextTreatment);
        await appointmentsApi.create({
          patientId: appointment.patientId,
          dentistId: appointment.dentistId,
          scheduledAt: scheduledAt.toISOString(),
          durationMinutes: treatmentMatch?.estimatedDurationMinutes ?? 30,
          status: "pending",
          notes: nextTreatment || undefined,
        });
      }

      toast.success("Cita completada correctamente");
      navigate("/dashboard/agenda");
    } catch {
      toast.error("No se pudo guardar el registro");
    } finally {
      setIsSaving(false);
    }
  };

  /* ── derived ── */
  const patientName = appointment?.patient
    ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
    : "—";
  const doctorName = appointment?.dentist?.user
    ? `Dr/a. ${appointment.dentist.user.firstName} ${appointment.dentist.user.lastName}`
    : "";

  const selectedMethod = paymentMethods.find((m) => m.id === payMethodId);
  const totalNum = parseFloat(payTotal) || 0;
  const amountNum = parseFloat(payAmount) || 0;
  const alreadyPaid = existingInvoice ? getPaidAmount(existingInvoice) : 0;
  const remaining = Math.max(0, totalNum - alreadyPaid - amountNum);

  const photoBefore = photos.find((p) => p.label === "before");
  const photoAfter = photos.find((p) => p.label === "after");
  const extraPhotos = photos.filter((p) => p.label === "other");

  const treatmentTotal = Array.from(selectedTreatments).reduce((sum, name) => {
    const t = treatments.find((x) => x.name === name);
    return sum + (t ? Number(t.basePrice) : 0);
  }, 0);

  /* ── loading / error ── */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <span className="material-symbols-outlined animate-spin text-primary text-5xl">
          progress_activity
        </span>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant">
          event_busy
        </span>
        <p className="font-body-md text-body-md text-on-surface-variant">No se encontró la cita.</p>
        <Link to="/dashboard/agenda" className="text-primary font-label-md hover:underline">
          Volver a la agenda
        </Link>
      </div>
    );
  }

  const { date, time } = fmtDateTime(appointment.scheduledAt);

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* ══ Header ══ */}
      <div className="flex flex-col gap-3">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 font-caption text-caption text-outline">
          <Link to="/dashboard/agenda" className="hover:text-primary transition-colors">
            Agenda
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface-variant">Completar Cita</span>
        </nav>

        {/* Title row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-h2 text-h2 text-on-surface">Completar Cita</h1>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">person</span>
                {patientName}
              </span>
              <span className="flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                {date}
              </span>
              <span className="flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                {time}
              </span>
              {doctorName && (
                <span className="flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px]">stethoscope</span>
                  {doctorName}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/dashboard/agenda"
              className="h-10 px-4 border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container-low transition-colors flex items-center"
            >
              Cancelar
            </Link>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="h-10 px-5 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {isSaving ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">
                    progress_activity
                  </span>
                  Guardando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">task_alt</span>
                  Completar y Guardar
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ══ Body ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* ─── Left column ─── */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Evolution notes */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-outline-variant bg-surface-container">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  edit_note
                </span>
              </div>
              <div>
                <h2 className="font-h3 text-h3 text-on-surface">Registro de Evolución</h2>
                <p className="font-caption text-caption text-on-surface-variant">
                  Observaciones clínicas de la sesión
                </p>
              </div>
            </div>
            <div className="p-6">
              <textarea
                value={evolutionNotes}
                onChange={(e) => setEvolutionNotes(e.target.value)}
                placeholder="Ej. Paciente sin dolor. Se realiza profilaxis con ultrasonido en cuadrante superior derecho e izquierdo. Se observa inflamación gingival leve..."
                rows={6}
                className={`${inputCls} resize-none`}
              />
            </div>
          </section>

          {/* Treatments */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant bg-surface-container">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary text-[18px]">
                    medical_services
                  </span>
                </div>
                <div>
                  <h2 className="font-h3 text-h3 text-on-surface">Tratamientos Realizados</h2>
                  <p className="font-caption text-caption text-on-surface-variant">
                    Marcá los procedimientos efectuados en esta sesión
                  </p>
                </div>
              </div>
              {selectedTreatments.size > 0 && (
                <span className="bg-secondary/10 text-secondary px-2.5 py-1 rounded-full font-label-sm text-label-sm border border-secondary/20 shrink-0">
                  {selectedTreatments.size} seleccionado{selectedTreatments.size !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div className="p-6">
              {treatments.length === 0 ? (
                <p className="font-body-sm text-body-sm text-on-surface-variant italic text-center py-4">
                  No hay tratamientos en el catálogo.
                </p>
              ) : (
                <div className="space-y-2">
                  {treatments.map((t) => {
                    const checked = selectedTreatments.has(t.name);
                    return (
                      <label
                        key={t.id}
                        className={`flex items-center gap-3 p-3.5 border rounded-xl transition-all cursor-pointer group ${
                          checked
                            ? "border-secondary/40 bg-secondary/5"
                            : "border-outline-variant hover:border-secondary/30 hover:bg-surface-container-low"
                        }`}
                      >
                        <div className="shrink-0">
                          <div
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                              checked
                                ? "bg-secondary border-secondary"
                                : "border-outline-variant group-hover:border-secondary/60"
                            }`}
                          >
                            {checked && (
                              <span className="material-symbols-outlined text-on-secondary text-[14px]">
                                check
                              </span>
                            )}
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleTreatment(t.name)}
                          className="sr-only"
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-label-md text-label-md transition-colors ${
                              checked ? "text-secondary" : "text-on-surface"
                            }`}
                          >
                            {t.name}
                          </p>
                          {t.description && (
                            <p className="font-caption text-caption text-on-surface-variant truncate">
                              {t.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            ${Number(t.basePrice).toLocaleString("es-AR")}
                          </span>
                          {checked && (
                            <span className="bg-secondary text-on-secondary px-2 py-0.5 rounded-full font-caption text-caption">
                              ✓
                            </span>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}

              {selectedTreatments.size > 0 && (
                <div className="mt-4 pt-4 border-t border-outline-variant flex items-center justify-between">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Total estimado de la sesión
                  </span>
                  <span className="font-h3 text-h3 text-secondary">
                    ${treatmentTotal.toLocaleString("es-AR")}
                  </span>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ─── Right column ─── */}
        <div className="flex flex-col gap-5">
          {/* Photos */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-outline-variant bg-surface-container">
              <div className="w-8 h-8 rounded-lg bg-outline/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-outline text-[18px]">
                  photo_camera
                </span>
              </div>
              <div>
                <h2 className="font-h3 text-h3 text-on-surface">Seguimiento Fotográfico</h2>
                <p className="font-caption text-caption text-on-surface-variant">
                  Fotos del procedimiento (almacenadas en Cloudinary)
                </p>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-5">
              {/* Before / After */}
              <div className="grid grid-cols-2 gap-3">
                <PhotoSlot
                  label="before"
                  photo={photoBefore}
                  isUploading={uploadingLabel === "before"}
                  onUpload={handlePhotoUpload}
                  onDelete={handlePhotoDelete}
                />
                <PhotoSlot
                  label="after"
                  photo={photoAfter}
                  isUploading={uploadingLabel === "after"}
                  onUpload={handlePhotoUpload}
                  onDelete={handlePhotoDelete}
                />
              </div>

              {/* Extra procedure photos */}
              {extraPhotos.length > 0 && (
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide mb-2">
                    Fotos del procedimiento
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {extraPhotos.map((p) => (
                      <ExtraPhotoCard key={p.id} photo={p} onDelete={handlePhotoDelete} />
                    ))}
                  </div>
                </div>
              )}

              {/* Add more photos */}
              <button
                type="button"
                onClick={() => extraPhotoRef.current?.click()}
                disabled={uploadingLabel === "other"}
                className="w-full py-2.5 border border-dashed border-outline-variant rounded-xl text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-50"
              >
                {uploadingLabel === "other" ? (
                  <span className="material-symbols-outlined text-[16px] animate-spin">
                    progress_activity
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
                )}
                Añadir foto del procedimiento
              </button>
              <input
                ref={extraPhotoRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  files.forEach((f) => handlePhotoUpload(f, "other"));
                  e.target.value = "";
                }}
              />
            </div>
          </section>

          {/* Payment */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden border-t-[3px] border-t-secondary">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-outline-variant bg-surface-container">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-secondary text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  payments
                </span>
              </div>
              <div>
                <h2 className="font-h3 text-h3 text-on-surface">Registrar Cobro</h2>
                <p className="font-caption text-caption text-on-surface-variant">
                  {existingInvoice
                    ? "Factura ya generada"
                    : "Opcional — completar si se cobra ahora"}
                </p>
              </div>
            </div>

            <div className="p-6">
              {existingInvoice ? (
                <div className="flex items-center gap-3 px-4 py-3.5 bg-secondary/5 rounded-xl border border-secondary/20">
                  <span
                    className="material-symbols-outlined text-secondary text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <div>
                    <p className="font-label-md text-label-md text-secondary">Factura registrada</p>
                    <p className="font-caption text-caption text-on-surface-variant">
                      {existingInvoice.number} · $
                      {Number(existingInvoice.total).toLocaleString("es-AR")}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">
                        Total
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-body-sm">
                          $
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={payTotal}
                          onChange={(e) => setPayTotal(e.target.value)}
                          placeholder="0.00"
                          className={`${inputCls} pl-6`}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">
                        Abona ahora
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-body-sm">
                          $
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={payAmount}
                          onChange={(e) => setPayAmount(e.target.value)}
                          placeholder="0.00"
                          className={`${inputCls} pl-6`}
                        />
                      </div>
                    </div>
                  </div>

                  {totalNum > 0 && amountNum > 0 && (
                    <div
                      className={`flex justify-between items-center px-4 py-2.5 rounded-xl border font-label-md text-label-md ${
                        remaining === 0
                          ? "bg-secondary/5 border-secondary/20 text-secondary"
                          : "bg-error-container/30 border-error/20 text-error"
                      }`}
                    >
                      <span>{remaining === 0 ? "Pagado" : "Saldo pendiente"}</span>
                      <span>
                        {remaining === 0
                          ? "✓ Cancelado"
                          : `$${remaining.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`}
                      </span>
                    </div>
                  )}

                  {paymentMethods.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">
                        Método de pago
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {paymentMethods.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setPayMethodId(m.id)}
                            className={`py-2 px-2 rounded-lg border-2 font-label-sm text-label-sm text-center transition-all cursor-pointer ${
                              payMethodId === m.id
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-outline-variant text-on-surface-variant hover:border-primary/40"
                            }`}
                          >
                            {m.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedMethod?.requiresReference && (
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">
                        Referencia / Comprobante
                      </label>
                      <input
                        type="text"
                        value={payReference}
                        onChange={(e) => setPayReference(e.target.value)}
                        placeholder="Nro. transferencia, ticket..."
                        className={inputCls}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Next appointment */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden border-t-[3px] border-t-primary">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-outline-variant bg-surface-container">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-[18px]">event</span>
              </div>
              <div>
                <h2 className="font-h3 text-h3 text-on-surface">Próxima Cita</h2>
                <p className="font-caption text-caption text-on-surface-variant">
                  Opcional — programá la siguiente visita
                </p>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={nextDate}
                    onChange={(e) => setNextDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">
                    Hora
                  </label>
                  <input
                    type="time"
                    value={nextTime}
                    onChange={(e) => setNextTime(e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">
                  Tratamiento
                </label>
                <div className="relative">
                  <select
                    value={nextTreatment}
                    onChange={(e) => setNextTreatment(e.target.value)}
                    className={`${inputCls} appearance-none pr-8 cursor-pointer`}
                  >
                    <option value="">Sin tratamiento específico</option>
                    {treatments.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                    arrow_drop_down
                  </span>
                </div>
              </div>

              {nextDate && nextTime && (
                <div className="flex items-start gap-2 px-4 py-3 bg-primary/5 rounded-xl border border-primary/20">
                  <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">
                    event_upcoming
                  </span>
                  <p className="font-body-sm text-body-sm text-primary">
                    Se agendará para el{" "}
                    <strong>
                      {new Date(`${nextDate}T${nextTime}`).toLocaleDateString("es-AR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </strong>{" "}
                    a las <strong>{nextTime}hs</strong>
                    {nextTreatment && ` · ${nextTreatment}`}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
