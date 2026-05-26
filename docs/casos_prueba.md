# Planilla de Casos de Prueba — 404 Not Found

**Proyecto:** Sistema de Gestión para Clínica Odontológica  
**Versión:** 1.0  
**Fecha:** 26/05/2026  
**Hito:** 4 — Avance 2

---

## Módulo: Autenticación (REQ-F01)

### TC-001 — Login: campos vacíos

| Campo                  | Detalle                                                                                                    |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| **ID**                 | TC-001                                                                                                     |
| **Tipo**               | Caja negra — partición inválida                                                                            |
| **Requerimiento**      | REQ-F01                                                                                                    |
| **Precondición**       | Formulario de login vacío                                                                                  |
| **Pasos**              | 1. Invocar `validate({ email: "", password: "", rememberMe: false })`                                      |
| **Resultado esperado** | `errors.email = "El correo electrónico es requerido."` y `errors.password = "La contraseña es requerida."` |
| **Resultado real**     | ✅ Igual al esperado                                                                                       |
| **Estado**             | ✅ Pasa (`login.validation.test.ts`)                                                                       |

### TC-002 — Login: email con formato inválido

| Campo                  | Detalle                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------- |
| **ID**                 | TC-002                                                                                 |
| **Tipo**               | Caja negra — partición inválida                                                        |
| **Requerimiento**      | REQ-F01                                                                                |
| **Precondición**       | Email sin `@` ni dominio                                                               |
| **Pasos**              | 1. Invocar `validate({ email: "no-es-email", password: "123456", rememberMe: false })` |
| **Resultado esperado** | `errors.email = "Ingresá un correo electrónico válido."`, `errors.password` indefinido |
| **Resultado real**     | ✅ Igual al esperado                                                                   |
| **Estado**             | ✅ Pasa                                                                                |

### TC-003 — Login: contraseña menor a 6 caracteres (valor límite)

| Campo                  | Detalle                                                                           |
| ---------------------- | --------------------------------------------------------------------------------- |
| **ID**                 | TC-003                                                                            |
| **Tipo**               | Caja negra — valor límite inferior                                                |
| **Requerimiento**      | REQ-F01                                                                           |
| **Precondición**       | Email válido, contraseña de 5 caracteres                                          |
| **Pasos**              | 1. Invocar `validate({ email: "a@b.com", password: "12345", rememberMe: false })` |
| **Resultado esperado** | `errors.password = "Debe tener al menos 6 caracteres."`                           |
| **Resultado real**     | ✅ Igual al esperado                                                              |
| **Estado**             | ✅ Pasa                                                                           |

### TC-004 — Login: datos completamente válidos

| Campo                  | Detalle                                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------------------- |
| **ID**                 | TC-004                                                                                             |
| **Tipo**               | Caja negra — partición válida                                                                      |
| **Requerimiento**      | REQ-F01                                                                                            |
| **Precondición**       | Email válido, contraseña ≥ 6 caracteres                                                            |
| **Pasos**              | 1. Invocar `validate({ email: "usuario@clinica.com", password: "secreta123", rememberMe: false })` |
| **Resultado esperado** | `errors` es un objeto vacío (`{}`)                                                                 |
| **Resultado real**     | ✅ Igual al esperado                                                                               |
| **Estado**             | ✅ Pasa                                                                                            |

---

## Módulo: Hook useForm — REQ-F01, REQ-F02

### TC-005 — Inicialización con valores por defecto

| Campo                  | Detalle                                                              |
| ---------------------- | -------------------------------------------------------------------- |
| **ID**                 | TC-005                                                               |
| **Tipo**               | Caja blanca — cobertura de sentencias                                |
| **Requerimiento**      | REQ-F01, REQ-F02                                                     |
| **Precondición**       | Hook montado con `initialValues: { email: "" }`                      |
| **Pasos**              | 1. Montar hook con `renderHook(() => useForm(...))`                  |
| **Resultado esperado** | `formData === { email: "" }`, `errors === {}`, `isLoading === false` |
| **Resultado real**     | ✅ Igual al esperado                                                 |
| **Estado**             | ✅ Pasa (`useForm.test.tsx`)                                         |

