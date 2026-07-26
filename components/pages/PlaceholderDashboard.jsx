/**
 * Shared scaffold for the three role dashboards until real features land.
 *
 * Structure and spacing are lifted from the original job seeker home page, so
 * the recruiter and admin views are visually consistent by construction rather
 * than by three copies of the same markup drifting apart. As each capability
 * ships, its card is replaced by a real component in the same grid slot.
 */
const PlaceholderDashboard = ({ eyebrow, title, description, gradient, cards }) => (
  <>
    <section
      className={`rounded-3xl bg-linear-to-br ${gradient} px-8 py-12 text-white shadow-lg`}
    >
      <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
        {eyebrow}
      </div>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85 sm:text-base">
        {description}
      </p>
    </section>

    <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {card.description}
          </p>
          <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-indigo-600">
            Coming soon
          </p>
        </div>
      ))}
    </section>
  </>
);

export default PlaceholderDashboard;
