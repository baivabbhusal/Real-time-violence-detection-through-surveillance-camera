import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useAlerts } from "../contexts/AlertContext";
import CamerasView  from "../views/CamerasView";
import AlertsView   from "../views/AlertsView";
import OverviewView from "../views/OverviewView";
import SettingsView from "../views/SettingsView";
import LiveAlertToast from "../components/LiveAlertToast";
import MobileNav      from "../components/MobileNav";
import WSStatusBar    from "../components/WSStatusBar";

const NAV = [
  {
    section: "Monitor",
    items: [
      { id: "overview", label: "Overview", icon: GridIcon },
      { id: "cameras",  label: "Cameras",  icon: CamIcon  },
      { id: "alerts",   label: "Alerts",   icon: AlertIcon, badge: true },
    ],
  },
  {
    section: "Account",
    items: [
      { id: "settings", label: "Settings", icon: SettingsIcon },
    ],
  },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { unreadCount, liveAlert, wsStatus } = useAlerts();
  const [view, setView] = useState("overview");
  const [showUserMenu, setShowUserMenu] = useState(false);

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U";

  const renderView = () => {
    switch (view) {
      case "overview": return <OverviewView onNavigate={setView} />;
      case "cameras":  return <CamerasView />;
      case "alerts":   return <AlertsView />;
      case "settings": return <SettingsView />;
      default:         return <OverviewView onNavigate={setView} />;
    }
  };

  return (
    <>
      {/* WS disconnect banner sits above everything */}
      <WSStatusBar status={wsStatus} />

      <div className="min-h-screen grid grid-rows-[60px_1fr] md:grid-cols-[220px_1fr] md:grid-rows-[60px_1fr]">
        {/* ── Topbar ── */}
        <header className="col-span-full flex items-center gap-4 px-4 md:px-6 bg-[#0d1117] border-b border-white/[0.07] sticky top-0 z-50">
          <div className="flex items-center gap-2.5 font-display text-[16px] font-bold tracking-[0.18em] text-[#e8edf5] mr-2">
            <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
              <path d="M24 4L44 14V34L24 44L4 34V14L24 4Z" stroke="#00d4ff" strokeWidth="2" fill="none" />
              <circle cx="24" cy="24" r="8" fill="#00d4ff" opacity="0.9" />
              <circle cx="24" cy="24" r="4" fill="#080a0f" />
            </svg>
            <span className="hidden sm:inline">VISIONGUARD</span>
          </div>

          {/* System status */}
          <div className="hidden md:flex items-center gap-2 font-mono-vg text-[11px] text-[#00e676]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] shadow-[0_0_6px_#00e676] animate-rec" />
            SYSTEM ACTIVE
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Alert bell */}
            <div className="relative">
              <button
                onClick={() => setView("alerts")}
                className="w-9 h-9 flex items-center justify-center rounded border border-white/10 text-[#7a8a9e] hover:text-[#e8edf5] hover:bg-[#141c26] hover:border-white/20 transition-all"
                title="Alerts"
              >
                <AlertIcon size={18} />
              </button>
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#ff3c5f] border-2 border-[#0d1117] font-mono-vg text-[10px] font-bold text-white px-1">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu((v) => !v)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-[#141c26] border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#ff3c5f] flex items-center justify-center font-display text-[11px] font-bold text-[#080a0f] flex-shrink-0">
                  {initials}
                </div>
                <span className="hidden sm:inline text-[13px] text-[#7a8a9e]">{user?.name?.split(" ")[0]}</span>
                <ChevronIcon />
              </button>

              {showUserMenu && (
                <>
                  {/* backdrop */}
                  <div className="fixed inset-0 z-[150]" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute top-[calc(100%+8px)] right-0 min-w-44 bg-[#1a2333] border border-white/10 rounded-lg p-1.5 z-[200] shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <div className="text-[13px] text-[#e8edf5] font-medium">{user?.name}</div>
                      <div className="text-[11px] text-[#445566]">{user?.email}</div>
                    </div>
                    <button
                      onClick={() => { setShowUserMenu(false); setView("settings"); }}
                      className="w-full text-left px-3 py-1.5 text-[13px] text-[#7a8a9e] hover:text-[#e8edf5] hover:bg-[#141c26] rounded transition-colors"
                    >
                      Settings
                    </button>
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-1.5 text-[13px] text-[#ff3c5f] hover:bg-[#ff3c5f]/10 rounded transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ── Sidebar (desktop only) ── */}
        <aside className="hidden md:flex flex-col gap-1 p-3 bg-[#0d1117] border-r border-white/[0.07] overflow-y-auto">
          {NAV.map((section) => (
            <div key={section.section} className="mb-2">
              <div className="font-mono-vg text-[10px] tracking-[0.14em] uppercase text-[#445566] px-2.5 py-1.5 mt-1">
                {section.section}
              </div>
              {section.items.map((item) => {
                const active = view === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-[14px] transition-all relative ${
                      active
                        ? "bg-[#141c26] text-[#00d4ff] border border-[#00d4ff]/20"
                        : "text-[#7a8a9e] hover:bg-[#141c26] hover:text-[#e8edf5] border border-transparent"
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-[20%] bottom-[20%] w-0.5 rounded-full bg-[#00d4ff]" />
                    )}
                    <item.icon size={18} />
                    {item.label}
                    {item.badge && unreadCount > 0 && (
                      <span className="ml-auto min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#ff3c5f] font-mono-vg text-[10px] font-bold text-white px-1">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {/* WS indicator in sidebar footer */}
          <div className="mt-auto pt-4 border-t border-white/[0.07]">
            <div className="flex items-center gap-2 px-2.5 py-2">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                wsStatus === "open"       ? "bg-[#00e676] animate-rec" :
                wsStatus === "connecting" ? "bg-[#ffb800] animate-rec" :
                                            "bg-[#ff3c5f]"
              }`} />
              <span className="font-mono-vg text-[10px] tracking-widest text-[#445566] uppercase">
                {wsStatus === "open" ? "Live stream" : wsStatus === "connecting" ? "Connecting..." : "Disconnected"}
              </span>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="overflow-y-auto bg-[#080a0f] p-5 md:p-7 pb-20 md:pb-7">
          {renderView()}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav view={view} setView={setView} unreadCount={unreadCount} />

      {/* Real-time alert toast */}
      {liveAlert && <LiveAlertToast alert={liveAlert} />}
    </>
  );
}

// ── Icons ──────────────────────────────────────────────
function GridIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function CamIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M2 7a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 8.5l4-2v7l-4-2V8.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function AlertIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 2.5L17.5 15.5H2.5L10 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="10" y1="8" x2="10" y2="11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="13.5" r="0.75" fill="currentColor" />
    </svg>
  );
}
function SettingsIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function ChevronIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M4 5.5L7 8.5L10 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}