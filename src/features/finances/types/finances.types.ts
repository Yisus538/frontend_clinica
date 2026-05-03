export type TransactionStatus = "Completado" | "Pendiente" | "Cancelado";
export type TransactionMethod = "Tarjeta" | "Efectivo" | "Transferencia" | "Otro";

export interface Transaction {
  id: string;
  date: string;
  patient: string;
  treatment: string;
  amount: number;
  method: TransactionMethod;
  status: TransactionStatus;
}

export interface FinanceMetric {
  label: string;
  value: string;
  icon: string;
  iconColorClass: string;
  trend?: {
    value: string;
    icon: string;
    colorClass: string;
    bgClass: string;
  };
  isHighlighted?: boolean;
}
