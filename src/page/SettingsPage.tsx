import { useState } from "react";
import { toast } from "sonner";
import { MOCK_USER_PROFILE, MOCK_SECURITY_SETTINGS } from "../features/settings/data/settings.mock";

export const SettingsPage = () => {
  const [profile, setProfile] = useState(MOCK_USER_PROFILE);
  const [security, setSecurity] = useState(MOCK_SECURITY_SETTINGS);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle2FA = () => {
    setSecurity(prev => {
      const newState = !prev.twoFactorEnabled;
      toast.info(`Autenticación en Dos Pasos ${newState ? 'activada' : 'desactivada'}`);
      return { ...prev, twoFactorEnabled: newState };
    });
  };

  const handleSave = () => {
    toast.success("Configuración guardada", {
      description: "Tu información de perfil ha sido actualizada."
    });
  };

  const handleCancel = () => {
    setProfile(MOCK_USER_PROFILE);
    setSecurity(MOCK_SECURITY_SETTINGS);
    toast.info("Cambios descartados");
  };

  const handleChangePassword = () => {
    toast.info("Se ha enviado un enlace para cambiar tu contraseña");
  };

  const handleChangeAvatar = () => {
    toast.info("Función para cambiar foto de perfil en desarrollo");
  };

  return (
    <div className="w-full pb-10">
      <div className="mb-8">
        <h2 className="font-h1 text-h1 text-on-surface mb-2">Configuración de Perfil</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Administra tu información personal y preferencias de seguridad.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm shadow-primary/5">
            <div className="flex flex-col items-center text-center">
              <div className="relative group mb-6">
                <div className="w-32 h-32 overflow-hidden bg-surface-container-high border border-outline-variant rounded-full shadow-inner">
                  <img 
                    alt="Avatar de usuario" 
                    className="w-full h-full object-cover" 
                    src={profile.avatarUrl} 
                  />
                </div>
                <button 
                  onClick={handleChangeAvatar}
                  className="absolute bottom-0 right-0 bg-primary p-2 text-white hover:bg-primary-container transition-colors shadow-sm rounded-full cursor-pointer flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                </button>
              </div>
              <h3 className="font-h3 text-h3 text-on-surface">{profile.fullName}</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">{profile.specialty}</p>
              
              <div className="w-full pt-6 border-t border-outline-variant flex flex-col gap-3">
                <div className="flex justify-between items-center text-left">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Miembro desde</span>
                  <span className="font-label-md text-label-md text-on-surface">{profile.memberSince}</span>
                </div>
                <div className="flex justify-between items-center text-left">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Estado</span>
                  <span className={`px-2.5 py-1 rounded-full font-label-sm text-[11px] uppercase tracking-wider ${
                    profile.status === 'Activo' 
                      ? 'bg-secondary-container/30 text-secondary' 
                      : 'bg-tertiary-container/30 text-tertiary'
                  }`}>
                    {profile.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Settings Sections */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Información Personal */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm shadow-primary/5">
            <h2 className="font-h3 text-h3 text-on-surface mb-6 pb-2 border-b border-outline-variant/30 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">person</span>
              Información Personal
            </h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-on-surface">Nombre Completo</label>
                <input 
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  className="h-12 px-3 border border-outline-variant rounded bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-md text-on-surface" 
                  type="text" 
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-on-surface">Especialidad</label>
                <input 
                  name="specialty"
                  value={profile.specialty}
                  onChange={handleChange}
                  className="h-12 px-3 border border-outline-variant rounded bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-md text-on-surface" 
                  type="text" 
                />
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="font-label-md text-label-md text-on-surface">Correo Electrónico</label>
                <input 
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="h-12 px-3 border border-outline-variant rounded bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-md text-on-surface" 
                  type="email" 
                />
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="font-label-md text-label-md text-on-surface">Biografía Profesional</label>
                <textarea 
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  className="px-3 py-3 border border-outline-variant rounded bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-md text-on-surface resize-none" 
                  rows={3}
                ></textarea>
              </div>
            </form>
          </div>

          {/* Seguridad y Acceso */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm shadow-primary/5">
            <h2 className="font-h3 text-h3 text-on-surface mb-6 pb-2 border-b border-outline-variant/30 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">lock</span>
              Seguridad y Acceso
            </h2>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 bg-surface-container-low/50 border border-outline-variant/50 rounded-xl">
              <div>
                <p className="font-label-md text-label-md text-on-surface mb-1">Contraseña</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Actualizada por última vez {security.lastPasswordUpdate}</p>
              </div>
              <button 
                onClick={handleChangePassword}
                className="h-10 px-6 rounded-full border border-primary text-primary font-label-md text-label-md hover:bg-primary-container hover:text-on-primary-container transition-colors cursor-pointer"
              >
                Cambiar Contraseña
              </button>
            </div>
            
            <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 bg-surface-container-low/50 border border-outline-variant/50 rounded-xl">
              <div>
                <p className="font-label-md text-label-md text-on-surface mb-1">Autenticación en Dos Pasos</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Añade una capa extra de seguridad a tu cuenta</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-label-sm text-label-sm uppercase tracking-wider ${security.twoFactorEnabled ? 'text-secondary' : 'text-error'}`}>
                  {security.twoFactorEnabled ? 'Activado' : 'Desactivado'}
                </span>
                <button 
                  onClick={handleToggle2FA}
                  className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer shadow-inner ${
                    security.twoFactorEnabled ? 'bg-secondary' : 'bg-surface-variant border border-outline-variant'
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
                    security.twoFactorEnabled ? 'left-[calc(100%-22px)]' : 'left-0.5'
                  }`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex justify-end gap-6 pt-4">
            <button 
              onClick={handleCancel}
              className="h-12 px-10 rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors flex items-center justify-center cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              className="h-12 px-12 bg-primary text-on-primary font-label-md text-label-md hover:bg-surface-tint shadow-sm shadow-primary/20 transition-all flex items-center justify-center gap-2 rounded-lg cursor-pointer"
            >
              Guardar Cambios
              <span className="material-symbols-outlined text-[18px]">save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
