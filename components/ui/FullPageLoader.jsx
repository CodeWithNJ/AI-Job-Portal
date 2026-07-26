import Spinner from "./Spinner";

/**
 * Full-viewport loading state, used while the session is being restored and
 * by route guards that must not decide before they know who the user is.
 * Keeping it in one place means every "is the app ready yet?" moment looks
 * identical instead of each route inventing its own.
 */
const FullPageLoader = ({ message = "Loading..." }) => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-3 text-slate-500">
      <Spinner className="h-8 w-8 text-indigo-600" />
      <p className="text-sm">{message}</p>
    </div>
  </div>
);

export default FullPageLoader;
