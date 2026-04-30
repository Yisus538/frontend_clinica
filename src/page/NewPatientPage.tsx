import { useState } from "react";
import { useNavigate } from "react-router";
import { ClinicalHistoryModal } from "../features/patients/components/clinical-history/ClinicalHistoryModal";

export const NewPatientPage = () => {
  const navigate = useNavigate();
  const [isClinicalHistoryModalOpen, setIsClinicalHistoryModalOpen] = useState(false);

  return (
    <div className="w-full pb-10">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="font-h1 text-h1 text-on-surface">Nuevo Paciente</h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
          Complete el formulario a continuación para registrar un nuevo perfil clínico.
        </p>
      </div>

      <form 
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          // Simular el guardado y regresar a la lista
          navigate("/dashboard/pacientes");
        }}
      >
        {/* Section 1: Datos Personales */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm shadow-primary/5">
          <h2 className="font-h3 text-h3 text-on-surface mb-6 pb-2 border-b border-outline-variant/30 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person</span>
            Datos Personales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="nombre">Nombre</label>
              <input className="h-12 px-sm px-3 border border-outline-variant rounded-DEFAULT rounded bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-md text-on-surface placeholder:text-outline" id="nombre" placeholder="Ej. Juan" type="text" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="apellidos">Apellidos</label>
              <input className="h-12 px-sm px-3 border border-outline-variant rounded-DEFAULT rounded bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-md text-on-surface placeholder:text-outline" id="apellidos" placeholder="Ej. Pérez" type="text" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="dni">ID / DNI</label>
              <input className="h-12 px-sm px-3 border border-outline-variant rounded-DEFAULT rounded bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-md text-on-surface placeholder:text-outline" id="dni" placeholder="Número de documento" type="text" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="dob">Fecha de Nacimiento</label>
              <input className="h-12 px-sm px-3 border border-outline-variant rounded-DEFAULT rounded bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-md text-on-surface" id="dob" type="date" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="genero">Género</label>
              <select defaultValue="" className="h-12 px-3 border border-outline-variant rounded-DEFAULT rounded bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-md text-on-surface appearance-none" id="genero" required>
                <option disabled value="">Seleccione</option>
                <option value="f">Femenino</option>
                <option value="m">Masculino</option>
                <option value="o">Otro</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section 2: Información de Contacto */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm shadow-primary/5">
          <h2 className="font-h3 text-h3 text-on-surface mb-6 pb-2 border-b border-outline-variant/30 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">contact_phone</span>
            Información de Contacto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="email">Correo Electrónico</label>
              <input className="h-12 px-sm px-3 border border-outline-variant rounded-DEFAULT rounded bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-md text-on-surface placeholder:text-outline" id="email" placeholder="ejemplo@correo.com" type="email" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="telefono">Teléfono</label>
              <input className="h-12 px-sm px-3 border border-outline-variant rounded-DEFAULT rounded bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-md text-on-surface placeholder:text-outline" id="telefono" placeholder="+34 600 000 000" type="tel" required />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="direccion">Dirección Residencial</label>
              <input className="h-12 px-sm px-3 border border-outline-variant rounded-DEFAULT rounded bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-md text-on-surface placeholder:text-outline" id="direccion" placeholder="Calle, Número, Ciudad, Código Postal" type="text" />
            </div>
          </div>
        </section>

        {/* Section 3: Antecedentes Médicos */}
        <div className="py-4">
          <button 
            type="button"
            onClick={() => setIsClinicalHistoryModalOpen(true)}
            className="w-full group flex flex-col items-center justify-center gap-4 bg-surface-container-low hover:bg-surface-container-high border-2 border-dashed border-primary/30 hover:border-primary rounded-xl py-12 px-6 transition-all duration-300 cursor-pointer" 
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[32px]">clinical_notes</span>
            </div>
            <div className="text-center">
              <span className="font-h3 text-h3 text-primary block">Abrir Historial Clínico Médico</span>
              <span className="font-body-sm text-on-surface-variant mt-1 block">Registre antecedentes, alergias y condiciones preexistentes del paciente.</span>
            </div>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-6 pt-10 pb-16">
          <button 
            type="button"
            onClick={() => navigate(-1)}
            className="h-12 px-10 rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors flex items-center justify-center cursor-pointer" 
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="h-12 px-16 bg-primary text-on-primary font-label-md text-label-md hover:bg-surface-tint shadow-sm shadow-primary/20 transition-all flex items-center justify-center gap-2 rounded-lg cursor-pointer" 
          >
            Guardar Paciente
            <span className="material-symbols-outlined text-[18px]">save</span>
          </button>
        </div>
      </form>

      <ClinicalHistoryModal 
        isOpen={isClinicalHistoryModalOpen} 
        onClose={() => setIsClinicalHistoryModalOpen(false)} 
      />
    </div>
  );
};
