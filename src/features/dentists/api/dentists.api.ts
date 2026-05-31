import { apiClient } from "../../../shared/api/client";

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface ApiAvailability {
  id: string;
  dentistId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface ApiDentist {
  id: string;
  userId: string;
  licenseNumber: string | null;
  specialty: string | null;
  bio: string | null;
  isActive: boolean;
  availabilities: ApiAvailability[];
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
  };
}

export interface AvailabilityItem {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isActive?: boolean;
}

export const dentistsApi = {
  getMe: () => apiClient.get<ApiDentist>("/dentists/me"),

  setAvailability: (dentistId: string, availabilities: AvailabilityItem[]) =>
    apiClient.put<ApiAvailability[]>(`/dentists/${dentistId}/availability`, { availabilities }),
};
