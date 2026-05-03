import type { FinanceMetric, Transaction } from "../types/finances.types";

export const FINANCE_METRICS: FinanceMetric[] = [
  {
    label: "Ingresos Totales",
    value: "$12,450.00",
    icon: "trending_up",
    iconColorClass: "text-secondary",
    trend: {
      value: "+8%",
      icon: "arrow_upward",
      colorClass: "text-secondary",
      bgClass: "bg-secondary-container/20",
    },
  },
  {
    label: "Egresos Mensuales",
    value: "$4,120.00",
    icon: "payment",
    iconColorClass: "text-tertiary",
  },
  {
    label: "Pagos Pendientes",
    value: "$3,450.00",
    icon: "schedule",
    iconColorClass: "text-error",
  },
  {
    label: "Balance Neto",
    value: "$8,330.00",
    icon: "account_balance",
    iconColorClass: "text-primary-container",
    isHighlighted: true,
  },
];

export const TRANSACTIONS: Transaction[] = [
  {
    id: "TRX-001",
    date: "12 Oct 2023",
    patient: "Ana García",
    treatment: "Limpieza Dental",
    amount: 150.00,
    method: "Tarjeta",
    status: "Completado",
  },
  {
    id: "TRX-002",
    date: "12 Oct 2023",
    patient: "Carlos López",
    treatment: "Extracción",
    amount: 320.00,
    method: "Efectivo",
    status: "Completado",
  },
  {
    id: "TRX-003",
    date: "11 Oct 2023",
    patient: "María Rodríguez",
    treatment: "Endodoncia",
    amount: 850.00,
    method: "Transferencia",
    status: "Pendiente",
  },
  {
    id: "TRX-004",
    date: "10 Oct 2023",
    patient: "Juan Pérez",
    treatment: "Blanqueamiento",
    amount: 200.00,
    method: "Tarjeta",
    status: "Completado",
  },
];
