import type { ReactNode } from "react";
import { SideNav } from "./SideNav";
import { TopBar } from "./TopBar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => (
  <div
    className="flex min-h-screen"
    style={{ background: "var(--color-surface)" }}
  >
    <SideNav />

    {/* Offset del sidebar en desktop */}
    <div className="flex-1 flex flex-col min-h-screen md:ml-64">
      <TopBar />
      <main className="flex-1 p-6 md:p-10 lg:p-16 max-w-[1200px] mx-auto w-full">
        {children}
      </main>
    </div>
  </div>
);
