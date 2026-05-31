import { apiClient } from "../../../shared/api/client";

export interface ProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  nickname: string | null;
  email: string;
  avatarUrl: string | null;
  specialty: string | null;
  bio: string | null;
  memberSince: string;
  status: string;
  licenseNumber: string | null;
  dentistId: string | null;
  theme: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  nickname?: string;
  licenseNumber?: string;
  specialty?: string;
  bio?: string;
  theme?: string;
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
