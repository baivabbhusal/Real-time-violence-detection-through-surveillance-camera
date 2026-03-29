import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Input } from "../components/Ui";

function VGLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
      <path d="M24 4L44 14V34L24 44L4 34V14L24 4Z" stroke="#00d4ff" strokeWidth="2" fill="none" />
      <circle cx="24" cy="24" r="8" fill="#00d4ff" opacity="0.9" />
      <circle cx="24" cy="24" r="4" fill="#080a0f" />
    </svg>
  );
}

const FEATURES = [
  "AI violence detection at 95%+ accuracy",
  "Real-time SMS & email alerts via Twilio + Gmail",
  "Multi-camera RTSP / HTTP stream management",
  "Automatic clip recording on every detection",
];

const FIELDS = [
  { k: "name",     label: "Full Name",              type: "text",     ph: "John Doe" },
  { k: "email",    label: "Email Address",           type: "email",    ph: "you@example.com" },
  { k: "phone",    label: "Phone (SMS alerts)",      type: "tel",      ph: "+1 555 000 0000" },
  { k: "password", label: "Password",                type: "password", ph: "Min. 8 characters" },
  { k: "confirm",  label: "Confirm Password",        type: "password", ph: "••••••••" },
];

export default function RegisterPage({ onSwitch }) {
  const { register } = useAuth();
  const [form,     setForm]    = useState({ name: "", email: "", password: "", confirm: "", phone: "" });
  const [errors,   setErrors]  = useState({});
  const [apiError, setApiError]= useState("");
  const [loading,  setLoading] = useState(false);
  const [success,  setSuccess] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim())           errs.name     = "Name is required";
    if (!form.email.includes("@"))   errs.email    = "Valid email required";
    if (form.password.length < 8)    errs.password = "Minimum 8 characters";
    if (form.password !== form.confirm) errs.confirm = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setApiError(""); setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      setSuccess(true);
      setTimeout(() => onSwitch(), 2500);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Success screen ── */
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080a0f]">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <svg width="72" height="72" viewBox="0 0 48 48" fill="none">
              <path d="M24 4L42 10V24C42 34 34 42 24 44C14 42 6 34 6 24V10L24 4Z" stroke="#00e676" strokeWidth="1.5" fill="rgba(0,230,118,0.08)" />
              <path d="M16 24L21 29L32 18" stroke="#00e676" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="font-display text-3xl font-bold tracking-wide text-[#e8edf5]">Account Created</h2>
          <p className="text-sm text-[#7a8a9e]">Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">

      {/* ── Left panel ── */}
      <div className="relative hidden md:flex flex-col justify-end p-12 bg-[#0d1117] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,rgba(0,212,255,0.07)_0%,transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Large shield watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06]">
          <svg width="240" height="240" viewBox="0 0 48 48" fill="none">
            <path d="M24 4L42 10V24C42 34 34 42 24 44C14 42 6 34 6 24V10L24 4Z" stroke="#00d4ff" strokeWidth="1" fill="#00d4ff" />
          </svg>
        </div>
        <div className="relative z-10">
          <h1 className="font-display text-5xl font-bold leading-tight tracking-wide text-[#e8edf5]">
            Join<br />
            <span className="text-[#00d4ff]">VisionGuard</span><br />
            Today
          </h1>
          <p className="mt-3 text-sm text-[#7a8a9e] max-w-xs leading-relaxed">
            Set up your surveillance network in minutes. Get instant alerts when threats are detected.
          </p>
          <ul className="mt-6 space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-[#7a8a9e]">
                <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-[#00d4ff]/15 flex items-center justify-center">
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2 2 4-4" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Right form ── */}
      <div className="flex items-center justify-center px-8 py-12 bg-[#080a0f] overflow-y-auto">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5 font-display text-lg font-bold tracking-[0.18em] text-[#e8edf5] mb-10">
            <VGLogo />
            VISIONGUARD
          </div>

          <h2 className="font-display text-3xl font-bold tracking-wide text-[#e8edf5]">
            Create account
          </h2>
          <p className="mt-1 mb-8 text-sm text-[#7a8a9e]">
            Already have an account?{" "}
            <button
              onClick={onSwitch}
              className="text-[#00d4ff] font-medium hover:opacity-75 transition-opacity"
            >
              Sign in
            </button>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {FIELDS.map(({ k, label, type, ph }) => (
              <Input
                key={k}
                label={label}
                type={type}
                placeholder={ph}
                value={form[k]}
                onChange={set(k)}
                error={errors[k]}
              />
            ))}

            {apiError && <p className="text-[12px] text-[#ff3c5f]">{apiError}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-[#00d4ff] text-[#080a0f] font-display font-semibold text-[15px] tracking-widest py-3 rounded transition-all hover:bg-[#33dcff] hover:shadow-[0_0_20px_rgba(0,212,255,0.25)] hover:-translate-y-px disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? "Creating account..." : "CREATE ACCOUNT"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}