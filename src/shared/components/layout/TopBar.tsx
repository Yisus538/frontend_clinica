import { Link, useLocation, useSearchParams } from "react-router";
import type { TopBarProps } from "../../../features/dashboard/types/dashboard.types";
import { SIDEBAR_WIDTH_COLLAPSED, SIDEBAR_WIDTH_EXPANDED } from "./Sidebar";
import { useAuth } from "../../../features/auth/context/AuthContext";

const SEARCH_CONFIG: { prefix: string; placeholder: string }[] = [
  { prefix: "/dashboard/pacientes", placeholder: "Buscar pacientes..." },
  { prefix: "/dashboard/tratamientos", placeholder: "Buscar tratamiento..." },
];

export const TopBar = ({ sidebarExpanded = false }: TopBarProps) => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const sidebarWidth = sidebarExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED;

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "U"
    : "U";

  const searchConfig = SEARCH_CONFIG.find(
    (c) => pathname.startsWith(c.prefix) && (pathname === c.prefix || pathname === c.prefix + "/")
  );

  const handleSearch = (value: string) => {
    if (value) {
      setSearchParams({ q: value }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  return (
    <header
      id="top-bar"
      className="fixed top-0 right-0 h-16 flex items-center justify-between px-8 z-30 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant transition-all duration-300 ease-in-out"
      style={{ left: sidebarWidth }}
    >
      {/* Search — solo en rutas relevantes */}
      <div className="flex-1 flex items-center">
        {searchConfig ? (
          <div className="relative w-64 md:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">
              search
            </span>
            <input
              type="text"
              value={searchParams.get("q") ?? ""}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={searchConfig.placeholder}
              className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg text-body-sm font-body-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all"
            />
          </div>
        ) : null}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-on-surface-variant">
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

        {/* Profile */}
        <div className="flex items-center gap-3" id="profile-menu">
          <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-sm font-bold text-xs border border-outline-variant">
            {initials}
          </div>
          <span className="hidden md:block text-body-sm text-on-surface font-medium">
            {user ? `${user.firstName} ${user.lastName}` : ""}
          </span>
        </div>
      </div>
    </header>
  );
};
