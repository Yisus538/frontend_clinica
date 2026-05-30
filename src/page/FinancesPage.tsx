import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FinanceMetricCard } from "../features/finances/components/FinanceMetricCard";
import { TransactionsTable } from "../features/finances/components/TransactionsTable";
import {
  financesApi,
  toTransaction,
  getPaidAmount,
  type ApiInvoice,
  type ApiEgreso,
  type CreateEgresoDto,
} from "../features/finances/api/finances.api";
import type { Transaction } from "../features/finances/types/finances.types";

const today = new Date().toISOString().split("T")[0];

interface EgresoForm {
  description: string;
  amount: string;
  expenseDate: string;
  category: string;
  notes: string;
}

const EMPTY_EGRESO_FORM: EgresoForm = {
  description: "",
  amount: "",
  expenseDate: today,
  category: "",
  notes: "",
};

export const FinancesPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<ApiInvoice[]>([]);
  const [egresos, setEgresos] = useState<ApiEgreso[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEgresoForm, setShowEgresoForm] = useState(false);
  const [egresoForm, setEgresoForm] = useState<EgresoForm>(EMPTY_EGRESO_FORM);
  const [isSavingEgreso, setIsSavingEgreso] = useState(false);

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

    financesApi
      .findEgresos()
      .then(setEgresos)
      .catch(() => setEgresos([]));
  }, []);

  const totalIngresos = invoices.reduce((sum, inv) => sum + getPaidAmount(inv), 0);

  const totalPendiente = invoices
    .filter(
      (inv) =>
        inv.status === "issued" || inv.status === "partially_paid" || inv.status === "overdue"
    )
    .reduce((sum, inv) => sum + Math.max(0, Number(inv.total) - getPaidAmount(inv)), 0);

  const totalEgresos = egresos.reduce((sum, e) => sum + Number(e.amount), 0);

  const balanceNeto = totalIngresos - totalEgresos - totalPendiente;

  const metrics = [
    {
      label: "Ingresos Totales",
      value: `$${totalIngresos.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
      icon: "trending_up",
      iconColorClass: "text-secondary",
    },
    {
      label: "Egresos Mensuales",
      value: `$${totalEgresos.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
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

  const handleEgresoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEgresoForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveEgreso = async () => {
    if (!egresoForm.description.trim() || !egresoForm.amount || !egresoForm.expenseDate) {
      toast.error("Completá los campos obligatorios: descripción, monto y fecha.");
      return;
    }
    const amount = parseFloat(egresoForm.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("El monto debe ser un número positivo.");
      return;
    }
    setIsSavingEgreso(true);
    const dto: CreateEgresoDto = {
      description: egresoForm.description.trim(),
      amount,
      expenseDate: egresoForm.expenseDate,
      category: egresoForm.category.trim() || undefined,
      notes: egresoForm.notes.trim() || undefined,
    };
    try {
      await financesApi.createEgreso(dto);
      const updated = await financesApi.findEgresos();
      setEgresos(updated);
      setShowEgresoForm(false);
      setEgresoForm(EMPTY_EGRESO_FORM);
      toast.success("Egreso registrado correctamente");
    } catch {
      toast.error("No se pudo registrar el egreso");
    } finally {
      setIsSavingEgreso(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-md text-body-md text-on-surface";

  return (
    <div className="w-full pb-10">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="font-h1 text-h1 text-on-surface">Finanzas</h1>
        <button
          onClick={() => setShowEgresoForm(true)}
          className="h-10 px-6 bg-primary-container text-on-primary rounded font-label-md text-label-md flex items-center gap-3 hover:bg-primary transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Registrar Egreso
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

      {/* Egreso Form Modal */}
      {showEgresoForm && (
        <div className="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-h3 text-h3 text-on-surface">Registrar Egreso</h2>
              <button
                onClick={() => {
                  setShowEgresoForm(false);
                  setEgresoForm(EMPTY_EGRESO_FORM);
                }}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-outline uppercase">
                  Descripción *
                </label>
                <input
                  name="description"
                  value={egresoForm.description}
                  onChange={handleEgresoChange}
                  placeholder="Ej: Compra de materiales"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-outline uppercase">
                    Monto *
                  </label>
                  <input
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={egresoForm.amount}
                    onChange={handleEgresoChange}
                    placeholder="0.00"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-outline uppercase">
                    Fecha *
                  </label>
                  <input
                    name="expenseDate"
                    type="date"
                    value={egresoForm.expenseDate}
                    onChange={handleEgresoChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-outline uppercase">
                  Categoría
                </label>
                <input
                  name="category"
                  value={egresoForm.category}
                  onChange={handleEgresoChange}
                  placeholder="Ej: Insumos, Mantenimiento..."
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-outline uppercase">Notas</label>
                <textarea
                  name="notes"
                  value={egresoForm.notes}
                  onChange={handleEgresoChange}
                  rows={2}
                  placeholder="Detalles adicionales..."
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowEgresoForm(false);
                  setEgresoForm(EMPTY_EGRESO_FORM);
                }}
                className="flex-1 py-2.5 px-4 border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveEgreso}
                disabled={isSavingEgreso}
                className="flex-1 py-2.5 px-4 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:opacity-90 transition-opacity shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSavingEgreso ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">
                      progress_activity
                    </span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    Guardar Egreso
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
