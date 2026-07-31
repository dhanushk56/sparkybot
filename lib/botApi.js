// lib/botApi.js
import { getApiSecret } from "@/lib/auth";

const BOT_API_URL = process.env.NEXT_PUBLIC_BOT_API_URL || "http://localhost:25567";

export async function getGuildSettings(guildId) {
  const secret = getApiSecret();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  const res = await fetch(
    `${BOT_API_URL}/api/guilds/${guildId}/settings?user_id=${user.id}`,
    {
      headers: {
        "x-api-secret": secret,
        "Content-Type": "application/json",
      },
    }
  );
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to fetch settings");
  }
  
  return res.json();
}

export async function saveGuildSettings(guildId, settings) {
  const secret = getApiSecret();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  const res = await fetch(
    `${BOT_API_URL}/api/guilds/${guildId}/settings`,
    {
      method: "POST",
      headers: {
        "x-api-secret": secret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...settings, user_id: user.id }),
    }
  );
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to save settings");
  }
  
  return res.json();
}

// NEW: Applications API
export async function getApplications(guildId) {
  const secret = getApiSecret();
  const res = await fetch(
    `${BOT_API_URL}/api/guilds/${guildId}/applications`,
    {
      headers: {
        "x-api-secret": secret,
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch applications");
  return res.json();
}

export async function createApplication(guildId, data) {
  const secret = getApiSecret();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const res = await fetch(
    `${BOT_API_URL}/api/guilds/${guildId}/applications`,
    {
      method: "POST",
      headers: {
        "x-api-secret": secret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, user_id: user.id }),
    }
  );
  if (!res.ok) throw new Error("Failed to create application");
  return res.json();
}

export async function updateApplication(guildId, name, data) {
  const secret = getApiSecret();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const res = await fetch(
    `${BOT_API_URL}/api/guilds/${guildId}/applications/${encodeURIComponent(name)}`,
    {
      method: "PUT",
      headers: {
        "x-api-secret": secret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, user_id: user.id }),
    }
  );
  if (!res.ok) throw new Error("Failed to update application");
  return res.json();
}

export async function deleteApplication(guildId, name) {
  const secret = getApiSecret();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const res = await fetch(
    `${BOT_API_URL}/api/guilds/${guildId}/applications/${encodeURIComponent(name)}`,
    {
      method: "DELETE",
      headers: {
        "x-api-secret": secret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: user.id }),
    }
  );
  if (!res.ok) throw new Error("Failed to delete application");
  return res.json();
}

export async function toggleApplication(guildId, name, open) {
  const secret = getApiSecret();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const res = await fetch(
    `${BOT_API_URL}/api/guilds/${guildId}/applications/${encodeURIComponent(name)}`,
    {
      method: "PATCH",
      headers: {
        "x-api-secret": secret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ open, user_id: user.id }),
    }
  );
  if (!res.ok) throw new Error("Failed to toggle application");
  return res.json();
}
