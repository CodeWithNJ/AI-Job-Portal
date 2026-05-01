import MetricCard from "./MetricCard";
import Tag from "./Tag";

const HeroSection = () => {
  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8">
        <div className="mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          Relevance-first discovery
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Relevance-First Hiring Powered by Resume Intelligence
        </h1>

        <p className="mt-4 max-w-xl text-base text-slate-600 sm:text-lg">
          Connect with opportunities using RAG-backed matching that understands
          skills beyond keywords.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button className="rounded-full bg-indigo-600 px-5 py-3 font-medium text-white">
            Upload Resume to Match
          </button>
          <button className="rounded-full border border-slate-300 px-5 py-3 font-medium text-slate-900">
            Post a Job
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <MetricCard
            label="Resume Parsing"
            value="3 sec"
            note="Profile prefill"
          />
          <MetricCard
            label="Match Quality"
            value="84%"
            note="Average fit score"
          />
          <MetricCard
            label="Screening Speed"
            value="11h"
            note="Recruiter time saved"
          />
        </div>
      </div>

      <div className="rounded-3xl bg-slate-900 p-8 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Explainable recommendation
        </p>

        <div className="mt-6 rounded-3xl border border-slate-700 bg-slate-800 p-6">
          <div className="inline-block rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
            Match Score 84%
          </div>

          <h2 className="mt-4 text-2xl font-bold">Senior Backend Engineer</h2>
          <p className="mt-2 text-sm text-slate-300">
            Remote • Fintech • 4-7 years
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <Tag dark>NestJS</Tag>
            <Tag dark>PostgreSQL</Tag>
            <Tag dark>Node.js</Tag>
            <Tag dark>RAG</Tag>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-700 p-4">
            <p className="text-sm text-slate-200">
              Why you&apos;re a match: Matches your Node.js and RAG experience.
              Minor gap in fintech domain depth.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
            <h3 className="font-semibold">Resume Parsing</h3>
            <p className="mt-2 text-sm text-slate-300">
              PDF becomes skill tags, experience, and work preferences.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
            <h3 className="font-semibold">Application Status</h3>
            <p className="mt-2 text-sm text-slate-300">
              Applied → Under Review → Shortlisted → Interview Scheduled
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
