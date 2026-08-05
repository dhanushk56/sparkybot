// lib/reviewAuth.js
import { getCurrentUser } from "@/lib/currentUser";

export async function getReviewUser(request) {
  try {
    const sessionUser = await getCurrentUser();
    if (sessionUser) return sessionUser;
  } catch {}

  const authHeader = request.headers.get("Authorization") || "";
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      const res = await fetch("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (!data.id) return null;
      return {
        id: data.id,
        username: data.username,
        avatar: data.avatar
          ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
          : null,
      };
    } catch {
      return null;
    }
  }
  return null;
}
