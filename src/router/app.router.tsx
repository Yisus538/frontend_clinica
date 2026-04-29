import { createBrowserRouter } from "react-router";
import { LoginPage } from "../page/LoginPage";

export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
]);