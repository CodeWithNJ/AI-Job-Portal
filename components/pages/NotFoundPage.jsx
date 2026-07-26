import { Link } from "react-router";
import { useAuth } from "../../src/auth/useAuth";
import { homePathForRole } from "../../src/auth/roles";
import Button from "../ui/Button";

/** Sends people back to wherever "home" means for them, signed in or not. */
const NotFoundPage = () => {
  const { isAuthenticated, user } = useAuth();
  const homePath = isAuthenticated ? homePathForRole(user.role) : "/";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
          404
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
          Page not found
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          That link doesn&apos;t point anywhere in the portal. It may have moved
          or never existed.
        </p>
        <Link to={homePath} className="mt-6 inline-block">
          <Button>{isAuthenticated ? "Back to dashboard" : "Back to home"}</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
