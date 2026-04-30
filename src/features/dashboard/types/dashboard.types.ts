import type { ReactNode } from "react";

export interface NavItem {
  icon: string;
  label: string;
  href: string;
  filled?: boolean;
}

export interface MetricCardData {
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  badge: {
    text: string;
    icon: string;
    variant: "success" | "warning";
  };
}

export interface PatientRow {
  id: string;
  initials: string;
  name: string;
  treatment: string;
  status: "Completado" | "Pendiente" | "Planeado" | "En progreso";
  lastVisit: string;
}

export interface AgendaItemData {
  time: string;
  title: string;
  patient: string;
  accentColor?: "primary" | "secondary";
}

export interface TopBarProps {
  doctorName?: string;
  avatarUrl?: string;
}

export interface SidebarProps {
  items: NavItem[];
  activeHref: string;
  bottomItems?: NavItem[];
}

export interface DashboardLayoutProps {
  children?: ReactNode;
}
