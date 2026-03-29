import { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { alertApi } from "../lib/api";
import useWebSocket from "../hooks/useWebSocket";

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const { token } = useAuth();
  const [alerts,    setAlerts]    = useState([]);
  const [liveAlert, setLiveAlert] = useState(null);

  /* ── WebSocket handler ─────────────────────────────── */
  const handleMessage = useCallback((data) => {
    if (data.type === "violence_detected") {
      const alert = {
        id:          Date.now(),
        camera_id:   data.camera_id,
        camera_name: data.camera_name,
        confidence:  data.confidence,
        clip_url:    data.clip_url   ?? null,
        thumbnail:   data.thumbnail  ?? null,
        timestamp:   new Date().toISOString(),
        read:        false,
      };
      setAlerts((prev) => [alert, ...prev.slice(0, 199)]);
      setLiveAlert(alert);
      setTimeout(() => setLiveAlert(null), 8000);
    }
  }, []);

  const wsUrl    = token ? alertApi.wsUrl(token) : null;
  const wsStatus = useWebSocket(wsUrl, handleMessage);

  /* ── Actions ───────────────────────────────────────── */
  const markRead    = useCallback((id) =>
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a))), []);

  const markAllRead = useCallback(() =>
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true }))), []);

  const clearAll    = useCallback(() => setAlerts([]), []);

  /**
   * seedAlerts — used by useAlertHistory to prepend server-side
   * history without overwriting live alerts already in state.
   */
  const seedAlerts = useCallback((historical) => {
    setAlerts((prev) => {
      const existingIds = new Set(prev.map((a) => String(a.id)));
      const fresh = historical.filter((h) => !existingIds.has(String(h.id)));
      // Append historical (older) after current live alerts
      return [...prev, ...fresh].slice(0, 200);
    });
  }, []);

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <AlertContext.Provider value={{
      alerts, liveAlert, unreadCount, wsStatus,
      markRead, markAllRead, clearAll, seedAlerts,
    }}>
      {children}
    </AlertContext.Provider>
  );
}

export const useAlerts = () => useContext(AlertContext);