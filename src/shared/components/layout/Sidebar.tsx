import { useLocation } from "react-router";
import type { SidebarProps } from "../../../features/dashboard/types/dashboard.types";

const NAV_ITEMS = [
  { icon: "dashboard", label: "Dashboard", href: "/dashboard", filled: true },
  { icon: "calendar_month", label: "Agenda", href: "/schedule" },
  { icon: "group", label: "Pacientes", href: "/patients" },
  { icon: "dentistry", label: "Tratamientos", href: "/treatments" },
  { icon: "payments", label: "Finanzas", href: "/finances" },
];

const BOTTOM_ITEMS = [
  { icon: "logout", label: "Cerrar sesión", href: "/logout" },
];

export const Sidebar = ({ items = NAV_ITEMS, bottomItems = BOTTOM_ITEMS }: Partial<SidebarProps>) => {
  const { pathname } = useLocation();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <nav
      id="sidebar-nav"
      className="bg-surface-container-lowest h-screen w-20 flex flex-col border-r border-outline-variant fixed left-0 top-0 z-40 items-center py-6 gap-8"
    >
      {/* Logo */}
      <div className="mb-2">
        <span
          className="material-symbols-outlined text-3xl text-primary"
          title="DentaClinic"
        >
          local_hospital
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col w-full items-center gap-6">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <a
              key={item.href}
              href={item.href}
              aria-label={item.label}
              title={item.label}
              className={`
                w-12 h-12 flex items-center justify-center rounded-xl
                transition-all duration-200 ease-in-out
                ${active
                  ? "text-primary bg-primary-light border-r-2 border-primary"
                  : "text-outline hover:text-primary hover:bg-surface-container-low"
                }
              `}
            >
              <span
                className="material-symbols-outlined"
                style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
            </a>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto flex flex-col items-center gap-4">
        {bottomItems?.map((item) => (
          <a
            key={item.href}
            href={item.href}
            aria-label={item.label}
            title={item.label}
            className="w-12 h-12 flex items-center justify-center rounded-xl text-outline hover:text-primary hover:bg-surface-container-low transition-all duration-200 ease-in-out"
          >
            <span className="material-symbols-outlined">{item.icon}</span>
          </a>
        ))}
      </div>
    </nav>
  );
};
