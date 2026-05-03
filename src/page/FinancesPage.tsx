import { toast } from "sonner";
import { FinanceMetricCard } from "../features/finances/components/FinanceMetricCard";
import { TransactionsTable } from "../features/finances/components/TransactionsTable";
import { FINANCE_METRICS, TRANSACTIONS } from "../features/finances/data/finances.mock";

export const FinancesPage = () => {
  const handleRegister = () => {
    toast.info("Función de registro de ingresos/gastos en desarrollo");
  };

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
        {FINANCE_METRICS.map((metric) => (
          <FinanceMetricCard key={metric.label} {...metric} />
        ))}
      </div>

      {/* Transactions Table */}
      <TransactionsTable transactions={TRANSACTIONS} />
    </div>
  );
};
