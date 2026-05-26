# Registro de Métricas — 404 Not Found

Actualizar este archivo antes de cada hito con los valores medidos.

## Medición — 20/05/2026 (Hito 3)

### Cobertura de tests (`npm run test:coverage`)

| Módulo                      | Sentencias | Funciones | Ramas     | Líneas    |
| --------------------------- | ---------- | --------- | --------- | --------- |
| `shared/hooks/useForm.tsx`  | 88.46%     | 83.33%    | 75%       | 91.66%    |
| `features/auth/hooks`       | 0%         | 0%        | 0%        | 0%        |
| `features/patients` (datos) | 0%         | 0%        | 0%        | 0%        |
| `features/finances` (datos) | 0%         | 0%        | 0%        | 0%        |
| `features/agenda` (datos)   | 0%         | 0%        | 0%        | 0%        |
| **Global**                  | **4.81%**  | **2.85%** | **1.91%** | **5.18%** |

### Errores de linter (`npm run lint`)

| Categoría                 | Cantidad | Umbral     |
| ------------------------- | -------- | ---------- |
| Errores críticos          | 0        | 0          |
| Advertencias (complexity) | 2        | Monitorear |
| Advertencias (max-lines)  | 34       | Monitorear |

### Tests escritos y ejecutados

| Suite de test                                   | Tests     | Estado     |
| ----------------------------------------------- | --------- | ---------- |
| `shared/hooks/__tests__/useForm.test.tsx`       | 6         | ✅ Pasando |
| `auth/hooks/__tests__/login.validation.test.ts` | 4         | ✅ Pasando |
| `patients/data/__tests__/patients.mock.test.ts` | 3         | ✅ Pasando |
| `finances/data/__tests__/finances.mock.test.ts` | 5         | ✅ Pasando |
| `agenda/data/__tests__/agenda.mock.test.ts`     | 5         | ✅ Pasando |
| **Total frontend**                              | **25/25** | ✅         |

---

## Medición — 26/05/2026 (Hito 4)

### Cobertura de tests (`npm run test:coverage`) — Frontend

| Módulo                                   | Sentencias | Funciones  | Ramas    | Líneas    |
| ---------------------------------------- | ---------- | ---------- | -------- | --------- |
| `shared/hooks/useForm.tsx`               | 96.15%     | 100%       | 100%     | 95.83%    |
| `auth/hooks/useForgotPasswordForm.ts`    | 100%       | 100%       | 100%     | 100%      |
| `auth/hooks/useLoginForm.ts`             | 100%       | 100%       | 100%     | 100%      |
| Resto de features (componentes, páginas) | 0%         | 0%         | 0%       | 0%        |
| **Global**                               | **14.18%** | **10.45%** | **7.4%** | **14.4%** |

> Los módulos críticos (`useForm`, `useForgotPasswordForm`, `useLoginForm`) superan el umbral de 60%.
> La cobertura global baja se debe a componentes y páginas sin tests, que quedan para Hito 5.

### Cobertura de tests — Backend

| Suite                                          | Tests     | Estado     |
| ---------------------------------------------- | --------- | ---------- |
| `auth/auth.service.spec.ts`                    | 6         | ✅ Pasando |
| `auth/auth.controller.spec.ts`                 | 5         | ✅ Pasando |
| `patients/patients.service.spec.ts`            | ≥5        | ✅ Pasando |
| `patients/patients.controller.spec.ts`         | ≥5        | ✅ Pasando |
| `appointments/appointments.service.spec.ts`    | ≥5        | ✅ Pasando |
| `appointments/appointments.controller.spec.ts` | ≥5        | ✅ Pasando |
| `finances/finances.service.spec.ts`            | ≥5        | ✅ Pasando |
| `finances/finances.controller.spec.ts`         | ≥5        | ✅ Pasando |
| `treatments/treatments.service.spec.ts`        | ≥5        | ✅ Pasando |
| `treatments/treatments.controller.spec.ts`     | ≥5        | ✅ Pasando |
| `clinical-history/*.spec.ts` (2 suites)        | ≥5        | ✅ Pasando |
| **Total backend**                              | **81/81** | ✅         |

### Errores de linter (`npm run lint`)

| Categoría                 | Cantidad | Umbral     |
| ------------------------- | -------- | ---------- |
| Errores críticos          | 0        | 0          |
| Advertencias (complexity) | 2        | Monitorear |
| Advertencias (max-lines)  | 34       | Monitorear |

### Tests escritos y ejecutados — Frontend

| Suite de test                                        | Tests     | Estado     |
| ---------------------------------------------------- | --------- | ---------- |
| `shared/hooks/__tests__/useForm.test.tsx`            | 6         | ✅ Pasando |
| `auth/hooks/__tests__/login.validation.test.ts`      | 4         | ✅ Pasando |
| `auth/hooks/__tests__/useForgotPasswordForm.test.ts` | 7         | ✅ Pasando |
| `auth/hooks/__tests__/useLoginForm.test.ts`          | 5         | ✅ Pasando |
| `patients/data/__tests__/patients.mock.test.ts`      | 3         | ✅ Pasando |
| `finances/data/__tests__/finances.mock.test.ts`      | 5         | ✅ Pasando |
| `agenda/data/__tests__/agenda.mock.test.ts`          | 5         | ✅ Pasando |
| **Total frontend**                                   | **38/38** | ✅         |

### Defectos

| Severidad | Total | Abiertos | Resueltos |
| --------- | ----- | -------- | --------- |
| Crítico   | 2     | 0        | 2         |
| Mayor     | 3     | 0        | 3         |
| Menor     | 2     | 0        | 2         |
| **Total** | **7** | **0**    | **7**     |
