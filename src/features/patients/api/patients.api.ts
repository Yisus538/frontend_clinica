import { apiClient } from "../../../shared/api/client";
import type { PatientRecord, PatientStatus } from "../types/patients.types";

export interface ApiPatient {
  id: string;
  dni: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  dateOfBirth: string | null;
  address: string | null;
  status: "active" | "in_treatment" | "inactive";
  notes: string | null;
  insuranceId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientDto {
  dni: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  address?: string;
  status: "active" | "in_treatment" | "inactive";
  notes?: string;
}

const STATUS_MAP: Record<ApiPatient["status"], PatientStatus> = {
  active: "Activo",
  in_treatment: "En Tratamiento",
  inactive: "Inactivo",
};

const STATUS_REVERSE: Record<PatientStatus, ApiPatient["status"]> = {
  Activo: "active",
  "En Tratamiento": "in_treatment",
  Inactivo: "inactive",
};

export function toPatientRecord(p: ApiPatient): PatientRecord {
  return {
    id: p.id,
    dni: p.dni,
    name: `${p.firstName} ${p.lastName}`,
    initials: `${p.firstName[0] ?? ""}${p.lastName[0] ?? ""}`.toUpperCase(),
    lastVisit: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString("es-AR") : "—",
    status: STATUS_MAP[p.status],
  };
}

export { STATUS_REVERSE };

export const patientsApi = {
  findAll: () => apiClient.get<ApiPatient[]>("/patients"),
  findOne: (id: string) => apiClient.get<ApiPatient>(`/patients/${id}`),
  create: (dto: CreatePatientDto) => apiClient.post<ApiPatient>("/patients", dto),
  update: (id: string, dto: Partial<CreatePatientDto>) =>
    apiClient.patch<ApiPatient>(`/patients/${id}`, dto),
  remove: (id: string) => apiClient.delete(`/patients/${id}`),
};
