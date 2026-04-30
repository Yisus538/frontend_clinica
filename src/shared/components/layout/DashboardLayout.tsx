import { useState } from "react";
import { Outlet } from "react-router";
import { Sidebar, SIDEBAR_WIDTH_COLLAPSED, SIDEBAR_WIDTH_EXPANDED } from "./Sidebar";
import { TopBar } from "./TopBar";

export const DashboardLayout = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

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
