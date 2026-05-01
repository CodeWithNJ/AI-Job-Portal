const JobCard = ({ title, score, reason }) => {
  return (
    <>
      <div className="rounded-2xl border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-slate-900">{title}</h4>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {score} Match
          </span>
        </div>
        <p className="mt-3 text-sm text-slate-600">{reason}</p>
      </div>
    </>
  );
};

export default JobCard;
