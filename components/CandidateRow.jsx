import Tag from "./Tag";

const CandidateRow = ({ note, score }) => {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-semibold text-slate-900">{name}</h4>
          <p className="mt-2 text-sm text-slate-600">{note}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Tag>NestJS</Tag>
            <Tag>Postgres</Tag>
            <Tag>APIs</Tag>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-900">{score}</p>
          <p className="text-xs text-slate-500">Fit Score</p>
        </div>
      </div>
    </div>
  );
};

export default CandidateRow;
