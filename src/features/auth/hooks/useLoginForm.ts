import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useForm } from "../../../shared/hooks/useForm";
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
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    initialValues: INITIAL_VALUES,
    validate,
    onSubmit: async (_data) => {
      // TODO: integrar con API de autenticación
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Sesión iniciada correctamente");
      navigate("/dashboard");
    },
  });

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return { ...form, showPassword, toggleShowPassword };
}
