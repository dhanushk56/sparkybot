"use client";

import { useState, useEffect } from "react";

const DISCORD_CLIENT_ID = "1528780547411804382";
const REDIRECT_URI = "https://sparkybot.bond/reviews";
const DISCORD_OAUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=identify`;

// ---------- StarRating Component ----------
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
            transition: "color 0.15s",
            userSelect: "none",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// ---------- ReviewItem Component ----------
function ReviewItem({ review, currentUser, onLike, onReply, onEdit, onDelete }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(review.text || "");
  const [editRating, setEditRating] = useState(review.rating);

  const canEdit = currentUser && review.userId === currentUser.id &&
                  (Date.now() - review.createdAt) < 3 * 24 * 60 * 60 * 1000;
  const isLiked = currentUser && review.likedBy?.includes(currentUser.id);

  return (
    <div style={{ background: "#1e1f22", border: "1px solid #2b2d31", borderRadius: "8px", padding: "1rem", marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <img src={review.userAvatar || "https://cdn.discordapp.com/embed/avatars/0.png"} alt={review.username} style={{ width: "32px", height: "32px", borderRadius: "50%" }} />
          <div>
            <strong style={{ color: "#e8e0d8" }}>{review.username}</strong>
            <span style={{ color: "#949ba4", fontSize: "0.75rem", marginLeft: "0.5rem" }}>
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <span
            style={{
              color: isLiked ? "#ed4245" : "#949ba4",
              fontSize: "0.85rem",
              cursor: currentUser ? "pointer" : "default",
            }}
            onClick={() => currentUser && onLike(review.id)}
          >
            {isLiked ? "❤️" : "🤍"} {review.likes || 0}
          </span>
          <span style={{ color: "#949ba4", fontSize: "0.85rem", cursor: "pointer" }} onClick={() => setShowReplyForm(!showReplyForm)}>
            💬 {review.replies?.length || 0}
          </span>
          {currentUser && currentUser.id === review.userId && canEdit && !isEditing && (
            <button className="btn btn-secondary" style={{ padding: "0.1rem 0.5rem", fontSize: "0.7rem" }} onClick={() => setIsEditing(true)}>Edit</button>
          )}
          {currentUser && currentUser.id === review.userId && canEdit && (
            <button className="btn btn-danger" style={{ padding: "0.1rem 0.5rem", fontSize: "0.7rem" }} onClick={() => onDelete(review.id)}>Delete</button>
          )}
        </div>
      </div>
      <div style={{ marginTop: "0.25rem" }}><StarRating rating={review.rating} readonly size={20} /></div>
      {isEditing ? (
        <div style={{ marginTop: "0.5rem" }}>
          <StarRating rating={editRating} onRatingChange={setEditRating} size={24} />
          <textarea className="field-input" rows="2" value={editText} onChange={(e) => setEditText(e.target.value)} style={{ marginTop: "0.5rem", width: "100%" }} />
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <button className="btn btn-primary" onClick={() => onEdit(review.id, editRating, editText)}>Save</button>
            <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        review.text && <div style={{ marginTop: "0.5rem", color: "#e8e0d8", whiteSpace: "pre-wrap" }}>{review.text}</div>
      )}
      {/* Replies */}
      {(review.replies || []).length > 0 && (
        <div style={{ marginTop: "0.75rem", paddingLeft: "1rem", borderLeft: "2px solid #2b2d31" }}>
          {review.replies.map((reply) => (
            <div key={reply.id} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "flex-start" }}>
              <img src={reply.userAvatar || "https://cdn.discordapp.com/embed/avatars/0.png"} alt="" style={{ width: "20px", height: "20px", borderRadius: "50%" }} />
              <div>
                <strong style={{ color: "#e8e0d8", fontSize: "0.85rem" }}>{reply.username}</strong>
                <span style={{ color: "#949ba4", fontSize: "0.7rem", marginLeft: "0.25rem" }}>{new Date(reply.createdAt).toLocaleDateString()}</span>
                <div style={{ color: "#c8c8c8", fontSize: "0.85rem" }}>{reply.text}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showReplyForm && currentUser && (
        <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
          <img src={currentUser.avatar || "https://cdn.discordapp.com/embed/avatars/0.png"} alt="" style={{ width: "24px", height: "24px", borderRadius: "50%" }} />
          <div style={{ flex: 1 }}>
            <textarea className="field-input" rows="2" placeholder="Write a reply..." value={replyText} onChange={(e) => setReplyText(e.target.value)} style={{ width: "100%" }} />
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
              <button className="btn btn-primary" onClick={() => onReply(review.id, replyText)}>Reply</button>
              <button className="btn btn-secondary" onClick={() => setShowReplyForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Main Page ----------
export default function ReviewsPage() {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);
  const [sortBy, setSortBy] = useState("latest");
  const [filterBy, setFilterBy] = useState("all");
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newText, setNewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ----- Discord OAuth Login -----
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get("access_token");
      if (token) {
        fetch("https://discord.com/api/users/@me", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            const userData = {
              id: data.id,
              username: data.username,
              avatar: data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png` : null,
            };
            setUser(userData);
            // After login, migrate any local reviews
            migrateLocalReviews(userData);
            window.history.replaceState({}, document.title, window.location.pathname);
          })
          .catch(console.error);
      }
    }
    const savedUser = localStorage.getItem("review_user");
    if (savedUser && !user) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        migrateLocalReviews(parsed);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("review_user", JSON.stringify(user));
    else localStorage.removeItem("review_user");
  }, [user]);

  // ----- Load reviews from API -----
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

  // ----- Migration: Upload local reviews to API -----
  const migrateLocalReviews = async (userData) => {
    const localKey = "reviews_data";
    const localData = localStorage.getItem(localKey);
    if (!localData) return;

    try {
      const localReviews = JSON.parse(localData);
      if (!localReviews.length) return;

      setMigrating(true);
      let migrated = 0;

      for (const localReview of localReviews) {
        // Check if this review already exists on server (by userId + createdAt)
        const exists = reviews.some(r => r.userId === userData.id && r.createdAt === localReview.createdAt);
        if (exists) continue;

        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating: localReview.rating,
            text: localReview.text || "",
            createdAt: localReview.createdAt,
          }),
        });
        if (res.ok) migrated++;
      }

      if (migrated > 0) {
        // Reload reviews to show the migrated ones
        await loadReviews();
        // Optionally clear localStorage after migration
        // localStorage.removeItem(localKey);
      }
    } catch (e) {
      console.error("Migration error:", e);
    } finally {
      setMigrating(false);
    }
  };

  // ----- CRUD Operations (API) -----
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

    const reply = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      userId: user.id,
      username: user.username,
      userAvatar: user.avatar || null,
      text: text.trim(),
      createdAt: Date.now(),
    };

    // Optimistic update
    setReviews(reviews.map(r => r.id === reviewId ? { ...r, replies: [...(r.replies || []), reply] } : r));

    // In a real app, POST to /api/reviews/:reviewId/replies
    // For now, we only store replies in memory (will reset on server restart)
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
      const res = await fetch(`/api/reviews?id=${reviewId}`, { method: "DELETE" });
      if (res.ok) {
        setReviews(reviews.filter(r => r.id !== reviewId));
      }
    } catch (e) { console.error(e); }
  };

  // ----- Sort & Filter -----
  const processedReviews = reviews
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
    });

  const highlights = reviews
    .map(r => ({ ...r, score: (r.likes || 0) * 3 + (r.replies || []).length * 2 + r.rating * 2 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (loading) return <div style={{ padding: "2rem", textAlign: "center", color: "#949ba4" }}>Loading reviews...</div>;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem", color: "#e8e0d8" }}>
      <style jsx>{`
        .btn { padding: 0.4rem 1rem; border: none; border-radius: 0.3rem; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: background 0.15s; }
        .btn-primary { background: #5865F2; color: white; }
        .btn-primary:hover { background: #4752c4; }
        .btn-secondary { background: #2b2d31; color: #e8e0d8; }
        .btn-secondary:hover { background: #3b3d41; }
        .btn-danger { background: #ed4245; color: white; }
        .btn-danger:hover { background: #c03537; }
        .field-input { background: #1e1f22; border: 1px solid #2b2d31; border-radius: 0.3rem; padding: 0.5rem; color: #e8e0d8; font-size: 0.9rem; outline: none; width: 100%; box-sizing: border-box; }
        .field-input:focus { border-color: #5865F2; }
        .select-input { background: #1e1f22; border: 1px solid #2b2d31; border-radius: 0.3rem; padding: 0.4rem 0.8rem; color: #e8e0d8; font-size: 0.9rem; outline: none; }
        @media (max-width: 500px) {
          .btn { padding: 0.5rem 1rem; font-size: 0.95rem; width: 100%; }
          .field-input { font-size: 1rem !important; }
          .select-input { font-size: 1rem !important; }
          .filter-group > div { flex: 1 1 100%; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <div><h1 style={{ margin: 0, fontSize: "1.8rem" }}>⭐ Reviews</h1><p style={{ color: "#949ba4", margin: "0.25rem 0 0 0", fontSize: "0.9rem" }}>Share your experience</p></div>
        <div>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <img src={user.avatar || "https://cdn.discordapp.com/embed/avatars/0.png"} alt="avatar" style={{ width: "32px", height: "32px", borderRadius: "50%" }} />
              <span style={{ fontSize: "0.9rem" }}>{user.username}</span>
              <button className="btn btn-secondary" onClick={() => { setUser(null); localStorage.removeItem("review_user"); }} style={{ fontSize: "0.8rem" }}>Logout</button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => window.location.href = DISCORD_OAUTH_URL}>🔒 Login</button>
          )}
        </div>
      </div>

      {/* Migration status */}
      {migrating && (
        <div style={{ background: "#1e1f22", border: "1px solid #2b2d31", borderRadius: "8px", padding: "0.75rem", marginBottom: "1rem", textAlign: "center", color: "#d4af37" }}>
          ⏳ Migrating your old reviews to the new system...
        </div>
      )}

      {/* Submit Review */}
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        {user ? (
          <button className="btn btn-primary" onClick={() => setShowSubmitForm(!showSubmitForm)} style={{ padding: "0.6rem 1.5rem", fontSize: "1rem" }}>
            {showSubmitForm ? "Cancel" : "✍️ Write a Review"}
          </button>
        ) : (
          <p style={{ color: "#949ba4", fontSize: "0.9rem" }}>Please log in with Discord to submit a review.</p>
        )}
      </div>

      {showSubmitForm && user && (
        <div style={{ background: "#1e1f22", border: "1px solid #2b2d31", borderRadius: "8px", padding: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ marginBottom: "0.75rem" }}>
            <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.9rem" }}>Your Rating</label>
            <StarRating rating={newRating} onRatingChange={setNewRating} size={32} />
            {newRating === 0 && <span style={{ color: "#ed4245", fontSize: "0.8rem", marginLeft: "0.5rem" }}>Required</span>}
          </div>
          <div style={{ marginBottom: "0.75rem" }}>
            <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.9rem" }}>
              Review Text {newRating >= 3 ? "(optional)" : "(required for ratings below 3)"}
            </label>
            <textarea className="field-input" rows="4" placeholder="Tell us about your experience..." value={newText} onChange={(e) => setNewText(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={handleSubmitReview} disabled={submitting} style={{ width: "100%" }}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}

      {/* Sort & Filter */}
      <div className="filter-group" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <div style={{ flex: 1, minWidth: "120px" }}>
          <label style={{ display: "block", marginBottom: "0.25rem", color: "#949ba4", fontSize: "0.85rem" }}>Sort</label>
          <select className="select-input" value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ width: "100%" }}>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Rated</option>
          </select>
        </div>
        <div style={{ flex: 1, minWidth: "120px" }}>
          <label style={{ display: "block", marginBottom: "0.25rem", color: "#949ba4", fontSize: "0.85rem" }}>Filter</label>
          <select className="select-input" value={filterBy} onChange={(e) => setFilterBy(e.target.value)} style={{ width: "100%" }}>
            <option value="all">All</option>
            <option value="withText">With Text</option>
            <option value="withoutText">Without Text</option>
            <option value="rating1+">⭐ 1+</option>
            <option value="rating2+">⭐ 2+</option>
            <option value="rating3+">⭐ 3+</option>
            <option value="rating4+">⭐ 4+</option>
          </select>
        </div>
        <div style={{ flex: "0 0 auto", display: "flex", alignItems: "flex-end" }}>
          <span style={{ color: "#949ba4", fontSize: "0.85rem" }}>{processedReviews.length} reviews</span>
        </div>
      </div>

      {/* Reviews List */}
      {processedReviews.length === 0 ? (
        <p style={{ color: "#949ba4", textAlign: "center", padding: "2rem 0" }}>No reviews yet. Be the first!</p>
      ) : (
        processedReviews.map((review) => (
          <ReviewItem key={review.id} review={review} currentUser={user} onLike={handleLike} onReply={handleReply} onEdit={handleEdit} onDelete={handleDelete} />
        ))
      )}

      {/* Highlights */}
      {highlights.length > 0 && (
        <div style={{ marginTop: "2.5rem", borderTop: "1px solid #2b2d31", paddingTop: "2rem" }}>
          <h2 style={{ textAlign: "center", marginBottom: "1rem", fontSize: "1.4rem" }}>🏆 Top Reviews</h2>
          {highlights.map((review) => (
            <ReviewItem key={review.id} review={review} currentUser={user} onLike={handleLike} onReply={handleReply} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}