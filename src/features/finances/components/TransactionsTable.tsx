import type { Transaction } from "../types/finances.types";
import { EmptyState } from "../../../shared/components/EmptyState";

const STATUS_STYLES: Record<string, string> = {
  Completado: "bg-secondary-container/30 text-secondary",
  Pendiente: "bg-error-container/50 text-error",
  Cancelado: "bg-tertiary-container/30 text-tertiary",
};

const METHOD_ICONS: Record<string, string> = {
  Tarjeta: "credit_card",
  Efectivo: "payments",
  Transferencia: "account_balance",
  Otro: "receipt_long",
};

interface TransactionsTableProps {
  transactions: Transaction[];
}

export const TransactionsTable = ({ transactions }: TransactionsTableProps) => {
  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden">
      <div className="p-6 border-b border-outline-variant bg-surface flex justify-between items-center">
        <h3 className="font-h3 text-h3 text-on-surface">Historial de Transacciones</h3>
        <button className="text-primary hover:text-primary-hover font-label-sm text-label-sm flex items-center gap-1 cursor-pointer">
          Ver todas <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
      {transactions.length === 0 ? (
        <EmptyState
          icon="receipt_long"
          title="No hay transacciones registradas"
          description="Aquí aparecerán los pagos y movimientos financieros de tu consultorio."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-bright border-b border-outline-variant">
                <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  FECHA
                </th>
                <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  PACIENTE
                </th>
                <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  TRATAMIENTO
                </th>
                <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  MONTO
                </th>
                <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  MÉTODO
                </th>
                <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  ESTADO
                </th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm text-on-surface">
              {transactions.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  <td className="py-6 px-6 whitespace-nowrap text-on-surface-variant">{t.date}</td>
                  <td className="py-6 px-6 font-medium text-on-surface">{t.patient}</td>
                  <td className="py-6 px-6 text-on-surface-variant">{t.treatment}</td>
                  <td className="py-6 px-6 font-label-md text-label-md">${t.amount.toFixed(2)}</td>
                  <td className="py-6 px-6 text-on-surface-variant">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        {METHOD_ICONS[t.method] || "receipt_long"}
                      </span>
                      {t.method}
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full font-label-sm text-[11px] uppercase tracking-wider ${STATUS_STYLES[t.status]}`}
                    >
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
