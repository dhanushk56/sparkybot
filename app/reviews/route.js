import { getCurrentUser } from "@/lib/currentUser";
import { NextResponse } from "next/server";

// In-memory storage (resets on restart – use a real database in production)
let reviews = [];

export async function GET() {
  return NextResponse.json(reviews);
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const data = await request.json();
  const newReview = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    userId: user.id,
    username: user.username,
    userAvatar: user.avatar || null,
    rating: data.rating,
    text: data.text || "",
    createdAt: Date.now(),
    likes: 0,
    likedBy: [],
    replies: [],
  };

  reviews.unshift(newReview);
  return NextResponse.json(newReview);
}

export async function PUT(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { reviewId, rating, text } = await request.json();
  const review = reviews.find(r => r.id === reviewId);
  if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });
  if (review.userId !== user.id) return NextResponse.json({ error: "Not your review" }, { status: 403 });

  // 3-day edit window
  if (Date.now() - review.createdAt > 3 * 24 * 60 * 60 * 1000) {
    return NextResponse.json({ error: "Edit window expired (3 days)" }, { status: 403 });
  }

  review.rating = rating;
  review.text = text;
  return NextResponse.json(review);
}

export async function DELETE(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const reviewId = searchParams.get("id");

  const review = reviews.find(r => r.id === reviewId);
  if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });
  if (review.userId !== user.id) return NextResponse.json({ error: "Not your review" }, { status: 403 });

  // 3-day delete window
  if (Date.now() - review.createdAt > 3 * 24 * 60 * 60 * 1000) {
    return NextResponse.json({ error: "Delete window expired (3 days)" }, { status: 403 });
  }

  reviews = reviews.filter(r => r.id !== reviewId);
  return NextResponse.json({ success: true });
}

// Like/unlike
export async function PATCH(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { reviewId, action } = await request.json(); // action: "like" or "unlike"

  const review = reviews.find(r => r.id === reviewId);
  if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });

  if (action === "like") {
    if (!review.likedBy.includes(user.id)) {
      review.likedBy.push(user.id);
      review.likes = (review.likes || 0) + 1;
    }
  } else if (action === "unlike") {
    review.likedBy = review.likedBy.filter(id => id !== user.id);
    review.likes = Math.max(0, (review.likes || 0) - 1);
  }

  return NextResponse.json(review);
}