/**
 * useAlertHistory — fetches persisted alert history from
 * GET /alerts on mount, then merges with live WebSocket alerts.
 * The AlertContext only holds in-memory (session) alerts;
 * this hook seeds it with the server-side history.
 */
import { useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { alertApi } from "../lib/api";

/**
 * Call this once inside AlertsView (or wherever you want
 * server history pre-loaded). It calls `seedAlerts` (passed in)
 * so it can prepend historical records without duplicating
 * live ones already in state.
 */
export default function useAlertHistory(seedAlerts) {
  const { token } = useAuth();
  const seeded = useRef(false);

  useEffect(() => {
    if (!token || seeded.current) return;
    seeded.current = true;

    alertApi.list(token)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Normalise server records to match in-memory shape
          const historical = data.map((a) => ({
            id:          a.id ?? `hist-${a.timestamp}`,
            camera_id:   a.camera_id,
            camera_name: a.camera_name,
            confidence:  a.confidence,
            clip_url:    a.clip_url ?? null,
            thumbnail:   a.thumbnail ?? null,
            timestamp:   a.timestamp,
            read:        true, // historical alerts start as read
          }));
          seedAlerts(historical);
        }
      })
      .catch(() => {
        // Silently fail — live alerts still work via WebSocket
      });
  }, [token, seedAlerts]);
}