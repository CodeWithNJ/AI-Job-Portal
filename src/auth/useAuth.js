import { useContext } from "react";
import { AuthContext } from "./auth-context";

/**
 * Session state for the current user.
 *
 * Returns `{ user, isAuthenticated, isBootstrapping, setSession, signOut }`.
 * `isBootstrapping` is true only while the initial `GET /users/me` is in
 * flight — guard redirects on it, or a returning user gets bounced to the
 * landing page before their cookie has been checked.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }

  return context;
};
