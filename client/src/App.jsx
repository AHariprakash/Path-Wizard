import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./store/auth";
import ProtectedRoute from "./components/ProtectedRoute";
import { PlannerProvider } from "./store/planner.jsx";
import { ToastProvider } from "./components/Toast.jsx";
import Navbar from "./components/Navbar";

// pages
import Home from "./pages/Home";
import Domains from "./pages/Domains";
import Resources from "./pages/Resources";
import Planner from "./pages/Planner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DomainDetail from "./pages/DomainDetail";
import DomainStack from "./pages/DomainStack";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile.jsx";
import AuthCallback from "./pages/AuthCallback"; // <-- added

function Layout() {
  return (
    <div>
      <header className="sticky top-0 z-40 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white">
        <Navbar />
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/domains" element={<Domains />} />
          <Route path="/domains/:slug/stack" element={<DomainStack />} />
          <Route path="/domains/:slug" element={<DomainDetail />} />

          {/* Resources route with optional domain parameter */}
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/:domain" element={<Resources />} />

          <Route
            path="/planner"
            element={
              <ProtectedRoute>
                <Planner />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* OAuth callback route (receives token and finishes sign-in) */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="border-t py-8 text-center text-slate-500">© PathWizard</footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PlannerProvider>
        <ToastProvider>
          <BrowserRouter>
            <Layout />
          </BrowserRouter>
        </ToastProvider>
      </PlannerProvider>
    </AuthProvider>
  );
}
