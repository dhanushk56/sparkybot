"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      className="navbar"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        padding: "1rem 2rem",
        background: "rgba(10,10,20,.7)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,.04)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: "1.8rem",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: ".5rem",
            color: "#e8e0d8",
            textDecoration: "none",
          }}
        >
          SparkyBot{" "}
          <span
            style={{
              background: "#d4af37",
              color: "#0d0d1a",
              padding: ".1rem .7rem",
              borderRadius: "6px",
              fontSize: ".75rem",
              fontWeight: 700,
            }}
          >
            BETA
          </span>
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
            flexWrap: "wrap",
            marginLeft: "auto",
          }}
        >
          <Link href="/" style={{ color: "#d4af37", fontSize: ".95rem", textDecoration: "none" }}>
            Home
          </Link>
          <Link
            href="/commands"
            style={{
              color: "#a09890",
              fontSize: ".95rem",
              textDecoration: "none",
              transition: "color .3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#d4af37")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#a09890")}
          >
            Commands
          </Link>
          <Link
            href="/dashboard"
            style={{
              color: "#a09890",
              fontSize: ".95rem",
              textDecoration: "none",
              transition: "color .3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#d4af37")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#a09890")}
          >
            Dashboard
          </Link>
          <Link
            href="/reviews"
            style={{
              color: "#a09890",
              fontSize: ".95rem",
              textDecoration: "none",
              transition: "color .3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#d4af37")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#a09890")}
          >
            Reviews
          </Link>
          <a
            href="https://invite.sparkybot.bond"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              padding: ".6rem 1.5rem",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: ".9rem",
              transition: "all .3s cubic-bezier(.22,1,.36,1)",
              border: "none",
              cursor: "pointer",
              background: "#d4af37",
              color: "#0d0d1a",
              boxShadow: "0 4px 16px rgba(212,175,55,.3)",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#e8c84a";
              e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 8px 28px rgba(212,175,55,.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#d4af37";
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(212,175,55,.3)";
            }}
          >
            ✨ Invite
          </a>
        </div>
      </div>
    </nav>
  );
}