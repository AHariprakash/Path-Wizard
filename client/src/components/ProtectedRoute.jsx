// client/src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth.jsx";

export default function ProtectedRoute({ children }) {
  const { token } = useAuth();

  // fallback to localStorage token in case auth state wasn't updated yet
  const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const effectiveToken = token || storedToken;

  return effectiveToken ? children : <Navigate to="/login" replace />;
}
