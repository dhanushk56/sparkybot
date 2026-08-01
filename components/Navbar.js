"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState({
    bot: false,
    community: false,
    account: false,
  });
  const pathname = usePathname();

  // Check for logged-in user (from reviews page or elsewhere)
  useEffect(() => {
    const savedUser = localStorage.getItem("review_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {}
    }
  }, []);

  const toggleDropdown = (name) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen({ bot: false, community: false, account: false });
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav
      style={{
        background: "#1e1f22",
        borderBottom: "1px solid #2b2d31",
        padding: "0.5rem 1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo / Brand */}
      <Link href="/" style={{ color: "#e8e0d8", fontSize: "1.2rem", fontWeight: "bold", textDecoration: "none" }}>
        SparkyBot
      </Link>

      {/* Navigation Links with Dropdowns */}
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        {/* Bot Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={(e) => { e.stopPropagation(); toggleDropdown("bot"); }}
            style={{
              background: "none",
              border: "none",
              color: "#e8e0d8",
              fontSize: "0.95rem",
              cursor: "pointer",
              padding: "0.3rem 0.5rem",
              borderRadius: "0.3rem",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            Bot ▾
          </button>
          {dropdownOpen.bot && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                background: "#1e1f22",
                border: "1px solid #2b2d31",
                borderRadius: "0.5rem",
                minWidth: "160px",
                padding: "0.5rem 0",
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                marginTop: "0.25rem",
              }}
            >
              <Link href="/dashboard" style={{ display: "block", padding: "0.4rem 1rem", color: "#e8e0d8", textDecoration: "none", fontSize: "0.9rem" }}>Dashboard</Link>
              <Link href="/commands" style={{ display: "block", padding: "0.4rem 1rem", color: "#e8e0d8", textDecoration: "none", fontSize: "0.9rem" }}>Commands</Link>
              <Link href="/invite" style={{ display: "block", padding: "0.4rem 1rem", color: "#e8e0d8", textDecoration: "none", fontSize: "0.9rem" }}>Invite</Link>
              <Link href="/support" style={{ display: "block", padding: "0.4rem 1rem", color: "#e8e0d8", textDecoration: "none", fontSize: "0.9rem" }}>Support</Link>
            </div>
          )}
        </div>

        {/* Community Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={(e) => { e.stopPropagation(); toggleDropdown("community"); }}
            style={{
              background: "none",
              border: "none",
              color: "#e8e0d8",
              fontSize: "0.95rem",
              cursor: "pointer",
              padding: "0.3rem 0.5rem",
              borderRadius: "0.3rem",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            Community ▾
          </button>
          {dropdownOpen.community && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                background: "#1e1f22",
                border: "1px solid #2b2d31",
                borderRadius: "0.5rem",
                minWidth: "160px",
                padding: "0.5rem 0",
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                marginTop: "0.25rem",
              }}
            >
              <Link href="/reviews" style={{ display: "block", padding: "0.4rem 1rem", color: "#e8e0d8", textDecoration: "none", fontSize: "0.9rem" }}>⭐ Reviews</Link>
              <Link href="/faq" style={{ display: "block", padding: "0.4rem 1rem", color: "#e8e0d8", textDecoration: "none", fontSize: "0.9rem" }}>FAQ</Link>
            </div>
          )}
        </div>

        {/* Account Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={(e) => { e.stopPropagation(); toggleDropdown("account"); }}
            style={{
              background: "none",
              border: "none",
              color: "#e8e0d8",
              fontSize: "0.95rem",
              cursor: "pointer",
              padding: "0.3rem 0.5rem",
              borderRadius: "0.3rem",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            {user ? user.username : "Account"} ▾
          </button>
          {dropdownOpen.account && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                background: "#1e1f22",
                border: "1px solid #2b2d31",
                borderRadius: "0.5rem",
                minWidth: "160px",
                padding: "0.5rem 0",
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                marginTop: "0.25rem",
              }}
            >
              {user ? (
                <>
                  <Link href="/dashboard" style={{ display: "block", padding: "0.4rem 1rem", color: "#e8e0d8", textDecoration: "none", fontSize: "0.9rem" }}>My Dashboard</Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem("review_user");
                      window.location.href = "/";
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      background: "none",
                      border: "none",
                      color: "#ed4245",
                      padding: "0.4rem 1rem",
                      fontSize: "0.9rem",
                      cursor: "pointer",
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <a
                  href={`https://discord.com/api/oauth2/authorize?client_id=1528780547411804382&redirect_uri=${encodeURIComponent("https://sparkysite.vercel.app/reviews")}&response_type=token&scope=identify`}
                  style={{ display: "block", padding: "0.4rem 1rem", color: "#5865F2", textDecoration: "none", fontSize: "0.9rem" }}
                >
                  Login with Discord
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
                }