### TC-006 — Actualización de campo de texto con `handleChange`

| Campo                  | Detalle                                                                                       |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| **ID**                 | TC-006                                                                                        |
| **Tipo**               | Caja blanca — rama: tipo texto                                                                |
| **Requerimiento**      | REQ-F01, REQ-F02                                                                              |
| **Precondición**       | Hook montado con campo `email`                                                                |
| **Pasos**              | 1. Llamar `handleChange` con evento `{ name: "email", value: "test@test.com", type: "text" }` |
| **Resultado esperado** | `formData.email === "test@test.com"`                                                          |
| **Resultado real**     | ✅ Igual al esperado                                                                          |
| **Estado**             | ✅ Pasa                                                                                       |

### TC-007 — Actualización de checkbox con `handleChange`

| Campo                  | Detalle                                                                                       |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| **ID**                 | TC-007                                                                                        |
| **Tipo**               | Caja blanca — rama: tipo checkbox                                                             |
| **Requerimiento**      | REQ-F01                                                                                       |
| **Precondición**       | Hook montado con campo `rememberMe: false`                                                    |
| **Pasos**              | 1. Llamar `handleChange` con evento `{ name: "rememberMe", type: "checkbox", checked: true }` |
| **Resultado esperado** | `formData.rememberMe === true`                                                                |
| **Resultado real**     | ✅ Igual al esperado                                                                          |
| **Estado**             | ✅ Pasa                                                                                       |

### TC-008 — Errores de validación al hacer submit con datos inválidos

| Campo                  | Detalle                                                          |
| ---------------------- | ---------------------------------------------------------------- |
| **ID**                 | TC-008                                                           |
| **Tipo**               | Caja blanca — cobertura de rama: validación falla                |
| **Requerimiento**      | REQ-F01, REQ-F02                                                 |
| **Precondición**       | Hook con función `validate` que retorna error                    |
| **Pasos**              | 1. Llamar `handleSubmit` con `email` vacío                       |
| **Resultado esperado** | `errors.email = "El correo es requerido"`, `onSubmit` no llamado |
| **Resultado real**     | ✅ Igual al esperado                                             |
| **Estado**             | ✅ Pasa                                                          |

### TC-009 — `onSubmit` llamado con datos válidos

| Campo                  | Detalle                                          |
| ---------------------- | ------------------------------------------------ |
| **ID**                 | TC-009                                           |
| **Tipo**               | Caja blanca — cobertura de rama: validación pasa |
| **Requerimiento**      | REQ-F01, REQ-F02                                 |
| **Precondición**       | Hook sin función validate (todo válido)          |
| **Pasos**              | 1. Llamar `handleSubmit`                         |
| **Resultado esperado** | `onSubmit` llamado con `{ nombre: "test" }`      |
| **Resultado real**     | ✅ Igual al esperado                             |
| **Estado**             | ✅ Pasa                                          |

### TC-010 — `resetForm` vuelve a valores iniciales

| Campo                  | Detalle                                              |
| ---------------------- | ---------------------------------------------------- |
| **ID**                 | TC-010                                               |
| **Tipo**               | Caja blanca — cobertura de función                   |
| **Requerimiento**      | REQ-F01, REQ-F02                                     |
| **Precondición**       | Campo modificado con `handleChange`                  |
| **Pasos**              | 1. Modificar campo, 2. Llamar `resetForm()`          |
| **Resultado esperado** | `formData` vuelve a `{ email: "" }`, `errors === {}` |
| **Resultado real**     | ✅ Igual al esperado                                 |
| **Estado**             | ✅ Pasa                                              |

---

## Módulo: Pacientes — REQ-F02

### TC-011 — Mock data contiene al menos un paciente

