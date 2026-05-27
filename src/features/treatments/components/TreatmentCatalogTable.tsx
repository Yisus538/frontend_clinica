import { useState } from "react";
import { useNavigate } from "react-router";
import type { Treatment, TreatmentCategory } from "../types/treatments.types";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { EmptyState } from "../../../shared/components/EmptyState";

const CATEGORY_STYLES: Record<TreatmentCategory, string> = {
  Prevención: "bg-surface-container-high text-primary",
  Estética: "bg-secondary-container text-on-secondary-container",
  Ortodoncia: "bg-primary-fixed text-on-primary-fixed",
  Cirugía: "bg-error-container text-on-error-container",
  Endodoncia: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  Periodoncia: "bg-surface-dim text-on-surface-variant",
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "USD" }).format(price);

const formatDuration = (minutes: number | null): string =>
  minutes === null ? "N/A" : `${minutes} min`;

interface TreatmentCatalogTableProps {
  treatments: Treatment[];
  onEdit?: (treatment: Treatment) => void;
  onToggleStatus?: (treatment: Treatment) => void;
}

export const TreatmentCatalogTable = ({
  treatments,
  onEdit,
  onToggleStatus,
}: TreatmentCatalogTableProps) => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (treatments.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant">
        <EmptyState
          icon="dental"
          title="No hay tratamientos registrados"
          description="Agrega los tratamientos y servicios que ofrece tu consultorio."
          actionLabel="Agregar Tratamiento"
          onAction={() => navigate("/dashboard/tratamientos/nuevo")}
        />
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface border-b border-outline-variant">
              <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">
                Nombre del Tratamiento
              </th>
              <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">
                Categoría
              </th>
              <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">
                Precio
              </th>
              <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">
                Duración
              </th>
              <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">
                Estado
              </th>
              <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/50">
            {treatments.map((treatment) => {
              const isSelected = selectedId === treatment.id;
              return (
                <tr
                  key={treatment.id}
                  className={`transition-colors group cursor-pointer ${
                    isSelected ? "bg-primary-fixed/40" : "hover:bg-surface/50"
                  }`}
                  onClick={() => setSelectedId(isSelected ? null : treatment.id)}
                >
                  {/* Name */}
                  <td className="py-4 px-6">
                    <span className="font-label-md text-label-md text-on-surface">
                      {treatment.name}
                    </span>
                    {treatment.description && (
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 max-w-xs truncate">
                        {treatment.description}
                      </p>
                    )}
                  </td>

                  {/* Category badge */}
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-medium ${
                        CATEGORY_STYLES[treatment.category]
                      }`}
                    >
                      {treatment.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-6 font-label-md text-label-md text-on-surface">
                    {formatPrice(treatment.price)}
                  </td>

                  {/* Duration */}
                  <td className="py-4 px-6 font-body-sm text-body-sm text-on-surface-variant">
                    {formatDuration(treatment.durationMinutes)}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    <StatusBadge active={treatment.status === "Activo"} />
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        title="Editar tratamiento"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit?.(treatment);
                        }}
                        className="p-1 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button
                        title={treatment.status === "Activo" ? "Desactivar" : "Activar"}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleStatus?.(treatment);
                        }}
                        className={`p-1 transition-colors cursor-pointer ${
                          treatment.status === "Activo"
                            ? "text-on-surface-variant hover:text-error"
                            : "text-on-surface-variant hover:text-secondary"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {treatment.status === "Activo" ? "toggle_on" : "toggle_off"}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-surface-container-lowest px-6 py-4 border-t border-outline-variant flex items-center justify-between">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Mostrando {treatments.length} de {treatments.length} servicios
        </p>
        <div className="flex items-center gap-1">
          <button
            className="p-1 text-outline hover:text-on-surface transition-colors disabled:opacity-50 cursor-not-allowed"
            disabled
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="w-8 h-8 rounded-md bg-primary-fixed text-primary font-label-sm flex items-center justify-center cursor-pointer">
            1
          </button>
          <button className="p-1 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};
