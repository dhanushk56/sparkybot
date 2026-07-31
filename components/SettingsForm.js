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

function ToggleRow({ label, desc, checked, onChange }) {
  return (
    <div className="toggle-row">
      <div>
        <div className="toggle-label">{label}</div>
        {desc && <div className="toggle-desc">{desc}</div>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="field-group">
      <label>{label}</label>
      {children}
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

function ChannelSelect({ value, onChange, options, allowNone = true, placeholder = "None" }) {
  return (
    <select
      className="field-input"
      value={value || ""}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
    >
      {allowNone && <option value="">{placeholder}</option>}
      {options.map((c) => (
        <option key={c.id} value={c.id}>#{c.name}</option>
      ))}
    </select>
  );
}

function ChipMultiSelect({ values, onChange, options, prefix = "" }) {
  const selected = values || [];
  const toggle = (id) => {
    if (selected.includes(id)) onChange(selected.filter((v) => v !== id));
    else onChange([...selected, id]);
  };
  if (!options.length) return <div className="chip-box"><span className="chip-empty">Nothing to select.</span></div>;
  return (
    <div className="chip-box">
      {options.map((o) => (
        <label key={o.id} className={`chip ${selected.includes(o.id) ? "chip-active" : ""}`}>
          <input type="checkbox" checked={selected.includes(o.id)} onChange={() => toggle(o.id)} />
          {prefix}{o.name}
        </label>
      ))}
    </div>
  );
}

function Section({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="dash-card">
      <button type="button" className="section-toggle" onClick={() => setOpen((o) => !o)}>
        <h3>{title}</h3>
        <span className={`section-caret ${open ? "open" : ""}`}>▶</span>
      </button>
      {open && children}
    </div>
  );
}

export default function SettingsForm({ guildId, initial }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const setEvent = (evt) => (value) =>
    setForm((f) => ({ ...f, logging_events: { ...f.logging_events, [evt]: value } }));

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
  const voiceChannelOptions = initial.voice_channels || [];
  const roleOptions = initial.roles || [];
  const languages = initial.translation_languages || {};
  const punishments = initial.antinuke_punishment_options || {};
  const logEvents = Object.keys(initial.logging_events || {});

  return (
    <div>
      <Section title="General" defaultOpen>
        <Field label="Prefix" hint="Slash commands always work regardless of prefix.">
          <input
            className="field-input"
            value={form.prefix || ""}
            maxLength={5}
            onChange={(e) => set("prefix")(e.target.value)}
          />
        </Field>
        <Field label="Moderation Log Channel">
          <ChannelSelect value={form.mod_log_channel} onChange={set("mod_log_channel")} options={channelOptions} />
        </Field>
        <Field label="Jail Role" hint="Role applied to members put in jail by moderation commands.">
          <ChannelSelect value={form.jail_role} onChange={set("jail_role")} options={roleOptions} placeholder="None" />
        </Field>
      </Section>

      <Section title="Welcome & Goodbye">
        <ToggleRow label="Welcome Messages" desc="Greet new members when they join." checked={!!form.welcome_enabled} onChange={set("welcome_enabled")} />
        <Field label="Welcome Channel">
          <ChannelSelect value={form.welcome_channel} onChange={set("welcome_channel")} options={channelOptions} />
        </Field>
        <ToggleRow label="Welcome as Embed" desc="Send the welcome message as an embed instead of plain text." checked={!!form.welcome_embed} onChange={set("welcome_embed")} />
        <Field label="Welcome Embed Title">
          <input className="field-input" value={form.welcome_embed_title || ""} onChange={(e) => set("welcome_embed_title")(e.target.value)} />
        </Field>
        <Field label="Welcome Embed Description" hint="Supports {user}, {servername}, {membercount}.">
          <textarea className="field-input" value={form.welcome_embed_description || ""} onChange={(e) => set("welcome_embed_description")(e.target.value)} />
        </Field>
        <Field label="Welcome Embed Footer">
          <input className="field-input" value={form.welcome_embed_footer || ""} onChange={(e) => set("welcome_embed_footer")(e.target.value)} />
        </Field>
        <Field label="Outside Embed Content" hint="Plain text sent alongside the embed, e.g. a mention ping.">
          <input className="field-input" value={form.welcome_outside_content || ""} onChange={(e) => set("welcome_outside_content")(e.target.value)} />
        </Field>
        <Field label="Welcome DM" hint="Optional direct message sent to new members. Leave blank to disable.">
          <textarea className="field-input" value={form.welcome_dm || ""} onChange={(e) => set("welcome_dm")(e.target.value)} />
        </Field>
        <Field label="Auto Roles" hint="Roles automatically given to new members.">
          <ChipMultiSelect values={form.autoroles} onChange={set("autoroles")} options={roleOptions} prefix="@" />
        </Field>

        <Field label="Goodbye Channel">
          <ChannelSelect value={form.goodbye_channel} onChange={set("goodbye_channel")} options={channelOptions} />
        </Field>
        <ToggleRow label="Goodbye as Embed" desc="Send the goodbye message as an embed instead of plain text." checked={!!form.goodbye_embed} onChange={set("goodbye_embed")} />
        <Field label="Goodbye Embed Description" hint="Supports {username}, {membercount}.">
          <textarea className="field-input" value={form.goodbye_embed_description || ""} onChange={(e) => set("goodbye_embed_description")(e.target.value)} />
        </Field>
        <Field label="Goodbye Embed Footer">
          <input className="field-input" value={form.goodbye_embed_footer || ""} onChange={(e) => set("goodbye_embed_footer")(e.target.value)} />
        </Field>
        <Field label="Outside Embed Content">
          <input className="field-input" value={form.goodbye_outside_content || ""} onChange={(e) => set("goodbye_outside_content")(e.target.value)} />
        </Field>
      </Section>

      <Section title="AutoMod">
        <ToggleRow label="AutoMod" desc="Master switch for all automod protections." checked={!!form.automod_enabled} onChange={set("automod_enabled")} />
        <ToggleRow label="Anti-Spam" desc="Mutes members who send messages too quickly." checked={!!form.automod_anti_spam} onChange={set("automod_anti_spam")} />
        <ToggleRow label="Anti-Invite" desc="Removes messages containing Discord invite links." checked={!!form.automod_anti_invite} onChange={set("automod_anti_invite")} />
        <ToggleRow label="Anti-Links" desc="Removes messages containing external links." checked={!!form.automod_anti_links} onChange={set("automod_anti_links")} />
        <ToggleRow label="Caps Filter" desc="Flags messages that are mostly uppercase." checked={!!form.automod_caps_filter} onChange={set("automod_caps_filter")} />
      </Section>

      <Section title="AntiNuke">
        <ToggleRow label="AntiNuke" desc="Automatically punishes members responsible for mass-destructive actions." checked={!!form.antinuke_enabled} onChange={set("antinuke_enabled")} />
        <Field label="Default Punishment">
          <select className="field-input" value={form.antinuke_punishment || "timeout"} onChange={(e) => set("antinuke_punishment")(e.target.value)}>
            {Object.entries(punishments).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="Timeout Duration (minutes)" hint="Used when the punishment is Timeout.">
          <input type="number" min="1" className="field-input" value={form.antinuke_duration ?? 60} onChange={(e) => set("antinuke_duration")(Number(e.target.value))} />
        </Field>
        <Field label="AntiNuke Log Channel">
          <ChannelSelect value={form.antinuke_log_channel} onChange={set("antinuke_log_channel")} options={channelOptions} />
        </Field>
      </Section>

      <Section title="Server Logging">
        <ToggleRow label="Logging" desc="Master switch for all server event logs." checked={!!form.logging_enabled} onChange={set("logging_enabled")} />
        <Field label="Log Channel">
          <ChannelSelect value={form.logging_channel} onChange={set("logging_channel")} options={channelOptions} />
        </Field>
        <Field label="Logged Events" hint="Toggle which events post to the log channel.">
          <div className="event-grid">
            {logEvents.map((evt) => (
              <div key={evt} className="event-toggle">
                <span>{evt.replace(/_/g, " ")}</span>
                <Toggle checked={!!(form.logging_events || {})[evt]} onChange={setEvent(evt)} />
              </div>
            ))}
          </div>
        </Field>
      </Section>

      <Section title="Leveling">
        <ToggleRow label="Leveling" desc="Members earn XP and levels from chatting." checked={!!form.leveling_enabled} onChange={set("leveling_enabled")} />
        <Field label="Level-Up Announcement Channel" hint="Only used when display mode sends to a channel.">
          <ChannelSelect value={form.level_channel} onChange={set("level_channel")} options={channelOptions} />
        </Field>
        <Field label="Display Mode">
          <select className="field-input" value={form.level_display_mode || "both"} onChange={(e) => set("level_display_mode")(e.target.value)}>
            <option value="embed">Embed only</option>
            <option value="plain">Plain text only</option>
            <option value="both">Both</option>
          </select>
        </Field>
        <Field label="Level-Up Embed Title">
          <input className="field-input" value={form.level_embed_title || ""} onChange={(e) => set("level_embed_title")(e.target.value)} />
        </Field>
        <Field label="Level-Up Embed Description" hint="Supports {user}, {level}.">
          <textarea className="field-input" value={form.level_embed_description || ""} onChange={(e) => set("level_embed_description")(e.target.value)} />
        </Field>
        <Field label="Level-Up Embed Footer">
          <input className="field-input" value={form.level_embed_footer || ""} onChange={(e) => set("level_embed_footer")(e.target.value)} />
        </Field>
        <Field label="Embed Color">
          <input type="color" className="field-input" value={form.level_embed_color || "#FFD700"} onChange={(e) => set("level_embed_color")(e.target.value)} />
        </Field>
        <Field label="Plain-Text / Outside Content">
          <input className="field-input" value={form.level_outside_text || ""} onChange={(e) => set("level_outside_text")(e.target.value)} />
        </Field>
        <Field label="XP-Blacklisted Channels" hint="Members don't earn XP for messages sent in these channels.">
          <ChipMultiSelect values={form.xp_blacklist} onChange={set("xp_blacklist")} options={channelOptions} prefix="#" />
        </Field>
      </Section>

      <Section title="Tickets">
        <Field label="Ticket Category Name" hint="The category new ticket channels are created under.">
          <input className="field-input" value={form.ticket_category || ""} onChange={(e) => set("ticket_category")(e.target.value)} />
        </Field>
        <Field label="Staff Roles" hint="Roles automatically given access to every ticket.">
          <ChipMultiSelect values={form.ticket_staff_roles} onChange={set("ticket_staff_roles")} options={roleOptions} prefix="@" />
        </Field>
        <Field label="Ticket Log Channel">
          <ChannelSelect value={form.ticket_log_channel} onChange={set("ticket_log_channel")} options={channelOptions} />
        </Field>
      </Section>

      <Section title="Verification">
        <Field label="Verification Category Name">
          <input className="field-input" value={form.verification_category || ""} onChange={(e) => set("verification_category")(e.target.value)} />
        </Field>
        <Field label="Verified Role">
          <ChannelSelect value={form.verification_role} onChange={set("verification_role")} options={roleOptions} placeholder="None" />
        </Field>
        <Field label="Verification Log Channel">
          <ChannelSelect value={form.verification_log_channel} onChange={set("verification_log_channel")} options={channelOptions} />
        </Field>
      </Section>

      <Section title="Auto-Translation">
        <ToggleRow label="Auto-Translation" desc="Automatically translate messages that aren't in the default language." checked={!!form.translation_enabled} onChange={set("translation_enabled")} />
        <Field label="Default Language">
          <select className="field-input" value={form.translation_default_language || "en"} onChange={(e) => set("translation_default_language")(e.target.value)}>
            {Object.entries(languages).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </Field>
      </Section>

      <Section title="Invite Tracking">
        <Field label="Invite Log Channel">
          <ChannelSelect value={form.invite_log_channel} onChange={set("invite_log_channel")} options={channelOptions} />
        </Field>
      </Section>

      <Section title="Reports, Suggestions & Bugs">
        <Field label="Report Channel">
          <ChannelSelect value={form.report_channel} onChange={set("report_channel")} options={channelOptions} />
        </Field>
        <Field label="Suggestion Channel">
          <ChannelSelect value={form.suggestion_channel} onChange={set("suggestion_channel")} options={channelOptions} />
        </Field>
        <Field label="Bug Report Channel">
          <ChannelSelect value={form.bug_report_channel} onChange={set("bug_report_channel")} options={channelOptions} />
        </Field>
      </Section>

      <Section title="Join to Create">
        <Field label="Trigger Voice Channel" hint="Joining this voice channel creates a personal channel for the member.">
          <ChannelSelect value={form.jtc_channel} onChange={set("jtc_channel")} options={voiceChannelOptions} placeholder="None" />
        </Field>
        <Field label="Control Panel Channel">
          <ChannelSelect value={form.jtc_panel_channel} onChange={set("jtc_panel_channel")} options={channelOptions} />
        </Field>
        <Field label="Channel Name Template" hint="Use {username} as a placeholder.">
          <input className="field-input" value={form.jtc_name_template || ""} onChange={(e) => set("jtc_name_template")(e.target.value)} />
        </Field>
        <Field label="Default User Limit" hint="0 means unlimited.">
          <input type="number" min="0" max="99" className="field-input" value={form.jtc_user_limit ?? 0} onChange={(e) => set("jtc_user_limit")(Number(e.target.value))} />
        </Field>
      </Section>

      <Section title="Forum Auto-Lock">
        <Field label="Forum Lock Log Channel" hint="Per-forum lock durations are still managed with /forumlock commands.">
          <ChannelSelect value={form.forum_lock_log_channel} onChange={set("forum_lock_log_channel")} options={channelOptions} />
        </Field>
      </Section>

      <div className="save-bar">
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
              }
              