| Campo                  | Detalle                               |
| ---------------------- | ------------------------------------- |
| **ID**                 | TC-011                                |
| **Tipo**               | Caja negra — contrato de datos        |
| **Requerimiento**      | REQ-F02                               |
| **Precondición**       | Módulo `patients.mock.ts` importado   |
| **Pasos**              | 1. Acceder a `PATIENT_RECORDS.length` |
| **Resultado esperado** | `length > 0`                          |
| **Resultado real**     | ✅ Igual al esperado                  |
| **Estado**             | ✅ Pasa (`patients.mock.test.ts`)     |

### TC-012 — Cada registro de paciente tiene campos obligatorios

| Campo                  | Detalle                                                  |
| ---------------------- | -------------------------------------------------------- |
| **ID**                 | TC-012                                                   |
| **Tipo**               | Caja negra — contrato de datos                           |
| **Requerimiento**      | REQ-F02                                                  |
| **Precondición**       | Módulo importado                                         |
| **Pasos**              | 1. Iterar `PATIENT_RECORDS` y verificar campos           |
| **Resultado esperado** | `id`, `name`, `dni`, `status` definidos en cada registro |
| **Resultado real**     | ✅ Igual al esperado                                     |
| **Estado**             | ✅ Pasa                                                  |

### TC-013 — IDs de pacientes son únicos

| Campo                  | Detalle                                              |
| ---------------------- | ---------------------------------------------------- |
| **ID**                 | TC-013                                               |
| **Tipo**               | Caja negra — valor límite / integridad               |
| **Requerimiento**      | REQ-F02                                              |
| **Precondición**       | Módulo importado                                     |
| **Pasos**              | 1. Crear `Set` de IDs y comparar tamaño con el array |
| **Resultado esperado** | `new Set(ids).size === ids.length`                   |
| **Resultado real**     | ✅ Igual al esperado                                 |
| **Estado**             | ✅ Pasa                                              |

---

## Módulo: Finanzas — REQ-F05

### TC-014 — Mock data contiene transacciones

| Campo                  | Detalle                                |
| ---------------------- | -------------------------------------- |
| **ID**                 | TC-014                                 |
| **Tipo**               | Caja negra — contrato de datos         |
| **Requerimiento**      | REQ-F05                                |
| **Precondición**       | Módulo `finances.mock.ts` importado    |
| **Pasos**              | 1. Verificar `TRANSACTIONS.length > 0` |
| **Resultado esperado** | Array no vacío                         |
| **Resultado real**     | ✅ Igual al esperado                   |
| **Estado**             | ✅ Pasa (`finances.mock.test.ts`)      |

### TC-015 — Cada transacción tiene campos obligatorios

| Campo                  | Detalle                                                     |
| ---------------------- | ----------------------------------------------------------- |
| **ID**                 | TC-015                                                      |
| **Tipo**               | Caja negra — contrato de datos                              |
| **Requerimiento**      | REQ-F05                                                     |
| **Precondición**       | Módulo importado                                            |
| **Pasos**              | 1. Verificar `id`, `amount`, `type`, `date` por transacción |
| **Resultado esperado** | Todos definidos                                             |
| **Resultado real**     | ✅ Igual al esperado                                        |
| **Estado**             | ✅ Pasa                                                     |

### TC-016 — IDs de transacciones son únicos

| Campo                  | Detalle                                      |
| ---------------------- | -------------------------------------------- |
| **ID**                 | TC-016                                       |
| **Tipo**               | Caja negra — integridad                      |
| **Requerimiento**      | REQ-F05                                      |
| **Precondición**       | Módulo importado                             |
| **Pasos**              | 1. Comparar `Set(ids).size` con `ids.length` |
| **Resultado esperado** | Sin duplicados                               |
| **Resultado real**     | ✅ Igual al esperado                         |
| **Estado**             | ✅ Pasa                                      |

### TC-017 — `FINANCE_METRICS` contiene exactamente 4 métricas

| Campo                  | Detalle                                     |
| ---------------------- | ------------------------------------------- |
| **ID**                 | TC-017                                      |
| **Tipo**               | Caja negra — valor exacto                   |
| **Requerimiento**      | REQ-F05                                     |
| **Precondición**       | Módulo importado                            |
| **Pasos**              | 1. Verificar `FINANCE_METRICS.length === 4` |
| **Resultado esperado** | 4 elementos                                 |
| **Resultado real**     | ✅ Igual al esperado                        |
| **Estado**             | ✅ Pasa                                     |

