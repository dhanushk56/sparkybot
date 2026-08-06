import { getReviewUser } from "@/lib/reviewAuth";
import { NextResponse } from "next/server";
import { replyToReview } from "@/lib/botApi";

export async function POST(request) {
  const user = await getReviewUser(request);
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const reviewId = searchParams.get("reviewId");
  const data = await request.json();

  if (!data.text || !data.text.trim()) {
    return NextResponse.json({ error: "Reply text is required." }, { status: 400 });
  }

  try {
    const reply = await replyToReview(user, reviewId, data.text.trim());
    return NextResponse.json(reply);
  } catch (err) {
    const match = String(err.message || err).match(/Bot API error (\d+): (.*)/);
    if (!match) return NextResponse.json({ error: String(err.message || err) }, { status: 502 });
    let detail = match[2];
    try {
      detail = JSON.parse(match[2]).detail || match[2];
    } catch {}
    return NextResponse.json({ error: detail }, { status: Number(match[1]) });
  }
}
