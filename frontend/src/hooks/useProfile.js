/**
 * useProfile — loads and saves the current user's profile
 * and notification preferences.
 */
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { authApi } from "../lib/api";

export default function useProfile() {
  const { user, token } = useAuth();

  const [form, setForm] = useState({
    name:                 user?.name  || "",
    email:                user?.email || "",
    phone:                user?.phone || "",
    sms_alerts:           user?.sms_alerts           ?? true,
    email_alerts:         user?.email_alerts          ?? true,
    confidence_threshold: user?.confidence_threshold  ?? 0.75,
  });

  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState(null);

  // Re-sync if user object changes (e.g. after token refresh)
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name:                 user.name  || prev.name,
        email:                user.email || prev.email,
        phone:                user.phone || prev.phone,
        sms_alerts:           user.sms_alerts           ?? prev.sms_alerts,
        email_alerts:         user.email_alerts          ?? prev.email_alerts,
        confidence_threshold: user.confidence_threshold  ?? prev.confidence_threshold,
      }));
    }
  }, [user]);

  const setField = (key) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: val }));
    setSaved(false);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await authApi.profile(token, form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return { form, setField, save, saving, saved, error };
}