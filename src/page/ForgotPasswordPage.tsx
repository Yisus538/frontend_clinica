import { Link } from "react-router";
import { Input } from "../shared/components/Input";
import { Button } from "../shared/components/Button";
import { AuthCard } from "../shared/components/AuthCard";
import { useForgotPasswordForm } from "../features/auth/hooks/useForgotPasswordForm";

export const ForgotPasswordPage = () => {
  const { formData, errors, isLoading, handleChange, handleSubmit } =
    useForgotPasswordForm();

  return (
    <AuthCard
      maxWidth="440px"
      footer={
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          ¿Necesitás ayuda?{" "}
          <a
            href="#"
            className="hover:underline transition-colors"
            style={{ color: "var(--color-primary)" }}
          >
            Contactar a soporte técnico
          </a>
        </p>
      }
    >
      {/* Ícono */}
      <div className="flex justify-center mb-8">
        <div
          className="w-16 h-16 flex items-center justify-center"
          style={{
            background: "var(--color-primary-light)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-primary-border)",
            color: "var(--color-primary)",
          }}
        >
          <span className="material-symbols-outlined text-[32px]">
            lock_reset
          </span>
        </div>
      </div>

      {/* Título */}
      <div className="flex flex-col items-center mb-8 text-center">
        <h1
          className="text-3xl font-semibold mb-2"
          style={{ color: "var(--color-text-main)" }}
        >
          Restablecer contraseña
        </h1>
        <p className="text-base" style={{ color: "var(--color-text-muted)" }}>
          Ingresá tu correo para enviarte un enlace de recuperación.
        </p>
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4 w-full items-center"
      >
        <Input
          id="email"
          name="email"
          type="email"
          label="Correo electrónico"
          value={formData.email as string}
          placeholder="doctor@clinicadental.com"
          error={errors.email}
          required
          onChange={handleChange}
        />

        <Button
          type="submit"
          isLoading={isLoading}
          loadingLabel="Enviando..."
          className="mt-5 w-full max-w-sm"
        >
          <span className="material-symbols-outlined text-[20px]">send</span>
          Enviar enlace
        </Button>
      </form>

      {/* Volver al login */}
      <div className="mt-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-semibold transition-colors focus:outline-none hover:underline"
          style={{ color: "var(--color-primary)" }}
        >
          <span className="material-symbols-outlined text-[18px]">
            arrow_back
          </span>
          Volver al inicio de sesión
        </Link>
      </div>
    </AuthCard>
  );
};
