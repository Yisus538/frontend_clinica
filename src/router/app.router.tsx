import { createBrowserRouter, Navigate } from "react-router";
import { LoginPage } from "../page/LoginPage";
import { ForgotPasswordPage } from "../page/ForgotPasswordPage";
import { DashboardPage } from "../page/DashboardPage";
import { AgendaPage } from "../page/AgendaPage";
import { NewAppointmentPage } from "../page/NewAppointmentPage";
import { PatientsPage } from "../page/PatientsPage";
import { NewPatientPage } from "../page/NewPatientPage";
import { PatientProfilePage } from "../page/PatientProfilePage";
import { TreatmentsPage } from "../page/TreatmentsPage";
import { NewTreatmentPage } from "../page/NewTreatmentPage";
import { EditTreatmentPage } from "../page/EditTreatmentPage";
import { FinancesPage } from "../page/FinancesPage";
import { SettingsPage } from "../page/SettingsPage";
import { DashboardLayout } from "../shared/components/layout/DashboardLayout";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";

export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    // Todas las rutas /dashboard/* requieren sesión activa
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "agenda", element: <AgendaPage /> },
          { path: "agenda/nueva-cita", element: <NewAppointmentPage /> },
          { path: "pacientes", element: <PatientsPage /> },
          { path: "pacientes/nuevo", element: <NewPatientPage /> },
          { path: "pacientes/:id", element: <PatientProfilePage /> },
          { path: "tratamientos", element: <TreatmentsPage /> },
          { path: "tratamientos/nuevo", element: <NewTreatmentPage /> },
          { path: "tratamientos/:id/editar", element: <EditTreatmentPage /> },
          { path: "finanzas", element: <FinancesPage /> },
          { path: "configuracion", element: <SettingsPage /> },
        ],
      },
    ],
  },
  // Fallback
  { path: "*", element: <Navigate to="/" replace /> },
]);
