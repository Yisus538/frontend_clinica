import { apiClient } from "../../../shared/api/client";

export type SessionStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export interface ApiTreatmentSession {
  id: string;
  planId: string;
  sessionNumber: number;
  status: SessionStatus;
  performedAt: string | null;
  durationMinutes: number | null;
  observations: string | null;
}

export interface ApiTreatmentPlan {
  id: string;
  appointmentId: string;
  catalogId: string;
  toothNumber: number | null;
  agreedPrice: string;
  notes: string | null;
  createdAt: string;
  treatmentCatalog: { id: string; name: string; estimatedDurationMinutes: number };
  appointment: { id: string; scheduledAt: string; notes: string | null };
  sessions: ApiTreatmentSession[];
}

export interface CreatePlanDto {
  appointmentId: string;
  catalogId: string;
  agreedPrice: number;
  toothNumber?: number;
  notes?: string;
}

export const treatmentPlansApi = {
  findByPatient: (patientId: string) =>
    apiClient.get<ApiTreatmentPlan[]>(`/treatments/plans/patient/${patientId}`),

  create: (dto: CreatePlanDto) => apiClient.post<ApiTreatmentPlan>("/treatments/plans", dto),

  remove: (id: string) => apiClient.delete(`/treatments/plans/${id}`),

  createSession: (
    planId: string,
    dto: { sessionNumber: number; status?: SessionStatus; observations?: string }
  ) => apiClient.post<ApiTreatmentSession>(`/treatments/plans/${planId}/sessions`, dto),

  updateSession: (
    planId: string,
    sessionId: string,
    dto: { status?: SessionStatus; performedAt?: string; observations?: string }
  ) =>
    apiClient.patch<ApiTreatmentSession>(`/treatments/plans/${planId}/sessions/${sessionId}`, dto),
};
