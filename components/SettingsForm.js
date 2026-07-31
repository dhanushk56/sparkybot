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
  const [expanded, setExpanded] = useState({
    general: true,
    welcome: false,
    automod: false,
    logging: false,
    verification: false,
    tickets: false,
    music: false,
    leveling: false,
    counting: false,
    jtc: false,
    antinuke: false,
    invite: false,
    reports: false,
    forumlock: false,
    autotranslate: false,
  });

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const setNested = (parent, key) => (value) =>
    setForm((f) => ({
      ...f,
      [parent]: { ...f[parent], [key]: value },
    }));

  const toggleSection = (section) =>
    setExpanded((e) => ({ ...e, [section]: !e[section] }));

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/guilds/${guildId}/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      setToast("✅ Settings saved.");
    } catch {
      setToast("❌ Couldn't save — the bot may be offline.");
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  }

  const channelOptions = initial.channels || [];
  const roleOptions = initial.roles || [];

  const ChannelSelect = ({ value, onChange, label, allowNone = true }) => (
    <select className="field-input" value={value || ""} onChange={(e) => onChange(e.target.value || null)}>
      {allowNone && <option value="">None</option>}
      {channelOptions.map((c) => (
        <option key={c.id} value={c.id}>#{c.name}</option>
      ))}
    </select>
  );

  const RoleMultiSelect = ({ value, onChange }) => {
    const ids = value || [];
    return (
      <select
        className="field-input"
        multiple
        value={ids.map(String)}
        onChange={(e) => {
          const selected = Array.from(e.target.selectedOptions, (opt) => Number(opt.value));
          onChange(selected);
        }}
        style={{ height: "auto", minHeight: "60px" }}
      >
        {roleOptions.map((r) => (
          <option key={r.id} value={r.id}>@{r.name}</option>
        ))}
      </select>
    );
  };

  const SectionHeader = ({ title, section }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
        padding: "0.5rem 0",
        borderBottom: "1px solid #2b2d31",
        marginBottom: "1rem",
      }}
      onClick={() => toggleSection(section)}
    >
      <h3 style={{ margin: 0, color: "#e8e0d8" }}>{title}</h3>
      <span style={{ color: "#b5b5b5", fontSize: "1.2rem" }}>
        {expanded[section] ? "▲" : "▼"}
      </span>
    </div>
  );

  const Card = ({ children }) => (
    <div className="dash-card" style={{ marginBottom: "1.5rem" }}>
      {children}
    </div>
  );

  const automod = form.automod || {};
  const logging = form.logging || {};
  const ticketCustomization = form.ticket_customization || {};
  const levelUpConfig = form.level_up_config || {};
  const counting = form.counting || { emojis: {} };
  const jtc = form.jtc || {};
  const antinuke = form.antinuke || {};
  const eventConfig = antinuke.event_config || {};
  const autotranslate = form.autotranslate || {};

  return (
    <div>
      {/* GENERAL */}
      <Card>
        <SectionHeader title="⚙️ General Settings" section="general" />
        {expanded.general && (
          <>
            <div className="field-group">
              <label>Prefix</label>
              <input
                className="field-input"
                value={form.prefix || ""}
                maxLength={5}
                onChange={(e) => set("prefix")(e.target.value)}
              />
              <span className="hint">Slash commands always work.</span>
            </div>
            <div className="field-group">
              <label>Moderation Log Channel</label>
              <ChannelSelect
                value={form.mod_log_channel}
                onChange={set("mod_log_channel")}
              />
            </div>
            <div className="field-group">
              <label>Support Hours Start (UTC)</label>
              <input
                className="field-input"
                value={form.support_start || ""}
                placeholder="14:00"
                onChange={(e) => set("support_start")(e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Support Hours End (UTC)</label>
              <input
                className="field-input"
                value={form.support_end || ""}
                placeholder="01:00"
                onChange={(e) => set("support_end")(e.target.value)}
              />
            </div>
          </>
        )}
      </Card>

      {/* WELCOME & GOODBYE */}
      <Card>
        <SectionHeader title="👋 Welcome & Goodbye" section="welcome" />
        {expanded.welcome && (
          <>
            <div className="toggle-row">
              <div>
                <div className="toggle-label">Welcome Messages</div>
                <div className="toggle-desc">Greet new members when they join.</div>
              </div>
              <Toggle checked={!!form.welcome_enabled} onChange={set("welcome_enabled")} />
            </div>
            <div className="field-group">
              <label>Welcome Channel</label>
              <ChannelSelect value={form.welcome_channel} onChange={set("welcome_channel")} />
            </div>
            <div className="field-group">
              <label>Goodbye Channel</label>
              <ChannelSelect value={form.goodbye_channel} onChange={set("goodbye_channel")} />
            </div>
            <div className="toggle-row">
              <div>
                <div className="toggle-label">Welcome Embed</div>
                <div className="toggle-desc">Send welcome as an embed.</div>
              </div>
              <Toggle checked={!!form.welcome_embed} onChange={set("welcome_embed")} />
            </div>
            <div className="field-group">
              <label>Welcome DM (optional)</label>
              <textarea
                className="field-input"
                rows="2"
                value={form.welcome_dm || ""}
                placeholder="Welcome to {servername}, {user}!"
                onChange={(e) => set("welcome_dm")(e.target.value || null)}
              />
            </div>
            <div className="field-group">
              <label>Auto-Roles</label>
              <RoleMultiSelect value={form.autoroles || []} onChange={set("autoroles")} />
            </div>
            <div className="field-group">
              <label>Welcome Embed Title</label>
              <input
                className="field-input"
                value={form.welcome_embed_title || ""}
                placeholder="Welcome to {servername}!"
                onChange={(e) => set("welcome_embed_title")(e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Welcome Embed Description</label>
              <textarea
                className="field-input"
                rows="3"
                value={form.welcome_embed_description || ""}
                placeholder="👋 Welcome {user}..."
                onChange={(e) => set("welcome_embed_description")(e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Welcome Embed Footer</label>
              <input
                className="field-input"
                value={form.welcome_embed_footer || ""}
                placeholder="ID: {id} • {servername}"
                onChange={(e) => set("welcome_embed_footer")(e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Welcome Outside Text</label>
              <input
                className="field-input"
                value={form.welcome_outside_content || ""}
                placeholder="{user}"
                onChange={(e) => set("welcome_outside_content")(e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Goodbye Embed Description</label>
              <textarea
                className="field-input"
                rows="2"
                value={form.goodbye_embed_description || ""}
                placeholder="👋 Goodbye {username}!"
                onChange={(e) => set("goodbye_embed_description")(e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Goodbye Embed Footer</label>
              <input
                className="field-input"
                value={form.goodbye_embed_footer || ""}
                placeholder="ID: {id}"
                onChange={(e) => set("goodbye_embed_footer")(e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Goodbye Outside Text</label>
              <input
                className="field-input"
                value={form.goodbye_outside_content || ""}
                placeholder=""
                onChange={(e) => set("goodbye_outside_content")(e.target.value)}
              />
            </div>
          </>
        )}
      </Card>

      {/* AUTOMOD */}
      <Card>
        <SectionHeader title="🛡️ AutoMod" section="automod" />
        {expanded.automod && (
          <>
            <div className="toggle-row">
              <div>
                <div className="toggle-label">AutoMod</div>
                <div className="toggle-desc">Master switch for all automod protections.</div>
              </div>
              <Toggle checked={!!automod.enabled} onChange={setNested("automod", "enabled")} />
            </div>
            <div className="toggle-row">
              <div>
                <div className="toggle-label">Anti-Spam</div>
                <div className="toggle-desc">Mutes members who send messages too quickly.</div>
              </div>
              <Toggle checked={!!automod.anti_spam} onChange={setNested("automod", "anti_spam")} />
            </div>
            <div className="toggle-row">
              <div>
                <div className="toggle-label">Anti-Invite</div>
                <div className="toggle-desc">Removes messages containing Discord invite links.</div>
              </div>
              <Toggle checked={!!automod.anti_invite} onChange={setNested("automod", "anti_invite")} />
            </div>
            <div className="toggle-row">
              <div>
                <div className="toggle-label">Anti-Links</div>
                <div className="toggle-desc">Removes messages containing external links.</div>
              </div>
              <Toggle checked={!!automod.anti_links} onChange={setNested("automod", "anti_links")} />
            </div>
            <div className="toggle-row">
              <div>
                <div className="toggle-label">Caps Filter</div>
                <div className="toggle-desc">Flags messages that are mostly uppercase.</div>
              </div>
              <Toggle checked={!!automod.caps_filter} onChange={setNested("automod", "caps_filter")} />
            </div>
            <div className="field-group">
              <label>Mention Limit</label>
              <input
                className="field-input"
                type="number"
                min="0"
                value={automod.mention_limit || 5}
                onChange={(e) => setNested("automod", "mention_limit")(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="field-group">
              <label>Bad Words (comma separated)</label>
              <input
                className="field-input"
                value={(automod.bad_words || []).join(", ")}
                placeholder="word1, word2"
                onChange={(e) =>
                  setNested("automod", "bad_words")(
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
              />
            </div>
            <div className="field-group">
              <label>AutoMod Log Channel</label>
              <ChannelSelect value={automod.log_channel} onChange={setNested("automod", "log_channel")} />
            </div>
            <div className="field-group">
              <label>Ignored Channels</label>
              <select
                className="field-input"
                multiple
                value={(automod.ignored_channels || []).map(String)}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, (opt) => Number(opt.value));
                  setNested("automod", "ignored_channels")(selected);
                }}
                style={{ height: "auto", minHeight: "60px" }}
              >
                {channelOptions.map((c) => (
                  <option key={c.id} value={c.id}>#{c.name}</option>
                ))}
              </select>
            </div>
            <div className="field-group">
              <label>Ignored Roles</label>
              <RoleMultiSelect value={automod.ignored_roles || []} onChange={setNested("automod", "ignored_roles")} />
            </div>
          </>
        )}
      </Card>

      {/* LOGGING */}
      <Card>
        <SectionHeader title="📜 Logging" section="logging" />
        {expanded.logging && (
          <>
            <div className="toggle-row">
              <div>
                <div className="toggle-label">Enable Logging</div>
                <div className="toggle-desc">Log server events to a channel.</div>
              </div>
              <Toggle checked={!!logging.enabled} onChange={setNested("logging", "enabled")} />
            </div>
            <div className="field-group">
              <label>Log Channel</label>
              <ChannelSelect value={logging.channel} onChange={setNested("logging", "channel")} />
            </div>
            <div style={{ marginTop: "1rem" }}>
              <label style={{ display: "block", marginBottom: ".5rem" }}>Events to Log</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem" }}>
                {[
                  "message_delete",
                  "message_edit",
                  "member_join",
                  "member_leave",
                  "member_ban",
                  "member_unban",
                  "role_create",
                  "role_delete",
                  "role_update",
                  "channel_create",
                  "channel_delete",
                  "channel_update",
                  "voice_join",
                  "voice_leave",
                  "voice_move",
                  "nickname_change",
                  "member_role_update",
                  "invite_create",
                  "invite_delete",
                ].map((ev) => (
                  <div key={ev} className="toggle-row" style={{ padding: ".25rem 0" }}>
                    <div>
                      <div className="toggle-label" style={{ fontSize: ".85rem" }}>
                        {ev.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </div>
                    </div>
                    <Toggle
                      checked={!!logging[ev]}
                      onChange={setNested("logging", ev)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </Card>

      {/* VERIFICATION */}
      <Card>
        <SectionHeader title="🔐 Verification" section="verification" />
        {expanded.verification && (
          <>
            <div className="field-group">
              <label>Verified Role</label>
              <select
                className="field-input"
                value={form.verification_role_id || ""}
                onChange={(e) => set("verification_role_id")(e.target.value || null)}
              >
                <option value="">None</option>
                {roleOptions.map((r) => (
                  <option key={r.id} value={r.id}>@{r.name}</option>
                ))}
              </select>
            </div>
            <div className="field-group">
              <label>Verification Log Channel</label>
              <ChannelSelect value={form.verification_log_channel} onChange={set("verification_log_channel")} />
            </div>
            <div className="field-group">
              <label>Verification Category</label>
              <input
                className="field-input"
                value={form.verification_category || "Verification"}
                placeholder="Verification"
                onChange={(e) => set("verification_category")(e.target.value)}
              />
            </div>
          </>
        )}
      </Card>

      {/* TICKETS */}
      <Card>
        <SectionHeader title="🎟️ Tickets" section="tickets" />
        {expanded.tickets && (
          <>
            <div className="field-group">
              <label>Ticket Category Name</label>
              <input
                className="field-input"
                value={form.ticket_category || "Tickets"}
                placeholder="Tickets"
                onChange={(e) => set("ticket_category")(e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Ticket Log Channel</label>
              <ChannelSelect value={form.ticket_log_channel} onChange={set("ticket_log_channel")} />
            </div>
            <div className="field-group">
              <label>Staff Roles (global)</label>
              <RoleMultiSelect value={form.ticket_staff_roles || []} onChange={set("ticket_staff_roles")} />
            </div>
            <div className="field-group">
              <label>Customization</label>
              <input
                className="field-input"
                value={ticketCustomization.embed_title || ""}
                placeholder="Embed Title"
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    ticket_customization: { ...f.ticket_customization, embed_title: e.target.value },
                  }))
                }
              />
              <textarea
                className="field-input"
                rows="2"
                value={ticketCustomization.embed_description || ""}
                placeholder="Embed Description"
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    ticket_customization: { ...f.ticket_customization, embed_description: e.target.value },
                  }))
                }
              />
              <input
                className="field-input"
                value={ticketCustomization.embed_color || "#5865F2"}
                placeholder="Embed Color (hex)"
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    ticket_customization: { ...f.ticket_customization, embed_color: e.target.value },
                  }))
                }
              />
              <textarea
                className="field-input"
                rows="2"
                value={ticketCustomization.embed_footer || ""}
                placeholder="Footer notes"
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    ticket_customization: { ...f.ticket_customization, embed_footer: e.target.value },
                  }))
                }
              />
              <input
                className="field-input"
                value={ticketCustomization.footer_text || ""}
                placeholder="Footer text"
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    ticket_customization: { ...f.ticket_customization, footer_text: e.target.value },
                  }))
                }
              />
              <input
                className="field-input"
                value={ticketCustomization.important_notes_heading || "📝 Important Notes"}
                placeholder="Notes heading"
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    ticket_customization: { ...f.ticket_customization, important_notes_heading: e.target.value },
                  }))
                }
              />
              <div className="toggle-row">
                <div>
                  <div className="toggle-label">Enable Ratings</div>
                  <div className="toggle-desc">Let users rate tickets after closing.</div>
                </div>
                <Toggle
                  checked={!!ticketCustomization.enable_ratings}
                  onChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      ticket_customization: { ...f.ticket_customization, enable_ratings: v },
                    }))
                  }
                />
              </div>
              <div className="toggle-row">
                <div>
                  <div className="toggle-label">Enable History</div>
                  <div className="toggle-desc">Users can view their ticket history.</div>
                </div>
                <Toggle
                  checked={!!ticketCustomization.enable_history}
                  onChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      ticket_customization: { ...f.ticket_customization, enable_history: v },
                    }))
                  }
                />
              </div>
              <div className="toggle-row">
                <div>
                  <div className="toggle-label">Enable Auto-Close</div>
                  <div className="toggle-desc">Automatically close inactive tickets.</div>
                </div>
                <Toggle
                  checked={!!ticketCustomization.enable_auto_close}
                  onChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      ticket_customization: { ...f.ticket_customization, enable_auto_close: v },
                    }))
                  }
                />
              </div>
              <div className="field-group">
                <label>Default Auto-Close Hours</label>
                <input
                  className="field-input"
                  type="number"
                  min="1"
                  value={ticketCustomization.default_auto_close_hours || 24}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      ticket_customization: {
                        ...f.ticket_customization,
                        default_auto_close_hours: parseInt(e.target.value) || 24,
                      },
                    }))
                  }
                />
              </div>
              <div className="field-group">
                <label>Reviews Channel</label>
                <ChannelSelect
                  value={ticketCustomization.reviews_channel}
                  onChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      ticket_customization: { ...f.ticket_customization, reviews_channel: v },
                    }))
                  }
                />
              </div>
              <div className="toggle-row">
                <div>
                  <div className="toggle-label">Show Available Categories</div>
                  <div className="toggle-desc">Display category list in ticket embed.</div>
                </div>
                <Toggle
                  checked={!!ticketCustomization.show_available_categories}
                  onChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      ticket_customization: { ...f.ticket_customization, show_available_categories: v },
                    }))
                  }
                />
              </div>
            </div>
          </>
        )}
      </Card>

      {/* MUSIC */}
      <Card>
        <SectionHeader title="🎵 Music" section="music" />
        {expanded.music && (
          <>
            <div className="field-group">
              <label>Designated Music Voice Channel</label>
              <ChannelSelect
                value={form.music_vc_channel_id}
                onChange={set("music_vc_channel_id")}
                allowNone={true}
              />
            </div>
            <div className="toggle-row">
              <div>
                <div className="toggle-label">Drag Users to VC</div>
                <div className="toggle-desc">Automatically move users to the music VC.</div>
              </div>
              <Toggle
                checked={!!form.music_vc_drag_users}
                onChange={set("music_vc_drag_users")}
              />
            </div>
            <div className="field-group">
              <label>Default Volume (1-200)</label>
              <input
                className="field-input"
                type="number"
                min="1"
                max="200"
                value={form.music_volume || 100}
                onChange={(e) => set("music_volume")(parseInt(e.target.value) || 100)}
              />
            </div>
            <div className="field-group">
              <label>Default Loop Mode</label>
              <select
                className="field-input"
                value={form.music_loop_mode || "off"}
                onChange={(e) => set("music_loop_mode")(e.target.value)}
              >
                <option value="off">Off</option>
                <option value="track">Track</option>
                <option value="queue">Queue</option>
              </select>
            </div>
            <div className="toggle-row">
              <div>
                <div className="toggle-label">VC Status Updates</div>
                <div className="toggle-desc">Show current song in voice channel status.</div>
              </div>
              <Toggle
                checked={!!form.music_status_enabled}
                onChange={set("music_status_enabled")}
              />
            </div>
          </>
        )}
      </Card>

      {/* LEVELING */}
      <Card>
        <SectionHeader title="⭐ Leveling" section="leveling" />
        {expanded.leveling && (
          <>
            <div className="toggle-row">
              <div>
                <div className="toggle-label">Enable Leveling</div>
                <div className="toggle-desc">Track XP and levels for members.</div>
              </div>
              <Toggle checked={!!form.leveling_enabled} onChange={set("leveling_enabled")} />
            </div>
            <div className="field-group">
              <label>Level-Up Channel</label>
              <ChannelSelect value={form.level_channel} onChange={set("level_channel")} />
            </div>
            <div className="field-group">
              <label>XP Blacklisted Channels</label>
              <select
                className="field-input"
                multiple
                value={(form.xp_blacklist || []).map(String)}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, (opt) => Number(opt.value));
                  set("xp_blacklist")(selected);
                }}
                style={{ height: "auto", minHeight: "60px" }}
              >
                {channelOptions.map((c) => (
                  <option key={c.id} value={c.id}>#{c.name}</option>
                ))}
              </select>
            </div>
            <div className="field-group">
              <label>XP Blacklisted Roles</label>
              <RoleMultiSelect value={form.xp_role_blacklist || []} onChange={set("xp_role_blacklist")} />
            </div>
            <div className="field-group">
              <label>Level Roles (format: level:role_id)</label>
              <textarea
                className="field-input"
                rows="2"
                value={Object.entries(form.level_roles || {})
                  .map(([lvl, rid]) => `${lvl}:${rid}`)
                  .join("\n")}
                placeholder="10:123456789\n20:987654321"
                onChange={(e) => {
                  const obj = {};
                  e.target.value.split("\n").forEach((line) => {
                    const [lvl, rid] = line.split(":");
                    if (lvl && rid) obj[lvl.trim()] = parseInt(rid.trim());
                  });
                  set("level_roles")(obj);
                }}
              />
            </div>
            <div className="field-group">
              <label>Level-Up Outside Text</label>
              <input
                className="field-input"
                value={levelUpConfig.outside_text || "{user}"}
                placeholder="{user}"
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    level_up_config: { ...f.level_up_config, outside_text: e.target.value },
                  }))
                }
              />
            </div>
            <div className="field-group">
              <label>Level-Up Embed Title</label>
              <input
                className="field-input"
                value={levelUpConfig.embed_title || "⬆️ Level Up!"}
                placeholder="⬆️ Level Up!"
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    level_up_config: { ...f.level_up_config, embed_title: e.target.value },
                  }))
                }
              />
            </div>
            <div className="field-group">
              <label>Level-Up Embed Description</label>
              <textarea
                className="field-input"
                rows="2"
                value={levelUpConfig.embed_description || "🎉 {user} reached **Level {level}**!"}
                placeholder="🎉 {user} reached **Level {level}**!"
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    level_up_config: { ...f.level_up_config, embed_description: e.target.value },
                  }))
                }
              />
            </div>
            <div className="field-group">
              <label>Level-Up Embed Footer</label>
              <input
                className="field-input"
                value={levelUpConfig.embed_footer || ""}
                placeholder="Footer text"
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    level_up_config: { ...f.level_up_config, embed_footer: e.target.value },
                  }))
                }
              />
            </div>
            <div className="field-group">
              <label>Level-Up Embed Color (hex)</label>
              <input
                className="field-input"
                value={levelUpConfig.embed_color || "#FFD700"}
                placeholder="#FFD700"
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    level_up_config: { ...f.level_up_config, embed_color: e.target.value },
                  }))
                }
              />
            </div>
            <div className="field-group">
              <label>Display Mode</label>
              <select
                className="field-input"
                value={levelUpConfig.display_mode || "both"}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    level_up_config: { ...f.level_up_config, display_mode: e.target.value },
                  }))
                }
              >
                <option value="embed">Embed Only</option>
                <option value="plain">Plain Text Only</option>
                <option value="both">Both</option>
              </select>
            </div>
          </>
        )}
      </Card>

      {/* COUNTING */}
      <Card>
        <SectionHeader title="🔢 Counting" section="counting" />
        {expanded.counting && (
          <>
            <div className="field-group">
              <label>Counting Channel</label>
              <ChannelSelect value={counting.channel} onChange={setNested("counting", "channel")} />
            </div>
            <div className="toggle-row">
              <div>
                <div className="toggle-label">Allow Same User Twice</div>
                <div className="toggle-desc">Allow the same member to count twice in a row.</div>
              </div>
              <Toggle
                checked={!!counting.allow_same_user}
                onChange={setNested("counting", "allow_same_user")}
              />
            </div>
            <div className="toggle-row">
              <div>
                <div className="toggle-label">Reset on Fail</div>
                <div className="toggle-desc">Reset count back to 0 (or checkpoint) when someone fails.</div>
              </div>
              <Toggle
                checked={!!counting.reset_on_fail}
                onChange={setNested("counting", "reset_on_fail")}
              />
            </div>
            <div className="field-group">
              <label>Cooldown (seconds)</label>
              <input
                className="field-input"
                type="number"
                min="0"
                value={counting.cooldown || 2}
                onChange={(e) => setNested("counting", "cooldown")(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="field-group">
              <label>Save Limit (-1 = unlimited, 0 = disabled)</label>
              <input
                className="field-input"
                type="number"
                min="-1"
                value={counting.save_limit !== undefined ? counting.save_limit : 3}
                onChange={(e) => setNested("counting", "save_limit")(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="field-group">
              <label>Save Cooldown (seconds)</label>
              <input
                className="field-input"
                type="number"
                min="0"
                value={counting.save_cooldown || 3}
                onChange={(e) => setNested("counting", "save_cooldown")(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="field-group">
              <label>Milestones (comma separated)</label>
              <input
                className="field-input"
                value={(counting.milestones || [100, 250, 500, 1000, 2500, 5000, 10000]).join(", ")}
                placeholder="100, 250, 500"
                onChange={(e) =>
                  setNested("counting", "milestones")(
                    e.target.value.split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n))
                  )
                }
              />
            </div>
            <div style={{ marginTop: "1rem" }}>
              <label style={{ display: "block", marginBottom: ".5rem" }}>Emojis</label>
              {["correct", "wrong", "milestone", "high_score", "save"].map((key) => (
                <div key={key} className="field-group" style={{ marginBottom: ".5rem" }}>
                  <label style={{ textTransform: "capitalize" }}>{key.replace("_", " ")}</label>
                  <input
                    className="field-input"
                    value={counting.emojis?.[key] || "✅"}
                    placeholder={key === "correct" ? "✅" : key === "wrong" ? "❌" : ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        counting: {
                          ...f.counting,
                          emojis: { ...f.counting?.emojis, [key]: e.target.value },
                        },
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* JTC */}
      <Card>
        <SectionHeader title="🔊 JTC (Join-to-Create)" section="jtc" />
        {expanded.jtc && (
          <>
            <div className="field-group">
              <label>Trigger Voice Channel</label>
              <ChannelSelect value={jtc.jtc_channel} onChange={setNested("jtc", "jtc_channel")} />
            </div>
            <div className="field-group">
              <label>Control Panel Channel</label>
              <ChannelSelect value={jtc.control_panel_channel} onChange={setNested("jtc", "control_panel_channel")} />
            </div>
            <div className="field-group">
              <label>Name Template</label>
              <input
                className="field-input"
                value={jtc.name_template || "{username}'s Channel"}
                placeholder="{username}'s Channel"
                onChange={(e) => setNested("jtc", "name_template")(e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Default User Limit (0 = unlimited)</label>
              <input
                className="field-input"
                type="number"
                min="0"
                value={jtc.user_limit || 0}
                onChange={(e) => setNested("jtc", "user_limit")(parseInt(e.target.value) || 0)}
              />
            </div>
          </>
        )}
      </Card>

      {/* ANTI-NUKE */}
      <Card>
        <SectionHeader title="🧨 Anti-Nuke" section="antinuke" />
        {expanded.antinuke && (
          <>
            <div className="toggle-row">
              <div>
                <div className="toggle-label">Anti-Nuke</div>
                <div className="toggle-desc">Protect your server from destructive actions.</div>
              </div>
              <Toggle checked={!!antinuke.enabled} onChange={setNested("antinuke", "enabled")} />
            </div>
            <div className="field-group">
              <label>Default Punishment</label>
              <select
                className="field-input"
                value={antinuke.punishment || "timeout"}
                onChange={(e) => setNested("antinuke", "punishment")(e.target.value)}
              >
                <option value="warn">Warn</option>
                <option value="timeout">Timeout</option>
                <option value="strip_roles">Strip Roles</option>
                <option value="kick">Kick</option>
                <option value="softban">Softban</option>
                <option value="ban">Ban</option>
              </select>
            </div>
            <div className="field-group">
              <label>Duration (minutes, for timeout)</label>
              <input
                className="field-input"
                type="number"
                min="1"
                value={antinuke.duration || 60}
                onChange={(e) => setNested("antinuke", "duration")(parseInt(e.target.value) || 60)}
              />
            </div>
            <div className="field-group">
              <label>Log Channel</label>
              <ChannelSelect value={antinuke.log_channel} onChange={setNested("antinuke", "log_channel")} />
            </div>
            <div className="field-group">
              <label>Global User Whitelist</label>
              <input
                className="field-input"
                value={(antinuke.global_whitelist || []).join(", ")}
                placeholder="User IDs (comma separated)"
                onChange={(e) =>
                  setNested("antinuke", "global_whitelist")(
                    e.target.value.split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n))
                  )
                }
              />
            </div>
            <div className="field-group">
              <label>Global Role Whitelist</label>
              <RoleMultiSelect value={antinuke.global_whitelist_roles || []} onChange={setNested("antinuke", "global_whitelist_roles")} />
            </div>
            <div className="field-group">
              <label>Forbidden Channels</label>
              <select
                className="field-input"
                multiple
                value={(antinuke.forbidden_channels || []).map(String)}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, (opt) => Number(opt.value));
                  setNested("antinuke", "forbidden_channels")(selected);
                }}
                style={{ height: "auto", minHeight: "60px" }}
              >
                {channelOptions.map((c) => (
                  <option key={c.id} value={c.id}>#{c.name}</option>
                ))}
              </select>
            </div>
            <div className="field-group">
              <label>Forbidden Categories</label>
              <select
                className="field-input"
                multiple
                value={(antinuke.forbidden_categories || []).map(String)}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, (opt) => Number(opt.value));
                  setNested("antinuke", "forbidden_categories")(selected);
                }}
                style={{ height: "auto", minHeight: "60px" }}
              >
                {initial.categories?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                )) || []}
              </select>
            </div>
            <div style={{ marginTop: "1rem" }}>
              <label style={{ display: "block", marginBottom: ".5rem" }}>Event Configurations</label>
              {Object.keys(eventConfig).length === 0 && <p style={{ color: "#aaa" }}>No events configured yet.</p>}
              {Object.entries(eventConfig).map(([event, cfg]) => (
                <div key={event} style={{ borderBottom: "1px solid #2b2d31", padding: "0.5rem 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                    <span style={{ minWidth: "150px", fontWeight: "bold" }}>
                      {event.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                    <Toggle
                      checked={!!cfg.enabled}
                      onChange={(v) =>
                        setForm((f) => ({
                          ...f,
                          antinuke: {
                            ...f.antinuke,
                            event_config: {
                              ...f.antinuke?.event_config,
                              [event]: { ...f.antinuke?.event_config?.[event], enabled: v },
                            },
                          },
                        }))
                      }
                    />
                    <label style={{ fontSize: "0.9rem" }}>Threshold:</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      style={{ width: "60px" }}
                      value={cfg.custom_threshold || cfg.default_threshold || 3}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          antinuke: {
                            ...f.antinuke,
                            event_config: {
                              ...f.antinuke?.event_config,
                              [event]: {
                                ...f.antinuke?.event_config?.[event],
                                custom_threshold: parseInt(e.target.value) || 1,
                              },
                            },
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* INVITE TRACKING */}
      <Card>
        <SectionHeader title="📨 Invite Tracking" section="invite" />
        {expanded.invite && (
          <div className="field-group">
            <label>Invite Log Channel</label>
            <ChannelSelect value={form.invite_log_channel} onChange={set("invite_log_channel")} />
          </div>
        )}
      </Card>

      {/* REPORTS */}
      <Card>
        <SectionHeader title="🚩 Reports & Suggestions" section="reports" />
        {expanded.reports && (
          <>
            <div className="field-group">
              <label>Report Channel</label>
              <ChannelSelect value={form.report_channel} onChange={set("report_channel")} />
            </div>
            <div className="field-group">
              <label>Suggestion Channel</label>
              <ChannelSelect value={form.suggestion_channel} onChange={set("suggestion_channel")} />
            </div>
            <div className="field-group">
              <label>Bug Report Channel</label>
              <ChannelSelect value={form.bug_report_channel} onChange={set("bug_report_channel")} />
            </div>
          </>
        )}
      </Card>

      {/* FORUM LOCK */}
      <Card>
        <SectionHeader title="🔒 Forum Lock" section="forumlock" />
        {expanded.forumlock && (
          <div className="field-group">
            <label>Forum Lock Log Channel</label>
            <ChannelSelect value={form.forum_lock_log_channel} onChange={set("forum_lock_log_channel")} />
          </div>
        )}
      </Card>

      {/* AUTO-TRANSLATE */}
      <Card>
        <SectionHeader title="🌐 Auto-Translate" section="autotranslate" />
        {expanded.autotranslate && (
          <>
            <div className="toggle-row">
              <div>
                <div className="toggle-label">Auto-Translate</div>
                <div className="toggle-desc">Automatically translate messages to a default language.</div>
              </div>
              <Toggle checked={!!autotranslate.enabled} onChange={setNested("autotranslate", "enabled")} />
            </div>
            <div className="field-group">
              <label>Default Language</label>
              <select
                className="field-input"
                value={autotranslate.default_language || "en"}
                onChange={(e) => setNested("autotranslate", "default_language")(e.target.value)}
              >
                <option value="af">Afrikaans</option>
                <option value="sq">Albanian</option>
                <option value="ar">Arabic</option>
                <option value="hy">Armenian</option>
                <option value="az">Azerbaijani</option>
                <option value="eu">Basque</option>
                <option value="be">Belarusian</option>
                <option value="bn">Bengali</option>
                <option value="bs">Bosnian</option>
                <option value="bg">Bulgarian</option>
                <option value="ca">Catalan</option>
                <option value="zh-cn">Chinese (Simplified)</option>
                <option value="zh-tw">Chinese (Traditional)</option>
                <option value="hr">Croatian</option>
                <option value="cs">Czech</option>
                <option value="da">Danish</option>
                <option value="nl">Dutch</option>
                <option value="en">English</option>
                <option value="eo">Esperanto</option>
                <option value="et">Estonian</option>
                <option value="tl">Filipino</option>
                <option value="fi">Finnish</option>
                <option value="fr">French</option>
                <option value="gl">Galician</option>
                <option value="ka">Georgian</option>
                <option value="de">German</option>
                <option value="el">Greek</option>
                <option value="gu">Gujarati</option>
                <option value="ht">Haitian Creole</option>
                <option value="ha">Hausa</option>
                <option value="iw">Hebrew</option>
                <option value="hi">Hindi</option>
                <option value="hu">Hungarian</option>
                <option value="is">Icelandic</option>
                <option value="ig">Igbo</option>
                <option value="id">Indonesian</option>
                <option value="ga">Irish</option>
                <option value="it">Italian</option>
                <option value="ja">Japanese</option>
                <option value="jw">Javanese</option>
                <option value="kn">Kannada</option>
                <option value="kk">Kazakh</option>
                <option value="km">Khmer</option>
                <option value="rw">Kinyarwanda</option>
                <option value="ko">Korean</option>
                <option value="ku">Kurdish</option>
                <option value="ky">Kyrgyz</option>
                <option value="lo">Lao</option>
                <option value="la">Latin</option>
                <option value="lv">Latvian</option>
                <option value="lt">Lithuanian</option>
                <option value="lb">Luxembourgish</option>
                <option value="mk">Macedonian</option>
                <option value="mg">Malagasy</option>
                <option value="ms">Malay</option>
                <option value="ml">Malayalam</option>
                <option value="mt">Maltese</option>
                <option value="mi">Maori</option>
                <option value="mr">Marathi</option>
                <option value="mn">Mongolian</option>
                <option value="my">Myanmar</option>
                <option value="ne">Nepali</option>
                <option value="no">Norwegian</option>
                <option value="or">Odia</option>
                <option value="ps">Pashto</option>
                <option value="fa">Persian</option>
                <option value="pl">Polish</option>
                <option value="pt">Portuguese</option>
                <option value="pa">Punjabi</option>
                <option value="ro">Romanian</option>
                <option value="ru">Russian</option>
                <option value="sm">Samoan</option>
                <option value="gd">Scots Gaelic</option>
                <option value="sr">Serbian</option>
                <option value="st">Sesotho</option>
                <option value="sn">Shona</option>
                <option value="sd">Sindhi</option>
                <option value="si">Sinhala</option>
                <option value="sk">Slovak</option>
                <option value="sl">Slovenian</option>
                <option value="so">Somali</option>
                <option value="es">Spanish</option>
                <option value="su">Sundanese</option>
                <option value="sw">Swahili</option>
                <option value="sv">Swedish</option>
                <option value="tg">Tajik</option>
                <option value="ta">Tamil</option>
                <option value="tt">Tatar</option>
                <option value="te">Telugu</option>
                <option value="th">Thai</option>
                <option value="tr">Turkish</option>
                <option value="tk">Turkmen</option>
                <option value="uk">Ukrainian</option>
                <option value="ur">Urdu</option>
                <option value="ug">Uyghur</option>
                <option value="uz">Uzbek</option>
                <option value="vi">Vietnamese</option>
                <option value="cy">Welsh</option>
                <option value="xh">Xhosa</option>
                <option value="yi">Yiddish</option>
                <option value="yo">Yoruba</option>
                <option value="zu">Zulu</option>
              </select>
            </div>
            <div className="field-group">
              <label>Ignored Channels</label>
              <select
                className="field-input"
                multiple
                value={(autotranslate.ignored_channels || []).map(String)}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, (opt) => Number(opt.value));
                  setNested("autotranslate", "ignored_channels")(selected);
                }}
                style={{ height: "auto", minHeight: "60px" }}
              >
                {channelOptions.map((c) => (
                  <option key={c.id} value={c.id}>#{c.name}</option>
                ))}
              </select>
            </div>
            <div className="field-group">
              <label>Ignored Roles</label>
              <RoleMultiSelect value={autotranslate.ignored_roles || []} onChange={setNested("autotranslate", "ignored_roles")} />
            </div>
            <div className="field-group">
              <label>Ignored Users (User IDs)</label>
              <input
                className="field-input"
                value={(autotranslate.ignored_users || []).join(", ")}
                placeholder="123456789, 987654321"
                onChange={(e) =>
                  setNested("autotranslate", "ignored_users")(
                    e.target.value.split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n))
                  )
                }
              />
            </div>
          </>
        )}
      </Card>

      {/* SAVE BAR */}
      <div className="save-bar">
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
