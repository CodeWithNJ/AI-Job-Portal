const Header = ({ onUploadResumeClick }) => {
  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="text-xl font-bold">AI Job Portal</div>

          <nav className="flex flex-wrap gap-4 text-sm text-slate-600">
            <a href="#" className="hover:text-slate-900">
              Job Seekers
            </a>
            <a href="#" className="hover:text-slate-900">
              Recruiters
            </a>
            <a href="#" className="hover:text-slate-900">
              AI Matching
            </a>
            <a href="#" className="hover:text-slate-900">
              Trust
            </a>
          </nav>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onUploadResumeClick}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 hover:cursor-pointer"
            >
              Upload Resume to Match
            </button>
            <button className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
              Post a Job
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
