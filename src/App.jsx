import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { queryClient } from "./api/queryClient";
import AuthProvider from "./auth/AuthProvider";
import AppRoutes from "./routes/AppRoutes";

/**
 * Composition root. Provider order matters: AuthProvider reads the session
 * through react-query, so it must sit inside QueryClientProvider, and the
 * route guards it feeds must sit inside BrowserRouter.
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
