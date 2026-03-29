/**
 * MobileNav — bottom tab bar shown on small screens.
 * Mirrors the sidebar navigation items.
 */
export default function MobileNav({ view, setView, unreadCount }) {
  const tabs = [
    { id: "overview",  label: "Overview",  icon: GridIcon  },
    { id: "cameras",   label: "Cameras",   icon: CamIcon   },
    { id: "alerts",    label: "Alerts",    icon: AlertIcon, badge: true },
    { id: "settings",  label: "Settings",  icon: SettingsIcon },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0d1117] border-t border-white/[0.07] flex">
      {tabs.map((tab) => {
        const active = view === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`relative flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
              active ? "text-[#00d4ff]" : "text-[#445566]"
            }`}
          >
            {active && (
              <span className="absolute top-0 left-1/4 right-1/4 h-px bg-[#00d4ff]" />
            )}
            <div className="relative">
              <tab.icon size={20} />
              {tab.badge && unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-[#ff3c5f] font-mono-vg text-[9px] font-bold text-white px-0.5 border border-[#0d1117]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
            <span className="font-mono-vg text-[9px] tracking-widest uppercase">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ── Icons ──────────────────────────────────────────────
function GridIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function CamIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M2 7a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 8.5l4-2v7l-4-2V8.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function AlertIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 2.5L17.5 15.5H2.5L10 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="10" y1="8" x2="10" y2="11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="13.5" r="0.75" fill="currentColor" />
    </svg>
  );
}
function SettingsIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}