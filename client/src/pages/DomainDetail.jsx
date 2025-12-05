import { Link, useParams } from "react-router-dom";
import { usePlanner } from "../store/planner.jsx";
import { useToast } from "../components/Toast.jsx";
import { DOMAIN_DATA } from "../data/domains.js";

export default function DomainDetail() {
  const { slug } = useParams();
  const { add } = usePlanner();
  const { show } = useToast();

  console.log("DomainDetail: slug =", slug);
  const domain = DOMAIN_DATA[slug];
  console.log("DomainDetail: domain data =", domain);

  if (!domain) {
    return (
      <div className="rounded-2xl bg-white border p-6">Unknown domain.</div>
    );
  }

  const pretty = (s) =>
    s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white border p-6">
        <div className="text-sm text-slate-500">
          <Link to="/domains" className="hover:underline">
            Domains
          </Link>{" "}
          / <span className="capitalize">{pretty(slug)}</span>
        </div>
        <h2 className="mt-1 text-2xl font-semibold">{domain.title}</h2>
        <p className="text-slate-600">Select steps and save them to the planner.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {domain.skills.map((skill, i) => (
            <div key={i} className="rounded-xl border bg-white p-4">
              <h3 className="font-semibold">{skill.name}</h3>
              <ul className="mt-2 space-y-2">
                {skill.steps.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between gap-2"
                  >
                    <span>{step}</span>
                    <button
                      onClick={() => {
                        add(slug, step);
                        show("Saved to planner");
                      }}
                      className="text-xs rounded-lg bg-indigo-600 text-white px-2 py-1 hover:opacity-95"
                    >
                      Save
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {domain.skills.length === 0 && (
            <div className="rounded-xl border bg-white p-4 text-slate-600">
              Content for this domain is coming soon.
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border bg-white p-4">
            <h3 className="font-semibold">Tip</h3>
            <p className="text-slate-600 text-sm">
              Use Save to add steps to the planner for tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}