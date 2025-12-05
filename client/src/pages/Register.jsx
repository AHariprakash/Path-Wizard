// client/src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../store/auth.jsx";

export default function Register() {
  const nav = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const redirectTo = location.state?.from || "/profile";

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) return setError("Email and password are required");

    const payload = {
      email: form.email.trim().toLowerCase(),
      password: form.password,
      fullName: form.fullName,
      username: form.username
    };

    setLoading(true);
    try {
      const res = await api.post("/register", payload);
      login(res.data.token, res.data.user);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      nav(redirectTo, { replace: true });
    } catch (err) {
      console.error("Registration request failed:", err);
      const serverMessage = err?.response?.data?.error;
      setError(serverMessage || err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const baseAuth = (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.replace(/\/api$/, "")) || "http://localhost:5000";

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white p-6">
        <h2 className="text-2xl font-semibold">Create account</h2>
      </div>

      <div className="rounded-xl border bg-white p-6 text-slate-600">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full name</label>
            <input name="fullName" value={form.fullName} onChange={onChange} placeholder="John Doe" className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input name="username" value={form.username} onChange={onChange} placeholder="johndoe" className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input name="email" type="email" value={form.email} onChange={onChange} placeholder="you@example.com" className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input name="password" type="password" value={form.password} onChange={onChange} placeholder="Choose a strong password" className="w-full p-2 border rounded" required />
          </div>

          {error && <div className="text-red-600">{error}</div>}

          <div>
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>

        <div className="mt-4">
          <div className="text-sm text-center">Or sign up with</div>
          <div className="flex gap-2 justify-center mt-3">
            <a href={`${baseAuth}/auth/google`} className="px-4 py-2 border rounded">Google</a>
            <a href={`${baseAuth}/auth/facebook`} className="px-4 py-2 border rounded">Facebook</a>
            <a href={`${baseAuth}/auth/microsoft`} className="px-4 py-2 border rounded">Microsoft</a>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-slate-600">
          Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
