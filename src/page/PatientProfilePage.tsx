import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { ClinicalHistoryModal } from "../features/patients/components/clinical-history/ClinicalHistoryModal";
import { patientsApi, type ApiPatient } from "../features/patients/api/patients.api";

const STATUS_LABEL: Record<ApiPatient["status"], string> = {
  active: "Activo",
  in_treatment: "En Tratamiento",
  inactive: "Inactivo",
};

const STATUS_CLASS: Record<ApiPatient["status"], string> = {
  active: "bg-secondary-container text-on-secondary-container",
  in_treatment: "bg-surface-container-high text-primary",
  inactive: "bg-tertiary-fixed-dim text-on-tertiary-fixed-variant",
};

export const PatientProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isClinicalHistoryModalOpen, setIsClinicalHistoryModalOpen] = useState(false);
  const [patient, setPatient] = useState<ApiPatient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    patientsApi
      .findOne(id)
      .then(setPatient)
      .catch(() => setPatient(null))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">
          progress_activity
        </span>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center py-16 gap-4">
        <span className="material-symbols-outlined text-error text-5xl">error</span>
        <p className="text-on-surface-variant">Paciente no encontrado.</p>
        <Link to="/dashboard/pacientes" className="text-primary hover:underline">
          Volver a Pacientes
        </Link>
      </div>
    );
  }

  const fullName = `${patient.firstName} ${patient.lastName}`;
  const initials = `${patient.firstName[0] ?? ""}${patient.lastName[0] ?? ""}`.toUpperCase();

  return (
    <div className="flex-1 w-full mx-auto pb-10">
      {/* Page Header */}
      <div className="mb-10">
        <nav className="flex text-on-surface-variant font-caption text-caption mb-1">
          <Link to="/dashboard/pacientes" className="hover:text-primary transition-colors">
            Pacientes
          </Link>
          <span className="mx-2">/</span>
          <span className="text-on-surface font-medium">{fullName}</span>
        </nav>
        <div className="flex items-center gap-6">
          <h1 className="font-h1 text-h1 text-on-surface">{fullName}</h1>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider ${STATUS_CLASS[patient.status]}`}
          >
            <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
            {STATUS_LABEL[patient.status]}
          </span>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column (Narrow) */}
        <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-6">
          {/* Patient Profile Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
            <div className="w-24 h-24 rounded-full bg-primary text-on-primary flex items-center justify-center text-3xl font-bold mb-4 border-2 border-surface-container">
              {initials}
            </div>
            <h2 className="font-h3 text-h3 text-on-surface mb-1">{fullName}</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
              DNI: {patient.dni}
            </p>
            <div className="w-full border-t border-outline-variant pt-4 flex flex-col gap-3 text-left">
              {patient.dateOfBirth && (
                <div className="flex justify-between items-center">
                  <span className="font-label-sm text-label-sm text-outline">F. NAC.</span>
                  <span className="font-body-md text-body-md text-on-surface font-medium">
                    {new Date(patient.dateOfBirth).toLocaleDateString("es-AR")}
                  </span>
                </div>
              )}
              {patient.phone && (
                <div className="flex justify-between items-center">
                  <span className="font-label-sm text-label-sm text-outline">TELÉFONO</span>
                  <span className="font-body-md text-body-md text-on-surface font-medium text-primary">
                    {patient.phone}
                  </span>
                </div>
              )}
              {patient.email && (
                <div className="flex justify-between items-center">
                  <span className="font-label-sm text-label-sm text-outline">EMAIL</span>
                  <span className="font-body-sm text-body-sm text-on-surface">{patient.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-3 pl-1">
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => navigate("/dashboard/agenda/nueva-cita")}
                className="bg-surface-container-lowest border border-outline-variant hover:border-primary hover:bg-surface-container-low transition-all duration-200 rounded-lg aspect-square flex flex-col items-center justify-center p-2 text-primary group cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined mb-2 group-hover:scale-110 transition-transform">
                  calendar_add_on
                </span>
                <span className="font-label-sm text-[10px] text-center leading-tight">
                  Nueva Cita
                </span>
              </button>
              <button className="bg-surface-container-lowest border border-outline-variant hover:border-primary hover:bg-surface-container-low transition-all duration-200 rounded-lg aspect-square flex flex-col items-center justify-center p-2 text-primary group cursor-pointer shadow-sm">
                <span className="material-symbols-outlined mb-2 group-hover:scale-110 transition-transform">
                  prescriptions
                </span>
                <span className="font-label-sm text-[10px] text-center leading-tight">
                  Nueva Receta
                </span>
              </button>
              <button className="bg-surface-container-lowest border border-outline-variant hover:border-primary hover:bg-surface-container-low transition-all duration-200 rounded-lg aspect-square flex flex-col items-center justify-center p-2 text-primary group cursor-pointer shadow-sm">
                <span className="material-symbols-outlined mb-2 group-hover:scale-110 transition-transform">
                  upload_file
                </span>
                <span className="font-label-sm text-[10px] text-center leading-tight">
                  Subir Doc
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (Wide) */}
        <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-10">
          {/* Clinical History Button */}
          <button
            onClick={() => setIsClinicalHistoryModalOpen(true)}
            className="w-full bg-primary hover:bg-on-primary-fixed-variant transition-colors duration-200 rounded-xl p-6 flex items-center justify-between text-on-primary group shadow-md cursor-pointer"
          >
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-3xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  medical_information
                </span>
              </div>
              <div className="text-left">
                <h2 className="font-h3 text-h3 font-bold mb-1">Abrir Historial Clínico Médico</h2>
                <p className="font-body-sm text-body-sm text-primary-fixed-dim">
                  Ver odontograma, periodontograma y notas clínicas completas.
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-3xl group-hover:translate-x-2 transition-transform">
              arrow_forward
            </span>
          </button>

          {/* Personal Information */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <h3 className="font-h3 text-h3 text-on-surface mb-6 pb-3 border-b border-outline-variant">
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {patient.dateOfBirth && (
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-outline uppercase">
                    Fecha de Nacimiento
                  </label>
                  <span className="font-body-md text-body-md text-on-surface">
                    {new Date(patient.dateOfBirth).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
              {patient.address && (
                <div className="flex flex-col gap-1 lg:col-span-2">
                  <label className="font-label-sm text-label-sm text-outline uppercase">
                    Dirección
                  </label>
                  <span className="font-body-md text-body-md text-on-surface">
                    {patient.address}
                  </span>
                </div>
              )}
              {patient.email && (
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-outline uppercase">
                    Correo Electrónico
                  </label>
                  <span className="font-body-md text-body-md text-on-surface">{patient.email}</span>
                </div>
              )}
              {patient.notes && (
                <div className="flex flex-col gap-1 lg:col-span-3">
                  <label className="font-label-sm text-label-sm text-outline uppercase">
                    Notas
                  </label>
                  <span className="font-body-md text-body-md text-on-surface">{patient.notes}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ClinicalHistoryModal
        isOpen={isClinicalHistoryModalOpen}
        onClose={() => setIsClinicalHistoryModalOpen(false)}
      />
    </div>
  );
};
