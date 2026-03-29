import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi, apiFetch, BASE_URL } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(() => localStorage.getItem("vg_token"));
  const [loading, setLoading] = useState(true);

  // Validate stored token on mount
  useEffect(() => {
    if (!token) { setLoading(false); return; }
    authApi.me(token)
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem("vg_token");
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []); // run once on mount only

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    localStorage.setItem("vg_token", data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password, phone) => {
    return authApi.register(name, email, password, phone);
  };

  const logout = () => {
    localStorage.removeItem("vg_token");
    setToken(null);
    setUser(null);
  };

  // Convenience wrapper used by views that still call authFetch directly
  const authFetch = useCallback(
    (url, opts = {}) =>
      fetch(url, {
        ...opts,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...opts.headers,
        },
      }),
    [token]
  );

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, authFetch, API: BASE_URL }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);