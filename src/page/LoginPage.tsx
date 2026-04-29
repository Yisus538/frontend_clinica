import { Input } from "../shared/components/Input";
import { Button } from "../shared/components/Button";
import { useLoginForm } from "../features/auth/hooks/useLoginForm";

export const LoginPage = () => {
  const {
    formData, errors, isLoading,
    showPassword, handleChange,
    handleSubmit, toggleShowPassword,
  } = useLoginForm();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "var(--color-surface)" }}>

      {/* Fondo */}
      <div
        className="absolute inset-0 z-0 opacity-30 bg-cover bg-center"
        style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuA2m25mXPfHVRBpcOWFWQ5a7hu0eVidzgseiy9sUR9EAq1JDSXVSxuSWAnWncB66yMiYAHkwCX9rNfHOK55mnuS_4zJS495I-TGdXiI1P-Nh_kULiHXD8jSlQvuizlpKcA3CxYOY5vndvc7oMWMkotA0AsTgHwyWd_PBzOhU7w6zirPKXORHT5ZZhCS_p62Ikm6RxP-Mva7JyReBPGeUkGV3iCLnezA0BsG06Bej2Ha7yauJed8Nh1X48XuFZWIlFV_s5XbZI4a1qA')` }}
        aria-hidden="true"
      />

      {/* Card */}
      <main className="relative z-10 w-full max-w-[480px] mx-4 flex flex-col items-center px-12 py-12 shadow-sm"
        style={{
          background: "var(--color-white)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border)",
        }}>

        {/* Ícono */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 flex items-center justify-center"
            style={{
              background: "var(--color-primary-light)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-primary-border)",
              color: "var(--color-primary)",
            }}>
            <span className="material-symbols-outlined text-[56px]">dentistry</span>
          </div>
        </div>

        {/* Título */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-semibold mb-2" style={{ color: "var(--color-text-main)" }}>
            Iniciar Sesión
          </h1>
          <p className="text-base text-center" style={{ color: "var(--color-text-muted)" }}>
            Accedé a tu espacio de trabajo clínico.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 w-full items-center">
          <Input
            id="email"
            name="email"
            type="email"
            label="Correo Electrónico"
            value={formData.email}
            placeholder="doctor@clinicadental.com"
            error={errors.email}
            required
            onChange={handleChange}
          />

          <div className="flex flex-col gap-1 w-full max-w-sm">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-sm font-semibold"
                style={{ color: "var(--color-text-main)" }}>
                Contraseña
              </label>
              <a href="#" className="text-xs hover:underline transition-colors"
                style={{ color: "var(--color-primary)" }}>
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              placeholder="••••••••"
              error={errors.password}
              required
              onChange={handleChange}
              rightSlot={
                <button type="button" onClick={toggleShowPassword}
                  className="transition-colors focus:outline-none h-full flex items-center justify-center"
                  style={{ color: "var(--color-text-placeholder)" }}>
                  <span className="material-symbols-outlined text-[28px]">
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              }
            />
          </div>

          <div className="w-full max-w-sm">
            <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe as boolean}
                onChange={handleChange}
                className="rounded focus:ring-[var(--color-primary)] w-5 h-5"
                style={{ accentColor: "var(--color-primary)" }}
              />
              <span className="text-sm" style={{ color: "var(--color-text-main)" }}>
                Recordarme en este dispositivo
              </span>
            </label>
          </div>

          <Button type="submit" isLoading={isLoading} className="mt-5 w-full max-w-sm">
            Iniciar Sesión
          </Button>
        </form>
      </main>
    </div>
  );
};

