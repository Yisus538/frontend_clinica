import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authApi, type AuthUser } from "../api/auth.api";
import type { AuthContextValue } from "../types/auth.types";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authApi
      .me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = await authApi.login({ email, password });
    setUser(u);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const hasPermission = useCallback(
    (permission: string) => user?.permissions?.includes(permission) ?? false,
    [user]
  );

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: user !== null, login, logout, hasPermission }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
