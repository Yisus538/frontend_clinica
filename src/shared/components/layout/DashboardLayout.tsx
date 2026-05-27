import { useEffect, useRef, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { Sidebar, SIDEBAR_WIDTH_COLLAPSED, SIDEBAR_WIDTH_EXPANDED } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useAuth } from "../../../features/auth/context/AuthContext";
import { ProfileProvider, useProfile } from "../../../features/settings/context/ProfileContext";

const SETTINGS_PATH = "/dashboard/configuracion";

function DashboardLayoutInner() {
  const { user } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const hasRedirected = useRef(false);

  const isOdontologo = user?.role === "ODONTOLOGO";
  const isOnSettings = location.pathname === SETTINGS_PATH;

  useEffect(() => {
    if (profileLoading || !isOdontologo) return;
    if (profile && !profile.licenseNumber && !isOnSettings) {
      if (!hasRedirected.current) {
        toast.warning("Completá tu perfil para continuar.", {
          description: "Ingresá tu número de matrícula en Configuración antes de usar el sistema.",
          duration: 6000,
        });
        hasRedirected.current = true;
      }
      navigate(SETTINGS_PATH, { replace: true });
    }
    if (profile?.licenseNumber) {
      hasRedirected.current = false;
    }
  }, [profileLoading, profile, isOdontologo, isOnSettings, navigate]);

  if (!user) return <Navigate to="/" replace />;

  const toggleSidebar = () => setSidebarExpanded((prev) => !prev);
  const sidebarWidth = sidebarExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED;

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md">
      <Sidebar expanded={sidebarExpanded} onToggle={toggleSidebar} />
      <TopBar sidebarExpanded={sidebarExpanded} />

      <main
        className="mt-16 p-gutter transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarWidth }}
      >
        <Outlet />
      </main>
    </div>
  );
}

export const DashboardLayout = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">
          progress_activity
        </span>
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  return (
    <ProfileProvider>
      <DashboardLayoutInner />
    </ProfileProvider>
  );
};
