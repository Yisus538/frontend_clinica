import { RouterProvider } from "react-router";
import { AppRouter } from "./router/app.router";

export const App = () => {
  return <RouterProvider router={AppRouter} />;
}