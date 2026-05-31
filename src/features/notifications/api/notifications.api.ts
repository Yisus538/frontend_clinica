import { apiClient } from "../../../shared/api/client";

export interface ApiNotification {
  id: string;
  type: string;
  channel: string;
  title: string;
  body: string;
  entityType: string | null;
  entityId: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationsPage {
  data: ApiNotification[];
  total: number;
  page: number;
  limit: number;
}

export const notificationsApi = {
  findAll: (page = 1, limit = 20) =>
    apiClient.get<NotificationsPage>(`/notifications?page=${page}&limit=${limit}`),
  getUnreadCount: () => apiClient.get<{ count: number }>("/notifications/unread-count"),
  markAsRead: (id: string) => apiClient.patch<ApiNotification>(`/notifications/${id}/read`, {}),
  markAllAsRead: () => apiClient.patch<{ updated: number }>("/notifications/read-all", {}),
};
