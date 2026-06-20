import axios from "axios";

// The backend issues HttpOnly auth cookies on /users/signin. We must send
// credentials with every request so the browser includes those cookies on
// subsequent calls. The Vite dev server reads VITE_API_URL from .env;
// the fallback matches PORT in ai-job-portal-backend/.env (7500).
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:7500";

const axiosClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Custom event broadcast by the response interceptor when a 401 cannot be
// recovered via /users/refresh. The App component listens for this so it can
// drop the local auth state and route the user back to the landing page.
export const SESSION_EXPIRED_EVENT = "auth:session-expired";

// Endpoints we never want the silent-refresh interceptor to touch — a 401
// from these isn't a "session expired" signal (signin = bad creds; refresh =
// already in the refresh flow; logout = already ending the session).
const AUTH_ENDPOINTS = [
  "/users/signin",
  "/users/signup",
  "/users/refresh",
  "/users/logout",
];

const isAuthEndpoint = (url = "") =>
  AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));

// Single in-flight refresh promise so a burst of concurrent 401s collapses
// into one network call. Without this, N parallel requests with an expired
// access cookie would each trigger their own refresh, and all but the first
// would race against an already-rotated refresh token.
let refreshPromise = null;

const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = axiosClient
      .post("/users/refresh")
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const url = original?.url ?? "";

    // Only attempt silent recovery for 401s on protected endpoints, and only
    // once per original request (the `_retried` flag prevents infinite loops
    // if the replay itself returns another 401).
    if (
      status !== 401 ||
      !original ||
      original._retried ||
      isAuthEndpoint(url)
    ) {
      return Promise.reject(error);
    }

    original._retried = true;

    try {
      await refreshAccessToken();
      return axiosClient(original);
    } catch {
      // Refresh failed — the session is genuinely dead. Tell the app so it
      // can clear UI state, and surface the original 401 to the caller.
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
      }
      return Promise.reject(error);
    }
  },
);

export const extractApiErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  if (!error) return fallback;

  // The Nest exception filter shapes errors as
  // { success: false, message, error: { code, details } }.
  const apiBody = error.response?.data;
  if (apiBody) {
    if (Array.isArray(apiBody.error?.details) && apiBody.error.details.length > 0) {
      return apiBody.error.details[0];
    }
    if (typeof apiBody.message === "string" && apiBody.message.trim().length > 0) {
      return apiBody.message;
    }
  }

  if (error.message === "Network Error") {
    return "Unable to reach the server. Please check your connection and try again.";
  }

  return error.message || fallback;
};

export default axiosClient;
