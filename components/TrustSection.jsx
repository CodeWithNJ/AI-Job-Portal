import TrustCard from "./TrustCard";

const TrustSection = () => {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Assistive, Not Autonomous
          </h2>
          <p className="mt-2 text-slate-600">
            AI helps with discovery and ranking, but humans remain the final
            decision-makers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <TrustCard
            title="Explainable Outputs"
            text="Every recommendation includes a clear reason for the match."
          />
          <TrustCard
            title="Safe Defaults"
            text="The system surfaces evidence, not black-box decisions."
          />
          <TrustCard
            title="Data Privacy"
            text="Profiles, resumes, and matching signals are handled carefully."
          />
        </div>
      </section>
    </>
  );
};

export default TrustSection;
