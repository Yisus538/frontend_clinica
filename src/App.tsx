import { RouterProvider } from "react-router";
import { AppRouter } from "./router/app.router";

function App() {
  return <RouterProvider router={AppRouter} />;
}

export default App;