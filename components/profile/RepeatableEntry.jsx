import Button from "../ui/Button";

/**
 * One card inside a repeatable list (a job, a degree). Shared by the experience
 * and education sections so both read the same way: a numbered heading, a
 * remove action, and the fields underneath.
 */
export const EntryCard = ({ index, label, onRemove, children }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
    <div className="mb-4 flex items-center justify-between">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label} {index + 1}
      </p>
      <button
        type="button"
        onClick={onRemove}
        className="text-xs font-medium text-slate-500 transition hover:text-rose-600 hover:cursor-pointer"
      >
        Remove
      </button>
    </div>
    {children}
  </div>
);

/** Empty state plus the add button, so both lists behave identically. */
export const EntryList = ({
  items,
  emptyMessage,
  addLabel,
  onAdd,
  canAdd,
  limitMessage,
  children,
}) => (
  <div className="space-y-4">
    {items.length === 0 ? (
      <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-6 text-center text-sm text-slate-500">
        {emptyMessage}
      </p>
    ) : (
      children
    )}

    <div className="flex items-center gap-3">
      <Button variant="secondary" onClick={onAdd} disabled={!canAdd}>
        {addLabel}
      </Button>
      {!canAdd && <p className="text-xs text-slate-500">{limitMessage}</p>}
    </div>
  </div>
);
