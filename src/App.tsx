import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { AppRouter } from "./router/app.router";
import { AuthProvider } from "./features/auth/context/AuthContext";
import { ThemeProvider, useTheme } from "./features/theme/context/ThemeContext";

function ThemedToaster() {
  const { isDark } = useTheme();
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      theme={isDark ? "dark" : "light"}
      toastOptions={{ style: { fontFamily: "Inter, sans-serif" } }}
    />
  );
}

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemedToaster />
        <RouterProvider router={AppRouter} />
      </AuthProvider>
    </ThemeProvider>
  );
};
