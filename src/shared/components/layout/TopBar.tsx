import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import type { TopBarProps } from "../../../features/dashboard/types/dashboard.types";
import { SIDEBAR_WIDTH_COLLAPSED, SIDEBAR_WIDTH_EXPANDED } from "./Sidebar";
import { useAuth } from "../../../features/auth/context/AuthContext";

export const TopBar = ({ sidebarExpanded = false }: TopBarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const sidebarWidth = sidebarExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED;

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "U";

  const handleLogout = async () => {
    await logout();
    toast.success("Sesión cerrada correctamente.");
    navigate("/");
  };

  return (
    <header
      id="top-bar"
      className="fixed top-0 right-0 h-16 flex items-center justify-between px-8 z-30 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant transition-all duration-300 ease-in-out"
      style={{ left: sidebarWidth }}
    >
      {/* Search */}
      <div className="flex-1 flex items-center">
        <div className="relative w-64 md:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">
            search
          </span>
          <input
            id="global-search"
            type="text"
            placeholder="Buscar pacientes..."
            className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg text-body-sm font-body-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-on-surface-variant">
          <button
            id="btn-notifications"
            className="hover:text-primary transition-colors cursor-pointer active:opacity-70 relative"
            aria-label="Notificaciones"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full" />
          </button>
          <button
            id="btn-help"
            className="hover:text-primary transition-colors cursor-pointer active:opacity-70"
            aria-label="Ayuda"
          >
            <span className="material-symbols-outlined">help</span>
          </button>
          <Link
            to="/dashboard/configuracion"
            id="btn-settings"
            className="hover:text-primary transition-colors cursor-pointer active:opacity-70 flex items-center justify-center"
            aria-label="Configuración"
          >
            <span className="material-symbols-outlined">settings</span>
          </Link>
        </div>

        <div className="h-8 w-px bg-outline-variant mx-2 hidden sm:block" />

        {/* Profile + logout */}
        <div className="flex items-center gap-3" id="profile-menu">
          <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-sm font-bold text-xs border border-outline-variant">
            {initials}
          </div>
          <span className="hidden md:block text-body-sm text-on-surface font-medium">
            {user ? `${user.firstName} ${user.lastName}` : ""}
          </span>
          <button
            onClick={handleLogout}
            className="hover:text-error transition-colors cursor-pointer active:opacity-70 text-on-surface-variant"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <span className="material-symbols-outlined text-[22px]">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
