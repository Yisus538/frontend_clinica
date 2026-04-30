import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { ClinicalHistoryModal } from "../features/patients/components/clinical-history/ClinicalHistoryModal";

export const PatientProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isClinicalHistoryModalOpen, setIsClinicalHistoryModalOpen] = useState(false);

  return (
    <div className="flex-1 w-full mx-auto pb-10">
      {/* Page Header */}
      <div className="mb-10">
        <nav className="flex text-on-surface-variant font-caption text-caption mb-1">
          <Link to="/dashboard/pacientes" className="hover:text-primary transition-colors">Pacientes</Link>
          <span className="mx-2">/</span>
          <span className="text-on-surface font-medium">María González</span>
        </nav>
        <div className="flex items-center gap-6">
          <h1 className="font-h1 text-h1 text-on-surface">María González</h1>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-secondary mr-2"></span>
            Activo
          </span>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column (Narrow) */}
        <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-6">
          {/* Patient Profile Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-surface-container">
              <img alt="María González" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkU7KkxGIwNO7cOSho32jvALJ-MT_kuwSXvMLjhWhsziwzrng4bDm284ssl5wwiuoRGYJYrFX4C_bsvRhPBQe1swWscz7lUePH4_12KnqrmPPAZ5iE0cOMvKOocl22NIoeK9jykKd63hx8piL2G1eR45CpByt0sFuEkvIa7RSKX8PVv5c0XqYxX2zv1KujoT-gV5B4KflCOMwXV8Vd3DzyE12hFLO1KgyXZmBDmrpIgQkS5IbhhYQ8xTV6k35WS1W836WbLaNNUYc" />
            </div>
            <h2 className="font-h3 text-h3 text-on-surface mb-1">María González</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">ID: {id || '45892103F'}</p>
            <div className="w-full border-t border-outline-variant pt-4 flex flex-col gap-3 text-left">
              <div className="flex justify-between items-center">
                <span className="font-label-sm text-label-sm text-outline">EDAD</span>
                <span className="font-body-md text-body-md text-on-surface font-medium">42 años</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-label-sm text-label-sm text-outline">SANGRE</span>
                <span className="font-body-md text-body-md text-on-surface font-medium">O+</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-label-sm text-label-sm text-outline">TELÉFONO</span>
                <span className="font-body-md text-body-md text-on-surface font-medium text-primary">655 432 109</span>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div>
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-3 pl-1">Acciones Rápidas</h3>
            <div className="grid grid-cols-3 gap-1">
              <button 
                onClick={() => navigate("/dashboard/agenda/nueva-cita")}
                className="bg-surface-container-lowest border border-outline-variant hover:border-primary hover:bg-surface-container-low transition-all duration-200 rounded-lg aspect-square flex flex-col items-center justify-center p-2 text-primary group cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined mb-2 group-hover:scale-110 transition-transform">calendar_add_on</span>
                <span className="font-label-sm text-[10px] text-center leading-tight">Nueva Cita</span>
              </button>
              <button className="bg-surface-container-lowest border border-outline-variant hover:border-primary hover:bg-surface-container-low transition-all duration-200 rounded-lg aspect-square flex flex-col items-center justify-center p-2 text-primary group cursor-pointer shadow-sm">
                <span className="material-symbols-outlined mb-2 group-hover:scale-110 transition-transform">prescriptions</span>
                <span className="font-label-sm text-[10px] text-center leading-tight">Nueva Receta</span>
              </button>
              <button className="bg-surface-container-lowest border border-outline-variant hover:border-primary hover:bg-surface-container-low transition-all duration-200 rounded-lg aspect-square flex flex-col items-center justify-center p-2 text-primary group cursor-pointer shadow-sm">
                <span className="material-symbols-outlined mb-2 group-hover:scale-110 transition-transform">upload_file</span>
                <span className="font-label-sm text-[10px] text-center leading-tight">Subir Doc</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (Wide) */}
        <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-10">
          {/* Clinical History Giant Button */}
          <button 
            onClick={() => setIsClinicalHistoryModalOpen(true)}
            className="w-full bg-primary hover:bg-on-primary-fixed-variant transition-colors duration-200 rounded-xl p-6 flex items-center justify-between text-on-primary group shadow-md cursor-pointer"
          >
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>medical_information</span>
              </div>
              <div className="text-left">
                <h2 className="font-h3 text-h3 font-bold mb-1">Abrir Historial Clínico Médico</h2>
                <p className="font-body-sm text-body-sm text-primary-fixed-dim">Ver odontograma, periodontograma y notas clínicas completas.</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-3xl group-hover:translate-x-2 transition-transform">arrow_forward</span>
          </button>

          {/* Personal Information */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <h3 className="font-h3 text-h3 text-on-surface mb-6 pb-3 border-b border-outline-variant">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-outline uppercase">Fecha de Nacimiento</label>
                <span className="font-body-md text-body-md text-on-surface">14 de Marzo, 1982</span>
              </div>
              <div className="flex flex-col gap-1 lg:col-span-2">
                <label className="font-label-sm text-label-sm text-outline uppercase">Dirección</label>
                <span className="font-body-md text-body-md text-on-surface">Calle de Alcalá 124, 3ºB, 28009, Madrid</span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-outline uppercase">Correo Electrónico</label>
                <span className="font-body-md text-body-md text-on-surface">maria.gonzalez82@email.com</span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-outline uppercase">Ocupación</label>
                <span className="font-body-md text-body-md text-on-surface">Arquitecta</span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-outline uppercase">Alergias Conocidas</label>
                <span className="font-body-md text-body-md text-error font-medium">Penicilina</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Recent Treatments */}
            <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-outline-variant">
                <h3 className="font-h3 text-h3 text-on-surface">Tratamientos Recientes</h3>
                <button className="text-primary font-label-md text-label-md hover:underline cursor-pointer">Ver Todos</button>
              </div>
              <div className="flex flex-col w-full">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-3 px-2 pb-2 font-label-sm text-label-sm text-outline uppercase">
                  <div className="col-span-4">Tratamiento</div>
                  <div className="col-span-3">Fecha</div>
                  <div className="col-span-3">Odontólogo</div>
                  <div className="col-span-2 text-right">Estado</div>
                </div>
                {/* Rows */}
                <div className="grid grid-cols-12 gap-3 px-2 py-3 border-t border-outline-variant items-center hover:bg-surface-container transition-colors cursor-pointer rounded-lg">
                  <div className="col-span-4 font-body-sm text-body-sm text-on-surface font-medium">Limpieza Dental</div>
                  <div className="col-span-3 font-body-sm text-body-sm text-on-surface-variant">12 Oct 2023</div>
                  <div className="col-span-3 font-body-sm text-body-sm text-on-surface-variant">Dra. Ruiz</div>
                  <div className="col-span-2 flex justify-end">
                    <span className="inline-flex px-2 py-1 bg-surface-container-highest text-on-surface rounded-full font-caption text-caption">Completado</span>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-3 px-2 py-3 border-t border-outline-variant items-center hover:bg-surface-container transition-colors cursor-pointer rounded-lg">
                  <div className="col-span-4 font-body-sm text-body-sm text-on-surface font-medium">Revisión Ortodoncia</div>
                  <div className="col-span-3 font-body-sm text-body-sm text-on-surface-variant">05 Sep 2023</div>
                  <div className="col-span-3 font-body-sm text-body-sm text-on-surface-variant">Dr. Silva</div>
                  <div className="col-span-2 flex justify-end">
                    <span className="inline-flex px-2 py-1 bg-surface-container-highest text-on-surface rounded-full font-caption text-caption">Completado</span>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-3 px-2 py-3 border-t border-outline-variant items-center hover:bg-surface-container transition-colors cursor-pointer rounded-lg">
                  <div className="col-span-4 font-body-sm text-body-sm text-on-surface font-medium">Empaste Composite</div>
                  <div className="col-span-3 font-body-sm text-body-sm text-on-surface-variant">14 Jul 2023</div>
                  <div className="col-span-3 font-body-sm text-body-sm text-on-surface-variant">Dra. Ruiz</div>
                  <div className="col-span-2 flex justify-end">
                    <span className="inline-flex px-2 py-1 bg-surface-container-highest text-on-surface rounded-full font-caption text-caption">Completado</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="lg:col-span-1 bg-primary-fixed border border-primary-fixed-dim rounded-xl p-6 relative overflow-hidden shadow-sm">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
              <h3 className="font-h3 text-h3 text-on-primary-fixed mb-6 relative z-10">Próxima Cita</h3>
              <div className="bg-surface-container-lowest rounded-lg p-3 border border-outline-variant relative z-10 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-md bg-surface-container-high flex items-center justify-center text-primary flex-shrink-0">
                    <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>event</span>
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface mb-1">Revisión Semestral</h4>
                    <p className="font-caption text-caption text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span> 10:30 AM - 11:00 AM
                    </p>
                  </div>
                </div>
                <div className="border-t border-outline-variant pt-3 mt-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-caption text-caption text-outline">Fecha</span>
                    <span className="font-label-sm text-label-sm text-on-surface font-semibold">24 Noviembre, 2023</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-caption text-caption text-outline">Odontólogo</span>
                    <span className="font-label-sm text-label-sm text-on-surface">Dra. Ruiz (Box 3)</span>
                  </div>
                </div>
              </div>
              <button className="w-full mt-3 py-2 rounded-lg border border-primary text-primary font-label-md text-label-md hover:bg-primary hover:text-white transition-colors duration-200 relative z-10 cursor-pointer bg-transparent">
                Modificar Cita
              </button>
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