### TC-018 — Cada métrica financiera tiene label y value

| Campo                  | Detalle                                    |
| ---------------------- | ------------------------------------------ |
| **ID**                 | TC-018                                     |
| **Tipo**               | Caja negra — contrato de datos             |
| **Requerimiento**      | REQ-F05                                    |
| **Precondición**       | Módulo importado                           |
| **Pasos**              | 1. Verificar `label` y `value` por métrica |
| **Resultado esperado** | Ambos definidos                            |
| **Resultado real**     | ✅ Igual al esperado                       |
| **Estado**             | ✅ Pasa                                    |

---

## Módulo: Agenda — REQ-F03

### TC-019 — Mock data contiene turnos

| Campo                  | Detalle                                |
| ---------------------- | -------------------------------------- |
| **ID**                 | TC-019                                 |
| **Tipo**               | Caja negra — contrato de datos         |
| **Requerimiento**      | REQ-F03                                |
| **Precondición**       | Módulo `agenda.mock.ts` importado      |
| **Pasos**              | 1. Verificar `APPOINTMENTS.length > 0` |
| **Resultado esperado** | Array no vacío                         |
| **Resultado real**     | ✅ Igual al esperado                   |
| **Estado**             | ✅ Pasa (`agenda.mock.test.ts`)        |

### TC-020 — Cada turno tiene campos obligatorios

| Campo                  | Detalle                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| **ID**                 | TC-020                                                                                   |
| **Tipo**               | Caja negra — contrato de datos                                                           |
| **Requerimiento**      | REQ-F03                                                                                  |
| **Precondición**       | Módulo importado                                                                         |
| **Pasos**              | 1. Verificar `id`, `patient`, `treatment`, `durationMinutes`, `startHour`, `startMinute` |
| **Resultado esperado** | Todos definidos y con valores coherentes                                                 |
| **Resultado real**     | ✅ Igual al esperado                                                                     |
| **Estado**             | ✅ Pasa                                                                                  |

### TC-021 — `startHour` está en rango válido (0–23)

| Campo                  | Detalle                                           |
| ---------------------- | ------------------------------------------------- |
| **ID**                 | TC-021                                            |
| **Tipo**               | Caja negra — valor límite                         |
| **Requerimiento**      | REQ-F03                                           |
| **Precondición**       | Módulo importado                                  |
| **Pasos**              | 1. Verificar `0 ≤ startHour < 24` para cada turno |
| **Resultado esperado** | Todos en rango                                    |
| **Resultado real**     | ✅ Igual al esperado                              |
| **Estado**             | ✅ Pasa                                           |

### TC-022 — `startMinute` está en rango válido (0–59)

| Campo                  | Detalle                                             |
| ---------------------- | --------------------------------------------------- |
| **ID**                 | TC-022                                              |
| **Tipo**               | Caja negra — valor límite                           |
| **Requerimiento**      | REQ-F03                                             |
| **Precondición**       | Módulo importado                                    |
| **Pasos**              | 1. Verificar `0 ≤ startMinute < 60` para cada turno |
| **Resultado esperado** | Todos en rango                                      |
| **Resultado real**     | ✅ Igual al esperado                                |
| **Estado**             | ✅ Pasa                                             |

### TC-023 — Turnos urgentes tienen `isUrgent === true`

| Campo                  | Detalle                                                   |
| ---------------------- | --------------------------------------------------------- |
| **ID**                 | TC-023                                                    |
| **Tipo**               | Caja negra — partición válida                             |
| **Requerimiento**      | REQ-F03                                                   |
| **Precondición**       | Módulo importado                                          |
| **Pasos**              | 1. Filtrar `APPOINTMENTS` por `isUrgent`, verificar campo |
| **Resultado esperado** | Todos los filtrados tienen `isUrgent === true`            |
| **Resultado real**     | ✅ Igual al esperado                                      |
| **Estado**             | ✅ Pasa                                                   |

