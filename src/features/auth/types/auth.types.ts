export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "SUPER_ADMIN" | "ODONTOLOGO" | "SECRETARIA";
  permissions: string[];
}

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
  [key: string]: unknown;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  apiError?: string;
  [key: string]: string | undefined;
}

export interface ForgotPasswordFormData {
  email: string;
  [key: string]: unknown;
}

export interface ForgotPasswordFormErrors {
  email?: string;
  [key: string]: string | undefined;
}
