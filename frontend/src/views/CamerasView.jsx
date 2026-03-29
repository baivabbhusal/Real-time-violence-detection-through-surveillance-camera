import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useAlerts } from "../contexts/AlertContext";
import useCameras from "../hooks/useCameras";
import useConfirm from "../hooks/useConfirm.jsx";
import CameraFullscreen from "../components/CameraFullscreen";
import { Input, Select, Button } from "../components/Ui";

export default function CamerasView() {
  const { API } = useAuth();
  const { alerts } = useAlerts();
  const { cameras, loading, error, addCamera, removeCamera } = useCameras();
  const { confirm, ConfirmDialog } = useConfirm();
  const [showAdd, setShowAdd] = useState(false);
  const [fullscreen, setFullscreen] = useState(null); // camera object

  const handleDelete = async (cam) => {
    const ok = await confirm(`Remove "${cam.name}" from monitoring?`, "Remove Camera");
    if (!ok) return;
    try { await removeCamera(cam.id); } catch {}
  };

  const activeCams = new Set(
    alerts
      .filter((a) => Date.now() - new Date(a.timestamp).getTime() < 15000)
      .map((a) => a.camera_id)
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-wide text-[#e8edf5]">Cameras</h1>
          <p className="text-sm text-[#7a8a9e] mt-0.5">
            {loading ? "Loading..." : `${cameras.length} camera${cameras.length !== 1 ? "s" : ""} registered`}
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#00d4ff] text-[#080a0f] font-display font-semibold text-sm tracking-widest rounded hover:bg-[#33dcff] hover:shadow-[0_0_16px_rgba(0,212,255,0.25)] transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          ADD CAMERA
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-[#ff3c5f]/10 border border-[#ff3c5f]/30 rounded-lg text-sm text-[#ff3c5f]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <line x1="8" y1="5" x2="8" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
          </svg>
          Failed to load cameras: {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#141c26] border border-white/[0.07] rounded-xl overflow-hidden animate-pulse">
              <div className="aspect-video bg-[#1a2333]" />
              <div className="p-4 flex items-center gap-3">
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-[#1a2333] rounded w-2/3" />
                  <div className="h-3 bg-[#1a2333] rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && cameras.length === 0 && !error && (
        <div className="flex flex-col items-center py-20 gap-3 text-center">
          <div className="opacity-25">
            <svg width="64" height="64" viewBox="0 0 20 20" fill="none">
              <path d="M2 7a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" stroke="#7a8a9e" strokeWidth="1.2" />
              <path d="M14 8.5l4-2v7l-4-2V8.5z" stroke="#7a8a9e" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="font-display text-lg text-[#7a8a9e]">No cameras added yet</h3>
          <p className="text-sm text-[#445566] max-w-xs">Add your first RTSP or HTTP stream to start monitoring for violence.</p>
          <button
            onClick={() => setShowAdd(true)}
            className="mt-2 px-5 py-2.5 bg-[#00d4ff] text-[#080a0f] font-display font-semibold text-sm tracking-widest rounded hover:bg-[#33dcff] transition-colors"
          >
            Add Camera
          </button>
        </div>
      )}

      {/* Camera grid */}
      {!loading && cameras.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {cameras.map((cam) => (
            <CameraCard
              key={cam.id}
              camera={cam}
              alertActive={activeCams.has(cam.id)}
              onDelete={() => handleDelete(cam)}
              onExpand={() => setFullscreen(cam)}
              API={API}
            />
          ))}
        </div>
      )}

      {/* Fullscreen viewer */}
      {fullscreen && (
        <CameraFullscreen
          camera={fullscreen}
          alertActive={activeCams.has(fullscreen.id)}
          onClose={() => setFullscreen(null)}
          API={API}
        />
      )}

      {/* Add camera modal */}
      {showAdd && (
        <AddCameraModal
          onClose={() => setShowAdd(false)}
          onAdded={async (data) => { await addCamera(data); setShowAdd(false); }}
        />
      )}

      {/* Styled confirm dialog */}
      <ConfirmDialog />
    </div>
  );
}

// ── CameraCard ─────────────────────────────────────────
function CameraCard({ camera, alertActive, onDelete, onExpand, API }) {
  const isOnline  = camera.status === "online";
  const streamUrl = `${API}/cameras/${camera.id}/stream`;

  return (
    <div className={`group bg-[#141c26] border rounded-xl overflow-hidden transition-all hover:-translate-y-0.5 ${
      alertActive
        ? "border-[#ff3c5f] animate-alert-card"
        : "border-white/[0.07] hover:border-white/[0.14]"
    }`}>
      {/* Feed area */}
      <div className="relative aspect-video bg-[#080a0f] cursor-pointer" onClick={onExpand}>
        {isOnline && (
          <img
            src={streamUrl}
            alt={camera.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        )}
        {!isOnline && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#445566] text-[13px]">
            <svg width="28" height="28" viewBox="0 0 20 20" fill="none">
              <path d="M2 7a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1.2" />
              <path d="M14 8.5l4-2v7l-4-2V8.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
            Stream offline
          </div>
        )}

        {/* Expand hint on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded font-mono-vg text-[11px] text-[#e8edf5] tracking-widest">
            ⛶ EXPAND
          </div>
        </div>

        {/* Top badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between pointer-events-none">
          {isOnline && (
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded font-mono-vg text-[10px] text-[#ff3c5f] tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff3c5f] animate-rec-fast" />
              REC
            </div>
          )}
          {alertActive && (
            <div className="ml-auto bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded font-mono-vg text-[10px] text-[#ffb800] tracking-wide border border-[#ffb800]/30">
              ⚠ VIOLENCE
            </div>
          )}
        </div>
      </div>

      {/* Info bar */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.07]">
        <div className="min-w-0 flex-1">
          <div className="font-display text-[15px] font-semibold text-[#e8edf5] truncate">{camera.name}</div>
          <div className="text-[12px] text-[#7a8a9e] truncate">{camera.location || "—"}</div>
        </div>
        <div className="flex items-center gap-2 ml-3 flex-shrink-0">
          <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded font-mono-vg text-[10px] tracking-wider ${
            isOnline ? "bg-[#00e676]/10 text-[#00e676]" : "bg-[#ff3c5f]/10 text-[#ff3c5f]"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-[#00e676]" : "bg-[#ff3c5f]"}`} />
            {isOnline ? "ONLINE" : "OFFLINE"}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="w-7 h-7 flex items-center justify-center rounded bg-[#ff3c5f]/10 text-[#ff3c5f] border border-[#ff3c5f]/30 hover:bg-[#ff3c5f]/20 transition-colors"
            title="Remove camera"
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M2 3.5h10M5.5 3.5V2.5h3v1M11 3.5l-.7 8H3.7l-.7-8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── AddCameraModal ──────────────────────────────────────
function AddCameraModal({ onClose, onAdded }) {
  const [form,    setForm]    = useState({ name: "", location: "", stream_url: "", type: "rtsp" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.stream_url) { setError("Name and stream URL are required."); return; }
    setError(""); setLoading(true);
    try {
      await onAdded(form);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center p-5 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-[460px] bg-[#141c26] border border-white/[0.1] rounded-xl p-7 shadow-[0_16px_48px_rgba(0,0,0,0.6)]">
        <h2 className="font-display text-xl font-bold tracking-wide text-[#e8edf5] mb-5">Add Camera</h2>
        <button onClick={onClose} className="absolute top-5 right-5 text-[#7a8a9e] hover:text-[#e8edf5] transition-colors">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Camera Name" placeholder="e.g. Front Door"         value={form.name}       onChange={set("name")} required />
          <Input label="Location"    placeholder="e.g. Building A — Lobby" value={form.location}   onChange={set("location")} />
          <Input label="Stream URL"  placeholder="rtsp://192.168.1.x:554/stream" value={form.stream_url} onChange={set("stream_url")} required mono />
          <Select label="Stream Type" value={form.type} onChange={set("type")}>
            <option value="rtsp">RTSP</option>
            <option value="http">HTTP / MJPEG</option>
            <option value="webcam">Local Webcam</option>
          </Select>

          {error && <p className="text-[12px] text-[#ff3c5f]">{error}</p>}

          <div className="flex gap-2.5 justify-end pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm" disabled={loading}>
              {loading ? "Adding..." : "ADD CAMERA"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}