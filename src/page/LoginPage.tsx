import { Link } from "react-router";
import { Input } from "../shared/components/Input";
import { Button } from "../shared/components/Button";
import { AuthCard } from "../shared/components/AuthCard";
import { useLoginForm } from "../features/auth/hooks/useLoginForm";

export const LoginPage = () => {
  const {
    formData, errors, isLoading,
    showPassword, handleChange,
    handleSubmit, toggleShowPassword,
  } = useLoginForm();

  return (
    <AuthCard>
      {/* Ícono */}
      <div className="flex justify-center mb-8">
        <div
          className="w-20 h-20 flex items-center justify-center"
          style={{
            background: "var(--color-primary-light)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-primary-border)",
            color: "var(--color-primary)",
          }}
        >
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
            <Link
              to="/forgot-password"
              className="text-xs hover:underline transition-colors"
              style={{ color: "var(--color-primary)" }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
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
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
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
    </AuthCard>
  );
};
