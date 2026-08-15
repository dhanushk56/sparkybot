"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/commands", label: "Commands" },
  { href: "/reviews", label: "Reviews" },
  { href: "/partners", label: "Partners" },
  { href: "/support", label: "Support" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setUser(data.user || null))
      .catch(() => setUser(null))
      .finally(() => setLoadingUser(false));
  }, []);

  return (
    <nav className="fixed top-0 inset-x-0 z-[70] px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mx-auto max-w-[1240px]">
        <div className="relative rounded-[26px] glass-nav">
          <div className="pointer-events-none absolute inset-0 rounded-[26px] bg-[radial-gradient(circle_at_15%_10%,rgba(255,215,0,0.15),transparent_44%),radial-gradient(circle_at_86%_120%,rgba(255,140,0,0.1),transparent_52%)]"></div>
          <div className="relative h-[66px] px-4 sm:px-6 flex items-center justify-between">
            <Link className="flex items-center gap-2.5 min-w-0" href="/">
              <div className="h-[34px] w-[34px] rounded-full bg-gradient-to-br from-gold-primary to-gold-secondary flex items-center justify-center text-black font-orbitron font-black text-lg">
                S
              </div>
              <span className="text-white font-orbitron font-bold tracking-tight text-[22px] leading-none">
                SparkyBot
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 text-white/80 hover:text-white hover:bg-white/8"
                  href={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden lg:block">
                <AccountControl user={user} loading={loadingUser} />
              </div>
              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="lg:hidden h-9 w-9 sm:h-10 sm:w-10 rounded-xl border border-white/15 bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition-all duration-300"
                aria-label="Toggle menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 transition-transform duration-300" style={{ transform: mobileMenuOpen ? "rotate(90deg)" : "rotate(0deg)" }}>
                  {mobileMenuOpen ? (
                    <path d="M18 6 6 18 M6 6l12 12" />
                  ) : (
                    <path d="M4 5h16 M4 12h16 M4 19h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          <div
            className="lg:hidden absolute top-full left-0 right-0 mt-2 rounded-[26px] glass-nav overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              maxHeight: mobileMenuOpen ? "480px" : "0px",
              opacity: mobileMenuOpen ? 1 : 0,
              transform: mobileMenuOpen ? "translateY(0)" : "translateY(-8px)",
              pointerEvents: mobileMenuOpen ? "auto" : "none",
            }}
          >
            <div className="p-4 flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  className="px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/8 transition-all duration-300"
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2">
                <AccountControl user={user} loading={loadingUser} mobile />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function AccountControl({ user, loading, mobile = false }) {
  if (loading) {
    return (
      <div
        className={`${mobile ? "w-full" : ""} h-10 w-24 rounded-xl bg-white/5 animate-pulse`}
      />
    );
  }

  if (!user) {
    return (
      <Link
        className={`${mobile ? "flex w-full" : "inline-flex"} items-center justify-center rounded-xl bg-gold-primary px-5 py-2.5 text-sm font-semibold text-black shadow-[0_8px_24px_rgba(255,215,0,0.4)] hover:bg-[#FFC700] hover:-translate-y-0.5 transition-all duration-300`}
        href="/login"
      >
        Login
      </Link>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${mobile ? "w-full flex-wrap" : ""}`}>
      <img
        src={user.avatar}
        alt=""
        className="h-8 w-8 rounded-full border border-white/15"
      />
      <span className="text-white/90 text-sm font-semibold truncate max-w-[110px]">
        {user.username}
      </span>
      <a
        href="/api/auth/logout"
        className="ml-auto text-xs font-semibold text-white/60 hover:text-white transition-all duration-300 px-3 py-1.5 rounded-lg hover:bg-white/8"
      >
        Logout
      </a>
    </div>
  );
}
