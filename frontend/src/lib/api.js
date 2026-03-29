/**
 * Centralized API helper.
 * All fetch calls go through apiFetch so there is
 * one place to handle errors, token injection, and base URL.
 */
export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function apiFetch(path, token, opts = {}) {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts.headers,
    },
  });

  let body;
  try { body = await res.json(); } catch { body = null; }

  if (!res.ok) {
    const msg =
      body?.detail ||
      body?.message ||
      (typeof body === "string" ? body : null) ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return body;
}

// Auth
export const authApi = {
  login:    (email, password)         => apiFetch("/auth/login",    null,  { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (name, email, pw, phone)  => apiFetch("/auth/register", null,  { method: "POST", body: JSON.stringify({ name, email, password: pw, phone }) }),
  me:       (token)                   => apiFetch("/auth/me",        token),
  profile:  (token, data)             => apiFetch("/auth/profile",   token, { method: "PUT", body: JSON.stringify(data) }),
};

// Cameras
export const cameraApi = {
  list:      (token)       => apiFetch("/cameras",      token),
  create:    (token, data) => apiFetch("/cameras",      token, { method: "POST",   body: JSON.stringify(data) }),
  remove:    (token, id)   => apiFetch(`/cameras/${id}`,token, { method: "DELETE" }),
  streamUrl: (id)          => `${BASE_URL}/cameras/${id}/stream`,
};

// Alerts
export const alertApi = {
  list:  (token) => apiFetch("/alerts", token),
  wsUrl: (token) => {
    const ws = BASE_URL.replace(/^http/, "ws");
    return `${ws}/ws/alerts?token=${token}`;
  },
};