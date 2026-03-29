export default function LiveAlertToast({ alert }) {
  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex items-center gap-4 bg-[#1a2333] border border-[#ff3c5f] rounded-xl px-5 py-4 max-w-sm shadow-[0_0_30px_rgba(255,60,95,0.35),0_8px_32px_rgba(0,0,0,0.5)] animate-toast">
      {/* pulsing icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#ff3c5f]/15 flex items-center justify-center animate-rec">
        <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
          <path d="M11 2L20.5 18H1.5L11 2Z" stroke="#ff3c5f" strokeWidth="2" strokeLinejoin="round" />
          <line x1="11" y1="8" x2="11" y2="13" stroke="#ff3c5f" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="11" cy="15.5" r="1" fill="#ff3c5f" />
        </svg>
      </div>

      {/* body */}
      <div className="flex-1 min-w-0">
        <div className="font-display text-[15px] font-bold text-[#ff3c5f] tracking-widest">VIOLENCE DETECTED</div>
        <div className="text-[12px] text-[#7a8a9e] mt-0.5 truncate">
          {alert.camera_name || alert.camera_id} · {new Date(alert.timestamp).toLocaleTimeString()}
        </div>
        <div className="flex gap-1.5 mt-1.5">
          <span className="px-2 py-0.5 rounded font-mono-vg text-[10px] bg-[#ff3c5f]/10 text-[#ff3c5f]">ALERT SENT</span>
          <span className="px-2 py-0.5 rounded font-mono-vg text-[10px] bg-[#00d4ff]/10 text-[#00d4ff]">CLIP SAVING</span>
        </div>
      </div>

      {/* confidence */}
      <div className="flex-shrink-0 font-display text-2xl font-bold text-[#ff3c5f]">
        {Math.round((alert.confidence || 0) * 100)}%
      </div>
    </div>
  );
}