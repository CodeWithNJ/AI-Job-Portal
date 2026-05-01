const MetricCard = ({ label, value, note }) => {
  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        <p className="mt-2 text-sm text-slate-600">{note}</p>
      </div>
    </>
  );
};

export default MetricCard;
