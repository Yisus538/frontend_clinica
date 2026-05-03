import type { Treatment } from "../types/treatments.types";

export const TREATMENTS_MOCK: Treatment[] = [
  {
    id: "t1",
    name: "Limpieza Dental",
    category: "Prevención",
    price: 80,
    durationMinutes: 45,
    status: "Activo",
    description:
      "Eliminación de sarro y placa bacteriana mediante ultrasonido y pulido dental profesional.",
  },
  {
    id: "t2",
    name: "Blanqueamiento Láser",
    category: "Estética",
    price: 250,
    durationMinutes: 60,
    status: "Activo",
    description:
      "Blanqueamiento dental de alta intensidad asistido por tecnología láser para resultados inmediatos.",
  },
  {
    id: "t3",
    name: "Ortodoncia Invisible",
    category: "Ortodoncia",
    price: 3500,
    durationMinutes: null,
    status: "Activo",
    description:
      "Alineadores transparentes removibles para corrección estética de maloclusiones.",
  },
  {
    id: "t4",
    name: "Implante de Titanio",
    category: "Cirugía",
    price: 1200,
    durationMinutes: 90,
    status: "Activo",
    description:
      "Colocación de implante de titanio como raíz artificial para reemplazar piezas dentales perdidas.",
  },
  {
    id: "t5",
    name: "Extracción Simple",
    category: "Cirugía",
    price: 150,
    durationMinutes: 30,
    status: "Inactivo",
    description:
      "Extracción de pieza dental con movilidad o fractura irreparable bajo anestesia local.",
  },
  {
    id: "t6",
    name: "Endodoncia Molar",
    category: "Endodoncia",
    price: 320,
    durationMinutes: 75,
    status: "Activo",
    description:
      "Tratamiento de conducto en piezas molares con infección o necrosis pulpar.",
  },
  {
    id: "t7",
    name: "Curetaje Periodontal",
    category: "Periodoncia",
    price: 180,
    durationMinutes: 50,
    status: "Activo",
    description:
      "Raspado y alisado radicular para el tratamiento de la enfermedad periodontal moderada.",
  },
  {
    id: "t8",
    name: "Carilla de Porcelana",
    category: "Estética",
    price: 450,
    durationMinutes: 60,
    status: "Activo",
    description:
      "Lámina de porcelana ultrafina adherida a la superficie dental para mejorar su forma y color.",
  },
];

export const TREATMENTS_STATS = {
  total: 24,
  categories: 6,
  mostRequested: "Limpieza Dental",
};
