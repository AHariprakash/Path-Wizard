import { Link } from "react-router-dom";
import { DOMAIN_LIST } from "../data/domains.js";

export default function Domains() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white p-6">
        <h2 className="text-2xl font-semibold">Software Engineering Domains</h2>
        <p className="text-white/90 mt-1">Pick a domain to start your roadmap.</p>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {DOMAIN_LIST.map((d) => (
          <Link
            key={d.slug}
            to={`/domains/${d.slug}/stack`}
            className="group rounded-2xl border bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{d.title}</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">
                Explore
              </span>
            </div>
            <p className="mt-2 text-slate-600 text-sm">
              Curated skills, steps, and resources with progress tracking.
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
