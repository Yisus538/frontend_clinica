import { NavLink, Link } from "react-router";

const CLINIC_LOGO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBbU7iN3911hb0x34ZfJ-3uF6w5gZ-ED4vfX9sIfuo-6AQ1CxP5GcPg5SuXJaD9vo7SM4gSbemkf0pXa73T4DKz-ZrNPmosmABFcHULsepH9_B0EQKY3dv0Cyqw5Up8qiVC3C42cdM4ZsOLJOnAR58yrBdqAuI6d4OEbYygMSCGe0E_zUr3mhoEctWyOw8ho343jehGyX3Xxz1D_1ZTVvVUR8j4QN_-gXkYyc0Xpj0wlXU7kQMIM-CT5NZ7DaE9PyXuwTVY-PAMMeQ";

const NAV_MAIN = [
  { icon: "dashboard", label: "Panel de Control", to: "/dashboard" },
  { icon: "calendar_today", label: "Agenda", to: "/agenda" },
  { icon: "group", label: "Pacientes", to: "/pacientes" },
  { icon: "dentistry", label: "Tratamientos", to: "/tratamientos" },
  { icon: "payments", label: "Facturación", to: "/facturacion" },
] as const;

const NAV_BOTTOM = [
  { icon: "help", label: "Centro de Ayuda", to: "/ayuda" },
] as const;

interface NavItemProps {
  icon: string;
  label: string;
  to: string;
}

const NavItem = ({ icon, label, to }: NavItemProps) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 px-3 py-2.5 rounded text-sm font-semibold transition-colors",
          isActive
            ? "border-r-4 border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]"
            : "text-[var(--color-text-muted)] hover:bg-[var(--color-primary-light)]",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: `'FILL' ${isActive ? 1 : 0}` }}
          >
            {icon}
          </span>
          {label}
        </>
      )}
    </NavLink>
  </li>
);

export const SideNav = () => (
  <nav
    className="hidden md:flex flex-col h-full fixed left-0 top-0 py-6 gap-2 border-r w-64 z-40"
    style={{
      background: "var(--color-white)",
      borderColor: "var(--color-border)",
    }}
  >
    {/* Logo */}
    <div className="px-6 mb-10">
      <div className="flex items-center gap-3">
        <img
          src={CLINIC_LOGO}
          alt="City Dental logo"
          className="w-10 h-10 rounded-full object-cover border"
          style={{ borderColor: "var(--color-border)" }}
        />
        <div>
          <h2
            className="text-xl font-semibold leading-tight"
            style={{ color: "var(--color-text-main)" }}
          >
            City Dental
          </h2>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Sucursal Principal
          </p>
        </div>
      </div>
    </div>

    {/* Links principales */}
    <div className="flex-1 overflow-y-auto px-2">
      <ul className="flex flex-col gap-1">
        {NAV_MAIN.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </ul>
    </div>

    {/* Links secundarios */}
    <div className="px-2">
      <ul
        className="flex flex-col gap-1 border-t pt-2"
        style={{ borderColor: "var(--color-border)" }}
      >
        {NAV_BOTTOM.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
        <li>
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-semibold transition-colors hover:bg-[var(--color-primary-light)]"
            style={{ color: "var(--color-text-muted)" }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              logout
            </span>
            Cerrar Sesión
          </Link>
        </li>
      </ul>
    </div>
  </nav>
);
