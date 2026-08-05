import { getCurrentUser } from "@/lib/currentUser";
import { NextResponse } from "next/server";
import { reviews } from "@/lib/reviewsStore";

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const reviewId = searchParams.get("reviewId");

  const data = await request.json();
  const review = reviews.find(r => r.id === reviewId);
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  const reply = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    userId: user.id,
    username: user.username,
    userAvatar: user.avatar || null,
    text: data.text,
    createdAt: Date.now(),
  };

  review.replies.push(reply);
  return NextResponse.json(reply);
}