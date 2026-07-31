import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import { updateGuildSettings } from "@/lib/botApi";

export async function POST(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const patch = await request.json();
  try {
    const result = await updateGuildSettings(user.id, params.guildId, patch);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err.message || err) }, { status: 502 });
  }
}
