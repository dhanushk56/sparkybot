import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import { getPremiumStatus } from "@/lib/botApi";

export async function GET(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ detail: "Not logged in." }, { status: 401 });
  }
  try {
    const result = await getPremiumStatus(user.id, params.guildId);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ detail: String(err.message || err) }, { status: 502 });
  }
}