---

## Módulo: Backend AuthService — REQ-F01

### TC-024 — Login exitoso con credenciales válidas

| Campo                  | Detalle                                                                    |
| ---------------------- | -------------------------------------------------------------------------- |
| **ID**                 | TC-024                                                                     |
| **Tipo**               | Integración con mocks (caja negra)                                         |
| **Requerimiento**      | REQ-F01                                                                    |
| **Precondición**       | `userRepo.findOne` retorna usuario activo, `bcrypt.compare` retorna `true` |
| **Pasos**              | 1. Llamar `service.login({ email, password })`                             |
| **Resultado esperado** | Retorna `{ accessToken, user: { email, role, permissions } }`              |
| **Resultado real**     | ✅ Igual al esperado                                                       |
| **Estado**             | ✅ Pasa (`auth.service.spec.ts`)                                           |

### TC-025 — Login con usuario inexistente lanza UnauthorizedException

| Campo                  | Detalle                                                               |
| ---------------------- | --------------------------------------------------------------------- |
| **ID**                 | TC-025                                                                |
| **Tipo**               | Integración (caja negra — partición inválida)                         |
| **Requerimiento**      | REQ-F01                                                               |
| **Precondición**       | `userRepo.findOne` retorna `null`                                     |
| **Pasos**              | 1. Llamar `service.login({ email: "noexiste@...", password: "..." })` |
| **Resultado esperado** | Lanza `UnauthorizedException`                                         |
| **Resultado real**     | ✅ Igual al esperado                                                  |
| **Estado**             | ✅ Pasa                                                               |

### TC-026 — Login con usuario inactivo lanza UnauthorizedException

| Campo                  | Detalle                                                   |
| ---------------------- | --------------------------------------------------------- |
| **ID**                 | TC-026                                                    |
| **Tipo**               | Integración (caja negra — partición inválida)             |
| **Requerimiento**      | REQ-F01                                                   |
| **Precondición**       | `userRepo.findOne` retorna usuario con `status: INACTIVE` |
| **Pasos**              | 1. Llamar `service.login(...)`                            |
| **Resultado esperado** | Lanza `UnauthorizedException`                             |
| **Resultado real**     | ✅ Igual al esperado                                      |
| **Estado**             | ✅ Pasa                                                   |

### TC-027 — Login con contraseña incorrecta lanza UnauthorizedException

| Campo                  | Detalle                                                                     |
| ---------------------- | --------------------------------------------------------------------------- |
| **ID**                 | TC-027                                                                      |
| **Tipo**               | Integración (caja negra — partición inválida)                               |
| **Requerimiento**      | REQ-F01                                                                     |
| **Precondición**       | `userRepo.findOne` retorna usuario activo, `bcrypt.compare` retorna `false` |
| **Pasos**              | 1. Llamar `service.login({ email, password: "wrong" })`                     |
| **Resultado esperado** | Lanza `UnauthorizedException`                                               |
| **Resultado real**     | ✅ Igual al esperado                                                        |
| **Estado**             | ✅ Pasa                                                                     |

---

## Módulo: Backend PatientsService — REQ-F02

### TC-028 — `findAll` retorna todos los pacientes

| Campo                  | Detalle                              |
| ---------------------- | ------------------------------------ |
| **ID**                 | TC-028                               |
| **Tipo**               | Integración                          |
| **Requerimiento**      | REQ-F02                              |
| **Precondición**       | `repo.find` mockeado con 2 pacientes |
| **Pasos**              | 1. Llamar `service.findAll()`        |
| **Resultado esperado** | Array de 2 elementos                 |
| **Resultado real**     | ✅ Igual al esperado                 |
| **Estado**             | ✅ Pasa (`patients.service.spec.ts`) |

### TC-029 — `findOne` lanza NotFoundException si id no existe

