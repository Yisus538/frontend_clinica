export type PatientStatus = "En Tratamiento" | "Activo" | "Inactivo";

export interface PatientRecord {
  id: string;
  dni: string;
  name: string;
  avatarUrl?: string;
  initials: string;
  lastVisit: string;
  nextAppointmentDate?: string;
  nextAppointmentTime?: string;
  status: PatientStatus;
}
