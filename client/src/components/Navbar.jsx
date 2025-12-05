// client/src/components/Navbar.jsx
import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../store/auth.jsx"; // Import useAuth

const base = "px-3 py-1.5 rounded-xl hover:bg-white/10";
const active = ({ isActive }) => (isActive ? "bg-white/20 " : "") + base;

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth(); // Use auth context

  // helper to render initial from name/email
  const getInitial = () => {
    const name = user?.fullName || user?.email || "";
    return name ? name.trim()[0].toUpperCase() : "?";
  };

  return (
    <nav className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((open) => !open)}
            className="w-10 h-10 rounded-full border-2 border-white overflow-hidden focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="User profile"
          >
            {/* prefer avatarUrl then fullName initial then email initial */}
            {user ? (
              user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="avatar"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="flex justify-center items-center w-full h-full bg-indigo-600 text-white font-bold">
                  {getInitial()}
                </span>
              )
            ) : (
              <img
                src="/default-avatar.png"
                alt="User Avatar"
                className="object-cover w-full h-full"
              />
            )}
          </button>

          {dropdownOpen && user && (
            <div className="absolute left-0 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-20">
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Settings
              </Link>
              <button
                onClick={() => {
                  logout();
                  setDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <Link to="/" className="text-xl font-semibold text-white">
          PathWizard
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <NavLink to="/domains" className={active}>
          Domains
        </NavLink>
        <NavLink to="/resources" className={active}>
          Resources
        </NavLink>
        <NavLink to="/planner" className={active}>
          Planner
        </NavLink>

        {!user ? (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                (isActive ? "bg-white/30 " : "bg-white/20 ") +
                "px-3 py-1.5 rounded-xl hover:bg-white/30"
              }
            >
              Sign in
            </NavLink>

            <NavLink
              to="/register"
              className={({ isActive }) =>
                (isActive ? "bg-white/30 " : "bg-white/10 ") +
                "px-3 py-1.5 rounded-xl hover:bg-white/20"
              }
            >
              Sign up
            </NavLink>
          </>
        ) : null}
      </div>
    </nav>
  );
}
