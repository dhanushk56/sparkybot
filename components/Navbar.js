"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              <Link className="px-4 py-2 rounded-xl text-sm font-semibold transition bg-white/12 text-white" href="/">
                Home
              </Link>
              <Link className="px-4 py-2 rounded-xl text-sm font-semibold transition text-white/80 hover:text-white hover:bg-white/8" href="/dashboard">
                Dashboard
              </Link>
              <Link className="px-4 py-2 rounded-xl text-sm font-semibold transition text-white/80 hover:text-white hover:bg-white/8" href="/commands">
                Commands
              </Link>
              <Link className="px-4 py-2 rounded-xl text-sm font-semibold transition text-white/80 hover:text-white hover:bg-white/8" href="/support">
                Support
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                className="hidden lg:inline-flex items-center justify-center rounded-xl bg-gold-primary px-5 py-2.5 text-sm font-semibold text-black shadow-[0_8px_24px_rgba(255,215,0,0.4)] hover:bg-[#FFC700] transition"
                href="/login"
              >
                Login
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden h-9 w-9 sm:h-10 sm:w-10 rounded-xl border border-white/15 bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition"
                aria-label="Toggle menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  {mobileMenuOpen ? (
                    <path d="M18 6 6 18 M6 6l12 12" />
                  ) : (
                    <path d="M4 5h16 M4 12h16 M4 19h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 mt-2 rounded-[26px] glass-nav p-4 flex flex-col gap-2">
              <Link className="px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/8 transition" href="/">
                Home
              </Link>
              <Link className="px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/8 transition" href="/dashboard">
                Dashboard
              </Link>
              <Link className="px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/8 transition" href="/commands">
                Commands
              </Link>
              <Link className="px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/8 transition" href="/support">
                Support
              </Link>
              <Link className="mt-2 inline-flex items-center justify-center rounded-xl bg-gold-primary px-5 py-2.5 text-sm font-semibold text-black" href="/login">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
