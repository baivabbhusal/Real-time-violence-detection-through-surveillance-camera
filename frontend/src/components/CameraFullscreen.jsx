/**
 * CameraFullscreen — modal that shows an expanded live feed
 * with detection confidence overlay and clip download link.
 */
export default function CameraFullscreen({ camera, alertActive, onClose, API }) {
  const isOnline  = camera.status === "online";
  const streamUrl = `${API}/cameras/${camera.id}/stream`;

  // Close on Escape
  const handleKey = (e) => { if (e.key === "Escape") onClose(); };

  return (
    <div
      className="fixed inset-0 z-[500] flex flex-col bg-black/90 backdrop-blur-md"
      onKeyDown={handleKey}
      tabIndex={-1}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.08] bg-[#0d1117]/80 flex-shrink-0">
        <div>
          <div className="font-display text-lg font-bold tracking-wide text-[#e8edf5]">{camera.name}</div>
          <div className="text-[12px] text-[#7a8a9e]">{camera.location || camera.stream_url}</div>
        </div>
        <div className="flex items-center gap-3">
          {/* Status badge */}
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-mono-vg text-[11px] tracking-wider ${isOnline ? "bg-[#00e676]/10 text-[#00e676]" : "bg-[#ff3c5f]/10 text-[#ff3c5f]"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-[#00e676] animate-rec" : "bg-[#ff3c5f]"}`} />
            {isOnline ? "LIVE" : "OFFLINE"}
          </span>
          {alertActive && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded font-mono-vg text-[11px] bg-[#ff3c5f]/15 text-[#ff3c5f] border border-[#ff3c5f]/30 animate-rec">
              ⚠ VIOLENCE DETECTED
            </span>
          )}
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded border border-white/10 text-[#7a8a9e] hover:text-[#e8edf5] hover:bg-[#141c26] hover:border-white/20 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-[#080a0f]">
        {isOnline ? (
          <img
            src={streamUrl}
            alt={camera.name}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center gap-4 text-[#445566]">
            <svg width="64" height="64" viewBox="0 0 20 20" fill="none">
              <path d="M2 7a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1" />
              <path d="M14 8.5l4-2v7l-4-2V8.5z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
            </svg>
            <div className="font-mono-vg text-[13px] tracking-widest">STREAM OFFLINE</div>
          </div>
        )}

        {/* Corner scan decoration when active */}
        {alertActive && (
          <div className="absolute inset-4 border border-[#ff3c5f]/40 rounded pointer-events-none animate-alert-card" />
        )}
      </div>

      {/* Bottom info bar */}
      <div className="flex items-center gap-4 px-5 py-3 border-t border-white/[0.08] bg-[#0d1117]/80 flex-shrink-0">
        <div className="font-mono-vg text-[11px] text-[#445566] tracking-widest">
          ID: {camera.id}
        </div>
        <div className="font-mono-vg text-[11px] text-[#445566] tracking-widest flex-1 truncate">
          {camera.stream_url}
        </div>
        <div className="font-mono-vg text-[11px] text-[#445566] tracking-widest">
          {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}