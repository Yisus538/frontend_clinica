import { apiClient } from "../../../shared/api/client";
import type { Treatment, TreatmentCategory, TreatmentStatus } from "../types/treatments.types";

type BackendCategory =
  | "prevention"
  | "endodontics"
  | "periodontics"
  | "orthodontics"
  | "implantology"
  | "aesthetics"
  | "oral_surgery"
  | "pediatric"
  | "other";

export interface ApiTreatment {
  id: string;
  code: string;
  name: string;
  description: string | null;
  category: BackendCategory;
  basePrice: number;
  estimatedDurationMinutes: number;
  isActive: boolean;
}

export interface CreateTreatmentDto {
  code: string;
  name: string;
  description?: string;
  category: BackendCategory;
  basePrice: number;
  estimatedDurationMinutes?: number;
}

const CATEGORY_MAP: Record<BackendCategory, TreatmentCategory> = {
  prevention: "Prevención",
  endodontics: "Endodoncia",
  periodontics: "Periodoncia",
  orthodontics: "Ortodoncia",
  implantology: "Cirugía",
  aesthetics: "Estética",
  oral_surgery: "Cirugía",
  pediatric: "Prevención",
  other: "Prevención",
};

const CATEGORY_REVERSE: Record<TreatmentCategory, BackendCategory> = {
  Prevención: "prevention",
  Endodoncia: "endodontics",
  Periodoncia: "periodontics",
  Ortodoncia: "orthodontics",
  Cirugía: "oral_surgery",
  Estética: "aesthetics",
};

export { CATEGORY_REVERSE, CATEGORY_MAP };

export function toTreatment(t: ApiTreatment): Treatment {
  return {
    id: t.id,
    name: t.name,
    category: CATEGORY_MAP[t.category],
    price: Number(t.basePrice),
    durationMinutes: t.estimatedDurationMinutes ?? null,
    status: (t.isActive ? "Activo" : "Inactivo") as TreatmentStatus,
    description: t.description ?? undefined,
  };
}

export const treatmentsApi = {
  findAll: () => apiClient.get<ApiTreatment[]>("/treatments"),
  findOne: (id: string) => apiClient.get<ApiTreatment>(`/treatments/${id}`),
  create: (dto: CreateTreatmentDto) => apiClient.post<ApiTreatment>("/treatments", dto),
  update: (id: string, dto: Partial<CreateTreatmentDto> & { isActive?: boolean }) =>
    apiClient.patch<ApiTreatment>(`/treatments/${id}`, dto),
  remove: (id: string) => apiClient.delete(`/treatments/${id}`),
};
