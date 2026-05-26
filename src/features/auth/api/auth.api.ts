import { apiClient } from "../../../shared/api/client";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
}

export interface LoginDto {
  email: string;
  password: string;
}

export const authApi = {
  login: (dto: LoginDto) => apiClient.post<AuthUser>("/auth/login", dto),
  logout: () => apiClient.post<{ message: string }>("/auth/logout", {}),
  me: () => apiClient.get<AuthUser>("/auth/me"),
};
