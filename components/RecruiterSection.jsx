import CandidateRow from "./CandidateRow";
import SignalCard from "./SignalCard";

const RecruiterSection = () => {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">For Recruiters</h2>
          <p className="mt-2 text-slate-600">
            Search your internal talent pool, rank applicants by fit, and review
            evidence quickly.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-400">
            Search your internal talent pool using natural language
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-lg font-semibold">Ranked Candidates</h3>
              <div className="mt-4 space-y-4">
                <CandidateRow
                  name="Aarav Sharma"
                  score="91"
                  note="Experience overlap: Node.js, backend systems, payments infra."
                />
                <CandidateRow
                  name="Riya Gupta"
                  score="87"
                  note="Missing qualification flag: no direct fintech experience."
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-lg font-semibold">Evidence Signals</h3>
              <div className="mt-4 space-y-3">
                <SignalCard
                  type="positive"
                  text="Experience overlap: 5 years in backend platform work"
                />
                <SignalCard
                  type="positive"
                  text="Skill match: NestJS, PostgreSQL, API design"
                />
                <SignalCard
                  type="warning"
                  text="Missing qualification: Fintech domain exposure"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecruiterSection;
