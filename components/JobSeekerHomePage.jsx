const JobSeekerHomePage = ({ user, onSignOut }) => {
  const displayName = user?.email?.split("@")[0] ?? "there";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="text-xl font-bold text-slate-900">AI Job Portal</div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-600 sm:inline">
              Signed in as{" "}
              <span className="font-medium text-slate-900">
                {user?.email ?? "Job Seeker"}
              </span>
            </span>
            {onSignOut && (
              <button
                type="button"
                onClick={onSignOut}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 hover:cursor-pointer"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-3xl bg-linear-to-br from-indigo-600 via-indigo-500 to-sky-500 px-8 py-12 text-white shadow-lg">
          <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100">
            Job Seeker Dashboard
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome back, {displayName}!
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-indigo-50 sm:text-base">
            This is a placeholder for your personalized job seeker homepage.
            Soon you will see role recommendations, application status, and
            insights from your resume right here.
          </p>
        </section>

        <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Matched Roles",
              description:
                "Roles ranked by how well they fit your experience and skills.",
            },
            {
              title: "Applications",
              description:
                "Track every application from applied to interview to offer.",
            },
            {
              title: "Profile Insights",
              description:
                "See how recruiters perceive your profile and what to improve.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {card.description}
              </p>
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-indigo-600">
                Coming soon
              </p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default JobSeekerHomePage;
