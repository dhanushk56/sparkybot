"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // 'bot', 'community', 'account', or null
  const pathname = usePathname();
  const navbarRef = useRef(null);

  // Load user from localStorage (client-side only)
  useEffect(() => {
    const saved = localStorage.getItem("review_user");
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
  }, []);

  // Close all menus on route change
  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
  }, [pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target)) {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  const closeAll = () => {
    setOpenDropdown(null);
    setMobileOpen(false);
  };

  // ---- Reusable dropdown items (desktop) ----
  const Dropdown = ({ label, name, items, links }) => {
    const isOpen = openDropdown === name;
    return (
      <div style={{ position: "relative" }}>
        <button
          onClick={() => toggleDropdown(name)}
          style={{
            background: "none",
            border: "none",
            color: "#e8e0d8",
            fontSize: "0.95rem",
            cursor: "pointer",
            padding: "0.3rem 0.5rem",
            borderRadius: "0.3rem",
          }}
        >
          {label} {isOpen ? "▴" : "▾"}
        </button>
        {isOpen && (
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
              zIndex: 200,
            }}
          >
            {items.map((item, i) => (
              <Link
                key={i}
                href={links[i]}
                onClick={closeAll}
                style={{
                  display: "block",
                  padding: "0.4rem 1rem",
                  color: "#e8e0d8",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
              >
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ---- Account dropdown (desktop) ----
  const AccountDropdown = () => {
    const isOpen = openDropdown === "account";
    return (
      <div style={{ position: "relative" }}>
        <button
          onClick={() => toggleDropdown("account")}
          style={{
            background: "none",
            border: "none",
            color: "#e8e0d8",
            fontSize: "0.95rem",
            cursor: "pointer",
            padding: "0.3rem 0.5rem",
          }}
        >
          {user ? user.username : "Account"} {isOpen ? "▴" : "▾"}
        </button>
        {isOpen && (
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
              zIndex: 200,
            }}
          >
            {user ? (
              <>
                <Link href="/dashboard" onClick={closeAll} style={{ display: "block", padding: "0.4rem 1rem", color: "#e8e0d8", textDecoration: "none" }}>My Dashboard</Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("review_user");
                    setUser(null);
                    closeAll();
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
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <a
                href={`https://discord.com/api/oauth2/authorize?client_id=1528780547411804382&redirect_uri=${encodeURIComponent("https://sparkysite.vercel.app/reviews")}&response_type=token&scope=identify`}
                onClick={closeAll}
                style={{ display: "block", padding: "0.4rem 1rem", color: "#5865F2", textDecoration: "none" }}
              >
                Login with Discord
              </a>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav
      ref={navbarRef}
      style={{
        background: "#1e1f22",
        borderBottom: "1px solid #2b2d31",
        padding: "0.5rem 1rem",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo */}
        <Link href="/" style={{ color: "#e8e0d8", fontSize: "1.2rem", fontWeight: "bold", textDecoration: "none" }}>
          SparkyBot
        </Link>

        {/* Desktop Navigation */}
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }} className="desktop-nav">
          <Dropdown label="Bot" name="bot" items={["Dashboard", "Commands", "Invite", "Support"]} links={["/dashboard", "/commands", "/invite", "/support"]} />
          <Dropdown label="Community" name="community" items={["Reviews", "FAQ"]} links={["/reviews", "/faq"]} />
          <AccountDropdown />
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={toggleMobile}
          style={{
            background: "none",
            border: "none",
            color: "#e8e0d8",
            fontSize: "1.5rem",
            cursor: "pointer",
            display: "block",
          }}
          className="mobile-hamburger"
          aria-label="Toggle menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{ marginTop: "0.5rem", borderTop: "1px solid #2b2d31", paddingTop: "0.5rem" }}>
          <MobileDropdown label="Bot" items={["Dashboard", "Commands", "Invite", "Support"]} links={["/dashboard", "/commands", "/invite", "/support"]} closeAll={closeAll} />
          <MobileDropdown label="Community" items={["Reviews", "FAQ"]} links={["/reviews", "/faq"]} closeAll={closeAll} />
          {user ? (
            <>
              <Link href="/dashboard" onClick={closeAll} style={{ display: "block", padding: "0.5rem 1rem", color: "#e8e0d8", textDecoration: "none" }}>My Dashboard</Link>
              <button
                onClick={() => {
                  localStorage.removeItem("review_user");
                  setUser(null);
                  closeAll();
                  window.location.href = "/";
                }}
                style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", color: "#ed4245", padding: "0.5rem 1rem", fontSize: "1rem", cursor: "pointer" }}
              >
                Logout
              </button>
            </>
          ) : (
            <a
              href={`https://discord.com/api/oauth2/authorize?client_id=1528780547411804382&redirect_uri=${encodeURIComponent("https://sparkysite.vercel.app/reviews")}&response_type=token&scope=identify`}
              onClick={closeAll}
              style={{ display: "block", padding: "0.5rem 1rem", color: "#5865F2", textDecoration: "none" }}
            >
              Login with Discord
            </a>
          )}
        </div>
      )}
    </nav>
  );
}

// ---- Mobile Dropdown (collapsible) ----
function MobileDropdown({ label, items, links, closeAll }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "none",
          border: "none",
          color: "#e8e0d8",
          fontSize: "1rem",
          cursor: "pointer",
          padding: "0.5rem 1rem",
          width: "100%",
          textAlign: "left",
        }}
      >
        {label} {open ? "▲" : "▼"}
      </button>
      {open && items.map((item, i) => (
        <Link
          key={i}
          href={links[i]}
          onClick={() => { setOpen(false); closeAll(); }}
          style={{ display: "block", padding: "0.4rem 1.5rem", color: "#e8e0d8", textDecoration: "none", fontSize: "0.95rem" }}
        >
          {item}
        </Link>
      ))}
    </div>
  );
          }
