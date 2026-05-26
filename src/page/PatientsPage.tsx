import { useEffect, useState } from "react";
import { PatientDirectoryTable } from "../features/patients/components/PatientDirectoryTable";
import { patientsApi, toPatientRecord } from "../features/patients/api/patients.api";
import { Link } from "react-router";
import type { PatientRecord } from "../features/patients/types/patients.types";

export const PatientsPage = () => {
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    patientsApi
      .findAll()
      .then((data) => setPatients(data.map(toPatientRecord)))
      .catch(() => setPatients([]))
      .finally(() => setIsLoading(false));
  }, []);

  const activeCount = patients.filter((p) => p.status === "Activo").length;

  return (
    <div className="w-full pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="font-h1 text-h1 text-on-surface">Pacientes</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Gestión y visión general de registros de pacientes.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-outline text-[20px]">filter_list</span>
            Filtrar
          </button>
          <Link
            to="/dashboard/pacientes/nuevo"
            className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg text-on-primary font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Nuevo Paciente
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed-dim rounded-bl-full opacity-20 -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                Total de Pacientes
              </p>
              <h3 className="font-h1 text-h1 text-on-surface">{patients.length}</h3>
            </div>
            <div className="p-3 bg-surface-container-low rounded-lg text-primary">
              <span className="material-symbols-outlined">groups</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-fixed-dim rounded-bl-full opacity-20 -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                En Tratamiento
              </p>
              <h3 className="font-h1 text-h1 text-on-surface">
                {patients.filter((p) => p.status === "En Tratamiento").length}
              </h3>
            </div>
            <div className="p-3 bg-surface-container-low rounded-lg text-secondary">
              <span className="material-symbols-outlined">medical_services</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-surface-variant rounded-bl-full opacity-50 -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                Pacientes Activos
              </p>
              <h3 className="font-h1 text-h1 text-on-surface">{activeCount}</h3>
            </div>
            <div className="p-3 bg-surface-container-low rounded-lg text-tertiary">
              <span className="material-symbols-outlined">health_and_safety</span>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Table */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <span className="material-symbols-outlined animate-spin text-primary text-4xl">
            progress_activity
          </span>
        </div>
      ) : (
        <PatientDirectoryTable patients={patients} />
      )}
    </div>
  );
};
