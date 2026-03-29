/**
 * Shared primitive UI components used across views.
 * Keeps inputCls, labels, buttons consistent in one place.
 */

/** Text/email/tel/password input */
export function Input({ label, error, className = "", mono = false, ...props }) {
  return (
    <div>
      {label && (
        <label className="block font-mono-vg text-[11px] tracking-[0.12em] uppercase text-[#7a8a9e] mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-[#0d1117] border rounded px-3.5 py-2.5 text-[14px] text-[#e8edf5] placeholder-[#445566] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#00d4ff]/20 ${
          error ? "border-[#ff3c5f]" : "border-white/10 focus:border-[#00d4ff]"
        } ${mono ? "font-mono-vg text-[12px]" : ""} ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-[11px] text-[#ff3c5f]">{error}</p>}
    </div>
  );
}

/** Select dropdown */
export function Select({ label, children, className = "", ...props }) {
  return (
    <div>
      {label && (
        <label className="block font-mono-vg text-[11px] tracking-[0.12em] uppercase text-[#7a8a9e] mb-2">
          {label}
        </label>
      )}
      <select
        className={`w-full bg-[#0d1117] border border-white/10 rounded px-3.5 py-2.5 text-[14px] text-[#e8edf5] outline-none focus:border-[#00d4ff] focus:ring-2 focus:ring-[#00d4ff]/20 transition-all ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

/** Primary / ghost / danger button */
export function Button({ variant = "primary", size = "md", className = "", children, ...props }) {
  const base = "inline-flex items-center justify-center gap-2 font-display font-semibold tracking-widest transition-all disabled:opacity-50 disabled:pointer-events-none rounded";

  const sizes = {
    sm: "px-3.5 py-1.5 text-[12px]",
    md: "px-5 py-2.5 text-[13px]",
    lg: "px-6 py-3 text-[15px]",
  };

  const variants = {
    primary: "bg-[#00d4ff] text-[#080a0f] hover:bg-[#33dcff] hover:shadow-[0_0_20px_rgba(0,212,255,0.25)] hover:-translate-y-px",
    ghost:   "text-[#7a8a9e] border border-white/10 hover:text-[#e8edf5] hover:bg-[#141c26] hover:border-white/20",
    danger:  "bg-[#ff3c5f]/10 text-[#ff3c5f] border border-[#ff3c5f]/30 hover:bg-[#ff3c5f]/20",
    icon:    "w-9 h-9 text-[#7a8a9e] border border-white/10 hover:text-[#e8edf5] hover:bg-[#141c26] hover:border-white/20",
  };

  return (
    <button className={`${base} ${sizes[size] ?? sizes.md} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

/** Section card container */
export function Card({ className = "", children }) {
  return (
    <div className={`bg-[#141c26] border border-white/[0.07] rounded-xl ${className}`}>
      {children}
    </div>
  );
}

/** Monospaced label / section heading */
export function SectionLabel({ children }) {
  return (
    <div className="font-mono-vg text-[10px] tracking-[0.14em] uppercase text-[#445566] mb-3">
      {children}
    </div>
  );
}

/** Horizontal rule */
export function Divider({ className = "" }) {
  return <div className={`h-px bg-white/[0.07] ${className}`} />;
}

/** Inline status tag */
export function Tag({ variant = "info", children }) {
  const styles = {
    danger:  "bg-[#ff3c5f]/10 text-[#ff3c5f]",
    warn:    "bg-[#ffb800]/10 text-[#ffb800]",
    info:    "bg-[#00d4ff]/10 text-[#00d4ff]",
    success: "bg-[#00e676]/10 text-[#00e676]",
    muted:   "bg-white/5 text-[#445566]",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded font-mono-vg text-[10px] tracking-wide ${styles[variant]}`}>
      {children}
    </span>
  );
}

/** Dot + text status badge */
export function StatusBadge({ online }) {
  return (
    <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded font-mono-vg text-[10px] tracking-wider ${
      online ? "bg-[#00e676]/10 text-[#00e676]" : "bg-[#ff3c5f]/10 text-[#ff3c5f]"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${online ? "bg-[#00e676]" : "bg-[#ff3c5f]"}`} />
      {online ? "ONLINE" : "OFFLINE"}
    </span>
  );
}

/** Full-page empty state */
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center py-20 gap-3 text-center">
      {icon && <div className="opacity-25 mb-1">{icon}</div>}
      <h3 className="font-display text-lg text-[#7a8a9e]">{title}</h3>
      {description && <p className="text-sm text-[#445566] max-w-xs leading-relaxed">{description}</p>}
      {action}
    </div>
  );
}

/** Inline error alert bar */
export function ErrorBar({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-[#ff3c5f]/10 border border-[#ff3c5f]/30 rounded-lg text-sm text-[#ff3c5f]">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <line x1="8" y1="4.5" x2="8" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
      </svg>
      {message}
    </div>
  );
}

/** Page-level header with title, subtitle, and optional right-side action */
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-wrap items-center gap-3 justify-between mb-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-wide text-[#e8edf5]">{title}</h1>
        {subtitle && <p className="text-sm text-[#7a8a9e] mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/** Toggle switch (replaces inline Toggle in SettingsView) */
export function Toggle({ label, sub, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="text-[14px] text-[#e8edf5] font-medium">{label}</div>
        {sub && <div className="text-[12px] text-[#445566] mt-0.5">{sub}</div>}
      </div>
      <label className="relative flex-shrink-0 w-10 h-[22px] cursor-pointer select-none">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
        <div className={`absolute inset-0 rounded-full border transition-all duration-200 ${
          checked ? "bg-[#00d4ff] border-[#00d4ff]" : "bg-[#1a2333] border-white/10"
        }`}>
          <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200 ${
            checked ? "left-[18px] bg-[#080a0f]" : "left-0.5 bg-[#445566]"
          }`} />
        </div>
      </label>
    </div>
  );
}