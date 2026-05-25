# Plan SQA — 404 Not Found

**Proyecto:** Sistema de Gestión para Clínica Odontológica  
**Versión:** 1.0  
**Fecha:** 19/05/2026  
**Hito:** 3 — Avance 1 — Ingeniería de Software II

## 1. Datos del proyecto

| Campo       | Valor                                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------------- |
| Nombre      | 404 Not Found — Sistema de Gestión para Clínica Odontológica                                                  |
| Grupo       | 5                                                                                                             |
| Integrantes | Bossio, Francisco · Bulatovich, Juan Cruz · Correa, Sofía Agostina · Disandro, Tomás · Martinez, Jesús Manuel |
| Referente   | Bossio, Francisco                                                                                             |
| Repositorio | https://github.com/Yisus538/ClinicaOdontologica.git                                                           |

## 2. Propósito

Asegurar la calidad del sistema garantizando el cumplimiento de requisitos funcionales y no funcionales. Se mitigan dos riesgos principales: errores en el manejo de datos sensibles de pacientes, y desorganización en el avance del proyecto.

## 3. Roles

| Rol                          | Responsable            |
| ---------------------------- | ---------------------- |
| Responsable de QA (procesos) | Correa, Sofía Agostina |
| Responsable de QC (testing)  | Disandro, Tomás        |
| Documentador                 | Bulatovich, Juan Cruz  |
| Referente con el docente     | Bossio, Francisco      |
| Mantenedor del repositorio   | Martinez, Jesús Manuel |

## 4. Estándares y convenciones

- **Linter/Formatter:** ESLint + Prettier (config Airbnb-TypeScript)
- **Naming:** camelCase (variables/funciones) · PascalCase (clases, componentes, DTOs) · SCREAMING_SNAKE_CASE (constantes de entorno) · kebab-case (rutas HTTP, archivos) · snake_case (columnas de BD via TypeORM)
- **Commits:** `[REQ-FXX] tipo: descripción breve` — tipos: `feat`, `fix`, `docs`, `refactor`, `test`, `style`, `chore`
- **Encoding:** UTF-8 sin BOM
- **Indentación:** 2 espacios (TypeScript, TSX, JSON, CSS, HTML)
- **JSDoc:** Cada método público de Controller/Service tiene `@param` y `@returns`. Los TODOs incluyen autor y fecha.

## 5. Estrategia de revisiones

- Code review obligatorio antes de merge a `main` — sin excepciones
- 1 aprobación de otro integrante del equipo
- **Branching:** `main` ← `develop` ← `feature/REQ-FXX-descripcion`
- `main` protegida: no se permiten pushes directos

### Checklist de revisión (PR)

- [ ] El código corre sin errores (`npm run dev`)
- [ ] ESLint + Prettier sin errores (`npm run lint`)
- [ ] Los tests pasan (`npm run test`)
- [ ] Hay al menos un test para el nuevo código
- [ ] No hay código comentado sin justificación
- [ ] No hay secretos hardcodeados — todo en `.env`
- [ ] `.env.example` actualizado si se agregaron variables
- [ ] Trazabilidad `// Trazabilidad: REQ-FXX` actualizada en JSDoc

## 6. Métricas y umbrales

| Métrica                                | Umbral | Herramienta                          |
| -------------------------------------- | ------ | ------------------------------------ |
| Complejidad ciclomática máxima/función | ≤ 10   | ESLint rule `complexity`             |
| Maintainability Index mínimo/archivo   | ≥ 65   | Code Climate                         |
| Cobertura mínima (módulos críticos)    | ≥ 65%  | Vitest `--coverage` (v8)             |
| Errores críticos del linter            | 0      | ESLint + Prettier en CI              |
| Defectos críticos abiertos al cierre   | 0      | GitHub Issues label `crítico`        |
| Líneas por función (LOC)               | ≤ 40   | ESLint rule `max-lines-per-function` |

## 7. Herramientas

| Función              | Herramienta                           |
| -------------------- | ------------------------------------- |
| Linter + Formatter   | ESLint + Prettier (Airbnb-TypeScript) |
| Tests Frontend       | Vitest + React Testing Library        |
| Cobertura            | Vitest `--coverage` (driver v8)       |
| Métricas CC/LOC      | ESLint rules + Code Climate (CI)      |
| Gestión de defectos  | GitHub Issues con labels              |
| CI/CD                | GitHub Actions                        |
| Control de versiones | Git + GitHub                          |

