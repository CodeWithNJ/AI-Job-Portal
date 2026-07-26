import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProfile, logoutUser } from "../api/authApi";
import { SESSION_EXPIRED_EVENT } from "../api/axiosClient";
import { AuthContext, CURRENT_USER_QUERY_KEY } from "./auth-context";

/**
 * Owns session state for the whole app.
 *
 * The tokens themselves live in HttpOnly cookies the browser manages, so there
 * is nothing to persist here — this provider only answers "who is signed in?"
 * by asking the API, and caches that answer through react-query so every
 * screen can read it without refetching.
 */
/** Routes that mean "the user is out of the app" — see the reset effect below. */
const PUBLIC_PATHS = new Set(["/", "/login", "/signup"]);

const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const location = useLocation();

  // Distinguishes "the user chose to leave" from "the session died underneath
  // them". Both end with no session, but they deserve different destinations,
  // and only the guards can act on that without racing (see signOut below).
  const [signOutRequested, setSignOutRequested] = useState(false);

  const { data: user, isPending } = useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: async () => {
      try {
        const response = await fetchProfile();
        return response?.data?.user ?? null;
      } catch {
        // A 401 here is the ordinary "not signed in yet" case, and a network
        // failure should not wedge the app on a loading screen either — both
        // resolve to "no session" and let the landing page render.
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  /** Seed the session straight from a signin response — no extra round trip. */
  const setSession = useCallback(
    (nextUser) => {
      setSignOutRequested(false);
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, nextUser ?? null);
    },
    [queryClient],
  );

  const clearSession = useCallback(() => {
    queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
    // Drop every other cached query so the next user to sign in on this
    // browser cannot see the previous user's data flash on screen.
    queryClient.removeQueries({
      predicate: (query) => query.queryKey[0] !== "auth",
    });
  }, [queryClient]);

  /**
   * Deliberate sign-out. Deliberately does NOT call navigate().
   *
   * react-query delivers cache updates on a microtask, so the session clears
   * asynchronously while navigate() applies synchronously — an imperative
   * redirect here always loses the race and the guards get the last word,
   * landing the user on /login as though the sign-out had failed. Flagging the
   * intent instead lets ProtectedRoute route them declaratively, in the same
   * commit that observes the cleared session.
   */
  const signOut = useCallback(async () => {
    setSignOutRequested(true);
    try {
      await logoutUser();
    } catch {
      // Server-side revocation may fail (offline, expired token); the local
      // session still has to end, so fall through to clearing state.
    }
    clearSession();
  }, [clearSession]);

  // Derived, not stored. The intent expires the moment the user reaches a
  // public route, and computing that during render keeps the two facts in
  // lockstep — a stored flag reset from an effect flips back while the router
  // is still mid-redirect, and ProtectedRoute, rendered once more on the old
  // path with the flag already false, sends them to /login after all.
  const isSigningOut =
    signOutRequested && !PUBLIC_PATHS.has(location.pathname);

  // The axios interceptor broadcasts this when a 401 could not be recovered by
  // refreshing. This is an *involuntary* sign-out, so it deliberately does not
  // navigate: ProtectedRoute bounces the user to /login with the current
  // location remembered, and signing back in returns them to where they were.
  useEffect(() => {
    window.addEventListener(SESSION_EXPIRED_EVENT, clearSession);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, clearSession);
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user: user ?? null,
      isAuthenticated: Boolean(user),
      isBootstrapping: isPending,
      isSigningOut,
      setSession,
      signOut,
    }),
    [user, isPending, isSigningOut, setSession, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
