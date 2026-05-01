const SignalCard = ({ type, text }) => {
  const styles =
    type === "positive"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-amber-50 text-amber-700 border-amber-200";

  return (
    <div className={`rounded-2xl border p-4 text-sm ${styles}`}>{text}</div>
  );
};

export default SignalCard;
