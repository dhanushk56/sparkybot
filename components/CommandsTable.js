"use client";

import { useMemo, useState } from "react";

export default function CommandsTable({ commands = [] }) {
  const [module, setModule] = useState("all");
  const [search, setSearch] = useState("");

  const modules = useMemo(() => {
    const set = new Set(commands.map((c) => c.module));
    return ["all", ...Array.from(set).sort()];
  }, [commands]);

  const filtered = commands.filter((c) => {
    const matchesModule = module === "all" || c.module === module;
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
    return matchesModule && matchesSearch;
  });

  return (
    <>
      <div className="commands-search-wrap">
        <div style={{ position: "relative" }}>
          <i className="fas fa-magnifying-glass" style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--db-faint)", fontSize: "0.85rem" }}></i>
          <input
            type="text"
            className="field-input"
            style={{ width: "100%", paddingLeft: "2.2rem" }}
            placeholder="Search commands by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="commands-module-pills">
        {modules.map((m) => (
          <button
            key={m}
            type="button"
            className={`pill ${module === m ? "pill-active" : "pill-inactive"}`}
            onClick={() => setModule(m)}
          >
            {m === "all" ? "All Modules" : m}
          </button>
        ))}
      </div>

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
    </>
  );
}
