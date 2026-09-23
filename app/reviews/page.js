"use client";

import { useState, useEffect, useMemo } from "react";

// ============================================================================
// Helpers
// ============================================================================

/**
 * Build a real Discord CDN URL for an avatar, regardless of what shape the
 * backend gave us. Different endpoints return one of three things:
 *   - a full URL           → use it as-is
 *   - a bare hash          → assemble the CDN path
 *   - nothing / null       → fall back to Discord's default avatar for the
 *                            user ID (index derived from the ID's high bits)
 * Without this, a raw hash like "a1b2c3d4e5" gets stuffed into <img src>
 * and renders nothing.
 */
function buildAvatarUrl(userId, avatar) {
  if (avatar && typeof avatar === "string" && avatar.startsWith("http")) {
    return avatar;
  }
  if (avatar && userId) {
    return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png?size=128`;
  }
  let index = 0;
  if (userId) {
    try {
      index = Number((BigInt(userId) >> 22n) % 6n);
    } catch {
      index = 0;
    }
  }
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
}

// Own reviews are editable / deletable for 48h after posting. Replies have
// no time limit -- they can be posted any time.
const EDIT_WINDOW_MS = 48 * 60 * 60 * 1000;

function canEditReview(review, currentUser) {
  if (!currentUser || review.userId !== currentUser.id) return false;
  return Date.now() - review.createdAt < EDIT_WINDOW_MS;
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ============================================================================
// Star rating
// ============================================================================

function StarRating({ rating, onRatingChange, readonly = false, size = 22 }) {
  return (
    <div style={{ display: "inline-flex", gap: "2px", lineHeight: 1 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => !readonly && onRatingChange(star)}
          style={{
            cursor: readonly ? "default" : "pointer",
            fontSize: `${size}px`,
            color: star <= rating ? "#FFD700" : "#3a3d42",
            transition: "color 0.15s ease, transform 0.15s ease",
            userSelect: "none",
            display: "inline-block",
            lineHeight: 1,
          }}
          onMouseEnter={(e) => {
            if (!readonly) e.currentTarget.style.transform = "scale(1.15)";
          }}
          onMouseLeave={(e) => {
            if (!readonly) e.currentTarget.style.transform = "scale(1)";
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// ============================================================================
// Rating summary (average + distribution bars)
// ============================================================================

function RatingSummary({ reviews }) {
  const total = reviews.length;
  const average = total ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  if (total === 0) return null;

  return (
    <div className="rating-summary">
      <div className="rating-summary-score">
        <div className="rating-summary-number">{average.toFixed(1)}</div>
        <StarRating rating={Math.round(average)} readonly size={16} />
        <div className="rating-summary-count">
          {total} review{total === 1 ? "" : "s"}
        </div>
      </div>
      <div className="rating-bars">
        {counts.map(({ star, count }) => (
          <div className="rating-bar-row" key={star}>
            <span style={{ width: "3.2em", flexShrink: 0 }}>{star} star</span>
            <div className="rating-bar-track">
              <div
                className="rating-bar-fill"
                style={{ width: total ? `${(count / total) * 100}%` : "0%" }}
              />
            </div>
            <span style={{ width: "2em", textAlign: "right", flexShrink: 0 }}>
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Single review card
// ============================================================================

function ReviewItem({
  review,
  currentUser,
  onLike,
  onReply,
  onEdit,
  onDelete,
  featured = false,
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(review.text || "");
  const [editRating, setEditRating] = useState(review.rating);

  const editable = canEditReview(review, currentUser);
  const isLiked = currentUser && review.likedBy?.includes(currentUser.id);
  const avatarUrl = buildAvatarUrl(review.userId, review.userAvatar);

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;
    onReply(review.id, replyText);
    setReplyText("");
    setShowReplyForm(false);
  };

  const handleSaveEdit = () => {
    if (editRating < 3 && !editText.trim()) {
      alert("Review text required for ratings below 3 stars.");
      return;
    }
    onEdit(review.id, editRating, editText);
    setIsEditing(false);
  };

  return (
    <article className={`review-card${featured ? " review-card-featured" : ""}`}>
      {featured && <span className="featured-tag">★ Top Review</span>}

      {/* ---------- Header: avatar / name / timestamp / stars ---------- */}
      <header className="review-header">
        <img
          src={avatarUrl}
          alt=""
          className="review-avatar"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = buildAvatarUrl(review.userId, null);
          }}
        />
        <div className="review-meta">
          <div className="review-name">{review.username}</div>
          <div className="review-timestamp">{formatDate(review.createdAt)}</div>
        </div>
        <div className="review-stars">
          <StarRating rating={review.rating} readonly size={14} />
        </div>
      </header>

      {/* ---------- Body / edit form ---------- */}
      {isEditing ? (
        <div className="review-edit">
          <StarRating rating={editRating} onRatingChange={setEditRating} size={24} />
          <textarea
            className="field-input"
            rows="3"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="Update your review..."
          />
          <div className="review-edit-actions">
            <button className="btn btn-primary" onClick={handleSaveEdit}>
              Save
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setIsEditing(false);
                setEditText(review.text || "");
                setEditRating(review.rating);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        review.text && <p className="review-body">{review.text}</p>
      )}

      {/* ---------- Action bar ---------- */}
      <footer className="review-actions">
        <button
          type="button"
          className={`review-action-btn${isLiked ? " liked" : ""}`}
          onClick={() => currentUser && onLike(review.id)}
          disabled={!currentUser}
          title={currentUser ? "Like" : "Log in to like"}
        >
          {isLiked ? "❤️" : "🤍"} <span>{review.likes || 0}</span>
        </button>

        <button
          type="button"
          className="review-action-btn"
          onClick={() => setShowReplyForm((v) => !v)}
        >
          💬 <span>{review.replies?.length || 0}</span>
        </button>

        <div className="review-action-spacer" />

        {editable && !isEditing && (
          <button
            type="button"
            className="review-action-btn"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        )}
        {editable && (
          <button
            type="button"
            className="review-action-btn danger"
            onClick={() => onDelete(review.id)}
          >
            Delete
          </button>
        )}
      </footer>

      {/* ---------- Replies ---------- */}
      {(review.replies || []).length > 0 && (
        <div className="review-replies">
          {review.replies.map((reply) => (
            <div key={reply.id} className="review-reply">
              <img
                src={buildAvatarUrl(reply.userId, reply.userAvatar)}
                alt=""
                className="review-avatar-sm"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = buildAvatarUrl(reply.userId, null);
                }}
              />
              <div className="review-reply-body">
                <div className="review-reply-head">
                  <span className="review-reply-author">{reply.username}</span>
                  <span className="review-reply-time">
                    {formatDate(reply.createdAt)}
                  </span>
                </div>
                <div className="review-reply-text">{reply.text}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------- Reply form ---------- */}
      {showReplyForm && currentUser && (
        <div className="review-reply-form">
          <img
            src={buildAvatarUrl(currentUser.id, currentUser.avatar)}
            alt=""
            className="review-avatar-sm"
          />
          <div className="review-reply-form-body">
            <textarea
              className="field-input"
              rows="2"
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <div className="review-reply-form-actions">
              <button className="btn btn-primary" onClick={handleSubmitReply}>
                Reply
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowReplyForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

// ============================================================================
// Page
// ============================================================================

export default function ReviewsPage() {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);
  const [sortBy, setSortBy] = useState("latest");
  const [filterBy, setFilterBy] = useState("all");
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newText, setNewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ----- Site-wide session login -----
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          migrateLocalReviews(data.user);
        }
      })
      .catch(() => {})
      .finally(() => setUserLoading(false));
  }, []);

  // ----- Load reviews -----
  const loadReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (e) {
      console.error("Failed to load reviews:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // ----- Migration of pre-backend local reviews -----
  const migrateLocalReviews = async (userData) => {
    const localData = localStorage.getItem("reviews_data");
    if (!localData) return;

    try {
      const localReviews = JSON.parse(localData);
      if (!localReviews.length) return;

      setMigrating(true);
      let migrated = 0;

      for (const r of localReviews) {
        const exists = reviews.some(
          (rev) => rev.userId === userData.id && rev.createdAt === r.createdAt
        );
        if (exists) continue;

        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating: r.rating,
            text: r.text || "",
            createdAt: r.createdAt,
            avatar: userData.avatar || null,
          }),
        });
        if (res.ok) migrated++;
      }

      if (migrated > 0) {
        localStorage.removeItem("reviews_data");
        await loadReviews();
      }
    } catch (e) {
      console.error("Migration error:", e);
    } finally {
      setMigrating(false);
    }
  };

  // ----- CRUD -----
  const handleSubmitReview = async () => {
    if (!user) {
      alert("Please log in first.");
      return;
    }
    if (newRating === 0) {
      alert("Please select a rating.");
      return;
    }
    if (newRating < 3 && !newText.trim()) {
      alert("Review text required for ratings below 3 stars.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: newRating,
          text: newText.trim(),
          avatar: user.avatar || null,
          username: user.username,
          userId: user.id,
        }),
      });
      if (res.ok) {
        const newReview = await res.json();
        setReviews([newReview, ...reviews]);
        setNewRating(0);
        setNewText("");
        setShowSubmitForm(false);
      }
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  const handleLike = async (reviewId) => {
    if (!user) {
      alert("Please log in to like.");
      return;
    }
    const review = reviews.find((r) => r.id === reviewId);
    if (!review) return;

    const isLiked = review.likedBy?.includes(user.id);
    try {
      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, action: isLiked ? "unlike" : "like" }),
      });
      if (res.ok) {
        const updated = await res.json();
        setReviews(reviews.map((r) => (r.id === reviewId ? updated : r)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReply = async (reviewId, text) => {
    if (!user) {
      alert("Please log in to reply.");
      return;
    }
    if (!text.trim()) return;

    try {
      const res = await fetch(`/api/reviews/reply?reviewId=${reviewId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim(),
          avatar: user.avatar || null,
          username: user.username,
          userId: user.id,
        }),
      });

      if (res.ok) {
        const newReply = await res.json();
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId
              ? { ...r, replies: [...(r.replies || []), newReply] }
              : r
          )
        );
      } else {
        const error = await res.json();
        alert(`Failed to post reply: ${error.error}`);
      }
    } catch (e) {
      console.error("Reply error:", e);
      alert("Failed to post reply. Please try again.");
    }
  };

  const handleEdit = async (reviewId, rating, text) => {
    if (!user) return;
    if (rating < 3 && !text.trim()) {
      alert("Review text required for ratings below 3 stars.");
      return;
    }

    try {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, rating, text }),
      });
      if (res.ok) {
        const updated = await res.json();
        setReviews(reviews.map((r) => (r.id === reviewId ? updated : r)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm("Delete your review?")) return;
    try {
      const res = await fetch(`/api/reviews?id=${reviewId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setReviews(reviews.filter((r) => r.id !== reviewId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ----- Sort & Filter -----
  const processedReviews = useMemo(
    () =>
      reviews
        .filter((r) => {
          switch (filterBy) {
            case "withText":
              return r.text && r.text.trim().length > 0;
            case "withoutText":
              return !r.text || r.text.trim().length === 0;
            case "rating1+":
              return r.rating >= 1;
            case "rating2+":
              return r.rating >= 2;
            case "rating3+":
              return r.rating >= 3;
            case "rating4+":
              return r.rating >= 4;
            default:
              return true;
          }
        })
        .sort((a, b) => {
          switch (sortBy) {
            case "latest":
              return b.createdAt - a.createdAt;
            case "oldest":
              return a.createdAt - b.createdAt;
            case "highest":
              return b.rating - a.rating;
            default:
              return 0;
          }
        }),
    [reviews, filterBy, sortBy]
  );

  const highlights = useMemo(
    () =>
      reviews
        .map((r) => ({
          ...r,
          score: (r.likes || 0) * 3 + (r.replies || []).length * 2 + r.rating * 2,
        }))
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3),
    [reviews]
  );

  if (loading) {
    return (
      <div className="reviews-page">
        <div className="reviews-skeleton">
          <div
            className="skel-line"
            style={{ width: "180px", height: "2rem", margin: "0 auto 0.5rem" }}
          />
          <div
            className="skel-line"
            style={{ width: "260px", height: "1rem", margin: "0 auto 2rem" }}
          />
          <div
            className="skel-line"
            style={{
              width: "100%",
              maxWidth: "700px",
              height: "110px",
              margin: "0 auto 1.5rem",
              borderRadius: "1rem",
            }}
          />
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="skel-line"
              style={{
                width: "100%",
                maxWidth: "700px",
                height: "90px",
                margin: "0 auto 1rem",
                borderRadius: "1rem",
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-page">
      <div className="reviews-hero">
        <h1>Reviews</h1>
        <p>What server owners are saying about SparkyBot</p>
      </div>

      <div className="reviews-container">
        <div className="reviews-toolbar">
          {userLoading ? (
            <div
              style={{
                width: "90px",
                height: "34px",
                borderRadius: "0.5rem",
                background: "rgba(255,255,255,0.06)",
              }}
            />
          ) : user ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                flexWrap: "wrap",
              }}
            >
              <img
                src={buildAvatarUrl(user.id, user.avatar)}
                alt=""
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  border: "1px solid rgba(255,215,0,0.2)",
                }}
              />
              <span style={{ fontSize: "0.9rem", color: "var(--db-text)" }}>
                {user.username}
              </span>
              <a
                className="btn btn-secondary"
                href="/api/auth/logout"
                style={{ fontSize: "0.8rem", textDecoration: "none" }}
              >
                Logout
              </a>
            </div>
          ) : (
            <a
              className="btn btn-secondary"
              href="/login"
              style={{
                textDecoration: "none",
                display: "inline-block",
                fontSize: "0.85rem",
              }}
            >
              Login with Discord
            </a>
          )}

          {user && (
            <button
              className="btn btn-primary"
              onClick={() => setShowSubmitForm(!showSubmitForm)}
            >
              {showSubmitForm ? "Cancel" : "✎ Write a Review"}
            </button>
          )}
        </div>

        {migrating && (
          <div
            className="dash-card"
            style={{
              padding: "0.75rem",
              marginBottom: "1rem",
              textAlign: "center",
              color: "#FFD700",
            }}
          >
            Migrating your old reviews to the new system...
          </div>
        )}

        <RatingSummary reviews={reviews} />

        {showSubmitForm && user && (
          <div className="dash-card review-form-card">
            <div style={{ marginBottom: "0.85rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.35rem",
                  fontSize: "0.9rem",
                  color: "var(--db-text)",
                  fontWeight: 600,
                }}
              >
                Your Rating
              </label>
              <StarRating
                rating={newRating}
                onRatingChange={setNewRating}
                size={32}
              />
              {newRating === 0 && (
                <span
                  style={{
                    color: "#ed4245",
                    fontSize: "0.8rem",
                    marginLeft: "0.5rem",
                  }}
                >
                  Required
                </span>
              )}
            </div>
            <div style={{ marginBottom: "0.85rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.35rem",
                  fontSize: "0.9rem",
                  color: "var(--db-text)",
                  fontWeight: 600,
                }}
              >
                Review Text{" "}
                {newRating >= 3 ? "(optional)" : "(required for ratings below 3)"}
              </label>
              <textarea
                className="field-input"
                rows="4"
                placeholder="Tell us about your experience with SparkyBot..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={handleSubmitReview}
              disabled={submitting}
              style={{ width: "100%" }}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        )}

        {!userLoading && !user && (
          <p
            style={{
              color: "var(--db-muted)",
              fontSize: "0.9rem",
              textAlign: "center",
              margin: "0 0 1.5rem",
            }}
          >
            <a href="/login" style={{ color: "#5865F2", fontWeight: 600 }}>
              Log in with Discord
            </a>{" "}
            to leave your own review.
          </p>
        )}

        {highlights.length > 0 && (
          <div className="reviews-featured-section">
            <h2 className="reviews-section-title">⭐ Top Reviews</h2>
            <div className="reviews-featured-grid">
              {highlights.map((review) => (
                <ReviewItem
                  key={review.id}
                  review={review}
                  currentUser={user}
                  onLike={handleLike}
                  onReply={handleReply}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  featured
                />
              ))}
            </div>
          </div>
        )}

        <div
          className="reviews-toolbar"
          style={{ marginTop: highlights.length ? "0.5rem" : 0 }}
        >
          <h2 className="reviews-section-title" style={{ margin: 0 }}>
            All Reviews
          </h2>
          <div
            style={{
              display: "flex",
              gap: "0.6rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <select
              className="select-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">Latest first</option>
              <option value="oldest">Oldest first</option>
              <option value="highest">Highest rated</option>
            </select>
            <select
              className="select-input"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
            >
              <option value="all">All reviews</option>
              <option value="withText">With text</option>
              <option value="withoutText">Rating only</option>
              <option value="rating4+">⭐ 4+ stars</option>
              <option value="rating3+">⭐ 3+ stars</option>
              <option value="rating2+">⭐ 2+ stars</option>
              <option value="rating1+">⭐ 1+ stars</option>
            </select>
            <span style={{ color: "var(--db-faint)", fontSize: "0.8rem" }}>
              {processedReviews.length} shown
            </span>
          </div>
        </div>

        {processedReviews.length === 0 ? (
          <div className="reviews-empty">
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>💬</div>
            <p>No reviews match these filters yet.</p>
          </div>
        ) : (
          <div className="reviews-list">
            {processedReviews.map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                currentUser={user}
                onLike={handleLike}
                onReply={handleReply}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
