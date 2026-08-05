import { getCurrentUser } from "@/lib/currentUser";
import { NextResponse } from "next/server";

// In-memory storage (replace with database in production)
let reviews = [];

// ----- GET all reviews -----
export async function GET() {
  return NextResponse.json(reviews);
}

// ----- POST a new review -----
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
    createdAt: data.createdAt || Date.now(),
    likes: 0,
    likedBy: [],
    replies: [],
  };

  reviews.unshift(newReview);
  return NextResponse.json(newReview);
}

// ----- PUT (edit a review) -----
export async function PUT(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { reviewId, rating, text } = await request.json();
  const review = reviews.find(r => r.id === reviewId);
  if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });
  if (review.userId !== user.id) return NextResponse.json({ error: "Not your review" }, { status: 403 });

  if (Date.now() - review.createdAt > 3 * 24 * 60 * 60 * 1000) {
    return NextResponse.json({ error: "Edit window expired (3 days)" }, { status: 403 });
  }

  review.rating = rating;
  review.text = text;
  return NextResponse.json(review);
}

// ----- DELETE a review -----
export async function DELETE(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const reviewId = searchParams.get("id");

  const review = reviews.find(r => r.id === reviewId);
  if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });
  if (review.userId !== user.id) return NextResponse.json({ error: "Not your review" }, { status: 403 });

  if (Date.now() - review.createdAt > 3 * 24 * 60 * 60 * 1000) {
    return NextResponse.json({ error: "Delete window expired (3 days)" }, { status: 403 });
  }

  reviews = reviews.filter(r => r.id !== reviewId);
  return NextResponse.json({ success: true });
}

// ----- PATCH (like/unlike) -----
export async function PATCH(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { reviewId, action } = await request.json();
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

// ----- ✅ NEW: POST a reply to a review -----
export async function POST_REPLY(request, { params }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const reviewId = params?.reviewId; // Note: This won't work in App Router – use URL parsing
  const { searchParams } = new URL(request.url);
  const reviewIdParam = searchParams.get("reviewId");

  const data = await request.json();
  const review = reviews.find(r => r.id === reviewIdParam);
  if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });

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
