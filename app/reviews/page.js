"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

// ---------- Discord OAuth Helper ----------
// Replace with your Discord Client ID and redirect URI
const DISCORD_CLIENT_ID = "YOUR_DISCORD_CLIENT_ID";
const REDIRECT_URI = "http://localhost:3000/reviews"; // Change to your page URL
const DISCORD_OAUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=identify`;

// ---------- Star Rating Component ----------
function StarRating({ rating, onRatingChange, readonly = false, size = 28 }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {stars.map((star) => (
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

// ---------- Review Item Component ----------
function ReviewItem({
  review,
  currentUser,
  onLike,
  onReply,
  onEdit,
  onDelete,
  isHighlight = false,
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(review.text || "");
  const [editRating, setEditRating] = useState(review.rating);

  const canEdit = currentUser && review.userId === currentUser.id && 
                  (Date.now() - new Date(review.createdAt).getTime()) < 3 * 24 * 60 * 60 * 1000;

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;
    onReply(review.id, replyText.trim());
    setReplyText("");
    setShowReplyForm(false);
  };

  const handleSaveEdit = () => {
    if (!editText.trim() && editRating < 3) {
      alert("Please provide a review text (required for ratings below 3 stars).");
      return;
    }
    onEdit(review.id, { rating: editRating, text: editText.trim() });
    setIsEditing(false);
  };

  return (
    <div
      style={{
        background: isHighlight ? "rgba(255, 215, 0, 0.08)" : "#1e1f22",
        border: isHighlight ? "1px solid rgba(255, 215, 0, 0.3)" : "1px solid #2b2d31",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "1rem",
        transition: "background 0.2s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <img
              src={review.userAvatar || "https://cdn.discordapp.com/embed/avatars/0.png"}
              alt={review.username}
              style={{ width: "36px", height: "36px", borderRadius: "50%" }}
            />
            <div>
              <strong style={{ color: "#e8e0d8" }}>{review.username}</strong>
              <span style={{ color: "#949ba4", fontSize: "0.8rem", marginLeft: "0.5rem" }}>
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div style={{ marginTop: "0.25rem" }}>
            <StarRating rating={review.rating} readonly size={20} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <span
            style={{ color: "#949ba4", fontSize: "0.85rem", cursor: "pointer" }}
            onClick={() => onLike(review.id)}
          >
            ❤️ {review.likes || 0}
          </span>
          <span
            style={{ color: "#949ba4", fontSize: "0.85rem", cursor: "pointer" }}
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            💬 {review.replies?.length || 0}
          </span>
          {currentUser && currentUser.id === review.userId && (
            <>
              {canEdit && !isEditing && (
                <button
                  className="btn btn-secondary"
                  style={{ padding: "0.1rem 0.5rem", fontSize: "0.75rem" }}
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              )}
              {canEdit && isEditing && (
                <button
                  className="btn btn-primary"
                  style={{ padding: "0.1rem 0.5rem", fontSize: "0.75rem" }}
                  onClick={handleSaveEdit}
                >
                  Save
                </button>
              )}
              {canEdit && !isEditing && (
                <button
                  className="btn btn-danger"
                  style={{ padding: "0.1rem 0.5rem", fontSize: "0.75rem" }}
                  onClick={() => onDelete(review.id)}
                >
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div style={{ marginTop: "0.5rem" }}>
          <StarRating rating={editRating} onRatingChange={setEditRating} size={24} />
          <textarea
            className="field-input"
            rows="2"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            style={{ marginTop: "0.5rem", width: "100%" }}
          />
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        review.text && (
          <div style={{ marginTop: "0.5rem", color: "#e8e0d8", whiteSpace: "pre-wrap" }}>
            {review.text}
          </div>
        )
      )}

      {/* Replies */}
      {(review.replies || []).length > 0 && (
        <div style={{ marginTop: "0.75rem", paddingLeft: "1.5rem", borderLeft: "2px solid #2b2d31" }}>
          {review.replies.map((reply) => (
            <div key={reply.id} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "flex-start" }}>
              <img
                src={reply.userAvatar || "https://cdn.discordapp.com/embed/avatars/0.png"}
                alt=""
                style={{ width: "24px", height: "24px", borderRadius: "50%" }}
              />
              <div>
                <strong style={{ color: "#e8e0d8", fontSize: "0.9rem" }}>{reply.username}</strong>
                <span style={{ color: "#949ba4", fontSize: "0.75rem", marginLeft: "0.25rem" }}>
                  {new Date(reply.createdAt).toLocaleDateString()}
                </span>
                <div style={{ color: "#c8c8c8", fontSize: "0.9rem" }}>{reply.text}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Form */}
      {showReplyForm && currentUser && (
        <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
          <img
            src={currentUser.avatar || "https://cdn.discordapp.com/embed/avatars/0.png"}
            alt=""
            style={{ width: "28px", height: "28px", borderRadius: "50%" }}
          />
          <div style={{ flex: 1 }}>
            <textarea
              className="field-input"
              rows="2"
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              style={{ width: "100%" }}
            />
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
              <button className="btn btn-primary" onClick={handleSubmitReply}>Reply</button>
              <button className="btn btn-secondary" onClick={() => setShowReplyForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Main Reviews Page ----------
export default function ReviewsPage() {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [sortBy, setSortBy] = useState("latest");
  const [filterBy, setFilterBy] = useState("all"); // all, withText, withoutText, rating1+, rating2+, rating3+, rating4+
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newText, setNewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // ----- Discord OAuth Login -----
  useEffect(() => {
    // Check for token in URL fragment (implicit flow)
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get("access_token");
      if (token) {
        // Fetch user info from Discord
        fetch("https://discord.com/api/users/@me", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            setUser({
              id: data.id,
              username: data.username,
              avatar: data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png` : null,
              discriminator: data.discriminator,
            });
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
          })
          .catch(console.error);
      }
    }
    // If already logged in via localStorage
    const savedUser = localStorage.getItem("review_user");
    if (savedUser && !user) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {}
    }
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("review_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("review_user");
    }
  }, [user]);

  // ----- Load reviews from localStorage -----
  useEffect(() => {
    const stored = localStorage.getItem("reviews_data");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setReviews(parsed);
      } catch {}
    } else {
      // Seed with some sample reviews for demo
      const sample = [
        {
          id: "1",
          userId: "123",
          username: "DemoUser",
          userAvatar: null,
          rating: 5,
          text: "Absolutely amazing! The bot is incredibly helpful.",
          createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
          likes: 5,
          replies: [
            { id: "r1", userId: "456", username: "Moderator", userAvatar: null, text: "Glad you like it!", createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000 }
          ]
        },
        {
          id: "2",
          userId: "456",
          username: "Moderator",
          userAvatar: null,
          rating: 4,
          text: "Great bot, but could use more commands.",
          createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
          likes: 2,
          replies: []
        },
        {
          id: "3",
          userId: "789",
          username: "Guest",
          userAvatar: null,
          rating: 2,
          text: "Had some issues with setup, but support helped.",
          createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
          likes: 0,
          replies: []
        }
      ];
      setReviews(sample);
      localStorage.setItem("reviews_data", JSON.stringify(sample));
    }
  }, []);

  // Save reviews whenever they change
  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem("reviews_data", JSON.stringify(reviews));
    }
  }, [reviews]);

  // ----- Helpers -----
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

  const currentUser = user;

  // ----- CRUD Operations -----
  const handleSubmitReview = () => {
    if (!currentUser) {
      alert("Please log in with Discord first.");
      return;
    }
    if (newRating === 0) {
      alert("Please select a star rating (1-5).");
      return;
    }
    if (newRating < 3 && !newText.trim()) {
      alert("A review text is required for ratings below 3 stars.");
      return;
    }
    setSubmitting(true);
    const newReview = {
      id: generateId(),
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar || null,
      rating: newRating,
      text: newText.trim(),
      createdAt: Date.now(),
      likes: 0,
      replies: [],
    };
    setReviews([newReview, ...reviews]);
    setNewRating(0);
    setNewText("");
    setShowSubmitForm(false);
    setSubmitting(false);
  };

  const handleLike = (reviewId) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, likes: (r.likes || 0) + 1 } : r
      )
    );
  };

  const handleReply = (reviewId, replyText) => {
    if (!currentUser) {
      alert("Please log in to reply.");
      return;
    }
    const reply = {
      id: generateId(),
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar || null,
      text: replyText,
      createdAt: Date.now(),
    };
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, replies: [...(r.replies || []), reply] } : r
      )
    );
  };

  const handleEdit = (reviewId, updatedData) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, ...updatedData, updatedAt: Date.now() } : r
      )
    );
  };

  const handleDelete = (reviewId) => {
    if (!confirm("Are you sure you want to delete your review?")) return;
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  // ----- Sort & Filter -----
  const processedReviews = useMemo(() => {
    let filtered = [...reviews];

    // Filter
    switch (filterBy) {
      case "withText":
        filtered = filtered.filter(r => r.text && r.text.trim().length > 0);
        break;
      case "withoutText":
        filtered = filtered.filter(r => !r.text || r.text.trim().length === 0);
        break;
      case "rating1+":
        filtered = filtered.filter(r => r.rating >= 1);
        break;
      case "rating2+":
        filtered = filtered.filter(r => r.rating >= 2);
        break;
      case "rating3+":
        filtered = filtered.filter(r => r.rating >= 3);
        break;
      case "rating4+":
        filtered = filtered.filter(r => r.rating >= 4);
        break;
      default:
        break;
    }

    // Sort
    switch (sortBy) {
      case "latest":
        filtered.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case "oldest":
        filtered.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case "highest":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return filtered;
  }, [reviews, sortBy, filterBy]);

  // ----- Highlights (top 3 based on engagement) -----
  const highlights = useMemo(() => {
    const scored = reviews.map((r) => {
      const likes = r.likes || 0;
      const replies = (r.replies || []).length;
      const ratingScore = r.rating * 2;
      const score = likes * 3 + replies * 2 + ratingScore;
      return { ...r, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3);
  }, [reviews]);

  // ----- Login / Logout -----
  const handleLogin = () => {
    window.location.href = DISCORD_OAUTH_URL;
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("review_user");
  };

  // ----- Render -----
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem", color: "#e8e0d8" }}>
      <style jsx>{`
        .btn {
          padding: 0.4rem 1rem;
          border: none;
          border-radius: 0.3rem;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s, opacity 0.15s;
        }
        .btn-primary { background: #5865F2; color: white; }
        .btn-primary:hover { background: #4752c4; }
        .btn-secondary { background: #2b2d31; color: #e8e0d8; }
        .btn-secondary:hover { background: #3b3d41; }
        .btn-danger { background: #ed4245; color: white; }
        .btn-danger:hover { background: #c03537; }
        .field-input {
          background: #1e1f22;
          border: 1px solid #2b2d31;
          border-radius: 0.3rem;
          padding: 0.5rem;
          color: #e8e0d8;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.15s;
          width: 100%;
          box-sizing: border-box;
        }
        .field-input:focus {
          border-color: #5865F2;
        }
        .select-input {
          background: #1e1f22;
          border: 1px solid #2b2d31;
          border-radius: 0.3rem;
          padding: 0.4rem 0.8rem;
          color: #e8e0d8;
          font-size: 0.9rem;
          outline: none;
        }
        .highlight-badge {
          display: inline-block;
          background: #FFD700;
          color: #1e1f22;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.1rem 0.6rem;
          border-radius: 12px;
          margin-left: 0.5rem;
        }
      `}</style>

      {/* Header with Login & Submit */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "2rem" }}>⭐ Community Reviews</h1>
          <p style={{ color: "#949ba4", margin: "0.25rem 0 0 0" }}>Share your experience with SparkyBot</p>
        </div>
        <div>
          {currentUser ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <img
                src={currentUser.avatar || "https://cdn.discordapp.com/embed/avatars/0.png"}
                alt="avatar"
                style={{ width: "36px", height: "36px", borderRadius: "50%" }}
              />
              <span>{currentUser.username}</span>
              <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={handleLogin}>🔒 Login with Discord</button>
          )}
        </div>
      </div>

      {/* Submit Review Button (Centered) */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        {currentUser ? (
          <button
            className="btn btn-primary"
            onClick={() => setShowSubmitForm(!showSubmitForm)}
            style={{ padding: "0.6rem 2rem", fontSize: "1rem" }}
          >
            {showSubmitForm ? "Cancel" : "✍️ Write a Review"}
          </button>
        ) : (
          <p style={{ color: "#949ba4" }}>Please log in with Discord to submit a review.</p>
        )}
      </div>

      {/* Submit Form */}
      {showSubmitForm && currentUser && (
        <div style={{ background: "#1e1f22", border: "1px solid #2b2d31", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.25rem" }}>Your Rating</label>
            <StarRating rating={newRating} onRatingChange={setNewRating} size={32} />
            {newRating === 0 && <span style={{ color: "#ed4245", fontSize: "0.8rem", marginLeft: "0.5rem" }}>Required</span>}
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.25rem" }}>
              Review Text {newRating >= 3 ? "(optional)" : "(required for ratings below 3)"}
            </label>
            <textarea
              className="field-input"
              rows="4"
              placeholder="Tell us about your experience..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSubmitReview} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}

      {/* Sort & Filter Controls */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem", alignItems: "center" }}>
        <div>
          <label style={{ marginRight: "0.5rem", color: "#949ba4" }}>Sort:</label>
          <select className="select-input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
          </select>
        </div>
        <div>
          <label style={{ marginRight: "0.5rem", color: "#949ba4" }}>Filter:</label>
          <select className="select-input" value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
            <option value="all">All Reviews</option>
            <option value="withText">With Text</option>
            <option value="withoutText">Without Text</option>
            <option value="rating1+">⭐ 1+ Stars</option>
            <option value="rating2+">⭐ 2+ Stars</option>
            <option value="rating3+">⭐ 3+ Stars</option>
            <option value="rating4+">⭐ 4+ Stars</option>
          </select>
        </div>
        <span style={{ color: "#949ba4", marginLeft: "auto" }}>{processedReviews.length} reviews</span>
      </div>

      {/* Reviews List */}
      <div>
        {processedReviews.length === 0 ? (
          <p style={{ color: "#949ba4", textAlign: "center" }}>No reviews match your filters.</p>
        ) : (
          processedReviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              currentUser={currentUser}
              onLike={handleLike}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Highlights Section */}
      {highlights.length > 0 && (
        <div style={{ marginTop: "3rem", borderTop: "1px solid #2b2d31", paddingTop: "2rem" }}>
          <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>🏆 Top Reviews</h2>
          {highlights.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              currentUser={currentUser}
              onLike={handleLike}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isHighlight={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}