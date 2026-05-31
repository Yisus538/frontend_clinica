import { apiClient } from "../../../shared/api/client";

export interface ApiDiagnosis {
  id: string;
  historyId: string;
  title: string;
  description: string | null;
  diagnosedAt: string;
  toothNumber: number | null;
}

export interface ApiClinicalHistory {
  id: string;
  patientId: string;
  bloodType: string | null;
  generalObservations: string | null;
  backgroundConditions: string[] | null;
  currentMedications: string[] | null;
  diagnoses: ApiDiagnosis[];
}

export const clinicalHistoryApi = {
  findByPatient: (patientId: string) =>
    apiClient.get<ApiClinicalHistory>(`/clinical-history/patient/${patientId}`),
  update: (
    id: string,
    data: {
      bloodType?: string;
      generalObservations?: string;
      backgroundConditions?: string[];
      currentMedications?: string[];
    }
  ) => apiClient.patch<ApiClinicalHistory>(`/clinical-history/${id}`, data),
  addDiagnosis: (data: {
    historyId: string;
    title: string;
    description?: string;
    diagnosedAt: string;
    toothNumber?: number;
  }) => apiClient.post<ApiDiagnosis>("/clinical-history/diagnosis", data),
  updateDiagnosis: (id: string, data: { title?: string; description?: string }) =>
    apiClient.patch<ApiDiagnosis>(`/clinical-history/diagnosis/${id}`, data),
};
