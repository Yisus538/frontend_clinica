import { useState } from "react";
import { Navigate, Outlet } from "react-router";
import { Sidebar, SIDEBAR_WIDTH_COLLAPSED, SIDEBAR_WIDTH_EXPANDED } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useAuth } from "../../../features/auth/context/AuthContext";

export const DashboardLayout = () => {
  const { user, isLoading } = useAuth();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

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
};
