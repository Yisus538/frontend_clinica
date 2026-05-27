import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { settingsApi, type ProfileResponse } from "../features/settings/api/settings.api";
import { useProfile } from "../features/settings/context/ProfileContext";

const STATUS_LABEL: Record<string, string> = {
  active: "Activo",
  inactive: "Inactivo",
  suspended: "Suspendido",
};

const STATUS_STYLE: Record<string, string> = {
  active: "bg-secondary-container/30 text-secondary",
  inactive: "bg-tertiary-container/30 text-tertiary",
  suspended: "bg-error-container/50 text-error",
};

function formatMemberSince(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("es-AR", { month: "short", year: "numeric" });
}

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

interface FormState {
  fullName: string;
  licenseNumber: string;
  specialty: string;
  email: string;
  bio: string;
  avatarUrl: string | null;
  avatarPreview: string | null;
}

function profileToForm(p: ProfileResponse): FormState {
  return {
    fullName: `${p.firstName} ${p.lastName}`.trim(),
    licenseNumber: p.licenseNumber ?? "",
    specialty: p.specialty ?? "",
    email: p.email,
    bio: p.bio ?? "",
    avatarUrl: p.avatarUrl,
    avatarPreview: null,
  };
}

export const SettingsPage = () => {
  const { refresh: refreshGlobalProfile } = useProfile();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    settingsApi
      .getProfile()
      .then((p) => {
        setProfile(p);
        setForm(profileToForm(p));
      })
      .catch(() => toast.error("No se pudo cargar el perfil"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => prev && { ...prev, [name]: value });
  };

  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    setForm((prev) => prev && { ...prev, licenseNumber: digits });
  };

  const handleLicenseFocus = () => {
    setForm((prev) => {
      if (!prev) return prev;
      return { ...prev, licenseNumber: prev.licenseNumber.replace(/^[A-Za-z]+-/, "") };
    });
  };

  const handleLicenseBlur = () => {
    setForm((prev) => {
      if (!prev) return prev;
      const digits = prev.licenseNumber.trim();
      if (!digits) return prev;
      return { ...prev, licenseNumber: `MP-${digits}` };
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setForm((prev) => prev && { ...prev, avatarPreview: localPreview });

    try {
      const { avatarUrl } = await settingsApi.uploadAvatar(file);
      setForm((prev) => prev && { ...prev, avatarUrl, avatarPreview: null });
      setProfile((prev) => prev && { ...prev, avatarUrl });
      toast.success("Foto de perfil actualizada");
    } catch {
      setForm((prev) => prev && { ...prev, avatarPreview: null });
      toast.error("No se pudo subir la foto");
    }

    e.target.value = "";
  };

  const handleSave = async () => {
    if (!form) return;
    setIsSaving(true);
    try {
      const { firstName, lastName } = splitFullName(form.fullName);
      const updated = await settingsApi.updateProfile({
        firstName,
        lastName,
        licenseNumber: form.licenseNumber || undefined,
        specialty: form.specialty,
        bio: form.bio,
      });
      setProfile(updated);
      setForm(profileToForm(updated));
      await refreshGlobalProfile();
      toast.success("Configuración guardada", {
        description: "Tu información de perfil ha sido actualizada.",
      });
    } catch {
      toast.error("No se pudo guardar el perfil");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) setForm(profileToForm(profile));
    toast.info("Cambios descartados");
  };

  const handleToggle2FA = () => {
    setTwoFactorEnabled((prev) => {
      const next = !prev;
      toast.info(`Autenticación en Dos Pasos ${next ? "activada" : "desactivada"}`);
      return next;
    });
  };

  const handleChangePassword = () => {
    toast.info("Se ha enviado un enlace para cambiar tu contraseña");
  };

  if (isLoading || !form || !profile) {
    return (
      <div className="w-full pb-10">
        <div className="mb-8">
          <div className="h-8 w-64 bg-surface-container rounded animate-pulse mb-2" />
          <div className="h-4 w-96 bg-surface-container rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 h-80 bg-surface-container rounded-xl animate-pulse" />
          <div className="lg:col-span-8 h-80 bg-surface-container rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  const avatarSrc = form.avatarPreview ?? form.avatarUrl;

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
                  {avatarSrc ? (
                    <img
                      alt="Avatar de usuario"
                      className="w-full h-full object-cover"
                      src={avatarSrc}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-h2 text-h2 text-primary font-bold uppercase">
                      {profile.firstName.charAt(0)}
                      {profile.lastName.charAt(0)}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleAvatarClick}
                  className="absolute bottom-0 right-0 bg-primary p-2 text-white hover:bg-primary-container transition-colors shadow-sm rounded-full cursor-pointer flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              <h3 className="font-h3 text-h3 text-on-surface">{form.fullName}</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                {form.specialty || "Sin especialidad"}
              </p>

              <div className="w-full pt-6 border-t border-outline-variant flex flex-col gap-3">
                <div className="flex justify-between items-center text-left">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                    Miembro desde
                  </span>
                  <span className="font-label-md text-label-md text-on-surface">
                    {formatMemberSince(profile.memberSince)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-left">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                    Estado
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full font-label-sm text-[11px] uppercase tracking-wider ${
                      STATUS_STYLE[profile.status] ?? "bg-surface-container text-on-surface-variant"
                    }`}
                  >
                    {STATUS_LABEL[profile.status] ?? profile.status}
                  </span>
                </div>
                {profile.licenseNumber && (
                  <div className="flex justify-between items-center text-left">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                      Matrícula
                    </span>
                    <span className="font-label-md text-label-md text-on-surface">
                      {profile.licenseNumber}
                    </span>
                  </div>
                )}
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
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-on-surface">
                  Nombre Completo
                </label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="h-12 px-3 border border-outline-variant rounded bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-md text-on-surface"
                  type="text"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-on-surface">
                  Matrícula Profesional{" "}
                  {!profile?.licenseNumber && (
                    <span className="text-error font-label-sm">* Requerida</span>
                  )}
                </label>
                <input
                  name="licenseNumber"
                  value={form.licenseNumber}
                  onChange={handleLicenseChange}
                  onFocus={handleLicenseFocus}
                  onBlur={handleLicenseBlur}
                  placeholder="Ej: 12345"
                  inputMode="numeric"
                  className={`h-12 px-3 border rounded outline-none transition-all font-body-md text-on-surface ${
                    !profile?.licenseNumber
                      ? "border-error/60 bg-error-container/10 focus:border-error focus:ring-2 focus:ring-error/20"
                      : "border-outline-variant bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20"
                  }`}
                  type="text"
                />
                {!profile?.licenseNumber && (
                  <p className="flex items-center gap-1 font-caption text-caption text-error">
                    <span className="material-symbols-outlined text-[13px]">error</span>
                    Ingresá tu matrícula para poder usar el sistema completo.
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-on-surface">Especialidad</label>
                <input
                  name="specialty"
                  value={form.specialty}
                  onChange={handleChange}
                  className="h-12 px-3 border border-outline-variant rounded bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-md text-on-surface"
                  type="text"
                />
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="font-label-md text-label-md text-on-surface">
                  Correo Electrónico
                </label>
                <input
                  name="email"
                  value={form.email}
                  readOnly
                  className="h-12 px-3 border border-outline-variant rounded bg-surface-container text-on-surface-variant outline-none font-body-md cursor-not-allowed"
                  type="email"
                />
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="font-label-md text-label-md text-on-surface">
                  Biografía Profesional
                </label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  className="px-3 py-3 border border-outline-variant rounded bg-surface-bright focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-md text-on-surface resize-none"
                  rows={3}
                />
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
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Cambiá tu contraseña cuando lo necesites
                </p>
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
                <p className="font-label-md text-label-md text-on-surface mb-1">
                  Autenticación en Dos Pasos
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Añade una capa extra de seguridad a tu cuenta
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`font-label-sm text-label-sm uppercase tracking-wider ${
                    twoFactorEnabled ? "text-secondary" : "text-error"
                  }`}
                >
                  {twoFactorEnabled ? "Activado" : "Desactivado"}
                </span>
                <button
                  onClick={handleToggle2FA}
                  className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer shadow-inner ${
                    twoFactorEnabled
                      ? "bg-secondary"
                      : "bg-surface-variant border border-outline-variant"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
                      twoFactorEnabled ? "left-[calc(100%-22px)]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex justify-end gap-6 pt-4">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="h-12 px-10 rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="h-12 px-12 bg-primary text-on-primary font-label-md text-label-md hover:bg-surface-tint shadow-sm shadow-primary/20 transition-all flex items-center justify-center gap-2 rounded-lg cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">
                    progress_activity
                  </span>
                  Guardando...
                </>
              ) : (
                <>
                  Guardar Cambios
                  <span className="material-symbols-outlined text-[18px]">save</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
