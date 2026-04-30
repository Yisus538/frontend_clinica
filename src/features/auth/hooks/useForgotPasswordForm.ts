import { useForm } from "../../../shared/hooks/useForm";
import type {
  ForgotPasswordFormData,
  ForgotPasswordFormErrors,
} from "../types/auth.types";

const INITIAL_VALUES: ForgotPasswordFormData = {
  email: "",
};

function validate(data: ForgotPasswordFormData): ForgotPasswordFormErrors {
  const errors: ForgotPasswordFormErrors = {};
  if (!data.email) {
    errors.email = "El correo electrónico es requerido.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Ingresá un correo electrónico válido.";
  }
  return errors;
}

export function useForgotPasswordForm() {
  return useForm<ForgotPasswordFormData>({
    initialValues: INITIAL_VALUES,
    validate,
    onSubmit: async (data) => {
      // TODO: integrar con API de recuperación de contraseña
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Enlace enviado a:", data.email);
    },
  });
}
