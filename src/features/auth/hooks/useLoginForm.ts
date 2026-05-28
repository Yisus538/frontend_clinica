import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useForm } from "../../../shared/hooks/useForm";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../../../shared/api/client";
import type { LoginFormData, LoginFormErrors } from "../types/auth.types";

const INITIAL_VALUES: LoginFormData = {
  email: "",
  password: "",
  rememberMe: false,
};

function validate(data: LoginFormData): LoginFormErrors {
  const errors: LoginFormErrors = {};
  if (!data.email) {
    errors.email = "El correo electrónico es requerido.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Ingresá un correo electrónico válido.";
  }
  if (!data.password) {
    errors.password = "La contraseña es requerida.";
  } else if (data.password.length < 6) {
    errors.password = "Debe tener al menos 6 caracteres.";
  }
  return errors;
}

export function useLoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    initialValues: INITIAL_VALUES,
    validate,
    onSubmit: async (data) => {
      setApiError(null);
      try {
        await login(data.email, data.password);
        toast.success("Sesión iniciada correctamente");
        navigate("/dashboard");
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          setApiError("Credenciales incorrectas. Verificá tu correo y contraseña.");
        } else {
          toast.error("Error al iniciar sesión. Intentá nuevamente.");
        }
        throw err;
      }
    },
  });

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return {
    ...form,
    showPassword,
    toggleShowPassword,
    errors: { ...form.errors, ...(apiError ? { email: apiError } : {}) } as LoginFormErrors,
  };
}
