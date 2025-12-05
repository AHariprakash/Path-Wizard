// client/src/pages/Planner.jsx
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { usePlanner } from "../store/planner.jsx";
import ProgressBar from "../components/ProgressBar.jsx";

/**
 * Backwards-compatible Planner page:
 * - Works if planner contains `items` (legacy)
 * - If planner does not contain items, we treat planner.days (or empty) as a different mode
 * - All writes persist by calling setPlanner(...) which delegates to provider (auto-save)
 *
 * Exposed functions to the UI keep the original names: toggle, remove, removeGroup, clear
 */

export default function Planner() {
  const { planner, setPlanner, clearPlanner, loading, saving, lastSavedAt, savePlanner } = usePlanner();

  // Modal/dialog state (same as before)
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingGid, setPendingGid] = useState(null);
  const [clearOpen, setClearOpen] = useState(false);

  // Build a local items view that preserves original item shape when possible.
  // If planner.items exists and is an array, use it directly (legacy).
  // Otherwise, if planner.days exists, flatten days -> items (read-only mapping to keep UI working).
  const items = useMemo(() => {
    if (!planner) return [];
    if (Array.isArray(planner.items)) return planner.items;
    // If planner.days exists, convert to step items: each day -> a step per task (best-effort)
    if (Array.isArray(planner.days)) {
      // produce items with deterministic ids so toggles/removes still work during session
      return planner.days.flatMap((d) => {
        const dayId = d.id || d.date || String(d.date || Date.now());
        const tasks = Array.isArray(d.items) ? d.items : [];
        return tasks.map((t, idx) => ({
          id: `${dayId}::${idx}`,
          type: "step",
          domain: d.domain || `Day ${d.date || ""}`,
          step: t,
          done: false,
          createdAt: d.date || undefined,
          // groupId left undefined for day-based items
        }));
      });
    }
    return [];
  }, [planner]);

  // Helper: replace planner.items with a new items array (preserves other planner fields)
  const writeItems = (newItems) => {
    setPlanner((p) => ({ ...(p || {}), items: newItems }));
    // provider will auto-save (debounced)
  };

  // Core actions (map to legacy API names)
  const toggle = (id) => {
    const next = items.map((it) => (it.id === id ? { ...it, done: !it.done } : it));
    writeItems(next);
  };

  const remove = (id) => {
    const next = items.filter((it) => it.id !== id);
    writeItems(next);
  };

  const removeGroup = (gid) => {
    // remove stack-report entries and steps with groupId === gid
    const next = items.filter((it) => {
      if (it.type === "stack-report" && it.report?.id === gid) return false;
      if (it.groupId && it.groupId === gid) return false;
      return true;
    });
    writeItems(next);
  };

  const clear = () => {
    // clear planner items (keeps other planner fields)
    setPlanner((p) => ({ ...(p || {}), items: [] }));
    // also call clearPlanner to ensure provider saves an empty planner shape if desired
    // but keep synced to items; avoid double-saving too often
    clearPlanner();
  };

  // Derived stats (only count step items for progress)
  const stepItems = items.filter((i) => i.type === "step");
  const doneCount = stepItems.filter((i) => i.done).length;
  const total = stepItems.length;

  // Dialog helpers
  const openGroupDialog = (gid) => {
    setPendingGid(gid);
    setConfirmOpen(true);
  };
  const confirmGroup = () => {
    if (pendingGid) removeGroup(pendingGid);
    setConfirmOpen(false);
    setPendingGid(null);
  };
  const cancelGroup = () => {
    setConfirmOpen(false);
    setPendingGid(null);
  };

  const openClearDialog = () => setClearOpen(true);
  const cancelClear = () => setClearOpen(false);
  const confirmClearAll = () => {
    clear();
    setClearOpen(false);
  };

  const modalRoot = typeof document !== "undefined" ? document.getElementById("modal-root") : null;

  // If there are no items but planner.days exists, show hint to switch to day-mode
  const isDayMode = Array.isArray(planner?.days) && (!Array.isArray(planner?.items) || planner.items.length === 0);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white p-6">
        <h2 className="text-2xl font-semibold">Planner</h2>
        <p className="text-white/90 mt-1">Track selected steps and completion.</p>
        <div className="mt-4">
          <ProgressBar value={doneCount} total={total || 1} />
        </div>
        <div className="text-white/80 text-sm mt-1">
          {doneCount} of {total} done
          {loading && " — loading..."}
          {!loading && saving && " — saving..."}
          {!loading && !saving && lastSavedAt && ` — last saved ${new Date(lastSavedAt).toLocaleString()}`}
        </div>
      </div>

      <div className="rounded-xl border bg-white p-0 divide-y">
        {items.length === 0 && (
          <div className="p-6 text-slate-600 flex items-center justify-between">
            <span>
              {isDayMode
                ? "Your planner uses Day-based entries. Use Planner (Days) to edit tasks, or add steps from domain pages."
                : "No items yet. Save steps from a domain page."}
            </span>
            <Link to="/domains" className="rounded-xl bg-indigo-600 text-white px-3 py-2 text-sm">
              Browse domains
            </Link>
          </div>
        )}

        {items.map((it) => {
          if (it.type === "stack-report") {
            return (
              <div key={it.id} className="p-4 bg-indigo-50/60">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">Stack Report — {it.report?.domain}</div>
                    <div className="text-xs text-slate-600">
                      Score: {it.report?.analysis?.compatibilityScore ?? "—"}/100 - Roles:{" "}
                      {(it.report?.analysis?.roleHints || []).join(", ") || "—"}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {it.report?.createdAt ? new Date(it.report.createdAt).toLocaleString() : "—"}
                    </div>
                  </div>
                  <button onClick={() => openGroupDialog(it.report?.id)} className="text-sm text-red-600 hover:underline">
                    Remove
                  </button>
                </div>
              </div>
            );
          }

          // default step item
          return (
            <div key={it.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={!!it.done}
                  onChange={() => toggle(it.id)}
                  className="h-4 w-4 accent-indigo-600"
                />
                <div>
                  <div className="font-medium">{it.step}</div>
                  <div className="text-xs text-slate-500">
                    Domain: {it.domain}
                    {it.subdomain ? ` -  ${it.subdomain}` : ""}
                  </div>
                </div>
              </div>
              <button onClick={() => remove(it.id)} className="text-sm text-red-600 hover:underline">
                Remove
              </button>
            </div>
          );
        })}
      </div>

      {items.length > 0 && (
        <div className="flex gap-2">
          <button onClick={openClearDialog} className="rounded-xl bg-slate-100 px-3 py-2 hover:bg-slate-200">
            Clear all
          </button>
          <button
            onClick={async () => {
              try {
                await savePlanner();
                alert("Planner saved");
              } catch (err) {
                console.error(err);
                alert("Save failed — see console");
              }
            }}
            className="rounded-xl bg-indigo-600 text-white px-3 py-2 hover:bg-indigo-700"
          >
            Save now
          </button>
        </div>
      )}

      {/* Remove stack dialog (portal) */}
      {confirmOpen && modalRoot && createPortal(
        <div className="fixed inset-0 z-50 pointer-events-auto">
          <div className="fixed inset-0 bg-black/40" onClick={cancelGroup}></div>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div role="dialog" aria-modal="true" className="modal-panel">
              <div className="p-5">
                <div className="text-lg font-semibold">Remove stack?</div>
                <p className="text-sm text-slate-600 mt-1">This deletes the stack report and all its items.</p>
                <div className="mt-4 flex justify-end gap-2">
                  <button onClick={cancelGroup} className="px-3 py-2 rounded-lg bg-slate-100">Cancel</button>
                  <button onClick={confirmGroup} className="px-3 py-2 rounded-lg bg-red-600 text-white">Remove</button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        modalRoot
      )}

      {/* Clear all dialog (portal) */}
      {clearOpen && modalRoot && createPortal(
        <div className="fixed inset-0 z-50 pointer-events-auto">
          <div className="fixed inset-0 bg-black/40" onClick={cancelClear}></div>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div role="dialog" aria-modal="true" className="modal-panel">
              <div className="p-5">
                <div className="text-lg font-semibold">Clear all items?</div>
                <p className="text-sm text-slate-600 mt-1">This removes every planner item.</p>
                <div className="mt-4 flex justify-end gap-2">
                  <button onClick={cancelClear} className="px-3 py-2 rounded-lg bg-slate-100">Cancel</button>
                  <button onClick={confirmClearAll} className="px-3 py-2 rounded-lg bg-red-600 text-white">Clear all</button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        modalRoot
      )}
    </div>
  );
}
