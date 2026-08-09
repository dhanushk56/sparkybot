"use client";

import { useEffect } from "react";
import Link from "next/link";

const CLIENT_ID = "1528780547411804382";
const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=8&scope=bot%20applications.commands`;

export default function InvitePage() {
  // Optional: auto-redirect after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = INVITE_URL;
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="main" style={{ textAlign: "center", paddingTop: "4rem" }}>
      <div className="hero">
        <h1>Invite SparkyBot</h1>
        <p style={{ maxWidth: "500px", margin: "0 auto 2rem" }}>
          Click the button below to invite SparkyBot to your server. You'll be redirected to Discord.
        </p>
        <div className="hero-buttons">
          <a href={INVITE_URL} className="btn btn-primary" style={{ fontSize: "1.2rem", padding: "0.8rem 2.5rem" }}>
            Invite Now
          </a>
          <Link href="/" className="btn btn-secondary">Cancel</Link>
        </div>
        <p style={{ marginTop: "2rem", color: "#808098", fontSize: "0.9rem" }}>
          Redirecting automatically in a moment...
        </p>
      </div>
    </main>
  );
}
