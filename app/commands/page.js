"use client";

import { useMemo, useState } from "react";

// Commands hidden from the public dashboard. These belong to the bot owner
// (global) or the server owner (extra-owner grants) and shouldn't be surfaced
// on a public command list.
const OWNER_ONLY_PATTERNS = [/\(owner only\)/i, /\[owner\]/];

function isOwnerOnly(cmd) {
  if (cmd.module === "Owner") return true;
  const d = cmd.description || "";
  return OWNER_ONLY_PATTERNS.some((re) => re.test(d));
}

// Preferred display order for the left pane. Anything not listed here falls
// through to the end alphabetically.
const MODULE_ORDER = [
  "Community",
  "Economy",
  "Help",
  "Media & Utility",
  "Premium",
  "Security",
  "Server Setup",
];

export default function CommandsTable({ commands }) {
  const visible = useMemo(
    () => commands.filter((c) => !isOwnerOnly(c)),
    [commands]
  );

  const modules = useMemo(() => {
    const present = new Set(visible.map((c) => c.module));
    const ordered = MODULE_ORDER.filter((m) => present.has(m));
    const extras = [...present]
      .filter((m) => !MODULE_ORDER.includes(m))
      .sort();
    return [...ordered, ...extras];
  }, [visible]);

  const [active, setActive] = useState(modules[0] ?? null);
  const [query, setQuery] = useState("");

  const searching = query.trim().length > 0;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return visible.filter((c) => c.module === active);
    return visible.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [visible, active, query]);

  // Group results by module so search hits are still organized.
  const grouped = useMemo(() => {
    const map = new Map();
    if (searching) {
      for (const c of filtered) {
        if (!map.has(c.module)) map.set(c.module, []);
        map.get(c.module).push(c);
      }
    } else if (active) {
      map.set(active, filtered);
    }
    return map;
  }, [filtered, active, searching]);

  const countFor = (m) => visible.filter((c) => c.module === m).length;
  const totalCount = visible.length;

  return (
    <div className="cmds-layout">
      <aside className="cmds-sidebar">
        <div className="cmds-sidebar-head">
          <span className="cmds-sidebar-title">Modules</span>
          <span className="cmds-sidebar-total">{totalCount}</span>
        </div>

        <input
          type="search"
          className="cmds-search"
          placeholder="Search commands..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search commands"
        />

        <nav className="cmds-nav" aria-label="Command modules">
          {modules.map((m) => {
            const isActive = !searching && m === active;
            return (
              <button
                key={m}
                type="button"
                className={`cmds-nav-item${isActive ? " is-active" : ""}`}
                onClick={() => {
                  setActive(m);
                  setQuery("");
                }}
              >
                <span className="cmds-nav-label">{m}</span>
                <span className="cmds-nav-count">{countFor(m)}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <section className="cmds-content">
        {grouped.size === 0 ? (
          <p className="cmds-empty">
            No commands match &ldquo;{query}&rdquo;.
          </p>
        ) : (
          [...grouped.entries()].map(([module, cmds]) => (
            <div key={module} className="cmds-group">
              <h2 className="cmds-group-title">
                {module}
                <span className="cmds-group-count">{cmds.length}</span>
              </h2>
              <ul className="cmds-list">
                {cmds.map((c) => (
                  <li key={c.name} className="cmds-item">
                    <code className="cmds-name">{c.name}</code>
                    <p className="cmds-desc">{c.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
