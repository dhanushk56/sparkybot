"use client";

import { useState, useEffect, useMemo } from "react";

function StarRating({ rating, onRatingChange, readonly = false, size = 28 }) {
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => !readonly && onRatingChange(star)}
          style={{
            cursor: readonly ? "default" : "pointer",
            fontSize: size,
            color: star <= rating ? "#FFD700" : "#4a4d52",
            transition: "color 0.2s var(--ease-smooth, ease), transform 0.2s var(--ease-smooth, ease)",
            userSelect: "none",
            display: "inline-block",
          }}
          onMouseEnter={(e) => { if (!readonly) e.currentTarget.style.transform = "scale(1.15)"; }}
          onMouseLeave={(e) => { if (!readonly) e.currentTarget.style.transform = "scale(1)"; }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// ---------- Rating summary (average + distribution bars) ----------
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
        <StarRating rating={Math.round(average)} readonly size={18} />
        <div className="rating-summary-count">{total} review{total === 1 ? "" : "s"}</div>
      </div>
      <div className="rating-bars">
        {counts.map(({ star, count }) => (
          <div className="rating-bar-row" key={star}>
            <span style={{ width: "3.2em", flexShrink: 0 }}>{star} star</span>
            <div className="rating-bar-track">
              <div className="rating-bar-fill" style={{ width: total ? `${(count / total) * 100}%` : "0%" }} />
            </div>
            <span style={{ width: "2em", textAlign: "right", flexShrink: 0 }}>{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewItem({ review, currentUser, onLike, onReply, onEdit, onDelete, featured = false }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(review.text || "");
  const [editRating, setEditRating] = useState(review.rating);

  const canEdit = currentUser && review.userId === currentUser.id &&
                  (Date.now() - review.createdAt) < 3 * 24 * 60 * 60 * 1000;
  const isLiked = currentUser && review.likedBy?.includes(currentUser.id);

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
    <div className={`review-card ${featured ? "review-card-featured" : ""}`}>
      {featured && <span className="featured-tag">★ Featured</span>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <img src={review.userAvatar || "https://cdn.discordapp.com/embed/avatars/0.png"} alt={review.username} className="review-avatar" />
          <div>
            <strong style={{ color: "var(--db-text)" }}>{review.username}</strong>
            <div style={{ color: "var(--db-faint)", fontSize: "0.75rem" }}>
              {new Date(review.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.85rem", alignItems: "center", flexWrap: "wrap" }}>
          <span
            className="review-action"
            style={{ color: isLiked ? "#ed4245" : "var(--db-muted)", cursor: currentUser ? "pointer" : "default" }}
            onClick={() => currentUser && onLike(review.id)}
          >
            {isLiked ? "❤️" : "🤍"} {review.likes || 0}
          </span>
          <span className="review-action" style={{ color: "var(--db-muted)", cursor: "pointer" }} onClick={() => setShowReplyForm(!showReplyForm)}>
            💬 {review.replies?.length || 0}
          </span>
          {currentUser && currentUser.id === review.userId && canEdit && !isEditing && (
            <button className="btn btn-secondary" style={{ padding: "0.15rem 0.6rem", fontSize: "0.72rem" }} onClick={() => setIsEditing(true)}>Edit</button>
          )}
          {currentUser && currentUser.id === review.userId && canEdit && (
            <button className="btn btn-danger" style={{ padding: "0.15rem 0.6rem", fontSize: "0.72rem" }} onClick={() => onDelete(review.id)}>Delete</button>
          )}
        </div>
      </div>
      <div style={{ marginTop: "0.4rem" }}><StarRating rating={review.rating} readonly size={18} /></div>
      {isEditing ? (
        <div style={{ marginTop: "0.6rem" }}>
          <StarRating rating={editRating} onRatingChange={setEditRating} size={22} />
          <textarea className="field-input" rows="2" value={editText} onChange={(e) => setEditText(e.target.value)} style={{ marginTop: "0.5rem", width: "100%" }} />
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <button className="btn btn-primary" onClick={handleSaveEdit}>Save</button>
            <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        review.text && <div style={{ marginTop: "0.55rem", color: "var(--db-text)", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{review.text}</div>
      )}
      {(review.replies || []).length > 0 && (
        <div className="review-replies">
          {review.replies.map((reply) => (
            <div key={reply.id} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.6rem", alignItems: "flex-start" }}>
              <img src={reply.userAvatar || "https://cdn.discordapp.com/embed/avatars/0.png"} alt="" style={{ width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0 }} />
              <div>
                <strong style={{ color: "var(--db-text)", fontSize: "0.85rem" }}>{reply.username}</strong>
                <span style={{ color: "var(--db-faint)", fontSize: "0.7rem", marginLeft: "0.4rem" }}>{new Date(reply.createdAt).toLocaleDateString()}</span>
                <div style={{ color: "#c8c8c8", fontSize: "0.85rem", marginTop: "0.1rem" }}>{reply.text}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showReplyForm && currentUser && (
        <div style={{ marginTop: "0.6rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
          <img src={currentUser.avatar || "https://cdn.discordapp.com/embed/avatars/0.png"} alt="" style={{ width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <textarea className="field-input" rows="2" placeholder="Write a reply..." value={replyText} onChange={(e) => setReplyText(e.target.value)} style={{ width: "100%" }} />
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.35rem" }}>
              <button className="btn btn-primary" onClick={handleSubmitReply}>Reply</button>
              <button className="btn btn-secondary" onClick={() => setShowReplyForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
  // Reviews use the same Discord login as the rest of the site (cookie-based
  // session), so there's no separate Discord popup/token flow here anymore.
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

  // ----- Migration -----
  // Some visitors may still have reviews saved locally from before the
  // shared backend existed; fold those into their account the first time
  // they're recognized as logged in.
  const migrateLocalReviews = async (userData) => {
    const localData = localStorage.getItem("reviews_data");
    if (!localData) return;

    try {
      const localReviews = JSON.parse(localData);
      if (!localReviews.length) return;

      setMigrating(true);
      let migrated = 0;

      for (const r of localReviews) {
        const exists = reviews.some(rev => rev.userId === userData.id && rev.createdAt === r.createdAt);
        if (exists) continue;

        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating: r.rating,
            text: r.text || "",
            createdAt: r.createdAt,
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
    if (!user) { alert("Please log in first."); return; }
    if (newRating === 0) { alert("Please select a rating."); return; }
    if (newRating < 3 && !newText.trim()) { alert("Review text required for ratings below 3 stars."); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: newRating, text: newText.trim() }),
      });
      if (res.ok) {
        const newReview = await res.json();
        setReviews([newReview, ...reviews]);
        setNewRating(0);
        setNewText("");
        setShowSubmitForm(false);
      }
    } catch (e) { console.error(e); }
    setSubmitting(false);
  };

  const handleLike = async (reviewId) => {
    if (!user) { alert("Please log in to like."); return; }
    const review = reviews.find(r => r.id === reviewId);
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
        setReviews(reviews.map(r => r.id === reviewId ? updated : r));
      }
    } catch (e) { console.error(e); }
  };

  const handleReply = async (reviewId, text) => {
    if (!user) { alert("Please log in to reply."); return; }
    if (!text.trim()) return;

    try {
      const res = await fetch(`/api/reviews/reply?reviewId=${reviewId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (res.ok) {
        const newReply = await res.json();
        setReviews(prevReviews =>
          prevReviews.map(r =>
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
    if (rating < 3 && !text.trim()) { alert("Review text required for ratings below 3 stars."); return; }

    try {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, rating, text }),
      });
      if (res.ok) {
        const updated = await res.json();
        setReviews(reviews.map(r => r.id === reviewId ? updated : r));
      }
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm("Delete your review?")) return;
    try {
      const res = await fetch(`/api/reviews?id=${reviewId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setReviews(reviews.filter(r => r.id !== reviewId));
      }
    } catch (e) { console.error(e); }
  };

  // ----- Sort & Filter -----
  const processedReviews = useMemo(() => reviews
    .filter(r => {
      switch (filterBy) {
        case "withText": return r.text && r.text.trim().length > 0;
        case "withoutText": return !r.text || r.text.trim().length === 0;
        case "rating1+": return r.rating >= 1;
        case "rating2+": return r.rating >= 2;
        case "rating3+": return r.rating >= 3;
        case "rating4+": return r.rating >= 4;
        default: return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "latest": return b.createdAt - a.createdAt;
        case "oldest": return a.createdAt - b.createdAt;
        case "highest": return b.rating - a.rating;
        default: return 0;
      }
    }), [reviews, filterBy, sortBy]);

  const highlights = useMemo(() => reviews
    .map(r => ({ ...r, score: (r.likes || 0) * 3 + (r.replies || []).length * 2 + r.rating * 2 }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3), [reviews]);

  if (loading) {
    return (
      <div className="reviews-page">
        <div className="reviews-skeleton">
          <div className="skel-line" style={{ width: "180px", height: "2rem", margin: "0 auto 0.5rem" }} />
          <div className="skel-line" style={{ width: "260px", height: "1rem", margin: "0 auto 2rem" }} />
          <div className="skel-line" style={{ width: "100%", maxWidth: "700px", height: "110px", margin: "0 auto 1.5rem", borderRadius: "1rem" }} />
          {[1, 2, 3].map((i) => (
            <div key={i} className="skel-line" style={{ width: "100%", maxWidth: "700px", height: "90px", margin: "0 auto 1rem", borderRadius: "1rem" }} />
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
            <div style={{ width: "90px", height: "34px", borderRadius: "0.5rem", background: "rgba(255,255,255,0.06)" }} />
          ) : user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
              <img src={user.avatar || "https://cdn.discordapp.com/embed/avatars/0.png"} alt="avatar" style={{ width: "32px", height: "32px", borderRadius: "50%" }} />
              <span style={{ fontSize: "0.9rem", color: "var(--db-text)" }}>{user.username}</span>
              <a className="btn btn-secondary" href="/api/auth/logout" style={{ fontSize: "0.8rem", textDecoration: "none" }}>Logout</a>
            </div>
          ) : (
            <a className="btn btn-secondary" href="/login" style={{ textDecoration: "none", display: "inline-block", fontSize: "0.85rem" }}>Login with Discord</a>
          )}

          {user && (
            <button className="btn btn-primary" onClick={() => setShowSubmitForm(!showSubmitForm)}>
              {showSubmitForm ? "Cancel" : "✎ Write a Review"}
            </button>
          )}
        </div>

        {migrating && (
          <div className="dash-card" style={{ padding: "0.75rem", marginBottom: "1rem", textAlign: "center", color: "#FFD700" }}>
            Migrating your old reviews to the new system...
          </div>
        )}

        <RatingSummary reviews={reviews} />

        {showSubmitForm && user && (
          <div className="dash-card review-form-card">
            <div style={{ marginBottom: "0.85rem" }}>
              <label style={{ display: "block", marginBottom: "0.35rem", fontSize: "0.9rem", color: "var(--db-text)", fontWeight: 600 }}>Your Rating</label>
              <StarRating rating={newRating} onRatingChange={setNewRating} size={32} />
              {newRating === 0 && <span style={{ color: "#ed4245", fontSize: "0.8rem", marginLeft: "0.5rem" }}>Required</span>}
            </div>
            <div style={{ marginBottom: "0.85rem" }}>
              <label style={{ display: "block", marginBottom: "0.35rem", fontSize: "0.9rem", color: "var(--db-text)", fontWeight: 600 }}>
                Review Text {newRating >= 3 ? "(optional)" : "(required for ratings below 3)"}
              </label>
              <textarea className="field-input" rows="4" placeholder="Tell us about your experience with SparkyBot..." value={newText} onChange={(e) => setNewText(e.target.value)} style={{ width: "100%" }} />
            </div>
            <button className="btn btn-primary" onClick={handleSubmitReview} disabled={submitting} style={{ width: "100%" }}>
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        )}

        {!userLoading && !user && (
          <p style={{ color: "var(--db-muted)", fontSize: "0.9rem", textAlign: "center", margin: "0 0 1.5rem" }}>
            <a href="/login" style={{ color: "#5865F2", fontWeight: 600 }}>Log in with Discord</a> to leave your own review.
          </p>
        )}

        {highlights.length > 0 && (
          <div className="reviews-featured-section">
            <h2 className="reviews-section-title">⭐ Top Reviews</h2>
            <div className="reviews-featured-grid">
              {highlights.map((review) => (
                <ReviewItem key={review.id} review={review} currentUser={user} onLike={handleLike} onReply={handleReply} onEdit={handleEdit} onDelete={handleDelete} featured />
              ))}
            </div>
          </div>
        )}

        <div className="reviews-toolbar" style={{ marginTop: highlights.length ? "0.5rem" : 0 }}>
          <h2 className="reviews-section-title" style={{ margin: 0 }}>All Reviews</h2>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
            <select className="select-input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="latest">Latest first</option>
              <option value="oldest">Oldest first</option>
              <option value="highest">Highest rated</option>
            </select>
            <select className="select-input" value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
              <option value="all">All reviews</option>
              <option value="withText">With text</option>
              <option value="withoutText">Rating only</option>
              <option value="rating4+">⭐ 4+ stars</option>
              <option value="rating3+">⭐ 3+ stars</option>
              <option value="rating2+">⭐ 2+ stars</option>
              <option value="rating1+">⭐ 1+ stars</option>
            </select>
            <span style={{ color: "var(--db-faint)", fontSize: "0.8rem" }}>{processedReviews.length} shown</span>
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
              <ReviewItem key={review.id} review={review} currentUser={user} onLike={handleLike} onReply={handleReply} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
