import { useAlerts } from "../contexts/AlertContext";
import useCameras from "../hooks/useCameras";
import { Card, Tag, StatusBadge, EmptyState, PageHeader } from "../components/ui";

export default function OverviewView({ onNavigate }) {
  const { alerts, unreadCount } = useAlerts();
  const { cameras, loading } = useCameras();

  const online      = cameras.filter((c) => c.status === "online").length;
  const todayAlerts = alerts.filter(
    (a) => new Date(a.timestamp).toDateString() === new Date().toDateString()
  ).length;

  const stats = [
    {
      label: "Cameras Online",
      value: loading ? "—" : String(online),
      sub:   `${cameras.length} total registered`,
      color: "text-[#00e676]",
      bar:   "#00e676",
    },
    {
      label: "Unread Alerts",
      value: String(unreadCount),
      sub:   `${todayAlerts} detected today`,
      color: unreadCount > 0 ? "text-[#ff3c5f]" : "text-[#00e676]",
      bar:   unreadCount > 0 ? "#ff3c5f" : "#00e676",
    },
    {
      label: "Total Detections",
      value: String(alerts.length),
      sub:   "All time",
      color: "text-[#ffb800]",
      bar:   "#ffb800",
    },
    {
      label: "Model Status",
      value: "ACTIVE",
      sub:   "Detection model running",
      color: "text-[#00e676] text-xl pt-2",
      bar:   "#00e676",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Overview"
        subtitle="System status and activity summary"
        action={
          <span className="font-mono-vg text-[11px] text-[#445566]">
            {new Date().toLocaleString()}
          </span>
        }
      />

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label} className="relative p-5 overflow-hidden hover:border-white/[0.14] transition-colors">
            <div
              className="absolute top-0 left-4 right-4 h-px"
              style={{ background: `linear-gradient(90deg,transparent,${s.bar},transparent)` }}
            />
            <div className="font-mono-vg text-[10px] tracking-[0.12em] uppercase text-[#7a8a9e] mb-2">
              {s.label}
            </div>
            <div className={`font-display text-4xl font-bold leading-none ${s.color}`}>
              {s.value}
            </div>
            <div className="text-[12px] text-[#445566] mt-1.5">{s.sub}</div>
          </Card>
        ))}
      </div>

      {/* ── Recent Detections ── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-semibold tracking-wide text-[#e8edf5]">
          Recent Detections
        </h2>
        {alerts.length > 0 && (
          <button
            onClick={() => onNavigate("alerts")}
            className="px-3 py-1.5 text-[12px] font-mono-vg tracking-widest uppercase text-[#7a8a9e] border border-white/10 rounded hover:text-[#e8edf5] hover:border-white/20 hover:bg-[#141c26] transition-all"
          >
            View all →
          </button>
        )}
      </div>

      {alerts.length === 0 ? (
        <Card className="py-10">
          <EmptyState
            icon={<ShieldCheckIcon />}
            title="All Clear"
            description="No incidents detected. The system is actively monitoring all cameras."
          />
        </Card>
      ) : (
        <div className="space-y-2 mb-8">
          {alerts.slice(0, 5).map((a) => (
            <AlertRow key={a.id} alert={a} onClick={() => onNavigate("alerts")} />
          ))}
        </div>
      )}

      {/* ── Camera Status ── */}
      <div className="h-px bg-white/[0.07] my-6" />
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-semibold tracking-wide text-[#e8edf5]">
          Camera Status
        </h2>
        <button
          onClick={() => onNavigate("cameras")}
          className="px-3 py-1.5 text-[12px] font-mono-vg tracking-widest uppercase text-[#7a8a9e] border border-white/10 rounded hover:text-[#e8edf5] hover:border-white/20 hover:bg-[#141c26] transition-all"
        >
          Manage →
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-[#141c26] border border-white/[0.07] rounded animate-pulse" />
          ))}
        </div>
      ) : cameras.length === 0 ? (
        <Card className="py-8">
          <EmptyState
            icon={<CamIcon />}
            title="No cameras yet"
            description="Add your first camera to start monitoring."
            action={
              <button
                onClick={() => onNavigate("cameras")}
                className="mt-2 px-5 py-2 bg-[#00d4ff] text-[#080a0f] font-display font-semibold text-sm tracking-widest rounded hover:bg-[#33dcff] transition-colors"
              >
                Add Camera
              </button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-2">
          {cameras.slice(0, 6).map((cam) => (
            <CameraRow key={cam.id} camera={cam} />
          ))}
          {cameras.length > 6 && (
            <button
              onClick={() => onNavigate("cameras")}
              className="w-full py-2.5 text-[12px] font-mono-vg tracking-widest uppercase text-[#445566] border border-dashed border-white/[0.07] rounded hover:text-[#7a8a9e] hover:border-white/[0.14] transition-all"
            >
              + {cameras.length - 6} more cameras
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────── */

function AlertRow({ alert, onClick }) {
  return (
    <Card
      className="flex gap-3.5 p-3.5 cursor-pointer hover:border-white/[0.14] transition-colors"
      style={{ borderLeftWidth: !alert.read ? "3px" : undefined, borderLeftColor: !alert.read ? "#ff3c5f" : undefined }}
    >
      <div
        className="flex gap-3.5 w-full"
        onClick={onClick}
      >
        {/* Thumb */}
        <div className="w-16 h-12 flex-shrink-0 bg-[#080a0f] rounded overflow-hidden flex items-center justify-center text-[#445566]">
          {alert.thumbnail
            ? <img src={alert.thumbnail} alt="" className="w-full h-full object-cover" />
            : <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L21.5 18H2.5L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
          }
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-display text-[14px] font-semibold text-[#e8edf5] truncate">
              Violence — {alert.camera_name || alert.camera_id}
            </span>
            {!alert.read && (
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#ff3c5f] shadow-[0_0_6px_#ff3c5f]" />
            )}
          </div>
          <div className="text-[11px] text-[#7a8a9e] mt-0.5">
            {new Date(alert.timestamp).toLocaleString()}
          </div>
          <div className="flex gap-1.5 mt-1 flex-wrap">
            <Tag variant="danger">VIOLENCE</Tag>
            <Tag variant="warn">{Math.round((alert.confidence || 0) * 100)}%</Tag>
            {alert.clip_url && <Tag variant="info">CLIP</Tag>}
          </div>
        </div>
      </div>
    </Card>
  );
}

function CameraRow({ camera }) {
  const online = camera.status === "online";
  return (
    <div className="flex items-center gap-3 bg-[#141c26] border border-white/[0.07] rounded px-4 py-2.5 hover:border-white/[0.14] transition-colors">
      <svg
        width="18" height="18" viewBox="0 0 20 20" fill="none"
        className={online ? "text-[#00d4ff]" : "text-[#445566]"}
      >
        <path d="M2 7a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 8.5l4-2v7l-4-2V8.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] text-[#e8edf5] font-medium truncate">{camera.name}</div>
        <div className="text-[11px] text-[#445566] truncate">{camera.location || camera.stream_url || "—"}</div>
      </div>
      <StatusBadge online={online} />
    </div>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
      <path d="M24 4L42 10V24C42 34 34 42 24 44C14 42 6 34 6 24V10L24 4Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 24L21 29L32 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CamIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 20 20" fill="none">
      <path d="M2 7a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M14 8.5l4-2v7l-4-2V8.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}