import { useNavigate } from "react-router";

export const NewAppointmentPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-64px-48px)] overflow-y-auto pb-10">
      <div className="mb-8">
        <h2 className="font-h1 text-h1 text-on-surface mb-2">Nueva Cita</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Programe una nueva consulta para un paciente existente o registre uno nuevo.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-8">
        <form onSubmit={(e) => { e.preventDefault(); navigate(-1); }}>
          {/* Section 1: Patient Info */}
          <div className="mb-10">
            <h3 className="font-h3 text-h3 text-on-surface border-b border-outline-variant pb-2 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">person</span>
              Información del Paciente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2">
                  Buscar Paciente
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                  <input 
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary-container focus:ring-2 focus:ring-primary-fixed-dim outline-none transition-all font-body-sm text-body-sm text-on-surface" 
                    placeholder="Nombre, DNI o Teléfono" 
                    type="text"
                  />
                </div>
                <p className="font-caption text-caption text-primary-container mt-2 cursor-pointer hover:underline">
                  + Registrar Nuevo Paciente
                </p>
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2">
                  Seleccionar Odontólogo
                </label>
                <div className="relative">
                  <select defaultValue="" className="w-full pl-4 pr-10 py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary-container focus:ring-2 focus:ring-primary-fixed-dim outline-none transition-all font-body-sm text-body-sm text-on-surface appearance-none">
                    <option disabled value="">Seleccione un especialista...</option>
                    <option value="1">Dra. Elena Martínez (Ortodoncia)</option>
                    <option value="2">Dr. Carlos Ruiz (General)</option>
                    <option value="3">Dra. Sofía Gómez (Pediatría)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">arrow_drop_down</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Treatment & Schedule */}
          <div className="mb-10">
            <h3 className="font-h3 text-h3 text-on-surface border-b border-outline-variant pb-2 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">medical_services</span>
              Tratamiento y Horario
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              <div className="md:col-span-12">
                <label className="block font-label-md text-label-md text-on-surface mb-2">
                  Seleccionar Tratamiento
                </label>
                <div className="relative">
                  <select defaultValue="" className="w-full pl-4 pr-10 py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary-container focus:ring-2 focus:ring-primary-fixed-dim outline-none transition-all font-body-sm text-body-sm text-on-surface appearance-none">
                    <option disabled value="">Seleccione el tipo de consulta...</option>
                    <option value="limpieza">Limpieza Dental</option>
                    <option value="ortodoncia">Control de Ortodoncia</option>
                    <option value="extraccion">Extracción</option>
                    <option value="revision">Revisión General</option>
                    <option value="blanqueamiento">Blanqueamiento</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">arrow_drop_down</span>
                </div>
              </div>
              <div className="md:col-span-6">
                <label className="block font-label-md text-label-md text-on-surface mb-2">Fecha</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">calendar_today</span>
                  <input 
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant bg-surface focus:border-primary-container focus:ring-2 focus:ring-primary-fixed-dim outline-none transition-all font-body-sm text-body-sm text-on-surface" 
                    type="date"
                  />
                </div>
              </div>
              <div className="md:col-span-6">
                <label className="block font-label-md text-label-md text-on-surface mb-2">Hora</label>
                <div className="grid grid-cols-4 gap-2">
                  <button className="py-2 px-1 border border-outline-variant rounded-md font-body-sm text-body-sm text-on-surface-variant hover:border-primary-container hover:text-primary-container transition-colors cursor-pointer" type="button">09:00</button>
                  <button className="py-2 px-1 border border-outline-variant rounded-md font-body-sm text-body-sm text-on-surface-variant hover:border-primary-container hover:text-primary-container transition-colors cursor-pointer" type="button">09:30</button>
                  <button className="py-2 px-1 border border-primary-container bg-primary-fixed text-primary-container rounded-md font-body-sm text-body-sm font-medium transition-colors cursor-pointer" type="button">10:00</button>
                  <button className="py-2 px-1 border border-outline-variant rounded-md font-body-sm text-body-sm text-outline bg-surface-container-low cursor-not-allowed opacity-50" disabled type="button">10:30</button>
                  <button className="py-2 px-1 border border-outline-variant rounded-md font-body-sm text-body-sm text-on-surface-variant hover:border-primary-container hover:text-primary-container transition-colors cursor-pointer" type="button">11:00</button>
                  <button className="py-2 px-1 border border-outline-variant rounded-md font-body-sm text-body-sm text-on-surface-variant hover:border-primary-container hover:text-primary-container transition-colors cursor-pointer" type="button">11:30</button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Notes */}
          <div className="mb-10">
            <label className="block font-label-md text-label-md text-on-surface mb-2">
              Notas/Observaciones
            </label>
            <textarea 
              className="w-full p-4 rounded-lg border border-outline-variant bg-surface focus:border-primary-container focus:ring-2 focus:ring-primary-fixed-dim outline-none transition-all font-body-sm text-body-sm text-on-surface resize-none" 
              placeholder="Añade cualquier detalle relevante para la consulta..." 
              rows={3}
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-outline-variant">
            <button 
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-lg font-label-md text-label-md text-secondary hover:bg-secondary-container transition-colors cursor-pointer" 
              type="button"
            >
              Cancelar
            </button>
            <button 
              className="px-6 py-3 rounded-lg font-label-md text-label-md bg-primary-container text-on-primary-container hover:bg-primary transition-colors shadow-sm cursor-pointer" 
              type="submit"
            >
              Confirmar Cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
