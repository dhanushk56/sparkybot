import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import { endGiveaway } from "@/lib/botApi";

export async function POST(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ detail: "Not logged in." }, { status: 401 });
  }
  try {
    const result = await endGiveaway(user.id, params.guildId, params.giveawayId);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ detail: String(err.message || err) }, { status: 502 });
  }
}
