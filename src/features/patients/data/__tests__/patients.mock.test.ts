// Trazabilidad: REQ-F02 — Gestión de pacientes
import { PATIENT_RECORDS } from "../patients.mock";

describe("PATIENT_RECORDS", () => {
  it("contiene al menos un paciente", () => {
    expect(PATIENT_RECORDS.length).toBeGreaterThan(0);
  });

  it("cada registro tiene los campos requeridos", () => {
    for (const p of PATIENT_RECORDS) {
      expect(p.id).toBeDefined();
      expect(p.dni).toBeDefined();
      expect(p.name).toBeDefined();
      expect(p.initials).toBeDefined();
      expect(p.lastVisit).toBeDefined();
      expect(["En Tratamiento", "Activo", "Inactivo"]).toContain(p.status);
    }
  });

  it("todos los IDs son únicos", () => {
    const ids = PATIENT_RECORDS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
