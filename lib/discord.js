const API_BASE = "https://discord.com/api/v10";

export function getAuthorizeUrl(redirectUri) {
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "identify guilds",
    prompt: "consent",
  });
  return `${API_BASE}/oauth2/authorize?${params.toString()}`;
}

export async function exchangeCode(code, redirectUri) {
  const body = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });

  const res = await fetch(`${API_BASE}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    throw new Error(`Discord token exchange failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchDiscordUser(accessToken) {
  const res = await fetch(`${API_BASE}/users/@me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch Discord user: ${res.status}`);
  return res.json();
}

export async function fetchDiscordGuilds(accessToken) {
  const res = await fetch(`${API_BASE}/users/@me/guilds`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch Discord guilds: ${res.status}`);
  return res.json();
}

const MANAGE_GUILD = 0x20;
const ADMINISTRATOR = 0x8;

export function canManageGuild(permissionsField) {
  const perms = BigInt(permissionsField);
  return (perms & BigInt(MANAGE_GUILD)) === BigInt(MANAGE_GUILD) ||
         (perms & BigInt(ADMINISTRATOR)) === BigInt(ADMINISTRATOR);
}

export function avatarUrl(user) {
  if (!user.avatar) {
    const fallbackIndex = user.discriminator && user.discriminator !== "0"
      ? Number(user.discriminator) % 5
      : Number(BigInt(user.id) >> 22n) % 6;
    return `https://cdn.discordapp.com/embed/avatars/${fallbackIndex}.png`;
  }
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
}

export function guildIconUrl(guild) {
  if (!guild.icon) return null;
  return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`;
}
