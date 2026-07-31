function baseUrl() {
  const url = process.env.BOT_API_URL;
  if (!url) throw new Error("BOT_API_URL environment variable is not set.");
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
    body: JSON.stringify({ user_id: userId, ...patch }),
  });
}
