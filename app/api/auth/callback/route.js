import { NextResponse } from "next/server";
import { exchangeCode, fetchDiscordUser, fetchDiscordGuilds, canManageGuild } from "@/lib/discord";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE } from "@/lib/session";

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/dashboard?error=missing_code", request.url));
  }

  const redirectUri = new URL("/api/auth/callback", request.url).toString();

  try {
    const tokenData = await exchangeCode(code, redirectUri);
    const user = await fetchDiscordUser(tokenData.access_token);
    const guilds = await fetchDiscordGuilds(tokenData.access_token);

    const manageable = guilds
      .filter((g) => canManageGuild(g.permissions))
      .map((g) => ({ id: g.id, name: g.name, icon: g.icon }));

    const session = await createSessionToken({
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      guilds: manageable,
    });

    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.cookies.set(SESSION_COOKIE_NAME, session, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_COOKIE_MAX_AGE,
    });
    return response;
  } catch (err) {
    console.error("Discord OAuth callback failed:", err);
    return NextResponse.redirect(new URL("/dashboard?error=auth_failed", request.url));
  }
}
