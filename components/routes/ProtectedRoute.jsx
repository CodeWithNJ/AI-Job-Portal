import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../src/auth/useAuth";
import { homePathForRole } from "../../src/auth/roles";
import FullPageLoader from "../ui/FullPageLoader";

/**
 * Gate for authenticated routes.
 *
 * Note this is a UX guard, not a security boundary — every protected route is
 * enforced server-side by AccessTokenGuard/RolesGuard. Its job is to send
 * people somewhere sensible instead of rendering a screen that will 401.
 *
 * A signed-in user who lands on a route for a different role is redirected to
 * their own home rather than shown an error: with three roles and one shared
 * header, a wrong-role URL is far more often a stale link than an attempt to
 * reach something forbidden.
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { isBootstrapping, isAuthenticated, isSigningOut, user } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return <FullPageLoader message="Restoring your session..." />;
  }

  if (!isAuthenticated) {
    // Someone who just signed out asked to leave — send them to the public
    // landing page. Prompting them to sign back in would read as a failure.
    if (isSigningOut) {
      return <Navigate to="/" replace />;
    }

    // Otherwise the session ended without their say-so (expiry, revocation).
    // Remember where they were so signing in completes the journey.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    return <Navigate to={homePathForRole(user.role)} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
