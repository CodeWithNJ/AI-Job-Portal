import { useEffect, useState } from "react";
import JobSeekerHomePage from "../components/JobSeekerHomePage";
import LandingPage from "../components/LandingPage";
import { fetchProfile, logoutUser } from "./api/authApi";
import { SESSION_EXPIRED_EVENT } from "./api/axiosClient";

function App() {
  // Simple in-memory auth state. The real auth lives in HttpOnly cookies on
  // the backend; this state just controls which view the SPA renders.
  const [authedUser, setAuthedUser] = useState(null);

  // True while we're checking whether a previously-issued cookie can still
  // hydrate a session. Keeping this separate from `authedUser` prevents a
  // flicker where the landing page renders momentarily before the home page
  // takes over for a "Keep me signed in" user.
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // On mount, ask the backend who we are. If the access cookie is valid
    // this resolves immediately; if only the refresh cookie is valid, the
    // axios interceptor silently rotates tokens and replays this call; if
    // neither cookie is valid, we land on the public landing page.
    (async () => {
      try {
        const response = await fetchProfile();
        const user = response?.data?.user ?? null;
        if (!cancelled && user) {
          setAuthedUser(user);
        }
      } catch {
        // 401 or network error → stay unauthenticated and let the user log in.
      } finally {
        if (!cancelled) {
          setBootstrapping(false);
        }
      }
    })();

    const handleSessionExpired = () => {
      setAuthedUser(null);
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);

    return () => {
      cancelled = true;
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, []);

  const handleLoginSuccess = (user) => {
    setAuthedUser(user);
  };

  const handleSignOut = async () => {
    try {
      await logoutUser();
    } catch {
      // Even if server-side revocation fails (e.g. transient network), we
      // still drop local state so the UI returns to an unauthenticated view.
    }
    setAuthedUser(null);
  };

  if (bootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <svg
            className="h-8 w-8 animate-spin text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
            />
          </svg>
          <p className="text-sm">Restoring your session...</p>
        </div>
      </div>
    );
  }

  if (authedUser) {
    return <JobSeekerHomePage user={authedUser} onSignOut={handleSignOut} />;
  }

  return <LandingPage onLoginSuccess={handleLoginSuccess} />;
}

export default App;
