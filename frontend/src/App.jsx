import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AlertProvider } from "./contexts/AlertContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
// import "./styles/globals.css";

function AppRouter() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState("login");

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-8 bg-[#080a0f]">
        <div className="flex items-center gap-3 font-display text-2xl font-bold tracking-[0.2em] text-[#e8edf5]">
          <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
            <path d="M24 4L44 14V34L24 44L4 34V14L24 4Z" stroke="#00d4ff" strokeWidth="2" fill="none" />
            <circle cx="24" cy="24" r="8" fill="#00d4ff" opacity="0.9" />
            <circle cx="24" cy="24" r="4" fill="#080a0f" />
          </svg>
          VISIONGUARD
        </div>
        <div className="w-48 h-0.5 bg-[#1a2333] rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-[#00d4ff] rounded-full animate-splash" />
        </div>
      </div>
    );
  }

  if (!user) {
    return page === "login"
      ? <LoginPage onSwitch={() => setPage("register")} />
      : <RegisterPage onSwitch={() => setPage("login")} />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <AppRouter />
      </AlertProvider>
    </AuthProvider>
  );
}