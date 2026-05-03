import { useState } from "react";
import { StatCard } from "../shared/components/StatCard";
import { TreatmentCatalogTable } from "../features/treatments/components/TreatmentCatalogTable";
import { TREATMENTS_MOCK, TREATMENTS_STATS } from "../features/treatments/data/treatments.mock";
import type { Treatment } from "../features/treatments/types/treatments.types";

export const TreatmentsPage = () => {
  const [treatments, setTreatments] = useState<Treatment[]>(TREATMENTS_MOCK);

  const handleToggleStatus = (target: Treatment) => {
    setTreatments((prev) =>
      prev.map((t) =>
        t.id === target.id
          ? { ...t, status: t.status === "Activo" ? "Inactivo" : "Activo" }
          : t
      )
    );
  };

  const handleEdit = (_treatment: Treatment) => {
    // TODO: open edit modal/drawer
  };

  const activeCount = treatments.filter((t) => t.status === "Activo").length;
  const categoryCount = new Set(treatments.map((t) => t.category)).size;

  return (
    <div className="w-full pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-h1 text-h1 text-on-surface">Tratamientos</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Catálogo y gestión de servicios odontológicos.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-outline text-[20px]">
              filter_list
            </span>
            Filtrar
          </button>
          <button
            id="btn-new-treatment"
            className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg text-on-primary font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Nuevo Tratamiento
          </button>
        </div>
      </div>

      {/* Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Total de Servicios"
          value={TREATMENTS_STATS.total}
          icon="medical_services"
          accentClass="text-primary"
          orbClass="bg-primary-fixed-dim"
        />
        <StatCard
          label="Categorías"
          value={categoryCount}
          icon="category"
          accentClass="text-secondary"
          orbClass="bg-secondary-fixed-dim"
        />
        <StatCard
          label="Servicios Activos"
          value={activeCount}
          icon="trending_up"
          accentClass="text-tertiary"
          orbClass="bg-surface-variant"
        />
      </div>

      {/* Catalog Table */}
      <TreatmentCatalogTable
        treatments={treatments}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
};
