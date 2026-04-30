import { createBrowserRouter } from "react-router";
import { LoginPage } from "../page/LoginPage";
import { ForgotPasswordPage } from "../page/ForgotPasswordPage";

export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
]);