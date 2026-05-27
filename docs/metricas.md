# Registro de Métricas — 404 Not Found

Actualizar este archivo antes de cada hito con los valores medidos.

## Medición inicial — 20/05/2026 (Hito 3) — actualizada 26/05/2026

### Cobertura de tests (`npm run test:coverage`)

| Módulo              | Líneas  | Funciones | Ramas  | Umbral |
| ------------------- | ------- | --------- | ------ | ------ |
| `features/auth`     | 0 %     | 0 %       | 0 %    | ≥ 65%  |
| `features/patients` | 0 %     | 0 %       | 0 %    | ≥ 65%  |
| `features/finances` | 0 %     | 0 %       | 0 %    | ≥ 65%  |
| `features/agenda`   | 0 %     | 0 %       | 0 %    | ≥ 65%  |
| `shared/hooks`      | 88.46 % | 83.33 %   | 75 %   | ≥ 65%  |
| **Global**          | 4.81 %  | 2.85 %    | 1.91 % | —      |

> Los tests actuales verifican contratos de tipos/mock data; no ejercen componentes React ni hooks de features.
> La cobertura del umbral ≥ 65 % sobre módulos críticos es el objetivo del **Hito 4 (03/06)**.

### Errores de linter (`npm run lint`)

| Categoría                 | Cantidad | Umbral     |
| ------------------------- | -------- | ---------- |
| Errores críticos          | **0**    | 0          |
| Advertencias (max-lines)  | 34       | Monitorear |
| Advertencias (complexity) | 2        | Monitorear |

> Se corrigieron 8 errores críticos el 26/05/2026:
>
> - `setState` sincrónico en `useEffect` (`AppointmentEditModal`) → patrón `key` prop
> - Componentes definidos dentro del render (`ClinicalHistoryModal`, `Tooth`) → extraídos al módulo
> - Hook co-exportado con componente (`AuthContext`) → `eslint-disable` justificado
> - `any` explícito (`ClinicalHistoryModal`) → tipado con `unknown`
> - `catch` inútil (`useForm`) → reemplazado por `try/finally`
> - Bug de override `minimatch` → `package.json` `overrides` con v9.0.5

### Issues abiertos en GitHub

| Severidad | Cantidad | Umbral al cierre |
| --------- | -------- | ---------------- |
| Crítico   | 0        | 0                |
| Mayor     | 0        | —                |
| Menor     | 0        | —                |
| Cosmético | 0        | —                |

### Tests escritos y ejecutados

| Archivo de test                                 | Tests  | Estado   |
| ----------------------------------------------- | ------ | -------- |
| `shared/hooks/__tests__/useForm.test.tsx`       | 6      | ✅ Pasan |
| `auth/hooks/__tests__/login.validation.test.ts` | 4      | ✅ Pasan |
| `patients/data/__tests__/patients.mock.test.ts` | 3      | ✅ Pasan |
| `finances/data/__tests__/finances.mock.test.ts` | 5      | ✅ Pasan |
| `agenda/data/__tests__/agenda.mock.test.ts`     | 9      | ✅ Pasan |
| **Total frontend**                              | **27** | ✅ 27/27 |

> Backend (Jest): 70 tests pasan en 10 suites; 2 suites con error de compilación TS en `auth.*.spec.ts` — pendiente Hito 4.

---

## Medición Hito 4 — 03/06/2026 (pendiente)

### Cobertura objetivo (módulos críticos)

| Módulo                  | Meta  |
| ----------------------- | ----- |
| `features/auth`         | ≥ 65% |
| `features/patients`     | ≥ 65% |
| `features/agenda`       | ≥ 65% |
| `features/finances`     | ≥ 65% |
| `shared/hooks`          | ≥ 65% |
| Backend services (Jest) | ≥ 60% |

**Notas / acciones correctivas planificadas:**

- Agregar tests de componentes con React Testing Library para `LoginPage`, `PatientsPage`, `AgendaPage`
- Agregar tests de integración en el backend para los services con repositorios mockeados
- Corregir los 2 spec files del backend que fallan por errores TS en `auth.controller.spec.ts` y `auth.service.spec.ts`

---

## Plantilla para próximas mediciones

Copiar esta sección y completar antes de cada hito.

### Medición — DD/MM/YYYY (Hito N)

| Módulo | Líneas | Funciones | Ramas |
| ------ | ------ | --------- | ----- |
| ...    |        |           |       |

**Notas / acciones correctivas:**

- ...
