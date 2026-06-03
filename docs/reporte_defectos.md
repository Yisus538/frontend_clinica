# Reporte de Defectos — 404 Not Found

**Proyecto:** Sistema de Gestión para Clínica Odontológica  
**Versión:** 1.0  
**Fecha:** 26/05/2026  
**Hito:** 4 — Avance 2

---

## Resumen ejecutivo

| Severidad | Prioridad  | Total | Abiertos | Resueltos |
| --------- | ---------- | ----- | -------- | --------- |
| Crítico   | Alta       | 2     | 0        | 2         |
| Mayor     | Alta/Media | 3     | 0        | 3         |
| Menor     | Baja       | 2     | 0        | 2         |
| **Total** | —          | **7** | **0**    | **7**     |

> Issues en GitHub: [frontend #6](https://github.com/Yisus538/frontend_clinica/issues/6) [#7](https://github.com/Yisus538/frontend_clinica/issues/7) [#8](https://github.com/Yisus538/frontend_clinica/issues/8) [#9](https://github.com/Yisus538/frontend_clinica/issues/9) [#10](https://github.com/Yisus538/frontend_clinica/issues/10) · [backend #3](https://github.com/Yisus538/backend_clinica/issues/3) [#4](https://github.com/Yisus538/backend_clinica/issues/4)

---

## DEF-001 — Incompatibilidad de `minimatch@10.x` con ESLint 10

| Campo             | Detalle                                                                          |
| ----------------- | -------------------------------------------------------------------------------- |
| **ID**            | DEF-001                                                                          |
| **Severidad**     | Crítico                                                                          |
| **Prioridad**     | Alta                                                                             |
| **Módulo**        | Tooling / CI                                                                     |
| **Requerimiento** | REQ-NF02 (mantenibilidad)                                                        |
| **Estado**        | ✅ Resuelto                                                                      |
| **GitHub Issue**  | [frontend_clinica #6](https://github.com/Yisus538/frontend_clinica/issues/6)     |
| **Commit**        | `[SQA] feat: autenticación con contexto, corrección de linter y métricas Hito 3` |

**Descripción:** Al ejecutar `npm run lint`, el proceso falla con `ReferenceError: exports is not defined in ES module scope`. El paquete `minimatch@10.2.5` declara `"type": "module"` en su `package.json`, pero su archivo `dist/commonjs/index.js` usa sintaxis CommonJS, lo que provoca un conflicto cuando ESLint intenta cargarlo con `require()`.

**Pasos para reproducir:**

1. Tener instalado Node.js ≥ 22 y `minimatch@10.x`
2. Ejecutar `npm run lint` en el directorio `frontend_clinica`
3. Observar el error `ReferenceError: exports is not defined`

**Resultado esperado:** El linter se ejecuta sin errores de inicialización.  
**Resultado real:** El proceso termina con código de salida 1 antes de analizar ningún archivo.

**Solución:** Agregar `"overrides": { "minimatch": "9.0.5" }` en `package.json` para forzar la versión compatible.

---

## DEF-002 — `setState` sincrónico dentro de `useEffect` en `AppointmentEditModal`

| Campo             | Detalle                                                                          |
| ----------------- | -------------------------------------------------------------------------------- |
| **ID**            | DEF-002                                                                          |
| **Severidad**     | Crítico                                                                          |
| **Prioridad**     | Alta                                                                             |
| **Módulo**        | `features/agenda/components/AppointmentEditModal.tsx`                            |
| **Requerimiento** | REQ-F03 (gestión de turnos)                                                      |
| **Estado**        | ✅ Resuelto                                                                      |
| **GitHub Issue**  | [frontend_clinica #7](https://github.com/Yisus538/frontend_clinica/issues/7)     |
| **Commit**        | `[SQA] feat: autenticación con contexto, corrección de linter y métricas Hito 3` |

**Descripción:** El componente llama a cuatro `setState` sincrónicos dentro del cuerpo de un `useEffect`, provocando renders en cascada. Según el equipo de React, este patrón es desaconsejado porque cada `setState` dispara un nuevo ciclo de renderizado desde dentro del efecto.

**Pasos para reproducir:**

1. Abrir la página de Agenda y hacer click sobre un turno
2. Observar en React DevTools múltiples re-renders al abrir el modal

**Resultado esperado:** El modal inicializa su estado en un único render.  
**Resultado real:** Se producen renders en cascada (4 setState → 4 re-renders).

**Solución:** Eliminar el `useEffect` e inicializar el estado directamente desde la prop `appointment`. Agregar `key={selectedAppointment?.id ?? 'none'}` en el padre para forzar remount cuando cambia el turno seleccionado.

---

## DEF-003 — Componentes definidos dentro del render en `ClinicalHistoryModal` y `Tooth`

| Campo             | Detalle                                                                          |
| ----------------- | -------------------------------------------------------------------------------- |
| **ID**            | DEF-003                                                                          |
| **Severidad**     | Mayor                                                                            |
| **Prioridad**     | Media                                                                            |
| **Módulo**        | `clinical-history/ClinicalHistoryModal.tsx`, `clinical-history/Tooth.tsx`        |
| **Requerimiento** | REQ-F02 (historial clínico)                                                      |
| **Estado**        | ✅ Resuelto                                                                      |
| **GitHub Issue**  | [frontend_clinica #8](https://github.com/Yisus538/frontend_clinica/issues/8)     |
| **Commit**        | `[SQA] feat: autenticación con contexto, corrección de linter y métricas Hito 3` |

**Descripción:** Los componentes `InputField`, `QuestionRow` (en `ClinicalHistoryModal`) y `NumberLabel` (en `Tooth`) estaban definidos dentro del cuerpo de sus componentes padre. React re-crea referencias de función en cada render, lo que provoca que estos sub-componentes sean considerados "nuevos" componentes en cada render, causando desmontaje y remontaje completo (pérdida de estado interno, foco en inputs, etc.).

**Pasos para reproducir:**

1. Abrir la historia clínica de cualquier paciente
2. Escribir algo en un `InputField`
3. Interactuar con cualquier otra parte del formulario que cause un re-render
4. Observar que el campo pierde el foco o el contenido

**Resultado esperado:** Los inputs del formulario mantienen el foco y el estado durante la edición.  
**Resultado real:** Los inputs se desmontan y remontan en cada re-render del padre.

**Solución:** Extraer `InputField` y `QuestionRow` al nivel del módulo usando un `FormCtx` (React Context) de alcance de archivo para acceder al estado del formulario sin prop drilling.

---

## DEF-004 — Tests del backend `auth.service.spec.ts` no compilan

| Campo             | Detalle                                                                         |
| ----------------- | ------------------------------------------------------------------------------- |
| **ID**            | DEF-004                                                                         |
| **Severidad**     | Mayor                                                                           |
| **Prioridad**     | Alta                                                                            |
| **Módulo**        | `backend_clinica/src/auth/auth.service.spec.ts`                                 |
| **Requerimiento** | REQ-F01 (autenticación)                                                         |
| **Estado**        | ✅ Resuelto                                                                     |
| **GitHub Issue**  | [backend_clinica #3](https://github.com/Yisus538/backend_clinica/issues/3)      |
| **Commit**        | `[SQA] test: corregir specs de auth y agregar tests de hooks frontend — Hito 4` |

**Descripción:** El archivo `auth.service.spec.ts` prueba una versión stub del servicio (con usuarios hardcodeados y token mock) que no coincide con la implementación real. `AuthService.login()` es `async`, requiere `UserRepository` y `JwtService` como dependencias, y usa `bcrypt.compare()`. El test instancia el servicio sin estos providers y llama al método sin `await`, por lo que TypeScript reporta errores de tipo en tiempo de compilación.

**Pasos para reproducir:**

1. `cd backend_clinica && npm run test`
2. Observar error `TS2339: Property 'accessToken' does not exist on type 'Promise<...>'`

**Resultado esperado:** El test compila y ejecuta los casos de prueba de autenticación.  
**Resultado real:** La suite falla antes de ejecutar cualquier test.

**Solución:** Reescribir el spec con mocks de `getRepositoryToken(User)`, `JwtService` y `bcrypt.compare` mediante `jest.spyOn`. El archivo ahora tiene 6 tests pasando que cubren los casos: login exitoso, usuario inexistente, usuario inactivo, contraseña incorrecta, permisos incluidos y registro de lastLoginAt.

---

## DEF-005 — Tests del backend `auth.controller.spec.ts` firma incorrecta

| Campo             | Detalle                                                                         |
| ----------------- | ------------------------------------------------------------------------------- |
| **ID**            | DEF-005                                                                         |
| **Severidad**     | Mayor                                                                           |
| **Prioridad**     | Alta                                                                            |
| **Módulo**        | `backend_clinica/src/auth/auth.controller.spec.ts`                              |
| **Requerimiento** | REQ-F01 (autenticación)                                                         |
| **Estado**        | ✅ Resuelto                                                                     |
| **GitHub Issue**  | [backend_clinica #4](https://github.com/Yisus538/backend_clinica/issues/4)      |
| **Commit**        | `[SQA] test: corregir specs de auth y agregar tests de hooks frontend — Hito 4` |

**Descripción:** `AuthController.login()` recibe dos parámetros: `(dto: LoginDto, @Res({ passthrough: true }) res: Response)`. El test lo invoca con un solo argumento (`controller.login(dto)`), causando un error de compilación TypeScript `TS2554: Expected 2 arguments, but got 1`. Además, el test espera `result.accessToken` cuando el controlador devuelve solo `user`.

**Pasos para reproducir:**

1. `cd backend_clinica && npm run test`
2. Observar error `TS2554: Expected 2 arguments, but got 1`

**Resultado esperado:** El test verifica que el controlador llama al servicio y setea la cookie.  
**Resultado real:** La suite falla antes de ejecutar cualquier test.

**Solución:** Reescribir el spec mockeando el objeto `Response` de Express (`{ cookie: jest.fn(), clearCookie: jest.fn() }`) y el `AuthService`. El archivo ahora tiene 4 tests pasando: controlador definido, login con cookie, propagación de UnauthorizedException y logout.

---

## DEF-006 — Tipo `any` explícito en `ClinicalHistoryModal`

| Campo             | Detalle                                                                          |
| ----------------- | -------------------------------------------------------------------------------- |
| **ID**            | DEF-006                                                                          |
| **Severidad**     | Menor                                                                            |
| **Prioridad**     | Baja                                                                             |
| **Módulo**        | `features/patients/components/clinical-history/ClinicalHistoryModal.tsx`         |
| **Requerimiento** | REQ-NF02 (mantenibilidad)                                                        |
| **Estado**        | ✅ Resuelto                                                                      |
| **GitHub Issue**  | [frontend_clinica #9](https://github.com/Yisus538/frontend_clinica/issues/9)     |
| **Commit**        | `[SQA] feat: autenticación con contexto, corrección de linter y métricas Hito 3` |

**Descripción:** El estado del formulario se tipaba como `Record<string, any>`, desactivando efectivamente el chequeo de tipos de TypeScript para todos los valores del formulario.

**Solución:** Cambiar a `Record<string, unknown>` y agregar castings explícitos en los puntos de uso.

---

## DEF-007 — Cláusula `catch` inútil en `useForm`

| Campo             | Detalle                                                                          |
| ----------------- | -------------------------------------------------------------------------------- |
| **ID**            | DEF-007                                                                          |
| **Severidad**     | Menor                                                                            |
| **Prioridad**     | Baja                                                                             |
| **Módulo**        | `shared/hooks/useForm.tsx`                                                       |
| **Requerimiento** | REQ-NF02 (mantenibilidad)                                                        |
| **Estado**        | ✅ Resuelto                                                                      |
| **GitHub Issue**  | [frontend_clinica #10](https://github.com/Yisus538/frontend_clinica/issues/10)   |
| **Commit**        | `[SQA] feat: autenticación con contexto, corrección de linter y métricas Hito 3` |

**Descripción:** El bloque `try/catch/finally` en `handleSubmit` tenía un `catch` que únicamente re-lanzaba el error (`throw error`), lo que es equivalente a no tener `catch`. ESLint reporta esto como `no-useless-catch`. Además genera confusión: un lector podría pensar que el `catch` hace algún manejo especial cuando en realidad no.

**Solución:** Eliminar el `catch` y dejar solo `try/finally`, que garantiza que `setIsLoading(false)` siempre se ejecuta sin cambiar el comportamiento de propagación de errores.
