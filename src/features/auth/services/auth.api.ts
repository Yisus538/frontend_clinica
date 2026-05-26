import type { AuthUser } from "../types/auth.types";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    credentials: "include", // envía y recibe cookies en cada request
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = (body as { message?: string | string[] }).message ?? "Error desconocido";
    throw new Error(Array.isArray(message) ? message[0] : message);
  }

  return res.json() as Promise<T>;
}

export const authApi = {
  /** POST /auth/login — el backend setea la cookie httpOnly */
  login: (email: string, password: string) =>
    request<AuthUser>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  /** GET /auth/me — lee la sesión actual desde la cookie */
  me: () => request<Omit<AuthUser, "firstName" | "lastName">>("/auth/me"),

  /** POST /auth/logout — el backend borra la cookie */
  logout: () => request<{ message: string }>("/auth/logout", { method: "POST" }),
};
