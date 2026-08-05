"use client";

import { useState, useEffect, useRef } from "react";

// ---------- Toggle Component ----------
function Toggle({ checked, onChange }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="slider" />
    </label>
  );
}

// ---------- Role Multi-Select Component ----------
function RoleMultiSelect({ value, onChange, placeholder = "Select roles...", roleOptions }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const ids = value || [];
  const selectedRoles = (roleOptions || []).filter(r => ids.includes(r.id));
  const availableRoles = (roleOptions || []).filter(r => !ids.includes(r.id));
  const filteredAvailable = availableRoles.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRemoveRole = (roleId) => {
    onChange(ids.filter(id => id !== roleId));
  };

  const handleAddRole = (roleId) => {
    if (!ids.includes(roleId)) {
      onChange([...ids, roleId]);
    }
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative", width: "100%" }}>
      <div
        className="field-input"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.25rem",
          padding: "0.25rem",
          minHeight: "44px",
          cursor: "pointer",
          alignItems: "center",
          transition: "border-color 0.15s",
          borderColor: isOpen ? "#5865F2" : undefined,
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedRoles.length === 0 ? (
          <span style={{ color: "#949ba4", padding: "0.25rem", fontSize: "0.9rem" }}>
            {placeholder}
          </span>
        ) : (
          selectedRoles.map((role) => (
            <span
              key={role.id}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                backgroundColor: "rgba(88, 101, 242, 0.25)",
                color: "#e8e0d8",
                padding: "0.15rem 0.5rem",
                borderRadius: "0.25rem",
                fontSize: "0.85rem",
                border: "1px solid rgba(88, 101, 242, 0.35)",
              }}
            >
              @{role.name}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveRole(role.id);
                }}
                style={{
                  cursor: "pointer",
                  color: "#ed4245",
                  fontSize: "0.7rem",
                  marginLeft: "0.15rem",
                  opacity: 0.7,
                }}
              >
                ✕
              </span>
            </span>
          ))
        )}
        <span style={{ marginLeft: "auto", color: "#949ba4", fontSize: "0.7rem" }}>
          {isOpen ? "▲" : "▼"}
        </span>
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            backgroundColor: "#1e1f22",
            border: "1px solid #2b2d31",
            borderRadius: "0.5rem",
            maxHeight: "220px",
            overflowY: "auto",
            zIndex: 100,
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ padding: "0.5rem", borderBottom: "1px solid #2b2d31", position: "sticky", top: 0, backgroundColor: "#1e1f22", zIndex: 1 }}>
            <input
              type="text"
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                padding: "0.5rem",
                backgroundColor: "#2b2d31",
                border: "1px solid #3b3d41",
                borderRadius: "0.25rem",
                color: "#e8e0d8",
                fontSize: "0.9rem",
                outline: "none",
              }}
            />
          </div>
          {filteredAvailable.length === 0 ? (
            <div style={{ padding: "0.75rem", color: "#949ba4", textAlign: "center", fontSize: "0.9rem" }}>
              {searchTerm ? "No roles match your search" : "All roles selected"}
            </div>
          ) : (
            filteredAvailable.map((role) => (
              <div
                key={role.id}
                onClick={() => handleAddRole(role.id)}
                style={{
                  padding: "0.5rem 0.75rem",
                  cursor: "pointer",
                  color: "#e8e0d8",
                  fontSize: "0.9rem",
                  transition: "background 0.15s",
                  borderBottom: "1px solid #2b2d31",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <span>@{role.name}</span>
                <span style={{ color: "#5865F2", fontSize: "0.75rem" }}>+ Add</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ---------- Channel Multi-Select Component ----------
function ChannelMultiSelect({ value, onChange, placeholder = "Select channels...", channelOptions }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const ids = value || [];
  const selectedChannels = (channelOptions || []).filter(c => ids.includes(c.id));
  const availableChannels = (channelOptions || []).filter(c => !ids.includes(c.id));
  const filteredAvailable = availableChannels.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRemoveChannel = (channelId) => {
    onChange(ids.filter(id => id !== channelId));
  };

  const handleAddChannel = (channelId) => {
    if (!ids.includes(channelId)) {
      onChange([...ids, channelId]);
    }
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative", width: "100%" }}>
      <div
        className="field-input"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.25rem",
          padding: "0.25rem",
          minHeight: "44px",
          cursor: "pointer",
          alignItems: "center",
          transition: "border-color 0.15s",
          borderColor: isOpen ? "#5865F2" : undefined,
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedChannels.length === 0 ? (
          <span style={{ color: "#949ba4", padding: "0.25rem", fontSize: "0.9rem" }}>
            {placeholder}
          </span>
        ) : (
          selectedChannels.map((channel) => (
            <span
              key={channel.id}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                backgroundColor: "rgba(88, 101, 242, 0.25)",
                color: "#e8e0d8",
                padding: "0.15rem 0.5rem",
                borderRadius: "0.25rem",
                fontSize: "0.85rem",
                border: "1px solid rgba(88, 101, 242, 0.35)",
              }}
            >
              #{channel.name}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveChannel(channel.id);
                }}
                style={{
                  cursor: "pointer",
                  color: "#ed4245",
                  fontSize: "0.7rem",
                  marginLeft: "0.15rem",
                  opacity: 0.7,
                }}
              >
                ✕
              </span>
            </span>
          ))
        )}
        <span style={{ marginLeft: "auto", color: "#949ba4", fontSize: "0.7rem" }}>
          {isOpen ? "▲" : "▼"}
        </span>
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            backgroundColor: "#1e1f22",
            border: "1px solid #2b2d31",
            borderRadius: "0.5rem",
            maxHeight: "220px",
            overflowY: "auto",
            zIndex: 100,
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ padding: "0.5rem", borderBottom: "1px solid #2b2d31", position: "sticky", top: 0, backgroundColor: "#1e1f22", zIndex: 1 }}>
            <input
              type="text"
              placeholder="Search channels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                padding: "0.5rem",
                backgroundColor: "#2b2d31",
                border: "1px solid #3b3d41",
                borderRadius: "0.25rem",
                color: "#e8e0d8",
                fontSize: "0.9rem",
                outline: "none",
              }}
            />
          </div>
          {filteredAvailable.length === 0 ? (
            <div style={{ padding: "0.75rem", color: "#949ba4", textAlign: "center", fontSize: "0.9rem" }}>
              {searchTerm ? "No channels match your search" : "All channels selected"}
            </div>
          ) : (
            filteredAvailable.map((channel) => (
              <div
                key={channel.id}
                onClick={() => handleAddChannel(channel.id)}
                style={{
                  padding: "0.5rem 0.75rem",
                  cursor: "pointer",
                  color: "#e8e0d8",
                  fontSize: "0.9rem",
                  transition: "background 0.15s",
                  borderBottom: "1px solid #2b2d31",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <span>#{channel.name}</span>
                <span style={{ color: "#5865F2", fontSize: "0.75rem" }}>+ Add</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ---------- Application Manager Component (FIXED) ----------
function ApplicationsManager({ guildId, apps, onAppsChange, roleOptions, channelOptions }) {
  const [editingApp, setEditingApp] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newApp, setNewApp] = useState({
    name: "",
    description: "",
    log_channel: null,
    grant_role: null,
    manager_roles: [],
    questions: [],
    open: true,
    cooldown: 1209600,
  });
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("short_answer");
  const [savingApp, setSavingApp] = useState(false);

  const appList = apps || {};

  // ----- Create Application -----
  const handleCreateApp = async () => {
    if (!newApp.name) {
      alert("Please enter a name for the application.");
      return;
    }
    setSavingApp(true);
    try {
      const payload = {
        ...newApp,
        questions: newApp.questions || [],
      };
      const res = await fetch(`/api/guilds/${guildId}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to create application");
      }
      const data = await res.json();
      onAppsChange({ ...appList, [newApp.name]: data });
      setIsCreating(false);
      setNewApp({
        name: "",
        description: "",
        log_channel: null,
        grant_role: null,
        manager_roles: [],
        questions: [],
        open: true,
        cooldown: 1209600,
      });
    } catch (e) {
      console.error("Create error:", e);
      alert(`❌ Failed to create application: ${e.message}`);
    } finally {
      setSavingApp(false);
    }
  };

  // ----- Delete Application -----
  const handleDeleteApp = async (name) => {
    if (!confirm(`Delete application "${name}"? This cannot be undone.`)) return;
    try {
      const encodedName = encodeURIComponent(name);
      const res = await fetch(`/api/guilds/${guildId}/applications/${encodedName}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to delete application");
      }
      const newApps = { ...appList };
      delete newApps[name];
      onAppsChange(newApps);
    } catch (e) {
      console.error("Delete error:", e);
      alert(`❌ Failed to delete application: ${e.message}`);
    }
  };

  // ----- Toggle Open/Close -----
  const handleToggleApp = async (name, open) => {
    try {
      const encodedName = encodeURIComponent(name);
      const res = await fetch(`/api/guilds/${guildId}/applications/${encodedName}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ open }),
      });
      if (!res.ok) throw new Error("Failed to toggle");
      onAppsChange({ ...appList, [name]: { ...appList[name], open } });
    } catch (e) {
      console.error("Toggle error:", e);
      alert(`❌ Failed to toggle application: ${e.message}`);
    }
  };

  // ----- Add Question -----
  const addQuestion = () => {
    if (!questionText.trim()) {
      alert("Please enter a question text.");
      return;
    }
    const q = {
      text: questionText.trim(),
      type: questionType,
      options: [],
      required: true,
    };
    if (editingApp) {
      setEditingApp({
        ...editingApp,
        questions: [...(editingApp.questions || []), q],
      });
    } else {
      setNewApp({
        ...newApp,
        questions: [...(newApp.questions || []), q],
      });
    }
    setQuestionText("");
  };

  // ----- Remove Question -----
  const removeQuestion = (index) => {
    if (editingApp) {
      const qs = [...(editingApp.questions || [])];
      qs.splice(index, 1);
      setEditingApp({ ...editingApp, questions: qs });
    } else {
      const qs = [...(newApp.questions || [])];
      qs.splice(index, 1);
      setNewApp({ ...newApp, questions: qs });
    }
  };

  // ----- Update Application -----
  const handleUpdateApp = async () => {
    if (!editingApp) return;
    setSavingApp(true);
    try {
      const encodedName = encodeURIComponent(editingApp.name);
      const res = await fetch(`/api/guilds/${guildId}/applications/${encodedName}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingApp),
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to update application");
      }
      const updated = await res.json();
      onAppsChange({ ...appList, [editingApp.name]: updated });
      setEditingApp(null);
    } catch (e) {
      console.error("Update error:", e);
      alert(`❌ Failed to update application: ${e.message}`);
    } finally {
      setSavingApp(false);
    }
  };

  // ----- Render -----
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h4 style={{ color: "#e8e0d8", margin: 0 }}>Applications</h4>
        <button
          className="btn btn-primary"
          onClick={() => setIsCreating(!isCreating)}
          style={{ padding: "0.3rem 1rem", fontSize: "0.85rem" }}
        >
          {isCreating ? "Cancel" : "+ Create"}
        </button>
      </div>

      {isCreating && (
        <div className="dash-card" style={{ marginBottom: "1rem", padding: "1rem" }}>
          <div className="field-group">
            <label>Name (internal ID)</label>
            <input
              className="field-input"
              value={newApp.name}
              placeholder="staff, mod, builder"
              onChange={(e) => setNewApp({ ...newApp, name: e.target.value.toLowerCase().replace(/\s/g, "_") })}
            />
          </div>
          <div className="field-group">
            <label>Description</label>
            <input
              className="field-input"
              value={newApp.description || ""}
              placeholder="Application description"
              onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
            />
          </div>
          <div className="field-group">
            <label>Log Channel</label>
            <select
              className="field-input"
              value={newApp.log_channel || ""}
              onChange={(e) => setNewApp({ ...newApp, log_channel: e.target.value || null })}
            >
              <option value="">None</option>
              {channelOptions?.map((c) => (
                <option key={c.id} value={c.id}>#{c.name}</option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label>Grant Role (on acceptance)</label>
            <select
              className="field-input"
              value={newApp.grant_role || ""}
              onChange={(e) => setNewApp({ ...newApp, grant_role: e.target.value || null })}
            >
              <option value="">None</option>
              {roleOptions?.map((r) => (
                <option key={r.id} value={r.id}>@{r.name}</option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label>Cooldown (seconds)</label>
            <input
              className="field-input"
              type="number"
              value={newApp.cooldown || 1209600}
              onChange={(e) => setNewApp({ ...newApp, cooldown: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="field-group">
            <label>Questions</label>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
              <input
                className="field-input"
                value={questionText}
                placeholder="Question text"
                onChange={(e) => setQuestionText(e.target.value)}
                style={{ flex: 1, minWidth: "150px" }}
              />
              <select
                className="field-input"
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                style={{ width: "150px" }}
              >
                <option value="short_answer">Short</option>
                <option value="long_answer">Long</option>
                <option value="multiple_choice">Multiple Choice</option>
                <option value="dropdown">Dropdown</option>
                <option value="numeric">Numeric</option>
                <option value="yes_no">Yes/No</option>
                <option value="url">URL</option>
              </select>
              <button className="btn btn-secondary" onClick={addQuestion}>+</button>
            </div>
            {(newApp.questions || []).length > 0 && (
              <div style={{ maxHeight: "150px", overflow: "auto" }}>
                {(newApp.questions || []).map((q, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.25rem 0", borderBottom: "1px solid #2b2d31" }}>
                    <span style={{ color: "#e8e0d8" }}>{i+1}. {q.text}</span>
                    <button onClick={() => removeQuestion(i)} style={{ background: "none", border: "none", color: "#ed4245", cursor: "pointer" }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            className="btn btn-primary"
            onClick={handleCreateApp}
            disabled={!newApp.name || savingApp}
          >
            {savingApp ? "Creating..." : "Create Application"}
          </button>
        </div>
      )}

      {Object.keys(appList).length === 0 && !isCreating && (
        <p style={{ color: "#aaa" }}>No applications created yet.</p>
      )}

      {Object.entries(appList).map(([name, app]) => (
        <div key={name} className="dash-card" style={{ padding: "0.75rem 1rem", marginBottom: "0.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <strong style={{ color: "#e8e0d8" }}>{name}</strong>
              <span style={{ color: "#aaa", marginLeft: "0.5rem", fontSize: "0.85rem" }}>
                {app.questions?.length || 0} questions • {app.open ? "🟢 Open" : "🔴 Closed"}
              </span>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                className="btn btn-secondary"
                style={{ padding: "0.2rem 0.75rem", fontSize: "0.8rem" }}
                onClick={() => handleToggleApp(name, !app.open)}
              >
                {app.open ? "Close" : "Open"}
              </button>
              <button
                className="btn btn-secondary"
                style={{ padding: "0.2rem 0.75rem", fontSize: "0.8rem" }}
                onClick={() => setEditingApp(app)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger"
                style={{ padding: "0.2rem 0.75rem", fontSize: "0.8rem" }}
                onClick={() => handleDeleteApp(name)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      {editingApp && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setEditingApp(null)}
        >
          <div
            className="dash-card"
            style={{ maxWidth: "600px", width: "90%", maxHeight: "80vh", overflow: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 style={{ color: "#e8e0d8" }}>Edit {editingApp.name}</h4>
            <div className="field-group">
              <label>Description</label>
              <input
                className="field-input"
                value={editingApp.description || ""}
                onChange={(e) => setEditingApp({ ...editingApp, description: e.target.value })}
              />
            </div>
            <div className="field-group">
              <label>Cooldown (seconds)</label>
              <input
                className="field-input"
                type="number"
                value={editingApp.cooldown || 1209600}
                onChange={(e) => setEditingApp({ ...editingApp, cooldown: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="field-group">
              <label>Questions</label>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                <input
                  className="field-input"
                  value={questionText}
                  placeholder="Question text"
                  onChange={(e) => setQuestionText(e.target.value)}
                  style={{ flex: 1, minWidth: "150px" }}
                />
                <select
                  className="field-input"
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  style={{ width: "150px" }}
                >
                  <option value="short_answer">Short</option>
                  <option value="long_answer">Long</option>
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="dropdown">Dropdown</option>
                  <option value="numeric">Numeric</option>
                  <option value="yes_no">Yes/No</option>
                  <option value="url">URL</option>
                </select>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    if (!questionText) return;
                    setEditingApp({
                      ...editingApp,
                      questions: [...(editingApp.questions || []), { text: questionText, type: questionType, options: [], required: true }],
                    });
                    setQuestionText("");
                  }}
                >
                  +
                </button>
              </div>
              {(editingApp.questions || []).map((q, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.25rem 0", borderBottom: "1px solid #2b2d31" }}>
                  <span style={{ color: "#e8e0d8" }}>{i+1}. {q.text}</span>
                  <button
                    onClick={() => {
                      const qs = [...(editingApp.questions || [])];
                      qs.splice(i, 1);
                      setEditingApp({ ...editingApp, questions: qs });
                    }}
                    style={{ background: "none", border: "none", color: "#ed4245", cursor: "pointer" }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
              <button className="btn btn-primary" onClick={handleUpdateApp} disabled={savingApp}>
                {savingApp ? "Saving..." : "Save"}
              </button>
              <button className="btn btn-secondary" onClick={() => setEditingApp(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Main SettingsForm Component ----------
export default function SettingsForm({ guildId, initial }) {
  const [form, setForm] = useState(initial);
  const [apps, setApps] = useState(initial.applications || {});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeSection, setActiveSection] = useState("general");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const contentRef = useRef(null);
  const menuRef = useRef(null);

  const channelOptions = initial.channels || [];
  const roleOptions = initial.roles || [];

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Close menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const setNested = (parent, key) => (value) =>
    setForm((f) => ({
      ...f,
      [parent]: { ...f[parent], [key]: value },
    }));

  async function handleSave() {
    setSaving(true);
    try {
      const payload = { ...form };
      delete payload.applications;
      delete payload.channels;
      delete payload.roles;
      delete payload.categories;

      const res = await fetch(`/api/guilds/${guildId}/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  const ChannelSelect = ({ value, onChange, allowNone = true }) => (
    <select className="field-input" value={value || ""} onChange={(e) => onChange(e.target.value || null)}>
      {allowNone && <option value="">None</option>}
      {channelOptions.map((c) => (
        <option key={c.id} value={c.id}>#{c.name}</option>
      ))}
    </select>
  );

  const navItems = [
    { icon: "⚙️", label: "General", section: "general" },
    { icon: "👋", label: "Welcome & Goodbye", section: "welcome" },
    { icon: "🛡️", label: "AutoMod", section: "automod" },
    { icon: "📜", label: "Logging", section: "logging" },
    { icon: "🔐", label: "Verification", section: "verification" },
    { icon: "🎟️", label: "Tickets", section: "tickets" },
    { icon: "🎵", label: "Music", section: "music" },
    { icon: "⭐", label: "Leveling", section: "leveling" },
    { icon: "🔢", label: "Counting", section: "counting" },
    { icon: "🔊", label: "JTC", section: "jtc" },
    { icon: "🧨", label: "Anti-Nuke", section: "antinuke" },
    { icon: "📨", label: "Invite Tracking", section: "invite" },
    { icon: "🚩", label: "Reports", section: "reports" },
    { icon: "🔒", label: "Forum Lock", section: "forumlock" },
    { icon: "🌐", label: "Auto-Translate", section: "autotranslate" },
    { icon: "📋", label: "Applications", section: "applications" },
  ];

  const renderContent = () => {
    const automod = form.automod || {};
    const logging = form.logging || {};
    const ticketCustomization = form.ticket_customization || {};
    const levelUpConfig = form.level_up_config || {};
    const counting = form.counting || { emojis: {} };
    const jtc = form.jtc || {};
    const antinuke = form.antinuke || {};
    const eventConfig = antinuke.event_config || {};
    const autotranslate = form.autotranslate || {};

    const SectionHeader = ({ icon, title }) => (
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0", borderBottom: "1px solid #2b2d31", marginBottom: "1rem" }}>
        <span style={{ fontSize: "1.3rem" }}>{icon}</span>
        <h3 style={{ margin: 0, color: "#e8e0d8" }}>{title}</h3>
      </div>
    );

    const renderGeneral = () => (
      <>
        <SectionHeader icon="⚙️" title="General Settings" />
        <div className="field-group">
          <label>Prefix</label>
          <input className="field-input" value={form.prefix || ""} maxLength={5} onChange={(e) => set("prefix")(e.target.value)} />
          <span className="hint">Slash commands always work.</span>
        </div>
        <div className="field-group">
          <label>Moderation Log Channel</label>
          <ChannelSelect value={form.mod_log_channel} onChange={set("mod_log_channel")} />
        </div>
        <div className="field-group">
          <label>Support Hours Start (UTC)</label>
          <input className="field-input" value={form.support_start || ""} placeholder="14:00" onChange={(e) => set("support_start")(e.target.value)} />
        </div>
        <div className="field-group">
          <label>Support Hours End (UTC)</label>
          <input className="field-input" value={form.support_end || ""} placeholder="01:00" onChange={(e) => set("support_end")(e.target.value)} />
        </div>
      </>
    );

    const renderWelcome = () => (
      <>
        <SectionHeader icon="👋" title="Welcome & Goodbye" />
        <div className="toggle-row"><div><div className="toggle-label">Welcome Messages</div><div className="toggle-desc">Greet new members when they join.</div></div><Toggle checked={!!form.welcome_enabled} onChange={set("welcome_enabled")} /></div>
        <div className="field-group"><label>Welcome Channel</label><ChannelSelect value={form.welcome_channel} onChange={set("welcome_channel")} /></div>
        <div className="field-group"><label>Goodbye Channel</label><ChannelSelect value={form.goodbye_channel} onChange={set("goodbye_channel")} /></div>
        <div className="toggle-row"><div><div className="toggle-label">Welcome Embed</div><div className="toggle-desc">Send welcome as an embed.</div></div><Toggle checked={!!form.welcome_embed} onChange={set("welcome_embed")} /></div>
        <div className="field-group"><label>Welcome DM (optional)</label><textarea className="field-input" rows="2" value={form.welcome_dm || ""} placeholder="Welcome to {servername}, {user}!" onChange={(e) => set("welcome_dm")(e.target.value || null)} /></div>
        <div className="field-group"><label>Auto-Roles</label><RoleMultiSelect value={form.autoroles || []} onChange={set("autoroles")} roleOptions={roleOptions} placeholder="Select auto-roles..." /></div>
        <div className="field-group"><label>Welcome Embed Title</label><input className="field-input" value={form.welcome_embed_title || ""} placeholder="Welcome to {servername}!" onChange={(e) => set("welcome_embed_title")(e.target.value)} /></div>
        <div className="field-group"><label>Welcome Embed Description</label><textarea className="field-input" rows="3" value={form.welcome_embed_description || ""} placeholder="👋 Welcome {user}..." onChange={(e) => set("welcome_embed_description")(e.target.value)} /></div>
        <div className="field-group"><label>Welcome Embed Footer</label><input className="field-input" value={form.welcome_embed_footer || ""} placeholder="ID: {id} • {servername}" onChange={(e) => set("welcome_embed_footer")(e.target.value)} /></div>
        <div className="field-group"><label>Welcome Outside Text</label><input className="field-input" value={form.welcome_outside_content || ""} placeholder="{user}" onChange={(e) => set("welcome_outside_content")(e.target.value)} /></div>
        <div className="field-group"><label>Goodbye Embed Description</label><textarea className="field-input" rows="2" value={form.goodbye_embed_description || ""} placeholder="👋 Goodbye {username}!" onChange={(e) => set("goodbye_embed_description")(e.target.value)} /></div>
        <div className="field-group"><label>Goodbye Embed Footer</label><input className="field-input" value={form.goodbye_embed_footer || ""} placeholder="ID: {id}" onChange={(e) => set("goodbye_embed_footer")(e.target.value)} /></div>
        <div className="field-group"><label>Goodbye Outside Text</label><input className="field-input" value={form.goodbye_outside_content || ""} placeholder="" onChange={(e) => set("goodbye_outside_content")(e.target.value)} /></div>
      </>
    );

    const renderAutoMod = () => (
      <>
        <SectionHeader icon="🛡️" title="AutoMod" />
        <div className="toggle-row"><div><div className="toggle-label">AutoMod</div><div className="toggle-desc">Master switch for all automod protections.</div></div><Toggle checked={!!automod.enabled} onChange={setNested("automod", "enabled")} /></div>
        <div className="toggle-row"><div><div className="toggle-label">Anti-Spam</div><div className="toggle-desc">Mutes members who send messages too quickly.</div></div><Toggle checked={!!automod.anti_spam} onChange={setNested("automod", "anti_spam")} /></div>
        <div className="toggle-row"><div><div className="toggle-label">Anti-Invite</div><div className="toggle-desc">Removes messages containing Discord invite links.</div></div><Toggle checked={!!automod.anti_invite} onChange={setNested("automod", "anti_invite")} /></div>
        <div className="toggle-row"><div><div className="toggle-label">Anti-Links</div><div className="toggle-desc">Removes messages containing external links.</div></div><Toggle checked={!!automod.anti_links} onChange={setNested("automod", "anti_links")} /></div>
        <div className="toggle-row"><div><div className="toggle-label">Caps Filter</div><div className="toggle-desc">Flags messages that are mostly uppercase.</div></div><Toggle checked={!!automod.caps_filter} onChange={setNested("automod", "caps_filter")} /></div>
        <div className="field-group"><label>Mention Limit</label><input className="field-input" type="number" min="0" value={automod.mention_limit || 5} onChange={(e) => setNested("automod", "mention_limit")(parseInt(e.target.value) || 0)} /></div>
        <div className="field-group"><label>Bad Words (comma separated)</label><input className="field-input" value={(automod.bad_words || []).join(", ")} placeholder="word1, word2" onChange={(e) => setNested("automod", "bad_words")(e.target.value.split(",").map(s => s.trim()).filter(Boolean))} /></div>
        <div className="field-group"><label>AutoMod Log Channel</label><ChannelSelect value={automod.log_channel} onChange={setNested("automod", "log_channel")} /></div>
        <div className="field-group"><label>Ignored Channels</label><ChannelMultiSelect value={automod.ignored_channels || []} onChange={setNested("automod", "ignored_channels")} channelOptions={channelOptions} placeholder="Select ignored channels..." /></div>
        <div className="field-group"><label>Ignored Roles</label><RoleMultiSelect value={automod.ignored_roles || []} onChange={setNested("automod", "ignored_roles")} roleOptions={roleOptions} placeholder="Select ignored roles..." /></div>
      </>
    );

    const renderLogging = () => (
      <>
        <SectionHeader icon="📜" title="Logging" />
        <div className="toggle-row"><div><div className="toggle-label">Enable Logging</div><div className="toggle-desc">Log server events to a channel.</div></div><Toggle checked={!!logging.enabled} onChange={setNested("logging", "enabled")} /></div>
        <div className="field-group"><label>Log Channel</label><ChannelSelect value={logging.channel} onChange={setNested("logging", "channel")} /></div>
        <div style={{ marginTop: "1rem" }}>
          <label style={{ display: "block", marginBottom: ".5rem" }}>Events to Log</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem" }}>
            {["message_delete","message_edit","member_join","member_leave","member_ban","member_unban","role_create","role_delete","role_update","channel_create","channel_delete","channel_update","voice_join","voice_leave","voice_move","nickname_change","member_role_update","invite_create","invite_delete"].map((ev) => (
              <div key={ev} className="toggle-row" style={{ padding: ".25rem 0" }}>
                <div><div className="toggle-label" style={{ fontSize: ".85rem" }}>{ev.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</div></div>
                <Toggle checked={!!logging[ev]} onChange={setNested("logging", ev)} />
              </div>
            ))}
          </div>
        </div>
      </>
    );

    const renderVerification = () => (
      <>
        <SectionHeader icon="🔐" title="Verification" />
        <div className="field-group"><label>Verified Role</label><select className="field-input" value={form.verification_role_id || ""} onChange={(e) => set("verification_role_id")(e.target.value || null)}><option value="">None</option>{roleOptions.map((r) => <option key={r.id} value={r.id}>@{r.name}</option>)}</select></div>
        <div className="field-group"><label>Verification Log Channel</label><ChannelSelect value={form.verification_log_channel} onChange={set("verification_log_channel")} /></div>
        <div className="field-group"><label>Verification Category</label><input className="field-input" value={form.verification_category || "Verification"} placeholder="Verification" onChange={(e) => set("verification_category")(e.target.value)} /></div>
      </>
    );

    const renderTickets = () => (
      <>
        <SectionHeader icon="🎟️" title="Tickets" />
        <div className="field-group"><label>Ticket Category Name</label><input className="field-input" value={form.ticket_category || "Tickets"} placeholder="Tickets" onChange={(e) => set("ticket_category")(e.target.value)} /></div>
        <div className="field-group"><label>Ticket Log Channel</label><ChannelSelect value={form.ticket_log_channel} onChange={set("ticket_log_channel")} /></div>
        <div className="field-group"><label>Staff Roles (global)</label><RoleMultiSelect value={form.ticket_staff_roles || []} onChange={set("ticket_staff_roles")} roleOptions={roleOptions} placeholder="Select staff roles..." /></div>
        <div className="field-group"><label>Customization</label>
          <input className="field-input" value={ticketCustomization.embed_title || ""} placeholder="Embed Title" onChange={(e) => setForm(f => ({ ...f, ticket_customization: { ...f.ticket_customization, embed_title: e.target.value } }))} />
          <textarea className="field-input" rows="2" value={ticketCustomization.embed_description || ""} placeholder="Embed Description" onChange={(e) => setForm(f => ({ ...f, ticket_customization: { ...f.ticket_customization, embed_description: e.target.value } }))} />
          <input className="field-input" value={ticketCustomization.embed_color || "#5865F2"} placeholder="Embed Color (hex)" onChange={(e) => setForm(f => ({ ...f, ticket_customization: { ...f.ticket_customization, embed_color: e.target.value } }))} />
          <textarea className="field-input" rows="2" value={ticketCustomization.embed_footer || ""} placeholder="Footer notes" onChange={(e) => setForm(f => ({ ...f, ticket_customization: { ...f.ticket_customization, embed_footer: e.target.value } }))} />
          <input className="field-input" value={ticketCustomization.footer_text || ""} placeholder="Footer text" onChange={(e) => setForm(f => ({ ...f, ticket_customization: { ...f.ticket_customization, footer_text: e.target.value } }))} />
          <input className="field-input" value={ticketCustomization.important_notes_heading || "📝 Important Notes"} placeholder="Notes heading" onChange={(e) => setForm(f => ({ ...f, ticket_customization: { ...f.ticket_customization, important_notes_heading: e.target.value } }))} />
          <div className="toggle-row"><div><div className="toggle-label">Enable Ratings</div><div className="toggle-desc">Let users rate tickets after closing.</div></div><Toggle checked={!!ticketCustomization.enable_ratings} onChange={(v) => setForm(f => ({ ...f, ticket_customization: { ...f.ticket_customization, enable_ratings: v } }))} /></div>
          <div className="toggle-row"><div><div className="toggle-label">Enable History</div><div className="toggle-desc">Users can view their ticket history.</div></div><Toggle checked={!!ticketCustomization.enable_history} onChange={(v) => setForm(f => ({ ...f, ticket_customization: { ...f.ticket_customization, enable_history: v } }))} /></div>
          <div className="toggle-row"><div><div className="toggle-label">Enable Auto-Close</div><div className="toggle-desc">Automatically close inactive tickets.</div></div><Toggle checked={!!ticketCustomization.enable_auto_close} onChange={(v) => setForm(f => ({ ...f, ticket_customization: { ...f.ticket_customization, enable_auto_close: v } }))} /></div>
          <div className="field-group"><label>Default Auto-Close Hours</label><input className="field-input" type="number" min="1" value={ticketCustomization.default_auto_close_hours || 24} onChange={(e) => setForm(f => ({ ...f, ticket_customization: { ...f.ticket_customization, default_auto_close_hours: parseInt(e.target.value) || 24 } }))} /></div>
          <div className="field-group"><label>Reviews Channel</label><ChannelSelect value={ticketCustomization.reviews_channel} onChange={(v) => setForm(f => ({ ...f, ticket_customization: { ...f.ticket_customization, reviews_channel: v } }))} /></div>
          <div className="toggle-row"><div><div className="toggle-label">Show Available Categories</div><div className="toggle-desc">Display category list in ticket embed.</div></div><Toggle checked={!!ticketCustomization.show_available_categories} onChange={(v) => setForm(f => ({ ...f, ticket_customization: { ...f.ticket_customization, show_available_categories: v } }))} /></div>
        </div>
      </>
    );

    const renderMusic = () => (
      <>
        <SectionHeader icon="🎵" title="Music" />
        <div className="field-group"><label>Designated Music Voice Channel</label><ChannelSelect value={form.music_vc_channel_id} onChange={set("music_vc_channel_id")} allowNone /></div>
        <div className="toggle-row"><div><div className="toggle-label">Drag Users to VC</div><div className="toggle-desc">Automatically move users to the music VC.</div></div><Toggle checked={!!form.music_vc_drag_users} onChange={set("music_vc_drag_users")} /></div>
        <div className="field-group"><label>Default Volume (1-200)</label><input className="field-input" type="number" min="1" max="200" value={form.music_volume || 100} onChange={(e) => set("music_volume")(parseInt(e.target.value) || 100)} /></div>
        <div className="field-group"><label>Default Loop Mode</label><select className="field-input" value={form.music_loop_mode || "off"} onChange={(e) => set("music_loop_mode")(e.target.value)}><option value="off">Off</option><option value="track">Track</option><option value="queue">Queue</option></select></div>
        <div className="toggle-row"><div><div className="toggle-label">VC Status Updates</div><div className="toggle-desc">Show current song in voice channel status.</div></div><Toggle checked={!!form.music_status_enabled} onChange={set("music_status_enabled")} /></div>
      </>
    );

    const renderLeveling = () => (
      <>
        <SectionHeader icon="⭐" title="Leveling" />
        <div className="toggle-row"><div><div className="toggle-label">Enable Leveling</div><div className="toggle-desc">Track XP and levels for members.</div></div><Toggle checked={!!form.leveling_enabled} onChange={set("leveling_enabled")} /></div>
        <div className="field-group"><label>Level-Up Channel</label><ChannelSelect value={form.level_channel} onChange={set("level_channel")} /></div>
        <div className="field-group"><label>XP Blacklisted Channels</label><ChannelMultiSelect value={form.xp_blacklist || []} onChange={set("xp_blacklist")} channelOptions={channelOptions} placeholder="Select XP blacklisted channels..." /></div>
        <div className="field-group"><label>XP Blacklisted Roles</label><RoleMultiSelect value={form.xp_role_blacklist || []} onChange={set("xp_role_blacklist")} roleOptions={roleOptions} placeholder="Select XP blacklisted roles..." /></div>
        <div className="field-group"><label>Level Roles (format: level:role_id)</label><textarea className="field-input" rows="2" value={Object.entries(form.level_roles || {}).map(([lvl, rid]) => `${lvl}:${rid}`).join("\n")} placeholder="10:123456789\n20:987654321" onChange={(e) => { const obj = {}; e.target.value.split("\n").forEach(line => { const [lvl, rid] = line.split(":"); if (lvl && rid) obj[lvl.trim()] = parseInt(rid.trim()); }); set("level_roles")(obj); }} /></div>
        <div className="field-group"><label>Level-Up Outside Text</label><input className="field-input" value={levelUpConfig.outside_text || "{user}"} placeholder="{user}" onChange={(e) => setForm(f => ({ ...f, level_up_config: { ...f.level_up_config, outside_text: e.target.value } }))} /></div>
        <div className="field-group"><label>Level-Up Embed Title</label><input className="field-input" value={levelUpConfig.embed_title || "⬆️ Level Up!"} placeholder="⬆️ Level Up!" onChange={(e) => setForm(f => ({ ...f, level_up_config: { ...f.level_up_config, embed_title: e.target.value } }))} /></div>
        <div className="field-group"><label>Level-Up Embed Description</label><textarea className="field-input" rows="2" value={levelUpConfig.embed_description || "🎉 {user} reached **Level {level}**!"} placeholder="🎉 {user} reached **Level {level}**!" onChange={(e) => setForm(f => ({ ...f, level_up_config: { ...f.level_up_config, embed_description: e.target.value } }))} /></div>
        <div className="field-group"><label>Level-Up Embed Footer</label><input className="field-input" value={levelUpConfig.embed_footer || ""} placeholder="Footer text" onChange={(e) => setForm(f => ({ ...f, level_up_config: { ...f.level_up_config, embed_footer: e.target.value } }))} /></div>
        <div className="field-group"><label>Level-Up Embed Color (hex)</label><input className="field-input" value={levelUpConfig.embed_color || "#FFD700"} placeholder="#FFD700" onChange={(e) => setForm(f => ({ ...f, level_up_config: { ...f.level_up_config, embed_color: e.target.value } }))} /></div>
        <div className="field-group"><label>Display Mode</label><select className="field-input" value={levelUpConfig.display_mode || "both"} onChange={(e) => setForm(f => ({ ...f, level_up_config: { ...f.level_up_config, display_mode: e.target.value } }))}><option value="embed">Embed Only</option><option value="plain">Plain Text Only</option><option value="both">Both</option></select></div>
      </>
    );

    const renderCounting = () => (
      <>
        <SectionHeader icon="🔢" title="Counting" />
        <div className="field-group"><label>Counting Channel</label><ChannelSelect value={counting.channel} onChange={setNested("counting", "channel")} /></div>
        <div className="toggle-row"><div><div className="toggle-label">Allow Same User Twice</div><div className="toggle-desc">Allow the same member to count twice in a row.</div></div><Toggle checked={!!counting.allow_same_user} onChange={setNested("counting", "allow_same_user")} /></div>
        <div className="toggle-row"><div><div className="toggle-label">Reset on Fail</div><div className="toggle-desc">Reset count back to 0 (or checkpoint) when someone fails.</div></div><Toggle checked={!!counting.reset_on_fail} onChange={setNested("counting", "reset_on_fail")} /></div>
        <div className="field-group"><label>Cooldown (seconds)</label><input className="field-input" type="number" min="0" value={counting.cooldown || 2} onChange={(e) => setNested("counting", "cooldown")(parseInt(e.target.value) || 0)} /></div>
        <div className="field-group"><label>Save Limit (-1 = unlimited, 0 = disabled)</label><input className="field-input" type="number" min="-1" value={counting.save_limit !== undefined ? counting.save_limit : 3} onChange={(e) => setNested("counting", "save_limit")(parseInt(e.target.value) || 0)} /></div>
        <div className="field-group"><label>Save Cooldown (seconds)</label><input className="field-input" type="number" min="0" value={counting.save_cooldown || 3} onChange={(e) => setNested("counting", "save_cooldown")(parseInt(e.target.value) || 0)} /></div>
        <div className="field-group"><label>Milestones (comma separated)</label><input className="field-input" value={(counting.milestones || [100,250,500,1000,2500,5000,10000]).join(", ")} placeholder="100, 250, 500" onChange={(e) => setNested("counting", "milestones")(e.target.value.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n)))} /></div>
        <div style={{ marginTop: "1rem" }}><label style={{ display: "block", marginBottom: ".5rem" }}>Emojis</label>
          {["correct","wrong","milestone","high_score","save"].map((key) => (
            <div key={key} className="field-group" style={{ marginBottom: ".5rem" }}><label style={{ textTransform: "capitalize" }}>{key.replace("_", " ")}</label><input className="field-input" value={counting.emojis?.[key] || "✅"} placeholder={key === "correct" ? "✅" : key === "wrong" ? "❌" : ""} onChange={(e) => setForm(f => ({ ...f, counting: { ...f.counting, emojis: { ...f.counting?.emojis, [key]: e.target.value } } }))} /></div>
          ))}
        </div>
      </>
    );

    const renderJTC = () => (
      <>
        <SectionHeader icon="🔊" title="JTC (Join-to-Create)" />
        <div className="field-group"><label>Trigger Voice Channel</label><ChannelSelect value={jtc.jtc_channel} onChange={setNested("jtc", "jtc_channel")} /></div>
        <div className="field-group"><label>Control Panel Channel</label><ChannelSelect value={jtc.control_panel_channel} onChange={setNested("jtc", "control_panel_channel")} /></div>
        <div className="field-group"><label>Name Template</label><input className="field-input" value={jtc.name_template || "{username}'s Channel"} placeholder="{username}'s Channel" onChange={(e) => setNested("jtc", "name_template")(e.target.value)} /></div>
        <div className="field-group"><label>Default User Limit (0 = unlimited)</label><input className="field-input" type="number" min="0" value={jtc.user_limit || 0} onChange={(e) => setNested("jtc", "user_limit")(parseInt(e.target.value) || 0)} /></div>
      </>
    );

    const renderAntiNuke = () => (
      <>
        <SectionHeader icon="🧨" title="Anti-Nuke" />
        <div className="toggle-row"><div><div className="toggle-label">Anti-Nuke</div><div className="toggle-desc">Protect your server from destructive actions.</div></div><Toggle checked={!!antinuke.enabled} onChange={setNested("antinuke", "enabled")} /></div>
        <div className="field-group"><label>Default Punishment</label><select className="field-input" value={antinuke.punishment || "timeout"} onChange={(e) => setNested("antinuke", "punishment")(e.target.value)}><option value="warn">Warn</option><option value="timeout">Timeout</option><option value="strip_roles">Strip Roles</option><option value="kick">Kick</option><option value="softban">Softban</option><option value="ban">Ban</option></select></div>
        <div className="field-group"><label>Duration (minutes, for timeout)</label><input className="field-input" type="number" min="1" value={antinuke.duration || 60} onChange={(e) => setNested("antinuke", "duration")(parseInt(e.target.value) || 60)} /></div>
        <div className="field-group"><label>Log Channel</label><ChannelSelect value={antinuke.log_channel} onChange={setNested("antinuke", "log_channel")} /></div>
        <div className="field-group"><label>Global User Whitelist</label><input className="field-input" value={(antinuke.global_whitelist || []).join(", ")} placeholder="User IDs (comma separated)" onChange={(e) => setNested("antinuke", "global_whitelist")(e.target.value.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n)))} /></div>
        <div className="field-group"><label>Global Role Whitelist</label><RoleMultiSelect value={antinuke.global_whitelist_roles || []} onChange={setNested("antinuke", "global_whitelist_roles")} roleOptions={roleOptions} placeholder="Select whitelisted roles..." /></div>
        <div className="field-group"><label>Forbidden Channels</label><ChannelMultiSelect value={antinuke.forbidden_channels || []} onChange={setNested("antinuke", "forbidden_channels")} channelOptions={channelOptions} placeholder="Select forbidden channels..." /></div>
        <div className="field-group"><label>Forbidden Categories</label><select className="field-input" multiple value={(antinuke.forbidden_categories || []).map(String)} onChange={(e) => { const selected = Array.from(e.target.selectedOptions, opt => Number(opt.value)); setNested("antinuke", "forbidden_categories")(selected); }} style={{ height: "auto", minHeight: "60px" }}>{initial.categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>) || []}</select></div>
        <div style={{ marginTop: "1rem" }}><label style={{ display: "block", marginBottom: ".5rem" }}>Event Configurations</label>
          {Object.keys(eventConfig).length === 0 && <p style={{ color: "#aaa" }}>No events configured yet.</p>}
          {Object.entries(eventConfig).map(([event, cfg]) => (
            <div key={event} style={{ borderBottom: "1px solid #2b2d31", padding: "0.5rem 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <span style={{ minWidth: "150px", fontWeight: "bold" }}>{event.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</span>
                <Toggle checked={!!cfg.enabled} onChange={(v) => setForm(f => ({ ...f, antinuke: { ...f.antinuke, event_config: { ...f.antinuke?.event_config, [event]: { ...f.antinuke?.event_config?.[event], enabled: v } } } }))} />
                <label style={{ fontSize: "0.9rem" }}>Threshold:</label>
                <input type="number" min="1" max="50" style={{ width: "60px" }} value={cfg.custom_threshold || cfg.default_threshold || 3} onChange={(e) => setForm(f => ({ ...f, antinuke: { ...f.antinuke, event_config: { ...f.antinuke?.event_config, [event]: { ...f.antinuke?.event_config?.[event], custom_threshold: parseInt(e.target.value) || 1 } } } }))} />
              </div>
            </div>
          ))}
        </div>
      </>
    );

    const renderInvite = () => (
      <>
        <SectionHeader icon="📨" title="Invite Tracking" />
        <div className="field-group"><label>Invite Log Channel</label><ChannelSelect value={form.invite_log_channel} onChange={set("invite_log_channel")} /></div>
      </>
    );

    const renderReports = () => (
      <>
        <SectionHeader icon="🚩" title="Reports & Suggestions" />
        <div className="field-group"><label>Report Channel</label><ChannelSelect value={form.report_channel} onChange={set("report_channel")} /></div>
        <div className="field-group"><label>Suggestion Channel</label><ChannelSelect value={form.suggestion_channel} onChange={set("suggestion_channel")} /></div>
        <div className="field-group"><label>Bug Report Channel</label><ChannelSelect value={form.bug_report_channel} onChange={set("bug_report_channel")} /></div>
      </>
    );

    const renderForumLock = () => (
      <>
        <SectionHeader icon="🔒" title="Forum Lock" />
        <div className="field-group"><label>Forum Lock Log Channel</label><ChannelSelect value={form.forum_lock_log_channel} onChange={set("forum_lock_log_channel")} /></div>
      </>
    );

    const renderAutoTranslate = () => (
      <>
        <SectionHeader icon="🌐" title="Auto-Translate" />
        <div className="toggle-row"><div><div className="toggle-label">Auto-Translate</div><div className="toggle-desc">Automatically translate messages to a default language.</div></div><Toggle checked={!!autotranslate.enabled} onChange={setNested("autotranslate", "enabled")} /></div>
        <div className="field-group"><label>Default Language</label><select className="field-input" value={autotranslate.default_language || "en"} onChange={(e) => setNested("autotranslate", "default_language")(e.target.value)}><option value="en">English</option><option value="es">Spanish</option><option value="fr">French</option><option value="de">German</option><option value="it">Italian</option><option value="pt">Portuguese</option><option value="ru">Russian</option><option value="ja">Japanese</option><option value="ko">Korean</option><option value="zh-cn">Chinese (Simplified)</option></select></div>
        <div className="field-group"><label>Ignored Channels</label><ChannelMultiSelect value={autotranslate.ignored_channels || []} onChange={setNested("autotranslate", "ignored_channels")} channelOptions={channelOptions} placeholder="Select ignored channels..." /></div>
        <div className="field-group"><label>Ignored Roles</label><RoleMultiSelect value={autotranslate.ignored_roles || []} onChange={setNested("autotranslate", "ignored_roles")} roleOptions={roleOptions} placeholder="Select ignored roles..." /></div>
        <div className="field-group"><label>Ignored Users (User IDs)</label><input className="field-input" value={(autotranslate.ignored_users || []).join(", ")} placeholder="123456789, 987654321" onChange={(e) => setNested("autotranslate", "ignored_users")(e.target.value.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n)))} /></div>
      </>
    );

    const renderApplications = () => (
      <>
        <SectionHeader icon="📋" title="Applications" />
        <ApplicationsManager guildId={guildId} apps={apps} onAppsChange={setApps} roleOptions={roleOptions} channelOptions={channelOptions} />
      </>
    );

    switch (activeSection) {
      case "general": return renderGeneral();
      case "welcome": return renderWelcome();
      case "automod": return renderAutoMod();
      case "logging": return renderLogging();
      case "verification": return renderVerification();
      case "tickets": return renderTickets();
      case "music": return renderMusic();
      case "leveling": return renderLeveling();
      case "counting": return renderCounting();
      case "jtc": return renderJTC();
      case "antinuke": return renderAntiNuke();
      case "invite": return renderInvite();
      case "reports": return renderReports();
      case "forumlock": return renderForumLock();
      case "autotranslate": return renderAutoTranslate();
      case "applications": return renderApplications();
      default: return renderGeneral();
    }
  };

  return (
    <div className="dash-layout" style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", flexWrap: "wrap", position: "relative" }}>
      {/* ----- DESKTOP SIDEBAR ----- */}
      <div className="desktop-sidebar" style={{
        flex: "0 0 220px",
        position: "sticky",
        top: "90px",
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
        background: "rgba(255,255,255,.02)",
        border: "1px solid rgba(255,255,255,.06)",
        borderRadius: "14px",
        padding: "0.6rem",
        maxHeight: "calc(100vh - 120px)",
        overflowY: "auto",
      }}>
        {navItems.map((item) => (
          <button
            key={item.section}
            className={`dash-sidebar-item ${activeSection === item.section ? "active" : ""}`}
            onClick={() => setActiveSection(item.section)}
            style={{
              textAlign: "left",
              background: "none",
              border: "none",
              color: activeSection === item.section ? "#d4af37" : "#a09890",
              padding: "0.65rem 0.9rem",
              borderRadius: "10px",
              fontSize: "0.88rem",
              fontWeight: activeSection === item.section ? "700" : "400",
              cursor: "pointer",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* ----- MOBILE HEADER & SLIDE-OUT MENU ----- */}
      <div style={{ width: "100%" }}>
        <div className="mobile-dash-header" style={{
          display: "none",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.75rem 1rem",
          background: "rgba(255,255,255,.02)",
          borderBottom: "1px solid rgba(255,255,255,.06)",
          marginBottom: "1rem",
          borderRadius: "14px",
        }}>
          <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#e8e0d8" }}>Settings</h2>
          <button
            className="mobile-hamburger-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              background: "none",
              border: "none",
              color: "#e8e0d8",
              fontSize: "1.8rem",
              cursor: "pointer",
              padding: "0.2rem 0.5rem",
            }}
          >
            ☰
          </button>
        </div>

        <div
          ref={menuRef}
          className="mobile-slide-menu"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "280px",
            height: "100vh",
            background: "#1a1a2e",
            borderRight: "1px solid rgba(255,255,255,.06)",
            padding: "1.5rem 1rem",
            transform: isMobileMenuOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
            zIndex: 1000,
            overflowY: "auto",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h3 style={{ margin: 0, color: "#e8e0d8" }}>Settings</h3>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "#a09890",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
          {navItems.map((item) => (
            <button
              key={item.section}
              className={`dash-sidebar-item ${activeSection === item.section ? "active" : ""}`}
              onClick={() => {
                setActiveSection(item.section);
                setIsMobileMenuOpen(false);
                if (contentRef.current) contentRef.current.scrollTop = 0;
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                color: activeSection === item.section ? "#d4af37" : "#a09890",
                padding: "0.75rem 0.9rem",
                borderRadius: "10px",
                fontSize: "0.95rem",
                fontWeight: activeSection === item.section ? "700" : "400",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "inherit",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {isMobileMenuOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              zIndex: 999,
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <div ref={contentRef} className="dash-content" style={{ flex: 1, minWidth: 0 }}>
          <div className="dash-card" style={{ padding: "1.5rem" }}>
            {renderContent()}
          </div>

          <div className="save-bar" style={{
            position: "sticky",
            bottom: "1rem",
            display: "flex",
            justifyContent: "flex-end",
            gap: ".75rem",
            background: "rgba(10,10,20,.85)",
            backdropFilter: "blur(10px)",
            padding: "1rem",
            borderRadius: "14px",
            border: "1px solid rgba(255,255,255,.06)",
            marginTop: "1.5rem",
          }}>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div className="toast" style={{
          position: "fixed",
          bottom: "1.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(10,10,20,.95)",
          border: "1px solid rgba(212,175,55,.3)",
          color: "#e8e0d8",
          padding: ".8rem 1.4rem",
          borderRadius: "12px",
          fontSize: ".9rem",
          zIndex: 200,
          animation: "toastIn .3s ease",
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}