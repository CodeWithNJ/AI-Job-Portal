const StatusStep = ({ label, active = false }) => {
  return (
    <>
      <div className="flex items-center gap-3">
        <div
          className={`h-3 w-3 rounded-full ${
            active ? "bg-emerald-500" : "bg-slate-300"
          }`}
        />
        <span
          className={active ? "font-medium text-slate-900" : "text-slate-500"}
        >
          {label}
        </span>
      </div>
    </>
  );
};

export default StatusStep;
