const TrustCard = ({ title, text }) => {
  return (
    <>
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="h-12 w-12 rounded-2xl bg-indigo-100" />
        <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{text}</p>
      </div>
    </>
  );
};

export default TrustCard;
