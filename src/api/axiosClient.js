import axios from "axios";

// The backend issues HttpOnly auth cookies on /users/login. We must send
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
