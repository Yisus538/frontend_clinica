import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Modal } from "../../../shared/components/Modal";
import {
  financesApi,
  type ApiInvoice,
  type ApiPaymentMethod,
  getPaidAmount,
} from "../api/finances.api";
import { treatmentsApi } from "../../treatments/api/treatments.api";

interface NewInvoiceMode {
  mode: "new";
  appointmentId: string;
  patientId: string;
  treatmentName: string;
}

interface ExistingInvoiceMode {
  mode: "existing";
  invoice: ApiInvoice;
}

export type RegisterPaymentModalProps = (NewInvoiceMode | ExistingInvoiceMode) & {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const inputClass =
  "w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-md text-body-md text-on-surface disabled:bg-surface-container disabled:text-on-surface-variant disabled:cursor-default";

export const RegisterPaymentModal = (props: RegisterPaymentModalProps) => {
  const { isOpen, onClose, onSuccess } = props;

  const [methods, setMethods] = useState<ApiPaymentMethod[]>([]);
  const [invoice, setInvoice] = useState<ApiInvoice | null>(
    props.mode === "existing" ? props.invoice : null
  );
  const [total, setTotal] = useState(
    props.mode === "existing" ? String(Number(props.invoice.total)) : ""
  );
  const [amountPaid, setAmountPaid] = useState("");
  const [methodId, setMethodId] = useState("");
  const [reference, setReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const treatmentLabel =
    props.mode === "new" ? props.treatmentName : (props.invoice.appointment?.notes ?? "Consulta");

  const alreadyPaid = invoice ? getPaidAmount(invoice) : 0;

  const totalNum = parseFloat(total) || 0;
  const amountNum = parseFloat(amountPaid) || 0;
  const remaining = Math.max(0, totalNum - alreadyPaid - amountNum);

  const selectedMethod = methods.find((m) => m.id === methodId);

  useEffect(() => {
    financesApi
      .findPaymentMethods()
      .then((data) => {
        setMethods(data);
        if (data.length > 0) setMethodId(data[0].id);
      })
      .catch(() => setMethods([]));
  }, []);

  useEffect(() => {
    if (props.mode !== "new" || !props.treatmentName) return;
    treatmentsApi
      .findAll()
      .then((data) => {
        const match = data.find((t) => t.name === props.treatmentName);
        if (match) setTotal(String(Number(match.basePrice)));
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!methodId) return;
    if (amountNum <= 0) {
      toast.error("El monto pagado debe ser mayor a cero");
      return;
    }

    setIsSubmitting(true);
    try {
      let targetInvoice = invoice;

      if (!targetInvoice) {
        if (props.mode !== "new") return;
        if (totalNum <= 0) {
          toast.error("Ingresá el monto total del tratamiento");
          setIsSubmitting(false);
          return;
        }
        targetInvoice = await financesApi.createInvoice({
          appointmentId: props.appointmentId,
          patientId: props.patientId,
          subtotal: totalNum,
          total: totalNum,
        });
        setInvoice(targetInvoice);
      }

      await financesApi.registerPayment(targetInvoice.id, {
        methodId,
        amount: amountNum,
        reference: reference.trim() || undefined,
      });

      toast.success("Pago registrado correctamente");
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error && err.message.includes("409")
          ? "Ya existe una factura para esta cita"
          : "No se pudo registrar el pago";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const footer = (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onClose}
        disabled={isSubmitting}
        className="flex-1 py-2.5 px-4 border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer disabled:opacity-50"
      >
        Cancelar
      </button>
      <button
        form="register-payment-form"
        type="submit"
        disabled={isSubmitting}
        className="flex-1 py-2.5 px-4 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:bg-on-primary-fixed-variant transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <span className="material-symbols-outlined text-[16px] animate-spin">
              progress_activity
            </span>
            Guardando...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[16px]">payments</span>
            Registrar Pago
          </>
        )}
      </button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Cobro" footer={footer}>
      <form id="register-payment-form" onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
        {/* Tratamiento */}
        <div className="flex items-center gap-3 px-4 py-3 bg-surface-container rounded-lg border border-outline-variant">
          <span
            className="material-symbols-outlined text-primary text-xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            medical_services
          </span>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">
              Tratamiento
            </p>
            <p className="font-body-md text-body-md text-on-surface font-medium">
              {treatmentLabel || "Consulta"}
            </p>
          </div>
        </div>

        {/* Monto total — solo editable si estamos creando la factura */}
        {props.mode === "new" && (
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface-variant">
              Monto total del tratamiento
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body-md text-on-surface-variant">
                $
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                placeholder="0.00"
                required
                className={`${inputClass} pl-7`}
              />
            </div>
          </div>
        )}

        {/* Ya pagado (solo modo existing) */}
        {props.mode === "existing" && alreadyPaid > 0 && (
          <div className="flex justify-between items-center px-4 py-2.5 bg-secondary-container/40 rounded-lg">
            <span className="font-label-md text-label-md text-on-surface-variant">Ya abonado</span>
            <span className="font-body-md text-body-md text-secondary font-semibold">
              ${alreadyPaid.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}

        {/* Monto que paga ahora */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-md text-label-md text-on-surface-variant">
            Monto que abona ahora
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body-md text-on-surface-variant">
              $
            </span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              placeholder="0.00"
              required
              className={`${inputClass} pl-7`}
            />
          </div>
        </div>

        {/* Resumen de deuda */}
        {totalNum > 0 && amountNum > 0 && (
          <div
            className={`flex justify-between items-center px-4 py-2.5 rounded-lg border ${
              remaining === 0
                ? "bg-secondary-container/30 border-secondary/30"
                : "bg-error-container/30 border-error/30"
            }`}
          >
            <span className="font-label-md text-label-md text-on-surface-variant">
              {remaining === 0 ? "Saldo: Pagado" : "Saldo pendiente"}
            </span>
            <span
              className={`font-body-md text-body-md font-semibold ${
                remaining === 0 ? "text-secondary" : "text-error"
              }`}
            >
              {remaining === 0
                ? "✓ Cancelado"
                : `$${remaining.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`}
            </span>
          </div>
        )}

        {/* Método de pago */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-md text-label-md text-on-surface-variant">
            Método de pago
          </label>
          {methods.length === 0 ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant italic">
              No hay métodos de pago disponibles
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {methods.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethodId(m.id)}
                  className={`py-2.5 px-3 rounded-lg border-2 font-label-md text-label-md text-center transition-all cursor-pointer ${
                    methodId === m.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Referencia — solo si el método lo requiere */}
        {selectedMethod?.requiresReference && (
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface-variant">
              Referencia / Comprobante
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Nro. de transferencia, ticket, etc."
              className={inputClass}
            />
          </div>
        )}
      </form>
    </Modal>
  );
};
