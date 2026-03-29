import { useState } from "react";
import { useAlerts } from "../contexts/AlertContext";
import useAlertHistory from "../hooks/useAlertHistory";
import { Card, Tag, PageHeader, Divider } from "../components/Ui";

export default function AlertsView() {
  const { alerts, markRead, markAllRead, clearAll, unreadCount, seedAlerts } = useAlerts();

  // Seed server-side history on first mount
  useAlertHistory(seedAlerts);

  const [selected, setSelected] = useState(null);
  const [filter,   setFilter]   = useState("all"); // "all" | "unread"

  const handleClick = (a) => { markRead(a.id); setSelected(a); };

  const filtered = filter === "unread" ? alerts.filter((a) => !a.read) : alerts;

  return (
    <div>
      {/* ── Header ── */}
      <PageHeader
        title="Alerts"
        subtitle={`${unreadCount} unread · ${alerts.length} total`}
        action={
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter pills */}
            <div className="flex bg-[#141c26] border border-white/[0.07] rounded p-0.5">
              {["all", "unread"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded text-[11px] font-mono-vg tracking-widest uppercase transition-all ${
                    filter === f
                      ? "bg-[#1a2333] text-[#e8edf5]"
                      : "text-[#445566] hover:text-[#7a8a9e]"
                  }`}
                >
                  {f}
                  {f === "unread" && unreadCount > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-[#ff3c5f] text-white text-[9px]">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="px-3 py-1.5 text-[11px] font-mono-vg tracking-widest uppercase text-[#7a8a9e] border border-white/10 rounded hover:text-[#e8edf5] hover:border-white/20 hover:bg-[#141c26] transition-all"
              >
                Mark all read
              </button>
            )}
            {alerts.length > 0 && (
              <button
                onClick={() => { clearAll(); setSelected(null); }}
                className="px-3 py-1.5 text-[11px] font-mono-vg tracking-widest uppercase text-[#ff3c5f] border border-[#ff3c5f]/20 rounded hover:bg-[#ff3c5f]/10 transition-all"
              >
                Clear
              </button>
            )}
          </div>
        }
      />

      {/* ── Empty ── */}
      {filtered.length === 0 && (
        <Card className="py-20">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="opacity-25">
              <svg width="56" height="56" viewBox="0 0 48 48" fill="none">
                <path d="M24 4L42 10V24C42 34 34 42 24 44C14 42 6 34 6 24V10L24 4Z" stroke="#7a8a9e" strokeWidth="1.5" fill="none" />
                <path d="M16 24L21 29L32 18" stroke="#7a8a9e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="font-display text-lg text-[#7a8a9e]">
              {filter === "unread" ? "No unread alerts" : "No alerts recorded"}
            </h3>
            <p className="text-sm text-[#445566] max-w-xs leading-relaxed">
              {filter === "unread"
                ? "You're all caught up."
                : "The system is monitoring. You'll be notified here and via SMS/email when violence is detected."}
            </p>
          </div>
        </Card>
      )}

      {/* ── Content ── */}
      {filtered.length > 0 && (
        <div className={`grid gap-5 items-start ${selected ? "grid-cols-1 lg:grid-cols-[1fr_360px]" : "grid-cols-1"}`}>

          {/* List */}
          <div className="space-y-2">
            {filtered.map((a) => {
              const isSelected = selected?.id === a.id;
              return (
                <div
                  key={a.id}
                  onClick={() => handleClick(a)}
                  className={`flex gap-3.5 rounded-xl p-3.5 cursor-pointer transition-all border ${
                    isSelected
                      ? "bg-[#1a2333] border-[#00d4ff]/30"
                      : !a.read
                        ? "bg-[#141c26] border-[#ff3c5f]/30 border-l-[3px] border-l-[#ff3c5f]"
                        : "bg-[#141c26] border-white/[0.07] hover:border-white/[0.14]"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-14 flex-shrink-0 bg-[#080a0f] rounded-lg overflow-hidden flex items-center justify-center text-[#445566]">
                    {a.thumbnail
                      ? <img src={a.thumbnail} alt="" className="w-full h-full object-cover" />
                      : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2L21.5 18H2.5L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                          <line x1="12" y1="8" x2="12" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <circle cx="12" cy="15.5" r="0.75" fill="currentColor" />
                        </svg>
                      )
                    }
                  </div>

                  {/* Meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-[15px] font-semibold text-[#e8edf5] truncate">
                        Violence Detected — {a.camera_name || a.camera_id}
                      </span>
                      {!a.read && (
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#ff3c5f] shadow-[0_0_6px_#ff3c5f]" />
                      )}
                    </div>
                    <div className="text-[12px] text-[#7a8a9e] mt-0.5">
                      {new Date(a.timestamp).toLocaleString()}
                    </div>
                    <div className="flex gap-1.5 mt-1.5 flex-wrap">
                      <Tag variant="danger">VIOLENCE</Tag>
                      <Tag variant="warn">{Math.round((a.confidence || 0) * 100)}% CONF.</Tag>
                      {a.clip_url && <Tag variant="info">CLIP SAVED</Tag>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Detail panel ── */}
          {selected && (
            <div className="sticky top-5">
              <Card className="p-5">
                {/* Panel header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-base font-semibold tracking-wide text-[#e8edf5]">
                    Alert Detail
                  </h2>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-[#7a8a9e] hover:text-[#e8edf5] transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                {/* Thumbnail */}
                {selected.thumbnail && (
                  <img
                    src={selected.thumbnail}
                    alt="Alert frame"
                    className="w-full rounded-lg mb-4 object-cover aspect-video bg-[#080a0f]"
                  />
                )}

                {/* Info rows */}
                <div className="space-y-3 mb-5">
                  {[
                    ["Camera",     selected.camera_name || selected.camera_id],
                    ["Time",       new Date(selected.timestamp).toLocaleString()],
                    ["Confidence", `${Math.round((selected.confidence || 0) * 100)}%`],
                    ["Status",     selected.read ? "Read" : "Unread"],
                  ].map(([label, val]) => (
                    <div key={label} className="flex items-center justify-between gap-2">
                      <span className="font-mono-vg text-[10px] uppercase tracking-widest text-[#445566] flex-shrink-0">
                        {label}
                      </span>
                      <span className="text-[13px] text-[#e8edf5] text-right">{val}</span>
                    </div>
                  ))}
                </div>

                <Divider className="mb-4" />

                {/* Clip */}
                {selected.clip_url ? (
                  <div>
                    <div className="font-mono-vg text-[10px] uppercase tracking-widest text-[#445566] mb-2">
                      Incident Clip
                    </div>
                    <video
                      src={selected.clip_url}
                      controls
                      className="w-full rounded-lg bg-[#080a0f] mb-2.5"
                    />
                    <a
                      href={selected.clip_url}
                      download
                      className="flex items-center justify-center gap-2 py-2 text-[13px] text-[#7a8a9e] border border-white/10 rounded-lg hover:text-[#e8edf5] hover:border-white/20 hover:bg-[#1a2333] transition-all no-underline"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 2v7M4.5 6.5L7 9l2.5-2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      </svg>
                      Download Clip
                    </a>
                  </div>
                ) : (
                  <div className="py-6 text-center text-[12px] text-[#445566] border border-dashed border-white/[0.07] rounded-lg">
                    No clip recorded for this alert
                  </div>
                )}

                {/* Notification status */}
                <div className="mt-4 flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5" stroke="#00e676" strokeWidth="1.2" />
                    <path d="M4 6l1.5 1.5L8 4" stroke="#00e676" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="font-mono-vg text-[10px] text-[#445566] tracking-widest">
                    Notification sent via SMS &amp; Email
                  </span>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}