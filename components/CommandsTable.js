"use client";

import { useMemo, useState } from "react";

export default function CommandsTable({ commands = [] }) {
  const [module, setModule] = useState("all");
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("prefix"); // "prefix" | "slash"

  const isPrefixCmd = (c) => c.name.startsWith("//");
  const isSlashCmd = (c) => c.name.startsWith("/") && !c.name.startsWith("//");

  const modules = useMemo(() => {
    const inMode = commands.filter((c) => (mode === "prefix" ? isPrefixCmd(c) : isSlashCmd(c)));
    const counts = {};
    for (const c of inMode) counts[c.module] = (counts[c.module] || 0) + 1;
    const names = Object.keys(counts).sort((a, b) => a.localeCompare(b));
    return [{ name: "all", count: inMode.length }, ...names.map((n) => ({ name: n, count: counts[n] }))];
  }, [commands, mode]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return commands
      .filter((c) => module === "all" || c.module === module)
      .filter((c) => (mode === "prefix" ? isPrefixCmd(c) : isSlashCmd(c)))
      .filter((c) => !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
      .sort((a, b) => a.name.replace(/^\/+/, "").localeCompare(b.name.replace(/^\/+/, "")));
  }, [commands, module, search, mode]);

  return (
    <div className="commands-shell">
      <aside className="commands-sidebar">
        {modules.map((m) => (
          <button
            key={m.name}
            type="button"
            className={`commands-sidebar-item ${module === m.name ? "active" : ""}`}
            onClick={() => setModule(m.name)}
          >
            <span>{m.name === "all" ? "All Modules" : m.name}</span>
            <span className="commands-sidebar-count">{m.count}</span>
          </button>
        ))}
      </aside>

      <div className="commands-main">
        <div className="commands-toolbar">
          <div style={{ position: "relative", flex: 1 }}>
            <i className="fas fa-magnifying-glass" style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--db-faint)", fontSize: "0.85rem" }}></i>
            <input
              type="text"
              className="field-input"
              style={{ width: "100%", paddingLeft: "2.2rem" }}
              placeholder="Search commands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="mode-toggle" role="tablist" aria-label="Command type">
            <button
              type="button"
              className={mode === "prefix" ? "active" : ""}
              aria-label="Prefix commands"
              onClick={() => setMode("prefix")}
            >
              //
            </button>
            <button
              type="button"
              className={mode === "slash" ? "active" : ""}
              aria-label="Slash commands"
              onClick={() => setMode("slash")}
            >
              /
            </button>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="commands-list">
            {filtered.map((c, i) => (
              <div key={`${c.module}:${c.name}`} className="command-row" style={{ animationDelay: `${Math.min(i, 16) * 20}ms` }}>
                <div className="command-row-top">
                  <span className="cmd-name">{c.name}</span>
                  {module === "all" && <span className="cmd-module">{c.module}</span>}
                </div>
                <p className="cmd-desc">{c.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", color: "var(--db-muted)", fontSize: "1rem", padding: "3rem 0" }}>
            No {mode === "prefix" ? "prefix" : "slash"} commands found{search ? ` for "${search}"` : ""}.
          </div>
        )}
      </div>
    </div>
  );
}
