import { toast } from "sonner";
import { useForm } from "../../../shared/hooks/useForm";
import { authApi } from "../api/auth.api";
import type { ForgotPasswordFormData, ForgotPasswordFormErrors } from "../types/auth.types";

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
      try {
        await authApi.forgotPassword(data.email as string);
        toast.success("Si el email existe recibirás instrucciones para restablecer tu contraseña");
      } catch {
        toast.error("No se pudo procesar la solicitud. Intentá nuevamente.");
      }
    },
  });
}
