import type { PatientRecord, PatientStatus } from "../types/patients.types";
import { useNavigate } from "react-router";
import { EmptyState } from "../../../shared/components/EmptyState";

const STATUS_STYLES: Record<PatientStatus, string> = {
  "En Tratamiento": "bg-surface-container-high text-primary",
  Activo: "bg-secondary-container text-on-secondary-container",
  Inactivo: "bg-tertiary-fixed-dim text-on-tertiary-fixed-variant",
};

interface PatientDirectoryTableProps {
  patients: PatientRecord[];
}

export const PatientDirectoryTable = ({ patients }: PatientDirectoryTableProps) => {
  const navigate = useNavigate();

  if (patients.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant">
        <EmptyState
          icon="person_add"
          title="No hay pacientes registrados"
          description="Comienza a gestionar tu consultorio agregando a tu primer paciente."
          actionLabel="Agregar Paciente"
          onAction={() => navigate("/dashboard/pacientes/nuevo")}
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
                Nombre del Paciente
              </th>
              <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">
                ID/DNI
              </th>
              <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">
                Última Visita
              </th>
              <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">
                Próxima Cita
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
            {patients.map((patient) => (
              <tr
                key={patient.id}
                className="hover:bg-surface/50 transition-colors group cursor-pointer"
                onClick={() => navigate(`/dashboard/pacientes/${patient.id}`)}
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    {patient.avatarUrl ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-low">
                        <img
                          src={patient.avatarUrl}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-tertiary-fixed text-on-tertiary-fixed font-label-sm font-bold">
                        {patient.initials}
                      </div>
                    )}
                    <span className="font-label-md text-label-md text-on-surface">
                      {patient.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 font-body-sm text-body-sm text-on-surface-variant">
                  {patient.dni}
                </td>
                <td className="py-4 px-6 font-body-sm text-body-sm text-on-surface-variant">
                  {patient.lastVisit}
                </td>
                <td className="py-4 px-6 font-label-md text-label-md text-on-surface">
                  {patient.nextAppointmentDate ? (
                    <>
                      {patient.nextAppointmentDate}
                      <span className="text-on-surface-variant font-normal text-xs ml-1">
                        {patient.nextAppointmentTime}
                      </span>
                    </>
                  ) : (
                    "--"
                  )}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[patient.status]}`}
                  >
                    {patient.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                    <button className="p-1 text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-surface-container-lowest px-6 py-4 border-t border-outline-variant flex items-center justify-between">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Mostrando 1 a {patients.length} de 1,204 pacientes
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
          <button className="w-8 h-8 rounded-md hover:bg-surface text-on-surface-variant font-label-sm flex items-center justify-center transition-colors cursor-pointer">
            2
          </button>
          <button className="w-8 h-8 rounded-md hover:bg-surface text-on-surface-variant font-label-sm flex items-center justify-center transition-colors cursor-pointer">
            3
          </button>
          <span className="text-on-surface-variant mx-1">...</span>
          <button className="p-1 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};
