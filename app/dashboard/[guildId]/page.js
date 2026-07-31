// app/dashboard/[guildId]/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SettingsForm from "@/components/SettingsForm";
import { getGuildSettings } from "@/lib/botApi";

export default function DashboardPage({ params }) {
  const { guildId } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getGuildSettings(guildId);
        setSettings(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchData();
  }, [guildId]);

  if (loading) return <div className="loading">Loading settings...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!settings) return <div className="error">No settings found.</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>{settings.guild?.name || "Server Settings"}</h1>
        <p>Configure all bot features for this server.</p>
      </div>
      <SettingsForm guildId={guildId} initial={settings} />
    </div>
  );
}
