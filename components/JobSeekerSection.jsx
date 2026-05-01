import JobCard from "./JobCard";
import StatusStep from "./StatusStep";
import Tag from "./Tag";

const JobSeekerSection = () => {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">For Job Seekers</h2>
          <p className="mt-2 text-slate-600">
            Personalized discovery with resume parsing, explainable matches, and
            application tracking.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold">Resume Parsing Card</h3>
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-4">
              <p className="text-sm text-slate-500">resume.pdf</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Tag>Node.js</Tag>
                <Tag>NestJS</Tag>
                <Tag>PostgreSQL</Tag>
                <Tag>RAG</Tag>
              </div>
              <p className="mt-4 text-sm text-slate-600">Experience: 5 years</p>
              <p className="text-sm text-slate-600">Location: India</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold">Matched Jobs</h3>
            <div className="mt-4 space-y-4">
              <JobCard
                title="Platform Engineer"
                score="81%"
                reason="Matches your API ownership and database experience."
              />
              <JobCard
                title="Backend Engineer, Lending"
                score="78%"
                reason="Strong overlap in backend architecture and SQL-heavy workflows."
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold">Application Status</h3>
            <div className="mt-4 space-y-3">
              <StatusStep label="Applied" active />
              <StatusStep label="Under Review" active />
              <StatusStep label="Shortlisted" />
              <StatusStep label="Interview Scheduled" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default JobSeekerSection;
