import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Input } from "../components/Ui";

const CAMS = [
  { id: "CAM-01", label: "Entrance A",  delay: "" },
  { id: "CAM-02", label: "Corridor B",  delay: "delay-700" },
  { id: "CAM-03", label: "Parking Lot", delay: "delay-1400" },
  { id: "CAM-04", label: "Server Room", delay: "delay-2100" },
];

function VGLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
      <path d="M24 4L44 14V34L24 44L4 34V14L24 4Z" stroke="#00d4ff" strokeWidth="2" fill="none" />
      <circle cx="24" cy="24" r="8" fill="#00d4ff" opacity="0.9" />
      <circle cx="24" cy="24" r="4" fill="#080a0f" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" className="animate-spin-vg">
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="20 10" />
    </svg>
  );
}

export default function LoginPage({ onSwitch }) {
  const { login } = useAuth();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">

      {/* ── Left visual panel ── */}
      <div className="relative hidden md:flex flex-col justify-end p-12 bg-[#0d1117] overflow-hidden">
        {/* Gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,rgba(0,212,255,0.07)_0%,transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_80%_80%,rgba(255,60,95,0.05)_0%,transparent_70%)]" />
        </div>
        {/* Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "linear-gradient(to bottom,transparent,rgba(0,0,0,0.5) 30%,rgba(0,0,0,0.5) 70%,transparent)",
          }}
        />

        {/* Fake camera thumbnails */}
        <div className="absolute top-10 left-10 right-10 grid grid-cols-2 gap-3">
          {CAMS.map((cam) => (
            <div key={cam.id} className="relative aspect-video bg-[#141c26] border border-white/10 rounded overflow-hidden">
              <div
                className={`absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent opacity-70 animate-scan ${cam.delay}`}
                style={{ top: 0 }}
              />
              <span className="absolute bottom-1.5 left-2 font-mono-vg text-[9px] text-[#00d4ff] tracking-widest">
                {cam.label}
              </span>
              <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-[#ff3c5f] shadow-[0_0_6px_#ff3c5f] animate-rec" />
            </div>
          ))}
        </div>

        {/* Tagline */}
        <div className="relative z-10">
          <h1 className="font-display text-5xl font-bold leading-tight tracking-wide text-[#e8edf5]">
            Real-time<br />
            <span className="text-[#00d4ff]">Violence</span><br />
            Detection
          </h1>
          <p className="mt-3 text-sm text-[#7a8a9e] max-w-xs leading-relaxed">
            AI-powered security surveillance that detects threats instantly and alerts your team before incidents escalate.
          </p>
        </div>
      </div>

      {/* ── Right form ── */}
      <div className="flex items-center justify-center px-8 py-12 bg-[#080a0f]">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5 font-display text-lg font-bold tracking-[0.18em] text-[#e8edf5] mb-10">
            <VGLogo />
            VISIONGUARD
          </div>

          <h2 className="font-display text-3xl font-bold tracking-wide text-[#e8edf5]">
            Welcome back
          </h2>
          <p className="mt-1 mb-8 text-sm text-[#7a8a9e]">
            Don't have an account?{" "}
            <button
              onClick={onSwitch}
              className="text-[#00d4ff] font-medium hover:opacity-75 transition-opacity"
            >
              Create one
            </button>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error ? " " : undefined}
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            {error && <p className="text-[12px] text-[#ff3c5f] -mt-2">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#00d4ff] text-[#080a0f] font-display font-semibold text-[15px] tracking-widest py-3 rounded transition-all hover:bg-[#33dcff] hover:shadow-[0_0_20px_rgba(0,212,255,0.25)] hover:-translate-y-px disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? <><Spinner /> Authenticating...</> : "SIGN IN"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}