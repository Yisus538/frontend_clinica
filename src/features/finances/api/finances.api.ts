import { apiClient } from "../../../shared/api/client";
import type { Transaction, TransactionStatus, TransactionMethod } from "../types/finances.types";

type BackendInvoiceStatus =
  | "draft"
  | "issued"
  | "paid"
  | "partially_paid"
  | "cancelled"
  | "overdue";

interface ApiPaymentMethod {
  id: string;
  name: string;
}

interface ApiPayment {
  id: string;
  amount: number;
  status: string;
  paymentMethod?: ApiPaymentMethod;
}

interface ApiPatientRef {
  id: string;
  firstName: string;
  lastName: string;
}

interface ApiAppointmentRef {
  id: string;
  notes: string | null;
}

export interface ApiInvoice {
  id: string;
  number: string;
  appointmentId: string;
  patientId: string;
  status: BackendInvoiceStatus;
  subtotal: number;
  taxAmount: number;
  insuranceCoverage: number;
  total: number;
  dueDate: string | null;
  createdAt: string;
  patient?: ApiPatientRef;
  appointment?: ApiAppointmentRef;
  payments?: ApiPayment[];
}

const STATUS_MAP: Record<BackendInvoiceStatus, TransactionStatus> = {
  draft: "Pendiente",
  issued: "Pendiente",
  paid: "Completado",
  partially_paid: "Pendiente",
  cancelled: "Cancelado",
  overdue: "Pendiente",
};

function resolveMethod(name: string | undefined): TransactionMethod {
  if (!name) return "Otro";
  const n = name.toLowerCase();
  if (n.includes("tarjeta") || n.includes("card") || n.includes("credito") || n.includes("debito"))
    return "Tarjeta";
  if (n.includes("efectivo") || n.includes("cash")) return "Efectivo";
  if (n.includes("transfer")) return "Transferencia";
  return "Otro";
}

export function toTransaction(inv: ApiInvoice): Transaction {
  const patientName = inv.patient
    ? `${inv.patient.firstName} ${inv.patient.lastName}`
    : inv.patientId;
  const treatment = inv.appointment?.notes ?? "—";
  const method = resolveMethod(inv.payments?.[0]?.paymentMethod?.name);
  const dateStr = inv.dueDate ?? inv.createdAt;
  const date = new Date(dateStr).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return {
    id: inv.number,
    date,
    patient: patientName,
    treatment,
    amount: Number(inv.total),
    method,
    status: STATUS_MAP[inv.status],
  };
}

export const financesApi = {
  findAllInvoices: () => apiClient.get<ApiInvoice[]>("/finances/invoices"),
};
