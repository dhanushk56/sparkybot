"use client";

import { useMemo, useRef, useState, useEffect } from "react";

function prefixOf(name) {
  return name.startsWith("//") ? "prefix" : "slash";
}

// ---------- Module filter dropdown ----------
function ModuleDropdown({ value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const label = value === "all" ? "All Modules" : value;

  return (
    <div ref={ref} className="module-dropdown">
      <button
        type="button"
        className={`module-dropdown-btn ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((o) => !o)}
      >
        <span>{label}</span>
        <i className="fas fa-chevron-down module-dropdown-chevron"></i>
      </button>
      {isOpen && (
        <div className="dropdown-panel module-dropdown-panel">
          {options.map((m) => (
            <div
              key={m}
              className={`module-dropdown-item ${value === m ? "is-selected" : ""}`}
              onClick={() => {
                onChange(m);
                setIsOpen(false);
              }}
            >
              <span>{m === "all" ? "All Modules" : m}</span>
              {value === m && <i className="fas fa-check"></i>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommandsTable({ commands }) {
  const allCommands = commands || [];
  const [type, setType] = useState("prefix"); // "prefix" | "slash"
  const [module, setModule] = useState("all");
  const [search, setSearch] = useState("");

  const byType = useMemo(
    () => allCommands.filter((c) => prefixOf(c.name) === type),
    [allCommands, type]
  );

  const modules = useMemo(() => {
    const set = new Set(byType.map((c) => c.module));
    return ["all", ...Array.from(set).sort()];
  }, [byType]);

  // If the currently-selected module doesn't exist for this command type
  // (e.g. it was only present on the other tab), fall back to "all" instead
  // of silently showing an empty grid.
  useEffect(() => {
    if (module !== "all" && !modules.includes(module)) setModule("all");
  }, [modules, module]);

  const filtered = byType.filter((c) => {
    const matchesModule = module === "all" || c.module === module;
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
    return matchesModule && matchesSearch;
  });

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
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
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
          <ModuleDropdown value={module} options={modules} onChange={setModule} />
        </div>
      </div>

      <div key={type} className="commands-fade-in">
        {filtered.length > 0 ? (
          <>
            <p className="commands-count">
              {filtered.length} command{filtered.length === 1 ? "" : "s"}
              {module !== "all" ? ` in ${module}` : ""}
            </p>
            <div className="commands-grid">
              {filtered.map((c, i) => (
                <div key={c.name} className="command-card" style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}>
                  <div className="command-card-top">
                    <span className="cmd-name">{c.name}</span>
                    <span className="cmd-module">{c.module}</span>
                  </div>
                  <p className="cmd-desc" style={{ margin: 0 }}>{c.description}</p>
                </div>
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
