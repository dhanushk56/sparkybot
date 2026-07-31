function baseUrl() {
  // Use the environment variable if set, otherwise fall back to a hardcoded value for testing
  const url = process.env.BOT_API_URL || "http://69.164.248.34:25567";
  console.log("[botApi] Using BOT_API_URL:", url);
  return url.replace(/\/$/, "");
}

async function call(path, options = {}) {
  const res = await fetch(`${baseUrl()}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Api-Secret": process.env.BOT_API_SECRET || "",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Bot API error ${res.status}: ${text}`);
  }
  return res.json();
}

export async function getBotStatus() {
  return call("/api/status");
}

export async function getMutualGuildIds(userId) {
  const data = await call(`/api/users/${userId}/guilds`);
  return data.guild_ids || [];
}

export async function getGuildSettings(userId, guildId) {
  return call(`/api/guilds/${guildId}/settings?user_id=${userId}`);
}

export async function updateGuildSettings(userId, guildId, patch) {
  return call(`/api/guilds/${guildId}/settings`, {
    method: "POST",
    body: JSON.stringify({ ...patch, user_id: userId }),
  });
}

export async function getApplications(userId, guildId) {
  return call(`/api/guilds/${guildId}/applications?user_id=${userId}`);
}

export async function createApplication(userId, guildId, data) {
  return call(`/api/guilds/${guildId}/applications`, {
    method: "POST",
    body: JSON.stringify({ ...data, user_id: userId }),
  });
}

export async function updateApplication(userId, guildId, name, data) {
  return call(`/api/guilds/${guildId}/applications/${encodeURIComponent(name)}`, {
    method: "PUT",
    body: JSON.stringify({ ...data, user_id: userId }),
  });
}

export async function toggleApplication(userId, guildId, name, open) {
  return call(`/api/guilds/${guildId}/applications/${encodeURIComponent(name)}`, {
    method: "PATCH",
    body: JSON.stringify({ open, user_id: userId }),
  });
}

export async function deleteApplication(userId, guildId, name) {
  return call(`/api/guilds/${guildId}/applications/${encodeURIComponent(name)}`, {
    method: "DELETE",
    body: JSON.stringify({ user_id: userId }),
  });
}
