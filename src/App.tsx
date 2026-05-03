import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { AppRouter } from "./router/app.router";

export const App = () => {
  return (
    <>
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: { fontFamily: 'Inter, sans-serif' }
        }}
      />
      <RouterProvider router={AppRouter} />
    </>
  );
}