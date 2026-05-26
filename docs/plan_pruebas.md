# Plan de Pruebas — 404 Not Found

**Proyecto:** Sistema de Gestión para Clínica Odontológica  
**Versión:** 1.0  
**Fecha:** 26/05/2026  
**Hito:** 4 — Avance 2 — Ingeniería de Software II

---

## 1. Propósito

Definir la estrategia, el alcance y los criterios de aceptación de las pruebas del sistema, de modo que los defectos sean detectados antes de la entrega final (Hito 5 — 16/06/2026).

---

## 2. Alcance

### 2.1 Qué se testea

| Módulo                                                                                         | Tipo de prueba                                          | Herramienta  |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------ |
| Validación de formularios (login, recuperación)                                                | Caja negra — partición de equivalencia y valores límite | Vitest       |
| Hook `useForm` (lógica compartida de formularios)                                              | Caja blanca — cobertura de sentencias y ramas           | Vitest + RTL |
| Hook `useForgotPasswordForm`                                                                   | Caja negra + blanca                                     | Vitest       |
| Mock data de pacientes, finanzas, agenda                                                       | Caja negra — contratos de datos                         | Vitest       |
| Backend `AuthService` (login, validaciones)                                                    | Integración con mocks de repo y JWT                     | Jest         |
| Backend `PatientsService` (CRUD)                                                               | Integración con mocks de repo                           | Jest         |
| Backend `AppointmentsService` (CRUD)                                                           | Integración con mocks de repo                           | Jest         |
| Backend `FinancesService` (transacciones, facturas)                                            | Integración con mocks de repo                           | Jest         |
| Backend `TreatmentsService` (catálogo)                                                         | Integración con mocks de repo                           | Jest         |
| Backend `ClinicalHistoryService`                                                               | Integración con mocks de repo                           | Jest         |
| Controllers del backend (auth, patients, appointments, finances, treatments, clinical-history) | Integración con servicio mockeado                       | Jest         |

### 2.2 Qué NO se testea en este hito

- Pruebas end-to-end (E2E) con base de datos real — quedan para Hito 5 si el tiempo lo permite
- Pruebas visuales de componentes complejos (CalendarGrid, ClinicalHistoryModal completo)
- Integración con servicios externos (WhatsApp, email)
- Performance / carga

---

## 3. Estrategia

### 3.1 Pruebas de caja negra

Técnicas utilizadas:

- **Partición de equivalencia:** se identifican clases válidas e inválidas para cada campo de entrada.
- **Valores límite:** se prueban los bordes de las restricciones (ej: contraseña de exactamente 6 caracteres vs 5).

Ejemplo de particiones para el campo `password` en login:

| Clase             | Descripción          | Ejemplo     |
| ----------------- | -------------------- | ----------- |
| Válida            | 6 o más caracteres   | `"secreto"` |
| Inválida          | Vacío                | `""`        |
| Inválida (límite) | 5 caracteres         | `"abc12"`   |
| Válida (límite)   | 6 caracteres exactos | `"abc123"`  |

### 3.2 Pruebas de caja blanca

Se analiza el código fuente para garantizar cobertura de:

- **Sentencias:** toda línea ejecutable debe ser ejercida al menos una vez.
- **Ramas:** ambas ramas de cada `if/else` deben ser cubiertas.

Módulos objetivo: `useForm.tsx`, `useForgotPasswordForm.ts`, `AuthService`, `PatientsService`.

### 3.3 Pruebas de integración (backend)

Cada servicio del backend se prueba con su repositorio de TypeORM mockeado mediante `jest.fn()`. Se verifica:

- Casos felices (happy path)
- Manejo de `NotFoundException` cuando el recurso no existe
- Comportamiento del `softRemove` (borrado lógico)

---

## 4. Criterios de aceptación

| Criterio                                        | Umbral | Estado (26/05)                                                  |
| ----------------------------------------------- | ------ | --------------------------------------------------------------- |
| Cobertura de líneas (módulos críticos frontend) | ≥ 60%  | ✅ useForm 95.8%, useForgotPasswordForm 100%, useLoginForm 100% |
| Cobertura de líneas (backend services)          | ≥ 60%  | ✅ Todos los servicios cubiertos con mocks (81 tests)           |
| Tests pasando al 100%                           | 100%   | ✅ Frontend 38/38, Backend 81/81                                |
| Suites que fallan compilación (backend auth)    | 0      | ✅ 0 suites con errores                                         |
| Defectos críticos abiertos                      | 0      | ✅ 0 críticos, 0 abiertos (7/7 resueltos)                       |

---

## 5. Herramientas

| Herramienta                  | Uso                                               |
| ---------------------------- | ------------------------------------------------- |
| **Vitest 4.x**               | Runner de tests del frontend (React + TypeScript) |
| **@testing-library/react**   | Renderizado de componentes React en tests         |
| **@vitest/coverage-v8**      | Reporte de cobertura del frontend                 |
| **Jest (via NestJS)**        | Runner de tests del backend                       |
| **@nestjs/testing**          | Módulo de pruebas unitarias de NestJS             |
| **jest.fn() / jest.spyOn()** | Mocking de dependencias en backend                |

---

## 6. Entorno de pruebas

- **Frontend:** Node.js 22.x, Vitest con entorno jsdom, sin servidor backend real
- **Backend:** Node.js 22.x, Jest con mocks de TypeORM y JwtService, sin base de datos real
- **CI:** GitHub Actions ejecuta `npm run test` en cada push y PR

---

## 7. Gestión de defectos

Los defectos encontrados durante las pruebas se documentan en `docs/reporte_defectos.md` con:

- ID correlativo (DEF-XXX)
- Severidad: `crítico` / `mayor` / `menor` / `cosmético`
- Descripción, pasos para reproducir, resultado esperado vs real
- Estado: `abierto` / `resuelto`
- Commit de resolución si aplica

---

## 8. Cronograma

| Fecha | Actividad                                                           |
| ----- | ------------------------------------------------------------------- |
| 20/05 | Tests de mock data y hooks (Hito 3) — ✅ completado                 |
| 26/05 | Corrección de suites del backend, nuevos tests de hooks frontend    |
| 30/05 | Cobertura ≥ 60% alcanzada en módulos críticos                       |
| 03/06 | **Entrega Hito 4** — plan + casos + reporte de defectos + cobertura |
