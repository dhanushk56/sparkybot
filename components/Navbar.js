"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const pathname = usePathname();
  const navbarRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("review_user");
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
  }, [pathname]);

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

  const DropdownItem = ({ label, name, items, links }) => {
    const isOpen = openDropdown === name;
    return (
      <div style={{ position: "relative", display: "inline-block" }}>
        <button
          onClick={() => toggleDropdown(name)}
          className="nav-link-btn"
          style={{
            background: "none",
            border: "none",
            color: "#a09890",
            fontSize: "0.95rem",
            cursor: "pointer",
            padding: "0.3rem 0.5rem",
            fontFamily: "inherit",
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
              background: "#1a1a2e",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              minWidth: "160px",
              padding: "0.5rem 0",
              boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
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
                  padding: "0.5rem 1.2rem",
                  color: "#e8e0d8",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  const AccountDropdown = () => {
    const isOpen = openDropdown === "account";
    return (
      <div style={{ position: "relative", display: "inline-block" }}>
        <button
          onClick={() => toggleDropdown("account")}
          className="nav-link-btn"
          style={{
            background: "none",
            border: "none",
            color: "#a09890",
            fontSize: "0.95rem",
            cursor: "pointer",
            padding: "0.3rem 0.5rem",
            fontFamily: "inherit",
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
              background: "#1a1a2e",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              minWidth: "160px",
              padding: "0.5rem 0",
              boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
              zIndex: 200,
            }}
          >
            {user ? (
              <>
                <Link href="/dashboard" onClick={closeAll} style={{ display: "block", padding: "0.5rem 1.2rem", color: "#e8e0d8", textDecoration: "none" }}>My Dashboard</Link>
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
                    color: "#f87171",
                    padding: "0.5rem 1.2rem",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: "0.9rem",
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <a
                href={`https://discord.com/api/oauth2/authorize?client_id=1528780547411804382&redirect_uri=${encodeURIComponent("https://sparkysite.vercel.app/reviews")}&response_type=token&scope=identify`}
                onClick={closeAll}
                style={{ display: "block", padding: "0.5rem 1.2rem", color: "#5865F2", textDecoration: "none" }}
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
    <nav ref={navbarRef} className="navbar">
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap", width: "100%" }}>
        {/* Logo */}
        <Link href="/" className="logo" style={{ fontSize: "1.8rem", fontWeight: 800, display: "flex", alignItems: "center", gap: ".5rem", color: "#e8e0d8", textDecoration: "none" }}>
          SparkyBot <span style={{ background: "#d4af37", color: "#0d0d1a", padding: ".1rem .7rem", borderRadius: "6px", fontSize: ".75rem", fontWeight: 700 }}>BETA</span>
        </Link>

        {/* Desktop Navigation - hidden on mobile via CSS */}
        <div className="nav-links">
          <DropdownItem label="Bot" name="bot" items={["Dashboard", "Commands", "Invite", "Support"]} links={["/dashboard", "/commands", "/invite", "/support"]} />
          <DropdownItem label="Community" name="community" items={["Reviews", "FAQ"]} links={["/reviews", "/faq"]} />
          <AccountDropdown />
        </div>

        {/* Mobile Hamburger - shown on mobile via CSS */}
        <button
          onClick={toggleMobile}
          className="mobile-hamburger"
          aria-label="Toggle menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu - only shown when mobileOpen is true */}
      {mobileOpen && (
        <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <MobileDropdown label="Bot" items={["Dashboard", "Commands", "Invite", "Support"]} links={["/dashboard", "/commands", "/invite", "/support"]} closeAll={closeAll} />
          <MobileDropdown label="Community" items={["Reviews", "FAQ"]} links={["/reviews", "/faq"]} closeAll={closeAll} />
          {user ? (
            <>
              <Link href="/dashboard" onClick={closeAll} style={{ display: "block", padding: "0.6rem 1rem", color: "#e8e0d8", textDecoration: "none" }}>My Dashboard</Link>
              <button
                onClick={() => {
                  localStorage.removeItem("review_user");
                  setUser(null);
                  closeAll();
                  window.location.href = "/";
                }}
                style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", color: "#f87171", padding: "0.6rem 1rem", fontSize: "1rem", cursor: "pointer" }}
              >
                Logout
              </button>
            </>
          ) : (
            <a
              href={`https://discord.com/api/oauth2/authorize?client_id=1528780547411804382&redirect_uri=${encodeURIComponent("https://sparkysite.vercel.app/reviews")}&response_type=token&scope=identify`}
              onClick={closeAll}
              style={{ display: "block", padding: "0.6rem 1rem", color: "#5865F2", textDecoration: "none" }}
            >
              Login with Discord
            </a>
          )}
        </div>
      )}
    </nav>
  );
}

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
          padding: "0.6rem 1rem",
          width: "100%",
          textAlign: "left",
          fontFamily: "inherit",
        }}
      >
        {label} {open ? "▲" : "▼"}
      </button>
      {open && items.map((item, i) => (
        <Link
          key={i}
          href={links[i]}
          onClick={() => { setOpen(false); closeAll(); }}
          style={{ display: "block", padding: "0.4rem 1.5rem", color: "#a09890", textDecoration: "none", fontSize: "0.95rem" }}
        >
          {item}
        </Link>
      ))}
    </div>
  );
}
