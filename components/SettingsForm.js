"use client";

import { useState } from "react";

function Toggle({ checked, onChange }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="slider" />
    </label>
  );
}

export default function SettingsForm({ guildId, initial }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/guilds/${guildId}/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      setToast("Settings saved.");
    } catch {
      setToast("Couldn't save — the bot may be offline.");
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  }

  const channelOptions = initial.channels || [];

  return (
    <div>
      <div className="dash-card">
        <h3 style={{ marginBottom: "1rem", color: "#e8e0d8" }}>General</h3>
        <div className="field-group">
          <label>Prefix</label>
          <input
            className="field-input"
            value={form.prefix || ""}
            maxLength={5}
            onChange={(e) => set("prefix")(e.target.value)}
          />
          <span className="hint">Slash commands always work regardless of prefix.</span>
        </div>
        <div className="field-group">
          <label>Moderation Log Channel</label>
          <select
            className="field-input"
            value={form.mod_log_channel || ""}
            onChange={(e) => set("mod_log_channel")(e.target.value || null)}
          >
            <option value="">None</option>
            {channelOptions.map((c) => (
              <option key={c.id} value={c.id}>#{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="dash-card">
        <h3 style={{ marginBottom: ".5rem", color: "#e8e0d8" }}>Welcome & Goodbye</h3>
        <div className="toggle-row">
          <div>
            <div className="toggle-label">Welcome Messages</div>
            <div className="toggle-desc">Greet new members when they join.</div>
          </div>
          <Toggle checked={!!form.welcome_enabled} onChange={set("welcome_enabled")} />
        </div>
        <div className="field-group" style={{ marginTop: "1rem" }}>
          <label>Welcome Channel</label>
          <select
            className="field-input"
            value={form.welcome_channel || ""}
            onChange={(e) => set("welcome_channel")(e.target.value || null)}
          >
            <option value="">None</option>
            {channelOptions.map((c) => (
              <option key={c.id} value={c.id}>#{c.name}</option>
            ))}
          </select>
        </div>
        <div className="field-group">
          <label>Goodbye Channel</label>
          <select
            className="field-input"
            value={form.goodbye_channel || ""}
            onChange={(e) => set("goodbye_channel")(e.target.value || null)}
          >
            <option value="">None</option>
            {channelOptions.map((c) => (
              <option key={c.id} value={c.id}>#{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="dash-card">
        <h3 style={{ marginBottom: ".5rem", color: "#e8e0d8" }}>AutoMod</h3>
        <div className="toggle-row">
          <div>
            <div className="toggle-label">AutoMod</div>
            <div className="toggle-desc">Master switch for all automod protections.</div>
          </div>
          <Toggle checked={!!form.automod_enabled} onChange={set("automod_enabled")} />
        </div>
        <div className="toggle-row">
          <div>
            <div className="toggle-label">Anti-Spam</div>
            <div className="toggle-desc">Mutes members who send messages too quickly.</div>
          </div>
          <Toggle checked={!!form.automod_anti_spam} onChange={set("automod_anti_spam")} />
        </div>
        <div className="toggle-row">
          <div>
            <div className="toggle-label">Anti-Invite</div>
            <div className="toggle-desc">Removes messages containing Discord invite links.</div>
          </div>
          <Toggle checked={!!form.automod_anti_invite} onChange={set("automod_anti_invite")} />
        </div>
        <div className="toggle-row">
          <div>
            <div className="toggle-label">Anti-Links</div>
            <div className="toggle-desc">Removes messages containing external links.</div>
          </div>
          <Toggle checked={!!form.automod_anti_links} onChange={set("automod_anti_links")} />
        </div>
        <div className="toggle-row">
          <div>
            <div className="toggle-label">Caps Filter</div>
            <div className="toggle-desc">Flags messages that are mostly uppercase.</div>
          </div>
          <Toggle checked={!!form.automod_caps_filter} onChange={set("automod_caps_filter")} />
        </div>
      </div>

      <div className="save-bar">
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
              }
