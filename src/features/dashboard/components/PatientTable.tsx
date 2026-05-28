import type { PatientRow } from "../types/dashboard.types";
import { EmptyState } from "../../../shared/components/EmptyState";

const STATUS_STYLES: Record<PatientRow["status"], string> = {
  Completado: "bg-primary-container text-on-primary-container",
  Pendiente: "bg-error-container text-on-error-container",
  Planeado: "bg-surface-variant text-on-surface-variant",
  "En progreso": "bg-secondary-container text-on-secondary-container",
};

interface PatientTableProps {
  patients: PatientRow[];
}

export const PatientTable = ({ patients }: PatientTableProps) => {
  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-outline-variant flex justify-between items-center">
        <h2 className="font-h3 text-h3 text-on-surface">Pacientes Recientes</h2>
        <button
          id="btn-view-all-patients"
          className="font-label-sm text-label-sm text-primary hover:text-on-primary-fixed-variant transition-colors cursor-pointer"
        >
          Ver todos
        </button>
      </div>

      {/* Table */}
      {patients.length === 0 ? (
        <EmptyState
          icon="group"
          title="No hay pacientes recientes"
          description="Aquí aparecerán los pacientes que hayas atendido o registrado recientemente."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-outline-variant">
                <th className="py-3 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">
                  PACIENTE
                </th>
                <th className="py-3 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">
                  TRATAMIENTO
                </th>
                <th className="py-3 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">
                  ESTADO
                </th>
                <th className="py-3 px-6 font-label-md text-label-md text-on-surface-variant font-semibold text-right">
                  ÚLTIMA VISITA
                </th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, idx) => (
                <tr
                  key={patient.id}
                  className={`hover:bg-surface transition-colors cursor-pointer ${
                    idx < patients.length - 1 ? "border-b border-outline-variant" : ""
                  }`}
                >
                  <td className="py-6 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-label-sm text-primary font-bold uppercase">
                        {patient.initials}
                      </div>
                      <div>
                        <div className="font-label-md text-label-md text-on-surface">
                          {patient.name}
                        </div>
                        <div className="font-caption text-caption text-on-surface-variant">
                          ID: {patient.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-6 font-body-sm text-body-sm text-on-surface">
                    {patient.treatment}
                  </td>
                  <td className="py-6 px-6">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full font-label-sm text-label-sm ${STATUS_STYLES[patient.status]}`}
                    >
                      {patient.status}
                    </span>
                  </td>
                  <td className="py-6 px-6 font-body-sm text-body-sm text-on-surface-variant text-right">
                    {patient.lastVisit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
