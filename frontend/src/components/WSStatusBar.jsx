/**
 * WSStatusBar — subtle banner shown when WebSocket is
 * disconnected or reconnecting, so the user always knows
 * whether real-time detection alerts are live.
 */
export default function WSStatusBar({ status }) {
  if (status === "open") return null;

  const isConnecting = status === "connecting";

  return (
    <div className={`flex items-center justify-center gap-2.5 px-4 py-2 text-[12px] font-mono-vg tracking-widest ${
      isConnecting
        ? "bg-[#ffb800]/10 text-[#ffb800] border-b border-[#ffb800]/20"
        : "bg-[#ff3c5f]/10 text-[#ff3c5f] border-b border-[#ff3c5f]/20"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isConnecting ? "bg-[#ffb800] animate-rec" : "bg-[#ff3c5f]"}`} />
      {isConnecting
        ? "CONNECTING TO ALERT STREAM..."
        : "ALERT STREAM DISCONNECTED — RECONNECTING"}
    </div>
  );
}