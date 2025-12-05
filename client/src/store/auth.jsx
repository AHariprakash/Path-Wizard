// client/src/store/auth.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  // initialize from localStorage so a page refresh keeps the user logged in
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch (e) {
      return null;
    }
  });

  // keep localStorage in sync when token/user state changes
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // On mount, ensure we are in sync with localStorage (covers cases where
  // something wrote directly to localStorage and the provider mounted earlier)
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t && t !== token) setToken(t);

    try {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      if (u && JSON.stringify(u) !== JSON.stringify(user)) setUser(u);
    } catch (e) {
      // ignore parse errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for storage events (other tabs) to keep auth state consistent
  useEffect(() => {
    function onStorage(e) {
      if (e.key === "token") {
        setToken(e.newValue || "");
      }
      if (e.key === "user") {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch (err) {
          setUser(null);
        }
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = (t, u) => {
    setToken(t);
    setUser(u);
    // Persisting to localStorage happens via the effects above
  };

  const logout = () => {
    setToken("");
    setUser(null);
    // localStorage removed via effects
  };

  return <AuthCtx.Provider value={{ token, user, login, logout }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
