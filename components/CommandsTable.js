"use client";

import { useEffect, useMemo, useState } from "react";

export default function CommandsTable() {
  const [commands, setCommands] = useState([]);
  const [module, setModule] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/commands")
      .then((r) => r.json())
      .then((data) => setCommands(data.commands || []))
      .catch(() => setCommands([]));
  }, []);

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
      <div className="filter-bar">
        <select value={module} onChange={(e) => setModule(e.target.value)}>
          {modules.map((m) => (
            <option key={m} value={m}>{m === "all" ? "All Modules" : m}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search commands by name or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length > 0 ? (
        <div className="commands-table-wrap">
          <table className="commands-table">
            <thead>
              <tr>
                <th>Command</th>
                <th>Description</th>
                <th style={{ textAlign: "right" }}>Module</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.name}>
                  <td className="cmd-name">{c.name}</td>
                  <td className="cmd-desc">{c.description}</td>
                  <td style={{ textAlign: "right" }}><span className="cmd-module">{c.module}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: "center", color: "#808098", fontSize: "1.1rem", padding: "3rem 0" }}>
          No commands found.
        </div>
      )}
    </>
  );
}
