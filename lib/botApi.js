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
  return call(`/api/guilds/${guildId}/applications/${encodeURIComponent(name)}?user_id=${userId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function toggleApplication(userId, guildId, name, open) {
  return call(`/api/guilds/${guildId}/applications/${encodeURIComponent(name)}?user_id=${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ open }),
  });
}

export async function deleteApplication(userId, guildId, name) {
  // ✅ FIXED: user_id as query parameter
  return call(`/api/guilds/${guildId}/applications/${encodeURIComponent(name)}?user_id=${userId}`, {
    method: "DELETE",
    // No body needed
  });
}

export async function getReviews() {
  return call("/api/reviews");
}

export async function createReview(user, rating, text) {
  return call("/api/reviews", {
    method: "POST",
    body: JSON.stringify({ user_id: user.id, username: user.username, avatar: user.avatar, rating, text }),
  });
}

export async function editReview(userId, reviewId, rating, text) {
  return call(`/api/reviews/${reviewId}`, {
    method: "PUT",
    body: JSON.stringify({ user_id: userId, rating, text }),
  });
}

export async function deleteReview(userId, reviewId) {
  return call(`/api/reviews/${reviewId}?user_id=${userId}`, {
    method: "DELETE",
  });
}

export async function toggleReviewLike(userId, reviewId) {
  return call(`/api/reviews/${reviewId}/like`, {
    method: "PATCH",
    body: JSON.stringify({ user_id: userId }),
  });
}

export async function replyToReview(user, reviewId, text) {
  return call(`/api/reviews/${reviewId}/reply`, {
    method: "POST",
    body: JSON.stringify({ user_id: user.id, username: user.username, avatar: user.avatar, text }),
  });
}

// ---------- Premium (read-only) ----------

export async function getPremiumStatus(userId, guildId) {
  return call(`/api/guilds/${guildId}/premium?user_id=${userId}`);
}

// Note: Auto-Translate uses getGuildSettings/updateGuildSettings (below,
// the "autotranslate" key) -- it doesn't need its own functions.

// ---------- YouTube subscriptions ----------

export async function getYoutubeSubs(userId, guildId) {
  return call(`/api/guilds/${guildId}/youtube?user_id=${userId}`);
}

export async function addYoutubeSub(userId, guildId, data) {
  return call(`/api/guilds/${guildId}/youtube`, {
    method: "POST",
    body: JSON.stringify({ ...data, user_id: userId }),
  });
}

export async function editYoutubeSub(userId, guildId, ytChannelId, data) {
  return call(`/api/guilds/${guildId}/youtube/${encodeURIComponent(ytChannelId)}`, {
    method: "PATCH",
    body: JSON.stringify({ ...data, user_id: userId }),
  });
}

export async function deleteYoutubeSub(userId, guildId, ytChannelId) {
  return call(`/api/guilds/${guildId}/youtube/${encodeURIComponent(ytChannelId)}?user_id=${userId}`, {
    method: "DELETE",
  });
}

// ---------- Reaction-role button panels ----------

export async function getReactionPanels(userId, guildId) {
  return call(`/api/guilds/${guildId}/reaction-roles?user_id=${userId}`);
}

export async function createReactionPanel(userId, guildId, data) {
  return call(`/api/guilds/${guildId}/reaction-roles`, {
    method: "POST",
    body: JSON.stringify({ ...data, user_id: userId }),
  });
}

export async function editReactionPanel(userId, guildId, messageId, data) {
  return call(`/api/guilds/${guildId}/reaction-roles/${messageId}`, {
    method: "PATCH",
    body: JSON.stringify({ ...data, user_id: userId }),
  });
}

export async function deleteReactionPanel(userId, guildId, messageId) {
  return call(`/api/guilds/${guildId}/reaction-roles/${messageId}?user_id=${userId}`, {
    method: "DELETE",
  });
}

export async function addReactionPanelRole(userId, guildId, messageId, data) {
  return call(`/api/guilds/${guildId}/reaction-roles/${messageId}/roles`, {
    method: "POST",
    body: JSON.stringify({ ...data, user_id: userId }),
  });
}

export async function removeReactionPanelRole(userId, guildId, messageId, roleId) {
  return call(`/api/guilds/${guildId}/reaction-roles/${messageId}/roles/${roleId}?user_id=${userId}`, {
    method: "DELETE",
  });
}

// ---------- Giveaways ----------

export async function getGiveaways(userId, guildId) {
  return call(`/api/guilds/${guildId}/giveaways?user_id=${userId}`);
}

export async function createGiveaway(userId, guildId, data) {
  return call(`/api/guilds/${guildId}/giveaways`, {
    method: "POST",
    body: JSON.stringify({ ...data, user_id: userId }),
  });
}

export async function editGiveaway(userId, guildId, giveawayId, data) {
  return call(`/api/guilds/${guildId}/giveaways/${giveawayId}`, {
    method: "PATCH",
    body: JSON.stringify({ ...data, user_id: userId }),
  });
}

export async function endGiveaway(userId, guildId, giveawayId) {
  return call(`/api/guilds/${guildId}/giveaways/${giveawayId}/end?user_id=${userId}`, {
    method: "POST",
  });
}

export async function rerollGiveaway(userId, guildId, giveawayId, winners = 1) {
  return call(`/api/guilds/${guildId}/giveaways/${giveawayId}/reroll`, {
    method: "POST",
    body: JSON.stringify({ winners, user_id: userId }),
  });
}

export async function deleteGiveaway(userId, guildId, giveawayId) {
  return call(`/api/guilds/${guildId}/giveaways/${giveawayId}?user_id=${userId}`, {
    method: "DELETE",
  });
}
