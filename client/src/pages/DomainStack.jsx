// client/src/pages/DomainStack.jsx
import { useParams, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { STACK_SCHEMA } from "../data/stack-schema";
import { analyzeStack } from "../utils/compat";
import AnalyticsPanel from "../components/AnalyticsPanel";
import { usePlanner } from "../store/planner.jsx";

export default function DomainStack() {
  // Normalize slug to lowercase
  let { slug } = useParams();
  slug = (slug || "").toLowerCase();

  const schema = STACK_SCHEMA[slug];
  const [selected, setSelected] = useState({});

  if (!schema) {
    console.warn(`DomainStack: Invalid slug "${slug}". Valid slugs: ${Object.keys(STACK_SCHEMA).join(", ")}`);
    return <div className="rounded-2xl bg-white border p-6">Unknown domain.</div>;
  }

  const toggle = (sd, comp, toolId, multi) => {
    setSelected((prev) => {
      const next = { ...prev, [sd]: { ...(prev[sd] || {}) } };
      const set = new Set(next[sd][comp] || []);
      if (multi) set.has(toolId) ? set.delete(toolId) : set.add(toolId);
      else {
        set.clear();
        set.add(toolId);
      }
      next[sd][comp] = Array.from(set);
      return next;
    });
  };

  const totalSelections = useMemo(() => {
    let c = 0;
    Object.values(selected).forEach((cs) =>
      Object.values(cs).forEach((arr) => (c += arr.length))
    );
    return c;
  }, [selected]);

  const analysis = useMemo(() => {
    const a = analyzeStack(schema, selected, slug);
    if (a.roleHints.length === 1 && a.roleHints[0] === "Generalist Engineer" && totalSelections === 0) {
      a.roleHints.length = 0;
    }
    return a;
  }, [schema, selected, slug, totalSelections]);

  // planner API: support both older functions and newer setPlanner
  const plannerApi = usePlanner();
  // attempt to pick convenient helpers if present
  const addMany = plannerApi?.addMany;
  const addStack = plannerApi?.addStack;
  const setPlanner = plannerApi?.setPlanner;

  // UI pop state for button animation & temporary "Added ✓" text
  const [popping, setPopping] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const commitToPlanner = () => {
    if (!analysis.viable || totalSelections === 0) return;

    // stable stack id and created timestamp
    const stackId = (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : `stack-${Date.now()}`;
    const createdAt = Date.now();

    // build flat step items from selected choices
    const flat = [];
    for (const [sd, comps] of Object.entries(selected || {})) {
      for (const [ck, ids] of Object.entries(comps || {})) {
        const comp = schema?.subdomains?.[sd]?.components?.[ck];
        if (!comp) continue;
        for (const id of ids) {
          const tool = comp.tools.find((t) => t.id === id);
          if (tool) {
            flat.push({
              id: (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : `step-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
              groupId: stackId,
              type: "step",
              done: false,
              domain: slug,
              subdomain: sd,
              component: ck,
              step: `${comp.title}: ${tool.name}`,
              meta: { toolId: id, tags: tool.tags },
              createdAt
            });
          }
        }
      }
    }

    // stack-report entry object
    const stackReport = {
      id: (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : `report-${Date.now()}`,
      type: "stack-report",
      createdAt,
      report: { id: stackId, domain: slug, selected, analysis, createdAt }
    };

    // Try new provider API first (setPlanner)
    if (typeof setPlanner === "function") {
      try {
        setPlanner((prev) => {
          const prevItems = Array.isArray(prev?.items) ? prev.items : [];
          const merged = [stackReport, ...flat, ...prevItems];
          return { ...(prev || {}), items: merged };
        });
        console.log("Added stack via setPlanner:", { stackReport, steps: flat.length });
      } catch (err) {
        console.error("setPlanner failed, falling back to addMany/addStack", err);
      }
    } else {
      // fallback to older API
      if (typeof addMany === "function" && typeof addStack === "function") {
        try {
          if (flat.length) addMany(flat);
          addStack({ id: stackId, domain: slug, selected, analysis, createdAt });
          console.log("Added stack via addMany/addStack:", { stackId, steps: flat.length });
        } catch (err) {
          console.error("addMany/addStack failed", err);
        }
      } else {
        console.error("No planner API available (setPlanner or addMany/addStack required)");
        return;
      }
    }

    // Visual feedback (pop + "Added ✓")
    setPopping(true);
    setJustAdded(true);
    setTimeout(() => setPopping(false), 300);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white border p-6">
        <div className="text-sm text-slate-500">
          <Link to="/domains" className="hover:underline">Domains</Link> / <span className="capitalize">{slug}</span> / Stack
        </div>
        <h2 className="mt-1 text-2xl font-semibold">{schema.title} Stack Builder</h2>
        <p className="text-slate-600">Select subdomains, then choose components and tools.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: hierarchy */}
        <div className="space-y-6">
          {Object.entries(schema.subdomains).map(([sdKey, sd]) => (
            <div key={sdKey} className="rounded-2xl border bg-white p-5">
              <h3 className="text-lg font-semibold">{sd.title}</h3>
              <div className="mt-3 space-y-4">
                {Object.entries(sd.components).map(([compKey, comp]) => (
                  <div key={compKey} className="rounded-xl border bg-white p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{comp.title}</h4>
                      <span className="text-xs text-slate-500">{comp.multi ? "Multiple" : "Single"} select</span>
                    </div>
                    <div className="mt-3 grid sm:grid-cols-2 gap-2">
                      {comp.tools.map((t) => {
                        const chosen = (selected[sdKey]?.[compKey] || []).includes(t.id);
                        return (
                          <button
                            key={t.id}
                            onClick={() => toggle(sdKey, compKey, t.id, comp.multi)}
                            className={`text-left rounded-lg border px-3 py-2 hover:bg-slate-50 ${
                              chosen ? "border-indigo-600 bg-indigo-50" : "border-slate-200"
                            }`}
                          >
                            <div className="font-medium">{t.name}</div>
                            <div className="text-xs text-slate-500">{t.tags.join(", ")}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right: analysis and charts */}
        <div className="space-y-4">
          <div className="rounded-2xl border bg-white p-5">
            <h3 className="font-semibold">Selected stack</h3>
            <p className="text-sm text-slate-600">Tools selected: {totalSelections}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {Object.entries(selected).map(([sd, comps]) => (
                <li key={sd}>
                  <span className="font-medium">{schema.subdomains[sd].title}</span>:{" "}
                  {Object.entries(comps)
                    .flatMap(([ck, arr]) =>
                      arr.map((a) => schema.subdomains[sd].components[ck].tools.find((x) => x.id === a)?.name)
                    )
                    .join(", ") || "—"}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <h3 className="font-semibold">Compatibility</h3>
            <p className="text-sm">Score: {analysis.compatibilityScore}/100</p>

            {analysis.warnings.length > 0 && (
              <ul className="mt-2 list-disc pl-5 text-sm text-amber-700">
                {analysis.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            )}

            {analysis.suggestions.length > 0 && (
              <ul className="mt-2 list-disc pl-5 text-sm text-emerald-700">
                {analysis.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            )}

            <div className="mt-2 text-sm text-slate-600">
              Roles: {analysis.roleHints.length ? analysis.roleHints.join(", ") : "—"}
            </div>

            <button
              disabled={!analysis.viable || totalSelections === 0}
              onClick={commitToPlanner}
              className={`mt-3 rounded-xl px-3 py-2 transition-transform duration-200 ease-out ${
                analysis.viable && totalSelections
                  ? `${popping ? "transform scale-110 shadow-xl bg-indigo-700" : "bg-indigo-600 text-white hover:bg-indigo-700"}`
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {justAdded ? "Added ✓" : "Add to Planner"}
            </button>
          </div>

          <AnalyticsPanel
            scores={analysis.aggregateScores}
            distribution={analysis.distribution}
            compatibility={analysis.compatibilityScore}
          />
        </div>
      </div>
    </div>
  );
}
