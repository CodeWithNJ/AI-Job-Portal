/**
 * The standard white card used across authenticated screens — same surface as
 * the dashboard cards (`rounded-3xl`, slate hairline, soft shadow) with a
 * title/description header and an optional action slot on the right.
 */
const SectionCard = ({ title, description, actions, className = "", children }) => (
  <section
    className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}
  >
    {(title || actions) && (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {title && (
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          )}
          {description && (
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    )}
    <div className={title || actions ? "mt-5" : ""}>{children}</div>
  </section>
);

export default SectionCard;
