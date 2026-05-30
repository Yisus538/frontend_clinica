import { useLocation, Link } from "react-router";
import type { SidebarProps } from "../../../features/dashboard/types/dashboard.types";
import { useAuth } from "../../../features/auth/context/AuthContext";

const ALL_NAV_ITEMS = [
  {
    icon: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    filled: true,
    exact: true,
    roles: ["SUPER_ADMIN", "ODONTOLOGO", "SECRETARIA"],
  },
  {
    icon: "calendar_month",
    label: "Agenda",
    href: "/dashboard/agenda",
    roles: ["SUPER_ADMIN", "ODONTOLOGO", "SECRETARIA"],
  },
  {
    icon: "group",
    label: "Pacientes",
    href: "/dashboard/pacientes",
    roles: ["SUPER_ADMIN", "ODONTOLOGO", "SECRETARIA"],
  },
  {
    icon: "dentistry",
    label: "Tratamientos",
    href: "/dashboard/tratamientos",
    roles: ["SUPER_ADMIN", "ODONTOLOGO", "SECRETARIA"],
  },
  {
    icon: "payments",
    label: "Finanzas",
    href: "/dashboard/finanzas",
    roles: ["SUPER_ADMIN", "ODONTOLOGO"],
  },
];

const ADMIN_ITEMS = [
  {
    icon: "manage_accounts",
    label: "Usuarios",
    href: "/dashboard/admin/usuarios",
    roles: ["SUPER_ADMIN"],
  },
];

const BOTTOM_ITEMS = [{ icon: "logout", label: "Cerrar Sesión", href: "/" }];

export const SIDEBAR_WIDTH_COLLAPSED = 80; // px
export const SIDEBAR_WIDTH_EXPANDED = 240; // px

export const Sidebar = ({
  items,
  bottomItems = BOTTOM_ITEMS,
  expanded = false,
  onToggle,
}: Partial<SidebarProps>) => {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const role = user?.role ?? "SECRETARIA";

  const filteredNavItems = (items ?? ALL_NAV_ITEMS).filter(
    (item) => !("roles" in item) || (item as { roles: string[] }).roles.includes(role)
  );

  const filteredAdminItems = ADMIN_ITEMS.filter((item) => item.roles.includes(role));

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
  const width = expanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED;

  return (
    <nav
      id="sidebar-nav"
      className="bg-surface-container-lowest h-screen flex flex-col border-r border-outline-variant fixed left-0 top-0 z-40 py-6 gap-6 transition-all duration-300 ease-in-out overflow-hidden"
      style={{ width }}
    >
      {/* Header: Logo + Toggle */}
      <div className={`flex items-center ${expanded ? "px-5 justify-between" : "justify-center"}`}>
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="material-symbols-outlined text-3xl text-primary shrink-0"
            title="DentaClinic"
          >
            local_hospital
          </span>
          {expanded && (
            <span className="text-label-md font-label-md text-on-surface truncate whitespace-nowrap">
              Gestión Administrativa
            </span>
          )}
        </div>

        {/* Toggle button — only visible when expanded */}
        {expanded && (
          <button
            id="btn-sidebar-collapse"
            onClick={onToggle}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-outline hover:text-primary hover:bg-surface-container-low transition-colors cursor-pointer"
            aria-label="Contraer menú"
          >
            <span className="material-symbols-outlined text-xl">chevron_left</span>
          </button>
        )}
      </div>

      {/* Expand button — only visible when collapsed */}
      {!expanded && (
        <div className="flex justify-center">
          <button
            id="btn-sidebar-expand"
            onClick={onToggle}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-outline hover:text-primary hover:bg-surface-container-low transition-colors cursor-pointer"
            aria-label="Expandir menú"
          >
            <span className="material-symbols-outlined text-xl">menu</span>
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <div className={`flex flex-col w-full gap-1 ${expanded ? "px-3" : "items-center"}`}>
        {filteredNavItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              to={item.href}
              aria-label={item.label}
              title={!expanded ? item.label : undefined}
              className={`
                flex items-center rounded-xl transition-all duration-200 ease-in-out overflow-hidden
                ${expanded ? "h-12 px-3 gap-4" : "w-12 h-12 justify-center"}
                ${
                  active
                    ? "text-primary bg-primary-light"
                    : "text-outline hover:text-primary hover:bg-surface-container-low"
                }
              `}
            >
              <span
                className="material-symbols-outlined text-[24px] shrink-0"
                style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              {expanded && (
                <span className="text-body-sm font-body-sm truncate whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Admin Section — only for SUPER_ADMIN */}
      {filteredAdminItems.length > 0 && (
        <div
          className={`flex flex-col w-full gap-1 ${expanded ? "px-3" : "items-center"} border-t border-outline-variant pt-4`}
        >
          {expanded && (
            <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider px-3 mb-1">
              Administración
            </p>
          )}
          {filteredAdminItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                aria-label={item.label}
                title={!expanded ? item.label : undefined}
                className={`
                  flex items-center rounded-xl transition-all duration-200 ease-in-out overflow-hidden
                  ${expanded ? "h-12 px-3 gap-4" : "w-12 h-12 justify-center"}
                  ${
                    active
                      ? "text-primary bg-primary-light"
                      : "text-outline hover:text-primary hover:bg-surface-container-low"
                  }
                `}
              >
                <span
                  className="material-symbols-outlined text-[24px] shrink-0"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                {expanded && (
                  <span className="text-body-sm font-body-sm truncate whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {/* Bottom Actions */}
      <div className={`mt-auto flex flex-col gap-1 ${expanded ? "px-3" : "items-center"}`}>
        {bottomItems?.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            aria-label={item.label}
            title={!expanded ? item.label : undefined}
            className={`
              flex items-center rounded-xl text-error hover:bg-error-container transition-all duration-200 ease-in-out overflow-hidden
              ${expanded ? "h-12 px-3 gap-4" : "w-12 h-12 justify-center"}
            `}
          >
            <span className="material-symbols-outlined text-[24px] shrink-0">{item.icon}</span>
            {expanded && (
              <span className="text-body-sm font-body-sm truncate whitespace-nowrap">
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};
