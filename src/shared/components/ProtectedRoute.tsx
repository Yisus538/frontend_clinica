import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../features/auth/context/AuthContext";

/** Redirige a "/" si no hay sesión activa. Muestra spinner mientras carga. */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span
          className="material-symbols-outlined animate-spin text-5xl"
          style={{ color: "var(--color-primary)" }}
        >
          progress_activity
        </span>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/" replace />;

  return <Outlet />;
}