| Campo                  | Detalle                                       |
| ---------------------- | --------------------------------------------- |
| **ID**                 | TC-029                                        |
| **Tipo**               | Integración (partición inválida)              |
| **Requerimiento**      | REQ-F02                                       |
| **Precondición**       | `repo.findOne` retorna `null`                 |
| **Pasos**              | 1. Llamar `service.findOne("id-inexistente")` |
| **Resultado esperado** | Lanza `NotFoundException`                     |
| **Resultado real**     | ✅ Igual al esperado                          |
| **Estado**             | ✅ Pasa                                       |

### TC-030 — `create` persiste un nuevo paciente

| Campo                  | Detalle                                      |
| ---------------------- | -------------------------------------------- |
| **ID**                 | TC-030                                       |
| **Tipo**               | Integración                                  |
| **Requerimiento**      | REQ-F02                                      |
| **Precondición**       | `repo.create` y `repo.save` mockeados        |
| **Pasos**              | 1. Llamar `service.create(dto)`              |
| **Resultado esperado** | Retorna paciente creado; `repo.save` llamado |
| **Resultado real**     | ✅ Igual al esperado                         |
| **Estado**             | ✅ Pasa                                      |

---

## Módulo: Backend AppointmentsService — REQ-F03

### TC-031 — `create` persiste un nuevo turno

| Campo                  | Detalle                                   |
| ---------------------- | ----------------------------------------- |
| **ID**                 | TC-031                                    |
| **Tipo**               | Integración                               |
| **Requerimiento**      | REQ-F03                                   |
| **Precondición**       | `repo.create` y `repo.save` mockeados     |
| **Pasos**              | 1. Llamar `service.create(dto)`           |
| **Resultado esperado** | Retorna turno creado; `repo.save` llamado |
| **Resultado real**     | ✅ Igual al esperado                      |
| **Estado**             | ✅ Pasa (`appointments.service.spec.ts`)  |

### TC-032 — `remove` aplica soft delete

| Campo                  | Detalle                                  |
| ---------------------- | ---------------------------------------- |
| **ID**                 | TC-032                                   |
| **Tipo**               | Integración                              |
| **Requerimiento**      | REQ-F03                                  |
| **Precondición**       | Turno existente en repo mockeado         |
| **Pasos**              | 1. Llamar `service.remove("apt-uuid-1")` |
| **Resultado esperado** | `repo.softRemove` llamado con el turno   |
| **Resultado real**     | ✅ Igual al esperado                     |
| **Estado**             | ✅ Pasa                                  |

---

## Módulo: Hook `useForgotPasswordForm` (REQ-F01)

### TC-033 — Inicialización con email vacío

| Campo                  | Detalle                                                         |
| ---------------------- | --------------------------------------------------------------- |
| **ID**                 | TC-033                                                          |
| **Tipo**               | Caja blanca — sentencias                                        |
| **Requerimiento**      | REQ-F01                                                         |
| **Precondición**       | Hook montado sin datos previos                                  |
| **Pasos**              | 1. `renderHook(() => useForgotPasswordForm())`                  |
| **Resultado esperado** | `formData.email === ""`, `errors === {}`, `isLoading === false` |
| **Resultado real**     | ✅ Igual al esperado                                            |
| **Estado**             | ✅ Pasa (`useForgotPasswordForm.test.ts`)                       |

### TC-034 — Error al enviar email vacío

| Campo                  | Detalle                                                |
| ---------------------- | ------------------------------------------------------ |
| **ID**                 | TC-034                                                 |
| **Tipo**               | Caja negra — partición inválida                        |
| **Requerimiento**      | REQ-F01                                                |
| **Precondición**       | Email vacío                                            |
| **Pasos**              | 1. Llamar `handleSubmit` con `preventDefault` mockeado |
| **Resultado esperado** | `errors.email = "El correo electrónico es requerido."` |
| **Resultado real**     | ✅ Igual al esperado                                   |
| **Estado**             | ✅ Pasa                                                |

### TC-035 — Error con email de formato inválido

