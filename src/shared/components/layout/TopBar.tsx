import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router";
import type { TopBarProps } from "../../../features/dashboard/types/dashboard.types";
import { SIDEBAR_WIDTH_COLLAPSED, SIDEBAR_WIDTH_EXPANDED } from "./Sidebar";
import { useAuth } from "../../../features/auth/context/AuthContext";
import {
  notificationsApi,
  type ApiNotification,
} from "../../../features/notifications/api/notifications.api";
import { toast } from "sonner";

const SEARCH_CONFIG: { prefix: string; placeholder: string }[] = [
  { prefix: "/dashboard/pacientes", placeholder: "Buscar pacientes..." },
  { prefix: "/dashboard/tratamientos", placeholder: "Buscar tratamiento..." },
];

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  return `hace ${Math.floor(hrs / 24)}d`;
}

export const TopBar = ({ sidebarExpanded = false }: TopBarProps) => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const sidebarWidth = sidebarExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED;

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

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

  // Load unread count on mount
  useEffect(() => {
    notificationsApi
      .getUnreadCount()
      .then((res) => setUnreadCount(res.count))
      .catch(() => setUnreadCount(0));
  }, []);

  // Close panel on outside click
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsPanelOpen(false);
      }
    };
    if (isPanelOpen) {
      document.addEventListener("mousedown", handleMouseDown);
    }
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isPanelOpen]);

  const handleBellClick = () => {
    const opening = !isPanelOpen;
    setIsPanelOpen(opening);
    if (opening) {
      // Refresh count and load notifications
      notificationsApi
        .getUnreadCount()
        .then((res) => setUnreadCount(res.count))
        .catch(() => {});
      notificationsApi
        .findAll(1, 5)
        .then((res) => setNotifications(res.data))
        .catch(() => setNotifications([]));
    }
  };

  const handleMarkAllAsRead = () => {
    notificationsApi
      .markAllAsRead()
      .then(() => {
        setUnreadCount(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        toast.success("Todas las notificaciones marcadas como leídas");
      })
      .catch(() => toast.error("No se pudo actualizar las notificaciones"));
  };

  const handleMarkOneAsRead = (id: string) => {
    notificationsApi
      .markAsRead(id)
      .then(() => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
        setUnreadCount((c) => Math.max(0, c - 1));
      })
      .catch(() => {});
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

          {/* Notification Bell */}
          <div className="relative" ref={panelRef}>
            <button
              id="btn-notifications"
              onClick={handleBellClick}
              aria-label="Notificaciones"
              className="relative hover:text-primary transition-colors cursor-pointer active:opacity-70 flex items-center justify-center"
            >
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown Panel */}
            {isPanelOpen && (
              <div className="absolute top-full right-0 mt-3 w-80 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-50 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant">
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    Notificaciones
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="font-label-sm text-label-sm text-primary hover:text-on-primary-fixed-variant transition-colors cursor-pointer"
                    >
                      Marcar todas como leídas
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center py-8 gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-3xl">notifications_none</span>
                      <p className="font-body-sm text-body-sm">Sin notificaciones nuevas</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => !n.isRead && handleMarkOneAsRead(n.id)}
                        className={`flex items-start gap-3 px-4 py-3 border-b border-outline-variant/50 last:border-b-0 transition-colors ${
                          n.isRead ? "opacity-60" : "cursor-pointer hover:bg-surface-container-low"
                        }`}
                      >
                        <span
                          className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${
                            n.isRead ? "bg-outline-variant" : "bg-secondary"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-label-sm text-label-sm text-on-surface font-medium truncate">
                            {n.title}
                          </p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant text-[12px] line-clamp-2 mt-0.5">
                            {n.body}
                          </p>
                          <p className="font-caption text-caption text-outline mt-1">
                            {timeAgo(n.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
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
