const Tag = ({ children, dark }) => {
  return (
    <>
      <span
        className={
          dark
            ? "rounded-full bg-slate-700 px-3 py-1 text-xs text-slate-200"
            : "rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
        }
      >
        {children}
      </span>
    </>
  );
};

export default Tag;
