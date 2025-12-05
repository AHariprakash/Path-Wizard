// client/src/pages/Profile.jsx
import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../store/auth.jsx";

export default function Profile() {
  const { user: authUser, login } = useAuth(); // login is optional; used to update context after save
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    bio: "",
    avatarUrl: ""
  });
  const [preview, setPreview] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/profile/me");
        const u = res.data;
        // normalize fields we expect
        setUser({
          fullName: u.fullName || "",
          email: u.email || "",
          phone: u.phone || "",
          college: u.college || "",
          bio: u.bio || "",
          avatarUrl: u.avatarUrl || ""
        });
        setPreview(u.avatarUrl || "");
        // ensure auth context has same user (in case)
        if (login && res.data) {
          // update auth context user object (keeps token untouched)
          login(localStorage.getItem("token"), {
            ...authUser,
            fullName: u.fullName || authUser?.fullName,
            email: u.email || authUser?.email,
            avatarUrl: u.avatarUrl || authUser?.avatarUrl
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((p) => ({ ...p, [name]: value }));
  };

  // File input: convert to base64 and preview
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setPreview(base64);
      setUser((p) => ({ ...p, avatarUrl: base64 }));
    };
    reader.readAsDataURL(file);
  };

  // Save profile to backend
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        fullName: user.fullName,
        phone: user.phone,
        college: user.college,
        bio: user.bio,
        avatarUrl: user.avatarUrl
      };
      const res = await api.put("/profile/me", payload);
      const updated = res.data;
      setUser({
        fullName: updated.fullName || "",
        email: updated.email || user.email,
        phone: updated.phone || "",
        college: updated.college || "",
        bio: updated.bio || "",
        avatarUrl: updated.avatarUrl || ""
      });
      setPreview(updated.avatarUrl || "");
      // update auth context user so navbar shows new initials/avatar
      if (login) {
        login(localStorage.getItem("token"), {
          ...authUser,
          fullName: updated.fullName || authUser?.fullName,
          email: updated.email || authUser?.email,
          avatarUrl: updated.avatarUrl || authUser?.avatarUrl
        });
      }
      alert("Profile saved");
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert(err?.response?.data?.error || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  // Helper: get initial to show
  const getInitial = () => {
    const name = user.fullName || user.email || authUser?.email || "";
    return name ? name.trim()[0].toUpperCase() : "?";
  };

  if (loading) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">User Profile</h1>

        <div className="flex flex-col items-center mb-6">
          {preview ? (
            <img src={preview} alt="avatar" className="w-24 h-24 rounded-full object-cover mb-2" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 mb-2 flex items-center justify-center text-xl font-semibold text-gray-600">
              {getInitial()}
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleFile} className="block mt-2" />
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input name="fullName" value={user.fullName} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input name="email" value={user.email} disabled className="w-full p-2 border rounded bg-gray-50" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input name="phone" value={user.phone} onChange={handleChange} className="w-full p-2 border rounded" placeholder="+1234567890" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">College</label>
            <input name="college" value={user.college} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Aspirations</label>
            <textarea name="bio" value={user.bio} onChange={handleChange} className="w-full p-2 border rounded" rows="4" placeholder="Describe your career goals..." />
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded">
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
