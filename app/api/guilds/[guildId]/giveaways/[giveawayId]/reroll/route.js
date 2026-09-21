import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import { rerollGiveaway } from "@/lib/botApi";

export async function POST(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ detail: "Not logged in." }, { status: 401 });
  }
  const { winners } = await request.json().catch(() => ({}));
  try {
    const result = await rerollGiveaway(user.id, params.guildId, params.giveawayId, winners || 1);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ detail: String(err.message || err) }, { status: 502 });
  }
}
