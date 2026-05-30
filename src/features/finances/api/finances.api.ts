import { apiClient } from "../../../shared/api/client";
import type { Transaction, TransactionStatus, TransactionMethod } from "../types/finances.types";
import { formatDate } from "../../../shared/utils/date";

type BackendInvoiceStatus =
  | "draft"
  | "issued"
  | "paid"
  | "partially_paid"
  | "cancelled"
  | "overdue";

export interface ApiPaymentMethod {
  id: string;
  name: string;
  requiresReference: boolean;
  isActive: boolean;
}

interface ApiPaymentRecord {
  id: string;
  amount: number;
  status: string;
  paidAt: string | null;
  reference: string | null;
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
  payments?: ApiPaymentRecord[];
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
  const date = formatDate(dateStr, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const paid = getPaidAmount(inv);
  const remaining = Math.max(0, Number(inv.total) - paid);
  const amount =
    inv.status === "paid" || inv.status === "cancelled" ? Number(inv.total) : remaining;

  return {
    id: inv.number,
    date,
    patient: patientName,
    treatment,
    amount,
    method,
    status: STATUS_MAP[inv.status],
  };
}

export function getPaidAmount(inv: ApiInvoice): number {
  return (inv.payments ?? [])
    .filter((p) => p.status === "approved")
    .reduce((sum, p) => sum + Number(p.amount), 0);
}

export type { BackendInvoiceStatus };

export interface CreateInvoicePayload {
  appointmentId: string;
  patientId: string;
  subtotal: number;
  total: number;
  taxAmount?: number;
  insuranceCoverage?: number;
  dueDate?: string;
}

export interface RegisterPaymentPayload {
  methodId: string;
  amount: number;
  reference?: string;
}

export interface ApiEgreso {
  id: string;
  description: string;
  amount: number;
  category: string | null;
  expenseDate: string;
  notes: string | null;
  createdAt: string;
}

export interface CreateEgresoDto {
  description: string;
  amount: number;
  category?: string;
  expenseDate: string;
  notes?: string;
}

export const financesApi = {
  findAllInvoices: () => apiClient.get<ApiInvoice[]>("/finances/invoices"),
  findInvoicesByPatient: (patientId: string) =>
    apiClient.get<ApiInvoice[]>(`/finances/invoices/patient/${patientId}`),
  createInvoice: (payload: CreateInvoicePayload) =>
    apiClient.post<ApiInvoice>("/finances/invoices", payload),
  registerPayment: (invoiceId: string, payload: RegisterPaymentPayload) =>
    apiClient.post<{ id: string }>(`/finances/invoices/${invoiceId}/payments`, payload),
  findPaymentMethods: () => apiClient.get<ApiPaymentMethod[]>("/finances/payment-methods"),
  findEgresos: () => apiClient.get<ApiEgreso[]>("/finances/egresos"),
  createEgreso: (dto: CreateEgresoDto) => apiClient.post<ApiEgreso>("/finances/egresos", dto),
};
