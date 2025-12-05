// client/src/pages/AuthCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../store/auth.jsx";

export default function AuthCallback() {
  const nav = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      nav("/login", { replace: true });
      return;
    }

    // store token and fetch profile
    localStorage.setItem("token", token);

    (async () => {
      try {
        const res = await api.get("/profile/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const user = res.data;
        localStorage.setItem("user", JSON.stringify(user));
        login(token, user);
        nav("/planner", { replace: true });
      } catch (err) {
        console.error("Auth callback: failed to fetch profile", err);
        // fallback: still store token and redirect home
        nav("/", { replace: true });
      }
    })();
  }, [nav, login]);

  return <div className="p-8 text-center">Signing you in…</div>;
}
