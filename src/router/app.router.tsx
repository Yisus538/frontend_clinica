import { createBrowserRouter } from "react-router";
import { LoginPage } from "../page/LoginPage";
import { ForgotPasswordPage } from "../page/ForgotPasswordPage";
import { DashboardPage } from "../page/DashboardPage";
import { AgendaPage } from "../page/AgendaPage";
import { NewAppointmentPage } from "../page/NewAppointmentPage";
import { PatientsPage } from "../page/PatientsPage";
import { DashboardLayout } from "../shared/components/layout/DashboardLayout";

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
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "agenda",
        element: <AgendaPage />,
      },
      {
        path: "agenda/nueva-cita",
        element: <NewAppointmentPage />,
      },
      {
        path: "pacientes",
        element: <PatientsPage />,
      },
    ],
  },
]);