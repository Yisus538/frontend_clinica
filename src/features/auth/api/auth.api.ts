import { apiClient } from "../../../shared/api/client";
import type { AuthUser } from "../types/auth.types";

export type { AuthUser };

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse extends AuthUser {
  accessToken: string;
}

export const authApi = {
  login: (dto: LoginDto) => apiClient.post<LoginResponse>("/auth/login", dto),
  logout: () => apiClient.post<{ message: string }>("/auth/logout", {}),
  me: () => apiClient.get<AuthUser>("/auth/me"),
};
