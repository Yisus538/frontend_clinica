import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { StatCard } from "../shared/components/StatCard";
import { TreatmentCatalogTable } from "../features/treatments/components/TreatmentCatalogTable";
import { treatmentsApi, toTreatment } from "../features/treatments/api/treatments.api";
import { TREATMENTS_STATS } from "../features/treatments/data/treatments.mock";
import type { Treatment } from "../features/treatments/types/treatments.types";

export const TreatmentsPage = () => {
  const navigate = useNavigate();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    treatmentsApi
      .findAll()
      .then((data) => setTreatments(data.map(toTreatment)))
      .catch(() => setTreatments([]))
      .finally(() => setIsLoading(false));
  }, []);

  const handleToggleStatus = (target: Treatment) => {
    const newIsActive = target.status !== "Activo";
    treatmentsApi
      .update(target.id, { isActive: newIsActive })
      .then((updated) => {
        setTreatments((prev) => prev.map((t) => (t.id === target.id ? toTreatment(updated) : t)));
        toast.info(`Tratamiento marcado como ${newIsActive ? "activo" : "inactivo"}`, {
          description: target.name,
        });
      })
      .catch(() => toast.error("No se pudo actualizar el estado del tratamiento."));
  };

  const handleEdit = () => {
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
            <span className="material-symbols-outlined text-outline text-[20px]">filter_list</span>
            Filtrar
          </button>
          <button
            id="btn-new-treatment"
            onClick={() => navigate("/dashboard/tratamientos/nuevo")}
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
          value={treatments.length || TREATMENTS_STATS.total}
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
      {isLoading ? (
        <div className="flex justify-center py-16">
          <span className="material-symbols-outlined animate-spin text-primary text-4xl">
            progress_activity
          </span>
        </div>
      ) : (
        <TreatmentCatalogTable
          treatments={treatments}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
        />
      )}
    </div>
  );
};
