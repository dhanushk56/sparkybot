// lib/botApi.js
import { getApiSecret, getUserId } from "@/lib/auth";

// Hardcoded bot API URL – change this to your bot's public IP/port
const BOT_API_URL = "http://69.164.248.34:25567";

/**
 * Fetch all settings for a guild from the bot.
 */
export async function getGuildSettings(guildId) {
  const secret = getApiSecret();
  const userId = getUserId();

  if (!userId) {
    throw new Error("You must be logged in to view settings.");
  }

  const url = `${BOT_API_URL}/api/guilds/${guildId}/settings?user_id=${userId}`;

  const res = await fetch(url, {
    headers: {
      "x-api-secret": secret,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `Failed to fetch settings (HTTP ${res.status})`);
  }

  return res.json();
}

/**
 * Save all settings for a guild to the bot.
 */
export async function saveGuildSettings(guildId, settings) {
  const secret = getApiSecret();
  const userId = getUserId();

  if (!userId) {
    throw new Error("You must be logged in to save settings.");
  }

  const payload = { ...settings, user_id: userId };

  const res = await fetch(`${BOT_API_URL}/api/guilds/${guildId}/settings`, {
    method: "POST",
    headers: {
      "x-api-secret": secret,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `Failed to save settings (HTTP ${res.status})`);
  }

  return res.json();
}

// ---------- Applications API ----------

/**
 * Fetch all applications for a guild.
 */
export async function getApplications(guildId) {
  const secret = getApiSecret();

  const res = await fetch(`${BOT_API_URL}/api/guilds/${guildId}/applications`, {
    headers: {
      "x-api-secret": secret,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `Failed to fetch applications (HTTP ${res.status})`);
  }

  return res.json();
}

/**
 * Create a new application.
 */
export async function createApplication(guildId, data) {
  const secret = getApiSecret();
  const userId = getUserId();

  const res = await fetch(`${BOT_API_URL}/api/guilds/${guildId}/applications`, {
    method: "POST",
    headers: {
      "x-api-secret": secret,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data, user_id: userId }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `Failed to create application (HTTP ${res.status})`);
  }

  return res.json();
}

/**
 * Update an existing application.
 */
export async function updateApplication(guildId, name, data) {
  const secret = getApiSecret();
  const userId = getUserId();

  const res = await fetch(`${BOT_API_URL}/api/guilds/${guildId}/applications/${encodeURIComponent(name)}`, {
    method: "PUT",
    headers: {
      "x-api-secret": secret,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data, user_id: userId }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `Failed to update application (HTTP ${res.status})`);
  }

  return res.json();
}

/**
 * Toggle an application open/closed.
 */
export async function toggleApplication(guildId, name, open) {
  const secret = getApiSecret();
  const userId = getUserId();

  const res = await fetch(`${BOT_API_URL}/api/guilds/${guildId}/applications/${encodeURIComponent(name)}`, {
    method: "PATCH",
    headers: {
      "x-api-secret": secret,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ open, user_id: userId }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `Failed to toggle application (HTTP ${res.status})`);
  }

  return res.json();
}

/**
 * Delete an application.
 */
export async function deleteApplication(guildId, name) {
  const secret = getApiSecret();
  const userId = getUserId();

  const res = await fetch(`${BOT_API_URL}/api/guilds/${guildId}/applications/${encodeURIComponent(name)}`, {
    method: "DELETE",
    headers: {
      "x-api-secret": secret,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `Failed to delete application (HTTP ${res.status})`);
  }

  return res.json();
}

// ---------- Status API ----------

/**
 * Check if the bot API is online.
 */
export async function getBotStatus() {
  try {
    const secret = getApiSecret();
    const res = await fetch(`${BOT_API_URL}/api/status`, {
      headers: {
        "x-api-secret": secret,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) return { status: "offline" };
    return res.json();
  } catch {
    return { status: "offline" };
  }
}
