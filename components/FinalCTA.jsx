const FinalCTA = () => {
  return (
    <>
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-indigo-600 px-6 py-12 text-center text-white sm:px-10">
          <h2 className="text-3xl font-bold tracking-tight">
            Start with relevance, not noise
          </h2>
          <p className="mt-3 text-indigo-100">
            Whether you are applying or hiring, get to stronger matches faster.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button className="rounded-full bg-white px-5 py-3 font-medium text-indigo-700">
              Upload Resume to Match
            </button>
            <button className="rounded-full border border-indigo-300 px-5 py-3 font-medium text-white">
              Post a Job
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default FinalCTA;