| Campo                  | Detalle                                                  |
| ---------------------- | -------------------------------------------------------- |
| **ID**                 | TC-035                                                   |
| **Tipo**               | Caja negra — partición inválida                          |
| **Requerimiento**      | REQ-F01                                                  |
| **Precondición**       | Email sin `@` ni dominio                                 |
| **Pasos**              | 1. `handleChange` con `"no-es-email"`, 2. `handleSubmit` |
| **Resultado esperado** | `errors.email = "Ingresá un correo electrónico válido."` |
| **Resultado real**     | ✅ Igual al esperado                                     |
| **Estado**             | ✅ Pasa                                                  |

### TC-036 — Sin errores con email válido (con timers falsos)

| Campo                  | Detalle                                                                   |
| ---------------------- | ------------------------------------------------------------------------- |
| **ID**                 | TC-036                                                                    |
| **Tipo**               | Caja negra — partición válida                                             |
| **Requerimiento**      | REQ-F01                                                                   |
| **Precondición**       | Email con formato correcto, `vi.useFakeTimers()` activo                   |
| **Pasos**              | 1. Ingresar `"usuario@clinica.com"`, 2. `handleSubmit`, 3. Avanzar 1500ms |
| **Resultado esperado** | `errors.email` indefinido                                                 |
| **Resultado real**     | ✅ Igual al esperado                                                      |
| **Estado**             | ✅ Pasa                                                                   |

### TC-037 — Limpieza del error al modificar el campo

| Campo                  | Detalle                                                                |
| ---------------------- | ---------------------------------------------------------------------- |
| **ID**                 | TC-037                                                                 |
| **Tipo**               | Caja blanca — ramas                                                    |
| **Requerimiento**      | REQ-F01                                                                |
| **Precondición**       | Error de validación activo                                             |
| **Pasos**              | 1. Enviar con email vacío, 2. Ingresar email válido vía `handleChange` |
| **Resultado esperado** | `errors.email` pasa a `undefined`                                      |
| **Resultado real**     | ✅ Igual al esperado                                                   |
| **Estado**             | ✅ Pasa                                                                |

### TC-038 — `isLoading` durante el envío

| Campo                  | Detalle                                                                         |
| ---------------------- | ------------------------------------------------------------------------------- |
| **ID**                 | TC-038                                                                          |
| **Tipo**               | Caja blanca — sentencias                                                        |
| **Requerimiento**      | REQ-F01                                                                         |
| **Precondición**       | Email válido, `vi.useFakeTimers()` activo                                       |
| **Pasos**              | 1. Iniciar `handleSubmit`, 2. Verificar `isLoading === true`, 3. Avanzar 1500ms |
| **Resultado esperado** | `isLoading` es `true` durante la espera y `false` al terminar                   |
| **Resultado real**     | ✅ Igual al esperado                                                            |
| **Estado**             | ✅ Pasa                                                                         |

### TC-039 — `resetForm` vuelve al estado inicial

| Campo                  | Detalle                                       |
| ---------------------- | --------------------------------------------- |
| **ID**                 | TC-039                                        |
| **Tipo**               | Caja blanca — sentencias                      |
| **Requerimiento**      | REQ-F01                                       |
| **Precondición**       | Email modificado                              |
| **Pasos**              | 1. `handleChange` con email, 2. `resetForm()` |
| **Resultado esperado** | `formData.email === ""`, `errors === {}`      |
| **Resultado real**     | ✅ Igual al esperado                          |
| **Estado**             | ✅ Pasa                                       |

---

## Módulo: Hook `useLoginForm` (REQ-F01)

### TC-040 — Inicialización con valores por defecto

| Campo                  | Detalle                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------- |
| **ID**                 | TC-040                                                                                 |
| **Tipo**               | Caja blanca — sentencias                                                               |
| **Requerimiento**      | REQ-F01                                                                                |
| **Precondición**       | Hook montado con `useNavigate` y `toast` mockeados                                     |
| **Pasos**              | 1. `renderHook(() => useLoginForm())`                                                  |
| **Resultado esperado** | `email=""`, `password=""`, `rememberMe=false`, `showPassword=false`, `isLoading=false` |
| **Resultado real**     | ✅ Igual al esperado                                                                   |
| **Estado**             | ✅ Pasa (`useLoginForm.test.ts`)                                                       |

