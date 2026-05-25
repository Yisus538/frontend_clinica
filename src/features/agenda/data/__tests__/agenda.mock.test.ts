// Trazabilidad: REQ-F03 — Gestión de turnos / agenda
import { APPOINTMENTS, WEEK_DAYS, LUNCH_HOUR } from "../agenda.mock";

describe("APPOINTMENTS", () => {
  it("contiene turnos", () => {
    expect(APPOINTMENTS.length).toBeGreaterThan(0);
  });

  it("cada turno tiene los campos requeridos", () => {
    for (const a of APPOINTMENTS) {
      expect(a.id).toBeDefined();
      expect(a.patient).toBeDefined();
      expect(a.treatment).toBeDefined();
      expect(a.durationMinutes).toBeGreaterThan(0);
      expect(a.startHour).toBeGreaterThanOrEqual(0);
      expect(a.startHour).toBeLessThan(24);
      expect(a.startMinute).toBeGreaterThanOrEqual(0);
      expect(a.startMinute).toBeLessThan(60);
    }
  });

  it("todos los IDs de turnos son únicos", () => {
    const ids = APPOINTMENTS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("los turnos urgentes tienen isUrgent en true", () => {
    const urgentes = APPOINTMENTS.filter((a) => a.isUrgent);
    for (const a of urgentes) {
      expect(a.isUrgent).toBe(true);
    }
  });
});

describe("WEEK_DAYS", () => {
  it("contiene 7 días", () => {
    expect(WEEK_DAYS).toHaveLength(7);
  });

  it("cada día tiene abreviatura y número", () => {
    for (const d of WEEK_DAYS) {
      expect(d.abbr).toBeDefined();
      expect(d.number).toBeGreaterThan(0);
    }
  });
});

describe("LUNCH_HOUR", () => {
  it("es 13 (horario de almuerzo estándar)", () => {
    expect(LUNCH_HOUR).toBe(13);
  });
});
