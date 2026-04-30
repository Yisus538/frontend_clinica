import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md">
      <Sidebar />
      <TopBar />

      <main className="ml-20 mt-16 p-gutter max-w-[1400px] mx-auto">
        <Outlet />
      </main>
    </div>
  );
};