### TC-041 — `toggleShowPassword` alterna la visibilidad

| Campo                  | Detalle                                              |
| ---------------------- | ---------------------------------------------------- |
| **ID**                 | TC-041                                               |
| **Tipo**               | Caja blanca — ramas                                  |
| **Requerimiento**      | REQ-F01                                              |
| **Precondición**       | `showPassword === false`                             |
| **Pasos**              | 1. `toggleShowPassword()`, 2. `toggleShowPassword()` |
| **Resultado esperado** | Primer toggle → `true`, segundo toggle → `false`     |
| **Resultado real**     | ✅ Igual al esperado                                 |
| **Estado**             | ✅ Pasa                                              |

### TC-042 — Errores de validación con campos vacíos

| Campo                  | Detalle                                                  |
| ---------------------- | -------------------------------------------------------- |
| **ID**                 | TC-042                                                   |
| **Tipo**               | Caja negra — partición inválida                          |
| **Requerimiento**      | REQ-F01                                                  |
| **Precondición**       | Email y password vacíos                                  |
| **Pasos**              | 1. `handleSubmit` sin completar campos                   |
| **Resultado esperado** | `errors.email` y `errors.password` con mensajes de error |
| **Resultado real**     | ✅ Igual al esperado                                     |
| **Estado**             | ✅ Pasa                                                  |

### TC-043 — Error con contraseña menor a 6 caracteres (valor límite)

| Campo                  | Detalle                                                 |
| ---------------------- | ------------------------------------------------------- |
| **ID**                 | TC-043                                                  |
| **Tipo**               | Caja negra — valor límite inferior                      |
| **Requerimiento**      | REQ-F01                                                 |
| **Precondición**       | Email válido, contraseña de 5 caracteres                |
| **Pasos**              | 1. Ingresar `"a@b.com"` y `"12345"`, 2. `handleSubmit`  |
| **Resultado esperado** | `errors.password = "Debe tener al menos 6 caracteres."` |
| **Resultado real**     | ✅ Igual al esperado                                    |
| **Estado**             | ✅ Pasa                                                 |

### TC-044 — Navegación a dashboard con credenciales válidas

| Campo                  | Detalle                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------- |
| **ID**                 | TC-044                                                                                 |
| **Tipo**               | Caja negra — partición válida                                                          |
| **Requerimiento**      | REQ-F01                                                                                |
| **Precondición**       | Email y password válidos, `vi.useFakeTimers()` activo                                  |
| **Pasos**              | 1. Ingresar `"admin@clinica.com"` y `"admin123"`, 2. `handleSubmit`, 3. Avanzar 1500ms |
| **Resultado esperado** | `mockNavigate` llamado con `"/dashboard"`                                              |
| **Resultado real**     | ✅ Igual al esperado                                                                   |
| **Estado**             | ✅ Pasa                                                                                |

---

## Resumen de cobertura de casos

| Módulo                      | Casos           | Pasan  | Fallan |
| --------------------------- | --------------- | ------ | ------ |
| Validación login (frontend) | TC-001 a TC-004 | 4      | 0      |
| useForm hook (frontend)     | TC-005 a TC-010 | 6      | 0      |
| Mock data pacientes         | TC-011 a TC-013 | 3      | 0      |
| Mock data finanzas          | TC-014 a TC-018 | 5      | 0      |
| Mock data agenda            | TC-019 a TC-023 | 5      | 0      |
| Backend AuthService         | TC-024 a TC-027 | 4      | 0      |
| Backend PatientsService     | TC-028 a TC-030 | 3      | 0      |
| Backend AppointmentsService | TC-031 a TC-032 | 2      | 0      |
| Hook useForgotPasswordForm  | TC-033 a TC-039 | 7      | 0      |
| Hook useLoginForm           | TC-040 a TC-044 | 5      | 0      |
| **Total**                   | **44**          | **44** | **0**  |
