import { useAuth } from "../contexts/AuthContext";
import useProfile from "../hooks/useProfile";
import { Input, Card, Divider, PageHeader, Toggle, ErrorBar, Button } from "../components/Ui";

export default function SettingsView() {
  const { user, logout } = useAuth();
  const { form, setField, save, saving, saved, error } = useProfile();

  return (
    <div>
      <PageHeader title="Settings" subtitle="Profile and notification preferences" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl">

        {/* ── Profile ── */}
        <Card className="p-6">
          <h2 className="font-display text-lg font-semibold text-[#e8edf5] mb-5">Profile</h2>
          <div className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={setField("name")}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={setField("email")}
            />
            <Input
              label="Phone (SMS alerts)"
              type="tel"
              placeholder="+1 555 000 0000"
              value={form.phone}
              onChange={setField("phone")}
            />
          </div>

          <ErrorBar message={error} />

          <div className="mt-5 flex items-center gap-3">
            <Button
              onClick={save}
              disabled={saving}
              variant="primary"
              size="sm"
            >
              {saving ? "Saving..." : saved ? "✓ Saved" : "Save Changes"}
            </Button>
            {saved && (
              <span className="text-[12px] text-[#00e676] font-mono-vg tracking-widest">
                Profile updated
              </span>
            )}
          </div>
        </Card>

        {/* ── Right column ── */}
        <div className="space-y-5">

          {/* Notifications */}
          <Card className="p-6">
            <h2 className="font-display text-lg font-semibold text-[#e8edf5] mb-5">Notifications</h2>
            <div className="space-y-4">
              <Toggle
                label="SMS Alerts (Twilio)"
                sub="Text message on every detection"
                checked={form.sms_alerts}
                onChange={setField("sms_alerts")}
              />
              <Divider />
              <Toggle
                label="Email Alerts (Gmail)"
                sub="Email with clip attachment on detection"
                checked={form.email_alerts}
                onChange={setField("email_alerts")}
              />
              <Divider />

              {/* Confidence threshold */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="font-mono-vg text-[11px] tracking-[0.12em] uppercase text-[#7a8a9e]">
                    Detection Threshold
                  </label>
                  <span className="font-mono-vg text-[13px] text-[#00d4ff]">
                    {Math.round(form.confidence_threshold * 100)}%
                  </span>
                </div>
                <input
                  type="range" min="0.5" max="0.99" step="0.01"
                  value={form.confidence_threshold}
                  onChange={setField("confidence_threshold")}
                  className="w-full accent-[#00d4ff] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#445566] mt-1.5">
                  <span>Sensitive (50%)</span>
                  <span>Strict (99%)</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Danger zone */}
          <Card className="p-6 bg-[#ff3c5f]/5 border-[#ff3c5f]/20">
            <h2 className="font-display text-lg font-semibold text-[#ff3c5f] mb-1.5">Danger Zone</h2>
            <p className="text-[13px] text-[#7a8a9e] mb-4 leading-relaxed">
              Sign out of all devices and return to the login screen.
            </p>
            <Button variant="danger" size="sm" onClick={logout}>Sign Out</Button>
          </Card>
        </div>
      </div>

      {/* ── Account info ── */}
      <div className="mt-6 max-w-3xl">
        <Card className="p-6">
          <h2 className="font-display text-lg font-semibold text-[#e8edf5] mb-1.5">Account</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            {[
              ["Name",  user?.name  || "—"],
              ["Email", user?.email || "—"],
              ["Phone", user?.phone || "Not set"],
            ].map(([label, val]) => (
              <div key={label}>
                <div className="font-mono-vg text-[10px] uppercase tracking-widest text-[#445566] mb-1">{label}</div>
                <div className="text-[14px] text-[#e8edf5] truncate">{val}</div>
              </div>
            ))}
          </div>

          <Divider className="mb-5" />

          <h3 className="font-display text-base font-semibold text-[#e8edf5] mb-2">API Token</h3>
          <p className="text-[13px] text-[#7a8a9e] mb-3 leading-relaxed">
            Your JWT access token is stored in <code className="text-[#00d4ff] font-mono-vg text-[11px]">localStorage</code> and
            sent as a Bearer token with every request. Tokens expire based on your backend config.
          </p>
          <div
            className="bg-[#080a0f] border border-white/10 rounded px-4 py-3 font-mono-vg text-[11px] text-[#00d4ff] break-all select-all cursor-text leading-relaxed"
            title="Click to select all"
          >
            {localStorage.getItem("vg_token") || "No token found"}
          </div>
        </Card>
      </div>
    </div>
  );
}