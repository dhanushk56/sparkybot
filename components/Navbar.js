"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/commands", label: "Commands" },
  { href: "/premium", label: "Premium", accent: true },
  { href: "/reviews", label: "Reviews" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const [mobileLegalOpen, setMobileLegalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const legalRef = useRef(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setUser(data.user || null))
      .catch(() => setUser(null))
      .finally(() => setLoadingUser(false));
  }, []);

  // Close the desktop Legal dropdown on outside click.
  useEffect(() => {
    if (!legalOpen) return;
    const handleClick = (e) => {
      if (legalRef.current && !legalRef.current.contains(e.target)) {
        setLegalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [legalOpen]);

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
              {NAV_LINKS.map((link) =>
                link.accent ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 rounded-xl text-sm font-bold text-black bg-gradient-to-br from-gold-primary to-gold-secondary shadow-[0_6px_18px_rgba(255,215,0,0.35)] hover:shadow-[0_8px_22px_rgba(255,215,0,0.5)] hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <Link
                    key={link.href}
                    className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 text-white/80 hover:text-white hover:bg-white/8"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                )
              )}

              <div className="relative" ref={legalRef}>
                <button
                  type="button"
                  onClick={() => setLegalOpen((v) => !v)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 text-white/80 hover:text-white hover:bg-white/8 flex items-center gap-1.5"
                  aria-expanded={legalOpen}
                  aria-haspopup="true"
                >
                  Legal
                  <i
                    className="fas fa-chevron-down text-[10px] transition-transform duration-300"
                    style={{ transform: legalOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  ></i>
                </button>
                {legalOpen && (
                  <div className="dropdown-panel absolute top-[calc(100%+0.5rem)] right-0 min-w-[180px] rounded-xl glass-nav p-1.5 z-10">
                    {LEGAL_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setLegalOpen(false)}
                        className="block px-3.5 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/8 transition-all duration-200 whitespace-nowrap"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
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
              maxHeight: mobileMenuOpen ? "640px" : "0px",
              opacity: mobileMenuOpen ? 1 : 0,
              transform: mobileMenuOpen ? "translateY(0)" : "translateY(-8px)",
              pointerEvents: mobileMenuOpen ? "auto" : "none",
            }}
          >
            <div className="p-4 flex flex-col gap-2">
              {NAV_LINKS.map((link) =>
                link.accent ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold text-black bg-gradient-to-br from-gold-primary to-gold-secondary shadow-[0_6px_18px_rgba(255,215,0,0.35)] text-center transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <Link
                    key={link.href}
                    className="px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/8 transition-all duration-300"
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}

              <button
                type="button"
                onClick={() => setMobileLegalOpen((v) => !v)}
                className="px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/8 transition-all duration-300 flex items-center justify-between"
              >
                Legal
                <i
                  className="fas fa-chevron-down text-[10px] transition-transform duration-300"
                  style={{ transform: mobileLegalOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                ></i>
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: mobileLegalOpen ? "200px" : "0px" }}
              >
                <div className="flex flex-col gap-1 pl-4">
                  {LEGAL_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => { setMobileMenuOpen(false); setMobileLegalOpen(false); }}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-white/70 hover:bg-white/8 hover:text-white transition-all duration-300"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

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
