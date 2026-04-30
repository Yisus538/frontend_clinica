export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
  [key: string]: unknown;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  [key: string]: string | undefined;
}

export interface UseLoginFormReturn {
  formData: LoginFormData;
  errors: LoginFormErrors;
  isLoading: boolean;
  showPassword: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  toggleShowPassword: () => void;
}
export interface ForgotPasswordFormData {
  email: string;
  [key: string]: unknown;
}

export interface ForgotPasswordFormErrors {
  email?: string;
  [key: string]: string | undefined;
}