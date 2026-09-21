import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import { getAiModerationSuggestion } from "@/lib/botApi";

export async function POST(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ detail: "Not logged in." }, { status: 401 });
  }
  const { situation } = await request.json();
  try {
    const result = await getAiModerationSuggestion(user.id, params.guildId, situation);
    return NextResponse.json(result);
  } catch (err) {
    // botApi's call() wraps non-OK responses as "Bot API error {status}: {raw json}" --
    // try to unwrap the bot's actual {"detail": "..."} message for a cleaner error in the UI.
    let detail = String(err.message || err);
    const jsonStart = detail.indexOf("{");
    if (jsonStart !== -1) {
      try {
        const parsed = JSON.parse(detail.slice(jsonStart));
        if (parsed.detail) detail = parsed.detail;
      } catch {}
    }
    return NextResponse.json({ detail }, { status: 502 });
  }
}
