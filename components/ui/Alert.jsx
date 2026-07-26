const TONES = {
  error: "border-rose-200 bg-rose-50 text-rose-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  info: "border-slate-200 bg-slate-50 text-slate-600",
};

/**
 * Inline status banner. Same shape the modals use for server errors and
 * success confirmations, so feedback reads identically everywhere.
 * Errors announce themselves to assistive tech; the quieter tones don't.
 */
const Alert = ({ tone = "info", className = "", children }) => (
  <div
    role={tone === "error" ? "alert" : undefined}
    className={`rounded-2xl border px-4 py-2.5 text-sm ${TONES[tone]} ${className}`}
  >
    {children}
  </div>
);

export default Alert;
