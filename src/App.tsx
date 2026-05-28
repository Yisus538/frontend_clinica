import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { AppRouter } from "./router/app.router";
import { AuthProvider } from "./features/auth/context/AuthContext";

export const App = () => {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: { fontFamily: "Inter, sans-serif" },
        }}
      />
      <RouterProvider router={AppRouter} />
    </AuthProvider>
  );
};
