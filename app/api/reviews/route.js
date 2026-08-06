import { getReviewUser } from "@/lib/reviewAuth";
import { NextResponse } from "next/server";
import { getReviews, createReview, editReview, deleteReview, toggleReviewLike } from "@/lib/botApi";

function errorResponse(err) {
  const match = String(err.message || err).match(/Bot API error (\d+): (.*)/);
  if (!match) return NextResponse.json({ error: String(err.message || err) }, { status: 502 });
  let detail = match[2];
  try {
    detail = JSON.parse(match[2]).detail || match[2];
  } catch {}
  return NextResponse.json({ error: detail }, { status: Number(match[1]) });
}

export async function GET() {
  try {
    const reviews = await getReviews();
    return NextResponse.json(reviews);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(request) {
  const user = await getReviewUser(request);
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const data = await request.json();
  try {
    const newReview = await createReview(user, data.rating, data.text || "");
    return NextResponse.json(newReview);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PUT(request) {
  const user = await getReviewUser(request);
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { reviewId, rating, text } = await request.json();
  try {
    const review = await editReview(user.id, reviewId, rating, text);
    return NextResponse.json(review);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(request) {
  const user = await getReviewUser(request);
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const reviewId = searchParams.get("id");
  try {
    await deleteReview(user.id, reviewId);
    return NextResponse.json({ success: true });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PATCH(request) {
  const user = await getReviewUser(request);
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { reviewId } = await request.json();
  try {
    const review = await toggleReviewLike(user.id, reviewId);
    return NextResponse.json(review);
  } catch (err) {
    return errorResponse(err);
  }
}
