// client/src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../store/auth.jsx";

export default function Login() {
  const nav = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const redirectTo = location.state?.from || "/profile";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) return setError("Email and password are required");
    setLoading(true);
    try {
      const res = await api.post("/login", {
        email: form.email,
        password: form.password
      });

      // update auth context (this updates Navbar, ProtectedRoute, etc.)
      login(res.data.token, res.data.user);

      // also persist to localStorage (auth provider effect will do this, but safe to ensure)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      nav(redirectTo, { replace: true });
    } catch (err) {
      console.error("Login error", err);
      setError(err?.response?.data?.error || err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="Your password"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {error && <div className="text-red-600">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm text-slate-600">
          Don't have an account? <Link to="/register" className="text-indigo-600 hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
