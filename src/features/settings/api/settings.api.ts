import { apiClient } from "../../../shared/api/client";

export interface ProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  specialty: string | null;
  bio: string | null;
  memberSince: string;
  status: string;
  licenseNumber: string | null;
  dentistId: string | null;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  licenseNumber?: string;
  specialty?: string;
  bio?: string;
}

export const settingsApi = {
  getProfile: () => apiClient.get<ProfileResponse>("/users/me/profile"),
  updateProfile: (data: UpdateProfilePayload) =>
    apiClient.patch<ProfileResponse>("/users/me/profile", data),
  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return apiClient.upload<{ avatarUrl: string }>("/users/me/avatar", form);
  },
};
