import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FinanceMetricCard } from "../features/finances/components/FinanceMetricCard";
import { TransactionsTable } from "../features/finances/components/TransactionsTable";
import { financesApi, toTransaction, type ApiInvoice } from "../features/finances/api/finances.api";
import type { Transaction } from "../features/finances/types/finances.types";

export const FinancesPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<ApiInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    financesApi
      .findAllInvoices()
      .then((data) => {
        setInvoices(data);
        setTransactions(data.map(toTransaction));
      })
      .catch(() => {
        setInvoices([]);
        setTransactions([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleRegister = () => {
    toast.info("Función de registro de ingresos/gastos en desarrollo");
  };

  const totalIngresos = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + Number(inv.total), 0);

  const totalPendiente = invoices
    .filter(
      (inv) =>
        inv.status === "issued" || inv.status === "partially_paid" || inv.status === "overdue"
    )
    .reduce((sum, inv) => sum + Number(inv.total), 0);

  const balanceNeto = totalIngresos - totalPendiente;

  const metrics = [
    {
      label: "Ingresos Totales",
      value: `$${totalIngresos.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
      icon: "trending_up",
      iconColorClass: "text-secondary",
    },
    {
      label: "Egresos Mensuales",
      value: "$0.00",
      icon: "payment",
      iconColorClass: "text-tertiary",
    },
    {
      label: "Pagos Pendientes",
      value: `$${totalPendiente.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
      icon: "schedule",
      iconColorClass: "text-error",
    },
    {
      label: "Balance Neto",
      value: `$${balanceNeto.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
      icon: "account_balance",
      iconColorClass: "text-primary-container",
      isHighlighted: true,
    },
  ];

  return (
    <div className="w-full pb-10">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="font-h1 text-h1 text-on-surface">Finanzas</h1>
        <button
          onClick={handleRegister}
          className="h-10 px-6 bg-primary-container text-on-primary rounded font-label-md text-label-md flex items-center gap-3 hover:bg-primary transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Registrar Ingreso/Gasto
        </button>
      </div>

      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {metrics.map((metric) => (
          <FinanceMetricCard key={metric.label} {...metric} />
        ))}
      </div>

      {/* Transactions Table */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <span className="material-symbols-outlined animate-spin text-primary text-4xl">
            progress_activity
          </span>
        </div>
      ) : (
        <TransactionsTable transactions={transactions} />
      )}
    </div>
  );
};
