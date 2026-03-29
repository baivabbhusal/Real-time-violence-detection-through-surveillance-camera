/**
 * useWebSocket — a resilient WebSocket hook with:
 *   - auto-reconnect (exponential back-off, capped at 30s)
 *   - clean teardown on unmount / token change
 *   - connection status: "connecting" | "open" | "closed"
 */
import { useEffect, useRef, useState, useCallback } from "react";

export default function useWebSocket(url, onMessage) {
  const wsRef        = useRef(null);
  const retryRef     = useRef(null);
  const retryCount   = useRef(0);
  const onMsgRef     = useRef(onMessage);
  const [status, setStatus] = useState("closed");

  // Keep latest callback without re-running effect
  useEffect(() => { onMsgRef.current = onMessage; }, [onMessage]);

  const connect = useCallback(() => {
    if (!url) return;
    setStatus("connecting");

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      retryCount.current = 0;
      setStatus("open");
    };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        onMsgRef.current?.(data);
      } catch {}
    };

    ws.onclose = () => {
      setStatus("closed");
      // Exponential back-off: 1s, 2s, 4s … capped at 30s
      const delay = Math.min(1000 * 2 ** retryCount.current, 30_000);
      retryCount.current += 1;
      retryRef.current = setTimeout(connect, delay);
    };

    ws.onerror = () => ws.close();
  }, [url]);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(retryRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  return status;
}