## 8. Frecuencia de medición

| Evento                    | Qué se verifica                                                                        |
| ------------------------- | -------------------------------------------------------------------------------------- |
| Cada commit (local)       | ESLint + Prettier via `lint-staged` — bloquea si hay errores                           |
| Cada Pull Request         | GitHub Actions: ESLint + Vitest + cobertura. El PR no se puede mergear si alguno falla |
| Reunión semanal (sábados) | Revisión manual de métricas; se carga issue si alguna está fuera de umbral             |
| Antes de cada hito        | Reporte completo en `docs/metricas.md`, actualización del RTM y del Plan SQA           |

## 9. Gestión de defectos

Cada issue en GitHub debe incluir:

- Título descriptivo
- Comportamiento esperado vs observado
- Pasos para reproducir
- Severidad (label): `crítico` / `mayor` / `menor` / `cosmético`
- Screenshot si aplica

**Criterios para cerrar un issue:**

1. El bug está reproducido y tiene un test que falla antes del fix
2. El fix pasa el test agregado
3. No hay regresiones (`npm run test`)
4. Pasó code review de otro integrante
5. El commit de cierre incluye `Closes #N`

## 10. Criterios de aceptación (Hito 5 — 16/06)

| Criterio                                              | Estado                          |
| ----------------------------------------------------- | ------------------------------- |
| Tests pasan al 100%                                   | Por verificar al cierre         |
| Cobertura ≥ 65% (Pacientes, Turnos, Historial, Pagos) | Por verificar al cierre         |
| Sin issues críticos abiertos                          | Por verificar al cierre         |
| RTM completa (REQ-F01..05 y REQ-NF01..02)             | Por completar                   |
| README con instrucciones de instalación y uso         | En progreso                     |
| Plan SQA actualizado                                  | Versión 1.0 entregada en Hito 3 |
| Plan de pruebas documentado                           | Pendiente para Hito 4 (03/06)   |
| Wireframes en alta y baja fidelidad                   | Pendiente                       |
| Reflexión final de 1 página                           | Pendiente para entrega final    |

## 11. Riesgos y mitigaciones

| Riesgo                                                 | Prob. | Impacto | Mitigación                                                                   |
| ------------------------------------------------------ | ----- | ------- | ---------------------------------------------------------------------------- |
| Falta de experiencia con NestJS/TypeORM/React avanzado | Alta  | Medio   | Sesiones grupales los sábados; pair programming en features complejas        |
| Errores en manejo de datos sensibles de pacientes      | Media | Alto    | Tests automatizados; validación con class-validator; migraciones versionadas |
| Problemas en la gestión del tiempo                     | Alta  | Alto    | Cronograma semanal; tablero Kanban en GitHub Projects; reunión semanal       |
| Conflictos de merge en archivos compartidos            | Media | Medio   | Ramas feature por REQ; PRs chicos y frecuentes                               |
| Integrante no disponible varios días                   | Media | Medio   | Cada feature con al menos dos personas que la conocen                        |
| Automatización WhatsApp fuera de alcance               | Media | Bajo    | Feature opcional; priorizar REQ-F01 a F05                                    |

## 12. Cronograma de calidad

| Fecha     | Hito interno                                      |
| --------- | ------------------------------------------------- |
| 06/05     | ESLint + Prettier configurado                     |
| 10/05     | Primeros 5 tests escritos                         |
| 12/05     | RTM v1 con REQ-F mapeados                         |
| 15/05     | Métricas iniciales en `docs/metricas.md`          |
| 17/05     | Primer PR mergeado con aprobación                 |
| **20/05** | **HITO 3 — Plan SQA + métricas iniciales**        |
| 27/05     | Plan de pruebas en borrador + casos REQ-F01 a F03 |
| **03/06** | **HITO 4 — Plan de pruebas**                      |
| 10/06     | Cobertura ≥ 65% alcanzada                         |
| 14/06     | Wireframes + reflexión final                      |
| **16/06** | **HITO 5 — Entrega final**                        |
