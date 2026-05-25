// Trazabilidad: REQ-F05 — Gestión de pagos y finanzas
import { TRANSACTIONS, FINANCE_METRICS } from "../finances.mock";

describe("TRANSACTIONS", () => {
  it("contiene transacciones", () => {
    expect(TRANSACTIONS.length).toBeGreaterThan(0);
  });

  it("cada transacción tiene los campos requeridos", () => {
    for (const t of TRANSACTIONS) {
      expect(t.id).toBeDefined();
      expect(t.date).toBeDefined();
      expect(t.patient).toBeDefined();
      expect(t.treatment).toBeDefined();
      expect(t.amount).toBeGreaterThan(0);
      expect(["Completado", "Pendiente", "Cancelado"]).toContain(t.status);
    }
  });

  it("todos los IDs de transacciones son únicos", () => {
    const ids = TRANSACTIONS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("FINANCE_METRICS", () => {
  it("contiene exactamente 4 métricas", () => {
    expect(FINANCE_METRICS).toHaveLength(4);
  });

  it("cada métrica tiene label y value definidos", () => {
    for (const m of FINANCE_METRICS) {
      expect(m.label).toBeDefined();
      expect(m.value).toBeDefined();
      expect(m.icon).toBeDefined();
    }
  });
});
