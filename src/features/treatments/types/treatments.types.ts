export type TreatmentStatus = "Activo" | "Inactivo";

export type TreatmentCategory =
  | "Prevención"
  | "Estética"
  | "Ortodoncia"
  | "Cirugía"
  | "Endodoncia"
  | "Periodoncia";

export interface Treatment {
  id: string;
  name: string;
  category: TreatmentCategory;
  price: number;
  durationMinutes: number | null;
  status: TreatmentStatus;
  description?: string;
}
