"use client";

import { useMemo, useRef, useState, useEffect } from "react";

function prefixOf(name) {
  return name.startsWith("//") ? "prefix" : "slash";
}

// ---------- One collapsible module section ----------
function ModuleSection({ module, commands, isOpen, onToggle, searchActive }) {
  return (
    <div className={`module-section ${isOpen ? "is-open" : ""}`}>
      <button type="button" className="module-section-header" onClick={onToggle} aria-expanded={isOpen}>
        <span className="module-section-title">{module}</span>
        <span className="module-section-count">{commands.length}</span>
        <i className="fas fa-chevron-down module-section-chevron"></i>
      </button>
      <div className="module-section-body" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
        <div className="module-section-inner">
          <div className="commands-grid">
            {commands.map((c, i) => (
              <div key={c.name} className="command-card" style={searchActive ? undefined : { animationDelay: `${Math.min(i, 12) * 25}ms` }}>
                <div className="command-card-top">
                  <span className="cmd-name">{c.name}</span>
                </div>
                <p className="cmd-desc" style={{ margin: 0 }}>{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CommandsTable({ commands }) {
  const allCommands = commands || [];
  const [type, setType] = useState("prefix"); // "prefix" | "slash"
  const [search, setSearch] = useState("");
  const [openModules, setOpenModules] = useState(() => new Set());

  const byType = useMemo(
    () => allCommands.filter((c) => prefixOf(c.name) === type),
    [allCommands, type]
  );

  const q = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return byType;
    return byType.filter((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  }, [byType, q]);

  // Group into modules, in a stable, sensible order (by descending command count).
  const grouped = useMemo(() => {
    const map = new Map();
    for (const c of filtered) {
      if (!map.has(c.module)) map.set(c.module, []);
      map.get(c.module).push(c);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [filtered]);

  // While searching, every module with a match auto-expands so results are visible
  // without extra clicks; clearing the search restores whatever was manually open.
  useEffect(() => {
    if (q) setOpenModules(new Set(grouped.map(([m]) => m)));
  }, [q, grouped]);

  const toggleModule = (mod) => {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(mod)) next.delete(mod);
      else next.add(mod);
      return next;
    });
  };

  const expandAll = () => setOpenModules(new Set(grouped.map(([m]) => m)));
  const collapseAll = () => setOpenModules(new Set());

  const counts = useMemo(() => {
    const prefix = allCommands.filter((c) => prefixOf(c.name) === "prefix").length;
    const slash = allCommands.length - prefix;
    return { prefix, slash };
  }, [allCommands]);

  return (
    <>
      <div className="commands-type-toggle" role="tablist" aria-label="Command type">
        <button
          type="button"
          role="tab"
          aria-selected={type === "prefix"}
          className={`type-toggle-btn ${type === "prefix" ? "is-active" : ""}`}
          onClick={() => setType("prefix")}
        >
          <i className="fas fa-terminal"></i>
          Prefix Commands
          <span className="type-toggle-count">{counts.prefix}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={type === "slash"}
          className={`type-toggle-btn ${type === "slash" ? "is-active" : ""}`}
          onClick={() => setType("slash")}
        >
          <i className="fas fa-slash"></i>
          Slash Commands
          <span className="type-toggle-count">{counts.slash}</span>
        </button>
        <span className={`type-toggle-thumb ${type === "slash" ? "is-slash" : ""}`} aria-hidden="true" />
      </div>

      <div className="commands-search-wrap">
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 260px", minWidth: 0 }}>
            <i className="fas fa-magnifying-glass" style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--db-faint)", fontSize: "0.85rem" }}></i>
            <input
              type="text"
              className="field-input"
              style={{ width: "100%", paddingLeft: "2.2rem" }}
              placeholder={`Search ${type} commands by name or description...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
            <button type="button" className="btn btn-secondary" style={{ padding: "0.5rem 0.9rem", fontSize: "0.8rem" }} onClick={expandAll}>Expand all</button>
            <button type="button" className="btn btn-secondary" style={{ padding: "0.5rem 0.9rem", fontSize: "0.8rem" }} onClick={collapseAll}>Collapse all</button>
          </div>
        </div>
      </div>

      <div key={type} className="commands-fade-in">
        {grouped.length > 0 ? (
          <>
            <p className="commands-count">
              {filtered.length} command{filtered.length === 1 ? "" : "s"} across {grouped.length} module{grouped.length === 1 ? "" : "s"}
            </p>
            <div className="module-sections">
              {grouped.map(([module, cmds]) => (
                <ModuleSection
                  key={module}
                  module={module}
                  commands={cmds}
                  isOpen={openModules.has(module)}
                  onToggle={() => toggleModule(module)}
                  searchActive={!!q}
                />
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", color: "var(--db-muted)", fontSize: "1.1rem", padding: "3rem 0" }}>
            No commands found{search ? ` for "${search}"` : ""}.
          </div>
        )}
      </div>
    </>
  );
}
