# 🦷 Clínica Odontológica — Sistema de Gestión

> **Trabajo de Campo · Ingeniería de Software II · IUA · Grupo 5 — 404 Not Found**

Sistema de gestión para clínicas odontológicas desarrollado con React + TypeScript + NestJS.  
Permite administrar pacientes, citas, tratamientos, historiales clínicos y finanzas de la clínica.

---

## 👥 Equipo

| Nombre                 | Rol                        |
| ---------------------- | -------------------------- |
| Bossio, Francisco      | Referente / Líder de grupo |
| Bulatovich, Juan Cruz  | Documentador               |
| Correa, Sofía Agostina | Responsable QA (procesos)  |
| Disandro, Tomás        | Responsable QC (testing)   |
| Martinez, Jesús Manuel | Mantenedor del repositorio |

---

## 🚀 Instalación y ejecución (Frontend)

### Requisitos previos

- **Node.js** ≥ 20.x
- **npm** ≥ 10.x

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/Yisus538/frontend_clinica.git
cd frontend_clinica

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Scripts disponibles

| Comando           | Descripción                     |
| ----------------- | ------------------------------- |
| `npm run dev`     | Servidor de desarrollo con HMR  |
| `npm run build`   | Build de producción             |
| `npm run lint`    | Ejecutar ESLint                 |
| `npm run preview` | Preview del build de producción |

---

## 🛠️ Stack tecnológico

### Frontend

| Tecnología   | Versión | Uso                     |
| ------------ | ------- | ----------------------- |
| React        | 19.x    | Biblioteca UI principal |
| TypeScript   | 6.x     | Tipado estático         |
| Vite         | 8.x     | Bundler y dev server    |
| Tailwind CSS | 4.x     | Estilos utilitarios     |
| React Router | 7.x     | Enrutamiento            |
| Sonner       | 2.x     | Notificaciones toast    |

### Calidad de código

| Herramienta       | Propósito                                     |
| ----------------- | --------------------------------------------- |
| ESLint + Prettier | Linter y formatter (config Airbnb-TypeScript) |
| TypeScript strict | Verificación de tipos en compilación          |
| GitHub Actions    | CI: lint + tests en cada PR y push            |

---

## 📁 Estructura del proyecto

```
src/
├── features/              # Módulos por dominio
│   ├── agenda/            # Gestión de citas y calendario
│   ├── auth/              # Autenticación y formularios
│   ├── dashboard/         # Panel principal y métricas
│   ├── finances/          # Módulo financiero
│   ├── patients/          # Pacientes e historial clínico
│   ├── settings/          # Configuración de perfil
│   └── treatments/        # Catálogo de tratamientos
├── page/                  # Páginas de la aplicación
├── router/                # Configuración de rutas
└── shared/                # Componentes, hooks y tipos reutilizables
    ├── components/
    │   └── layout/        # Sidebar, TopBar, DashboardLayout
    ├── hooks/             # useForm, etc.
    ├── styles/            # Variables CSS / Design tokens
    └── types/             # Tipos compartidos
```

---

## ✅ Funcionalidades implementadas

- **Autenticación**: Login y recuperación de contraseña
- **Dashboard**: Métricas del día, pacientes recientes y agenda
- **Agenda**: Vista semanal/diaria/mensual con drag & drop de citas
- **Pacientes**: Directorio, perfil completo e historial clínico con odontograma
- **Tratamientos**: Catálogo de servicios con CRUD completo
- **Finanzas**: Métricas financieras e historial de transacciones
- **Configuración**: Gestión de perfil y seguridad

---

## 🔍 Convenciones de código

### Naming

| Contexto              | Convención             | Ejemplo               |
| --------------------- | ---------------------- | --------------------- |
| Variables y funciones | `camelCase`            | `handleSubmit`        |
| Clases y componentes  | `PascalCase`           | `PatientCard`         |
| Constantes de entorno | `SCREAMING_SNAKE_CASE` | `JWT_SECRET`          |
| Rutas y archivos      | `kebab-case`           | `patient-profile.tsx` |

### Commits

Formato convencional con trazabilidad a requisitos:

```
[REQ-FXX] tipo: descripción breve

Tipos: feat | fix | docs | refactor | test | style | chore
```

**Ejemplo:** `[REQ-F02] feat: agregar componente formulario de turnos`

---

## 📊 Métricas de calidad (Plan SQA)

| Métrica                      | Umbral | Herramienta                     |
| ---------------------------- | ------ | ------------------------------- |
| Complejidad ciclomática máx. | ≤ 10   | ESLint rule `complexity`        |
| Maintainability Index mín.   | ≥ 65   | Code Climate                    |
| Cobertura de tests           | ≥ 65%  | Vitest `--coverage`             |
| Errores críticos de linter   | 0      | ESLint + CI                     |
| LOC por función              | ≤ 40   | ESLint `max-lines-per-function` |

Métricas medidas y registradas en `docs/metricas.md`.

---

## 🔄 Flujo de trabajo Git

```
main ← develop ← feature/REQ-FXX-descripcion
```

- **main** está protegida: solo acepta PRs aprobados
- Cada PR requiere al menos **1 aprobación** de otro integrante
- El CI debe pasar (ESLint + tests) antes del merge

---

## 🗓️ Cronograma de hitos

| Fecha      | Hito                                      |
| ---------- | ----------------------------------------- |
| 20/05/2026 | ✅ Hito 3 — Plan SQA + métricas iniciales |
| 03/06/2026 | Hito 4 — Plan de pruebas                  |
| 10/06/2026 | Cobertura ≥ 65% en módulos críticos       |
| 16/06/2026 | Hito 5 — Entrega final                    |

---

## 📄 Documentación adicional

- [`docs/plan_sqa.md`](docs/plan_sqa.md) — Plan SQA completo v1.0
- [`docs/metricas.md`](docs/metricas.md) — Registro de métricas por hito
- [`docs/rtm.md`](docs/rtm.md) — Matriz de trazabilidad de requisitos

---

_Ingeniería de Software II · IUA · 2026_
