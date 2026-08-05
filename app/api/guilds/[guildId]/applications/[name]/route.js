import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";

// Replace with your actual bot API base URL
const BOT_API_URL = process.env.BOT_API_URL || "https://your-bot-api.com";

export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ detail: "Not logged in." }, { status: 401 });
    }

    const { guildId, name } = params;
    const data = await request.json();

    const url = `${BOT_API_URL}/guilds/${guildId}/applications/${encodeURIComponent(name)}?user_id=${user.id}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { detail: `Bot API error: ${errorText}` },
        { status: res.status }
      );
    }

    const result = await res.json();
    return NextResponse.json(result);
  } catch (err) {
    console.error("[API] PUT error:", err);
    return NextResponse.json(
      { detail: err.message || "Internal server error" },
      { status: 502 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ detail: "Not logged in." }, { status: 401 });
    }

    const { guildId, name } = params;
    const { open } = await request.json();

    const url = `${BOT_API_URL}/guilds/${guildId}/applications/${encodeURIComponent(name)}?user_id=${user.id}`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ open }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { detail: `Bot API error: ${errorText}` },
        { status: res.status }
      );
    }

    const result = await res.json();
    return NextResponse.json(result);
  } catch (err) {
    console.error("[API] PATCH error:", err);
    return NextResponse.json(
      { detail: err.message || "Internal server error" },
      { status: 502 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ detail: "Not logged in." }, { status: 401 });
    }

    const { guildId, name } = params;

    // ✅ The bot API requires user_id as a query parameter
    const url = `${BOT_API_URL}/guilds/${guildId}/applications/${encodeURIComponent(name)}?user_id=${user.id}`;

    const res = await fetch(url, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { detail: `Bot API error: ${errorText}` },
        { status: res.status }
      );
    }

    // DELETE usually returns 204 No Content, but handle JSON if any
    const result = res.status === 204 ? {} : await res.json();
    return NextResponse.json(result);
  } catch (err) {
    console.error("[API] DELETE error:", err);
    return NextResponse.json(
      { detail: err.message || "Internal server error" },
      { status: 502 }
    );
  }
}
