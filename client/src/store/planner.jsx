// client/src/store/planner.jsx
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import api from "../api/client";
import { useAuth } from "./auth.jsx";

const PlannerCtx = createContext(null);

export function PlannerProvider({ children }) {
  const { user } = useAuth();
  const [planner, setPlannerState] = useState(() => ({
    title: "",
    days: [],
    meta: {}
  }));
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const saveTimer = useRef(null);
  const lastSavedRef = useRef(null);

  // Load planner when user logs in
  useEffect(() => {
    async function load() {
      if (!user) {
        setPlannerState({ title: "", days: [], meta: {} });
        return;
      }
      setLoading(true);
      try {
        const res = await api.get("/planner");
        const loaded = res.data || {};
        setPlannerState((prev) => ({ ...prev, ...loaded }));
      } catch (err) {
        console.error("Failed to load planner:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  // internal setter that triggers debounced save
  const setPlanner = (patchOrUpdater) => {
    setPlannerState((prev) => {
      const next = typeof patchOrUpdater === "function" ? patchOrUpdater(prev) : { ...prev, ...patchOrUpdater };
      scheduleSave(next);
      return next;
    });
  };

  // debounced save scheduler
  const scheduleSave = (nextPlanner) => {
    if (!user) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      doSave(nextPlanner);
    }, 1000);
  };

  const doSave = async (payload) => {
    try {
      setSaving(true);
      const res = await api.post("/planner", payload || planner);
      lastSavedRef.current = new Date().toISOString();
      setPlannerState((prev) => ({ ...prev, ...(res.data || {}) }));
    } catch (err) {
      console.error("Auto-save planner failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const savePlanner = async () => {
    if (!user) throw new Error("Not authenticated");
    setSaving(true);
    try {
      const res = await api.post("/planner", planner);
      lastSavedRef.current = new Date().toISOString();
      setPlannerState((prev) => ({ ...prev, ...(res.data || {}) }));
      return res.data;
    } finally {
      setSaving(false);
    }
  };

  const clearPlanner = async () => {
    setPlannerState({ title: "", days: [], meta: {} });
    if (!user) return;
    try {
      await api.post("/planner", { title: "", days: [], meta: {} });
    } catch (err) {
      console.error("Failed to clear planner:", err);
    }
  };

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const value = useMemo(
    () => ({
      planner,
      setPlanner,
      savePlanner,
      clearPlanner,
      loading,
      saving,
      lastSavedAt: lastSavedRef.current
    }),
    [planner, loading, saving]
  );

  return <PlannerCtx.Provider value={value}>{children}</PlannerCtx.Provider>;
}

export function usePlanner() {
  const ctx = useContext(PlannerCtx);
  if (!ctx) throw new Error("usePlanner must be used within PlannerProvider");
  return ctx;
}
