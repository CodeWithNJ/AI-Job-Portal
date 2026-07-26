import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../src/auth/useAuth";
import { homePathForRole } from "../../src/auth/roles";
import FullPageLoader from "../ui/FullPageLoader";

/**
 * Gate for the public routes (landing, login, signup).
 *
 * Centralising the post-signin redirect here — rather than in the login
 * handler — means there is exactly one place that decides where an
 * authenticated user belongs, so seeding the session is enough to navigate.
 * It also covers the "already signed in, typed /login" case for free.
 */
const GuestRoute = () => {
  const { isBootstrapping, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return <FullPageLoader message="Restoring your session..." />;
  }

  if (isAuthenticated) {
    // `from` is set by ProtectedRoute when it bounces an unauthenticated user,
    // so signing in returns them to the page they originally asked for.
    const intendedPath = location.state?.from?.pathname;
    return <Navigate to={intendedPath ?? homePathForRole(user.role)} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
