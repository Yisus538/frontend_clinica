import { apiClient } from "../../../shared/api/client";
import type { AuthUser } from "../types/auth.types";

export type { AuthUser };

export interface LoginDto {
  email: string;
  password: string;
}

export const authApi = {
  login: (dto: LoginDto) => apiClient.post<AuthUser>("/auth/login", dto),
  logout: () => apiClient.post<{ message: string }>("/auth/logout", {}),
  me: () => apiClient.get<AuthUser>("/auth/me"),
};
