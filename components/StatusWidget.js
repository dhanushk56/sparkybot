"use client";

import { useEffect, useState } from "react";

export default function StatusWidget() {
  const [status, setStatus] = useState({ state: "unknown", servers: "--", users: "--", uptime: "--" });

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/status", { cache: "no-store" });
        if (!res.ok) throw new Error("bad status");
        const data = await res.json();
        if (!cancelled) {
          setStatus({
            state: data.online ? "online" : "offline",
            servers: data.servers ?? "--",
            users: data.users ?? "--",
            uptime: data.uptime ?? "--",
          });
        }
      } catch {
        if (!cancelled) setStatus((s) => ({ ...s, state: "offline" }));
      }
    }

    poll();
    const interval = setInterval(poll, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const label =
    status.state === "online" ? "Online" : status.state === "offline" ? "Offline" : "Checking status...";

  return (
    <div className="status-section">
      <div className="status-left">
        <span className={`status-dot ${status.state}`} />
        <span className="status-label">
          <span className={status.state}>{label}</span>
        </span>
      </div>
      <div className="status-stats">
        <div className="status-stat">
          <span className="number">{status.servers}</span>
          <span className="label">Servers</span>
        </div>
        <div className="status-stat">
          <span className="number">{status.users}</span>
          <span className="label">Users</span>
        </div>
        <div className="status-stat">
          <span className="number">{status.uptime}</span>
          <span className="label">Uptime</span>
        </div>
      </div>
    </div>
  );
}
