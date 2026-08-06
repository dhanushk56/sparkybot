"use client";

import { useState, useEffect } from "react";
import UptimeCounter from "@/components/UptimeCounter";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Checking...");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Fetch bot status
  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        const online = data.status === "online" || data.uptime > 0;
        setIsOnline(online);
        setStatusMessage(online ? "🟢 Online" : "🔴 Offline");
      })
      .catch(() => {
        setIsOnline(false);
        setStatusMessage("🔴 Offline");
      });
  }, []);

  // ... (features, logo, banner URLs remain unchanged)
  const features = [ /* your features array */ ];
  const logoUrl = "your-logo-url";
  const bannerUrl = "your-banner-url";

  if (loading) {
    return ( /* loader (same as before) */ );
  }

  return (
    <div style={{ /* ... same background */ }}>
      {/* Background overlay (same) */}

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header with Banner */}

        {/* Status Boxes */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2rem", marginTop: "-60px", position: "relative", zIndex: 3, flexWrap: "wrap", padding: "0 1rem" }}>
          {/* Bot Status – now dynamic */}
          <div>
            <div style={{ /* styles */ }}>
              <div>{/* SVG icon */}</div>
              <div>
                <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                  <span style={{ color: isOnline ? "#4ade80" : "#f87171" }}>
                    {statusMessage}
                  </span>
                </div>
                <div style={{ fontSize: "0.85rem", color: "#a09890" }}>
                  sparkybot.bond
                </div>
              </div>
            </div>
          </div>

          {/* Logo */}
          <div style={{ animation: "float 4s ease-in-out infinite" }}>
            <a href="/">
              <img alt="SparkyBot" src={logoUrl} style={{ height: "150px", maxWidth: "100%", filter: "drop-shadow(0 0 30px rgba(212,175,55,0.15))" }} />
            </a>
          </div>

          {/* Discord Button with Emoji */}
          <a href="https://support.sparkybot.bond" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
            <div style={{ /* styles */ }}>
              <img src="https://cdn3.emoji.gg/emojis/660815-discordlogo.png" width="32" height="32" alt="Discord" />
              <span style={{ color: "#5865F2", fontSize: "1.1rem", fontWeight: 600 }}>Discord</span>
            </div>
          </a>
        </div>

        {/* Uptime Counter – now a single row */}
        <div style={{ maxWidth: "900px", margin: "1.5rem auto 0", padding: "0 1.5rem", animation: "fadeInUp 0.8s ease forwards", animationDelay: "0.3s", opacity: 0 }}>
          <h2 style={{ textAlign: "center", color: "#808098", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.15rem", marginBottom: "0.5rem" }}>
            Bot Uptime
          </h2>
          <UptimeCounter />
        </div>

        {/* Features Section (unchanged) */}

        {/* Footer (unchanged) */}
      </div>
    </div>
  );
}