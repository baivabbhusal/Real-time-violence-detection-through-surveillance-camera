/**
 * useCameras — fetches & manages the camera list.
 * Exposed: cameras, loading, error, addCamera, removeCamera, refresh
 */
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { cameraApi } from "../lib/api";

export default function useCameras() {
  const { token } = useAuth();
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await cameraApi.list(token);
      setCameras(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { refresh(); }, [refresh]);

  const addCamera = useCallback(async (formData) => {
    const cam = await cameraApi.create(token, formData);
    setCameras((prev) => [...prev, cam]);
    return cam;
  }, [token]);

  const removeCamera = useCallback(async (id) => {
    await cameraApi.remove(token, id);
    setCameras((prev) => prev.filter((c) => c.id !== id));
  }, [token]);

  return { cameras, loading, error, addCamera, removeCamera, refresh };
}