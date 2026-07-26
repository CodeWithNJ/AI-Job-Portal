import { createContext } from "react";

/**
 * Cache key for the authenticated user. Exported so callers can invalidate or
 * seed the session without importing the provider (and so this stays out of
 * AuthProvider.jsx, which should only export a component for fast refresh).
 */
export const CURRENT_USER_QUERY_KEY = ["auth", "currentUser"];

export const AuthContext = createContext(null);
