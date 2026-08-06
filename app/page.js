"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const [serverStatus, setServerStatus] = useState("Loading...");
  const [botStatus, setBotStatus] = useState("Loading...");
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    // Simulate status checks – replace with actual API calls
    const fetchStatus = async () => {
      try {
        // Replace with your actual bot API endpoint
        const res = await fetch("/api/status");
        if (res.ok) {
          const data = await res.json();
          setBotStatus(data.status || "🟢 Online");
          setServerStatus(data.status || "🟢 Operational");
        } else {
          setBotStatus("🟢 Online");
          setServerStatus("🟢 Operational");
        }
      } catch {
        setBotStatus("🟢 Online");
        setServerStatus("🟢 Operational");
      }
    };
    fetchStatus();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const features = [
    {
      icon: "⚔️",
      title: "Advanced Moderation",
      desc: "Kick, ban, mute, warn, jail, purge, lockdown, and slowmode – all with detailed logging.",
    },
    {
      icon: "🎟️",
      title: "Ticket System",
      desc: "Complete support tickets with transcripts, categories, claim/close, and staff roles.",
    },
    {
      icon: "💰",
      title: "Economy & Leveling",
      desc: "Currency, shop, daily rewards, XP, and leveling with role rewards and leaderboards.",
    },
    {
      icon: "🎉",
      title: "Giveaways",
      desc: "Create and manage giveaways with role requirements, multiple winners, and rerolls.",
    },
    {
      icon: "📄",
      title: "Applications",
      desc: "Staff applications with custom questions, review flows, and automatic role assignment.",
    },
    {
      icon: "🎵",
      title: "Music System",
      desc: "YouTube, SoundCloud, and Spotify support — queue, shuffle, loop, 24/7 mode, and live lyrics.",
    },
    {
      icon: "🛡️",
      title: "Anti-Nuke Protection",
      desc: "Automatically detect and stop mass-deletes, bans, role changes, channel creations, and webhooks.",
    },
    {
      icon: "🌐",
      title: "Translation",
      desc: "Translate messages, detect languages, and auto-translate channels with 100+ languages.",
    },
    {
      icon: "🎭",
      title: "Reaction Roles",
      desc: "Assign roles via reactions with multiple modes, exclusive groups, and full customization.",
    },
    {
      icon: "🔊",
      title: "Join-to-Create",
      desc: "Let members create private voice channels with automatic cleanup, naming, and full control.",
    },
    {
      icon: "📝",
      title: "Logging",
      desc: "Comprehensive audit logs for messages, members, channels, roles, and moderation actions – 20+ events.",
    },
    {
      icon: "📨",
      title: "Invite Tracking",
      desc: "Track invites, detect fake accounts, view leaderboards, and message statistics.",
    },
    {
      icon: "🔐",
      title: "Verification",
      desc: "Image captcha verification with private channels, timeout, and custom roles.",
    },
    {
      icon: "👋",
      title: "Welcome & Auto-role",
      desc: "Welcome/goodbye messages with embeds, DMs, and auto-roles for new members.",
    },
    {
      icon: "▶️",
      title: "YouTube Notifications",
      desc: "Track YouTube channels and get notified on new uploads with keyword filters and custom messages.",
    },
    {
      icon: "🔒",
      title: "Forum Lock",
      desc: "Automatically lock forum posts after a set time with logging.",
    },
    {
      icon: "🖥️",
      title: "Web Dashboard",
      desc: "Manage prefixes, welcome messages and automod straight from your browser — no commands needed.",
    },
  ];

  const newsPosts = [
    {
      id: 1,
      title: "🚀 SparkyBot v2.0 Released!",
      author: "Noxillio",
      date: "2 months ago",
      summary:
        "SparkyBot v2.0 is here with major improvements! New features include a revamped music system, enhanced anti-nuke protection, and a brand new web dashboard.",
      link: "/blog/sparkybot-v2-release",
    },
    {
      id: 2,
      title: "🎵 Music System Overhaul Complete",
      author: "Noxillio",
      date: "3 months ago",
      summary:
        "The music system has been completely rewritten with support for YouTube, SoundCloud, and Spotify. Enjoy improved playback, live lyrics, and 24/7 mode.",
      link: "/blog/music-system-overhaul",
    },
    {
      id: 3,
      title: "🛡️ New Anti-Nuke Features",
      author: "Noxillio",
      date: "4 months ago",
      summary:
        "We've added advanced anti-nuke protection to detect and prevent mass-deletes, bans, role changes, and channel creations in real-time.",
      link: "/blog/anti-nuke-features",
    },
  ];

  return (
    <div style={{ backgroundColor: "#0a0a14", minHeight: "100vh", color: "#e8e0d8" }}>
      {/* Loader */}
      <div className="load-wrapper" style={{ display: "none" }}>
        <div className="loader">
          <div className="loader-inner line-scale">
            <div></div><div></div><div></div><div></div><div></div>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-theme navbar-double navbar-top-new" style={{ background: "rgba(10,10,20,.7)", backdropFilter: "blur(16px)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
          <button className="navbar-toggler nav-link" type="button" style={{ background: "none", border: "none", color: "#e8e0d8", fontSize: "1.2rem" }}>
            <i className="fa-solid fa-bars"></i> Menu
          </button>

          <a href="#" onClick={() => copyToClipboard("sparkybot.bond")} style={{ color: "#e8e0d8", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <svg className="creeper" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{ width: "24px", height: "24px", fill: "#d4af37" }}>
              <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm88.3 339.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7-4.7 16.7-12.3 20.9s-16.8 4.1-24.3-.5l-144-88c-7.1-4.4-11.5-12.1-11.5-20.5s4.4-16.1 11.5-20.5l144-88c7.4-4.5 16.7-4.7 24.3-.5 7.6 4.2 12.3 12.3 12.3 20.9v144c0 8.7-4.7 16.7-12.3 20.9z"/>
            </svg>
            <span style={{ fontSize: "0.85rem", color: "#a09890" }}>sparkybot.bond</span>
          </a>

          <a href="https://discord.gg/sparkybot" target="_blank" rel="noreferrer" style={{ color: "#e8e0d8", textDecoration: "none" }}>
            <svg className="discord" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 245 240" style={{ width: "28px", height: "28px", fill: "#5865F2" }}>
              <path d="M104.4 103.9c-5.7 0-10.2 5-10.2 11.1s4.6 11.1 10.2 11.1c5.7 0 10.2-5 10.2-11.1.1-6.1-4.5-11.1-10.2-11.1zM140.9 103.9c-5.7 0-10.2 5-10.2 11.1s4.6 11.1 10.2 11.1c5.7 0 10.2-5 10.2-11.1s-4.5-11.1-10.2-11.1z"/>
              <path d="M189.5 20h-134C44.2 20 35 29.2 35 40.6v135.2c0 11.4 9.2 20.6 20.5 20.6h113.4l-5.3-18.5 12.8 11.9 12.1 11.2 21.5 19V40.6c0-11.4-9.2-20.6-20.5-20.6zm-38.6 130.6s-3.6-4.3-6.6-8.1c13.1-3.7 18.1-11.9 18.1-11.9-4.1 2.7-8 4.6-11.5 5.9-5 2.1-9.8 3.5-14.5 4.3-9.6 1.8-18.4 1.3-25.9-.1-5.7-1.1-10.6-2.7-14.7-4.3-2.3-.9-4.8-2-7.3-3.4-.3-.2-.6-.3-.9-.5-.2-.1-.3-.2-.4-.3-1.8-1-2.8-1.7-2.8-1.7s4.8 8 17.5 11.8c-3 3.8-6.7 8.3-6.7 8.3-22.1-.7-30.5-15.2-30.5-15.2 0-32.2 14.4-58.3 14.4-58.3 14.4-10.8 28.1-10.5 28.1-10.5l1 1.2c-18 5.2-26.3 13.1-26.3 13.1s2.2-1.2 5.9-2.9c10.7-4.7 19.2-6 22.7-6.3.6-.1 1.1-.2 1.7-.2 6.1-.8 13-1 20.2-.2 9.5 1.1 19.7 3.9 30.1 9.6 0 0-7.9-7.5-24.9-12.7l1.4-1.6s13.7-.3 28.1 10.5c0 0 14.4 26.1 14.4 58.3 0 0-8.5 14.5-30.6 15.2z"/>
            </svg>
          </a>

          <div className="collapse navbar-collapse" id="navbar">
            <ul className="navbar-nav mx-auto" style={{ display: "flex", listStyle: "none", gap: "1.5rem", margin: 0, padding: 0 }}>
              <li className="nav-item"><a className="nav-link nav-link-active" href="/" style={{ color: "#d4af37", textDecoration: "none" }}><i className="fa-solid fa-house"></i> Home</a></li>
              <li className="nav-item"><a className="nav-link" href="/features" style={{ color: "#a09890", textDecoration: "none" }}><i className="fa-solid fa-star"></i> Features</a></li>
              <li className="nav-item"><a className="nav-link" href="/commands" style={{ color: "#a09890", textDecoration: "none" }}><i className="fa-solid fa-terminal"></i> Commands</a></li>
              <li className="nav-item"><a className="nav-link" href="/dashboard" style={{ color: "#a09890", textDecoration: "none" }}><i className="fa-solid fa-gauge-high"></i> Dashboard</a></li>
              <li className="nav-item"><a className="nav-link" href="/reviews" style={{ color: "#a09890", textDecoration: "none" }}><i className="fa-solid fa-star"></i> Reviews</a></li>
              <li className="nav-item"><a className="nav-link" href="https://invite.sparkybot.bond" target="_blank" rel="noreferrer" style={{ color: "#a09890", textDecoration: "none" }}><i className="fa-solid fa-plus-circle"></i> Invite</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="color-overlay" style={{ position: "relative" }}>
        <div className="header" id="header-pjs" style={{
          height: "475px",
          background: "url('/uploads/banner.png') no-repeat center center",
          backgroundSize: "cover",
          opacity: 0.7,
          position: "relative",
          zIndex: 1,
        }}></div>
      </div>

      {/* Status Boxes */}
      <div className="logo-ds-flex" style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "2rem",
        marginTop: "-60px",
        position: "relative",
        zIndex: 2,
        flexWrap: "wrap",
      }}>
        {/* Bot Status */}
        <div className="status-box-container" style={{ cursor: "pointer" }} onClick={() => copyToClipboard("sparkybot.bond")}>
          <div className="status-text" style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            background: "rgba(10,10,20,.8)",
            backdropFilter: "blur(10px)",
            padding: "0.75rem 1.5rem",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,.06)",
          }}>
            <div className="icon">
              <div className="icon-wrapper">
                <svg className="creeper" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{ width: "32px", height: "32px", fill: "#d4af37" }}>
                  <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm88.3 339.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7-4.7 16.7-12.3 20.9s-16.8 4.1-24.3-.5l-144-88c-7.1-4.4-11.5-12.1-11.5-20.5s4.4-16.1 11.5-20.5l144-88c7.4-4.5 16.7-4.7 24.3-.5 7.6 4.2 12.3 12.3 12.3 20.9v144c0 8.7-4.7 16.7-12.3 20.9z"/>
                </svg>
              </div>
            </div>
            <div className="text">
              <div className="top-text" style={{ fontSize: "1.1rem", fontWeight: "600" }}>
                <span className="server-status" style={{ color: "#4ade80" }}>🟢 Online</span>
              </div>
              <div className="bottom-text" style={{ fontSize: "0.85rem", color: "#a09890" }}>
                <div className="reel-1">sparkybot.bond</div>
                <div className="reel-1">Click to copy</div>
              </div>
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="logo-container">
          <a id="logo-link" href="/">
            <img className="logo animated-logo" alt="SparkyBot" src="/uploads/logo.png" style={{ height: "150px", maxWidth: "100%" }} />
          </a>
        </div>

        {/* Discord Status */}
        <div className="discord-box-container">
          <a href="https://discord.gg/sparkybot" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
            <div className="discord-text" style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              background: "rgba(10,10,20,.8)",
              backdropFilter: "blur(10px)",
              padding: "0.75rem 1.5rem",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,.06)",
            }}>
              <div className="icon">
                <div className="icon-wrapper">
                  <svg className="discord" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 245 240" style={{ width: "32px", height: "32px", fill: "#5865F2" }}>
                    <path d="M104.4 103.9c-5.7 0-10.2 5-10.2 11.1s4.6 11.1 10.2 11.1c5.7 0 10.2-5 10.2-11.1.1-6.1-4.5-11.1-10.2-11.1zM140.9 103.9c-5.7 0-10.2 5-10.2 11.1s4.6 11.1 10.2 11.1c5.7 0 10.2-5 10.2-11.1s-4.5-11.1-10.2-11.1z"/>
                    <path d="M189.5 20h-134C44.2 20 35 29.2 35 40.6v135.2c0 11.4 9.2 20.6 20.5 20.6h113.4l-5.3-18.5 12.8 11.9 12.1 11.2 21.5 19V40.6c0-11.4-9.2-20.6-20.5-20.6zm-38.6 130.6s-3.6-4.3-6.6-8.1c13.1-3.7 18.1-11.9 18.1-11.9-4.1 2.7-8 4.6-11.5 5.9-5 2.1-9.8 3.5-14.5 4.3-9.6 1.8-18.4 1.3-25.9-.1-5.7-1.1-10.6-2.7-14.7-4.3-2.3-.9-4.8-2-7.3-3.4-.3-.2-.6-.3-.9-.5-.2-.1-.3-.2-.4-.3-1.8-1-2.8-1.7-2.8-1.7s4.8 8 17.5 11.8c-3 3.8-6.7 8.3-6.7 8.3-22.1-.7-30.5-15.2-30.5-15.2 0-32.2 14.4-58.3 14.4-58.3 14.4-10.8 28.1-10.5 28.1-10.5l1 1.2c-18 5.2-26.3 13.1-26.3 13.1s2.2-1.2 5.9-2.9c10.7-4.7 19.2-6 22.7-6.3.6-.1 1.1-.2 1.7-.2 6.1-.8 13-1 20.2-.2 9.5 1.1 19.7 3.9 30.1 9.6 0 0-7.9-7.5-24.9-12.7l1.4-1.6s13.7-.3 28.1 10.5c0 0 14.4 26.1 14.4 58.3 0 0-8.5 14.5-30.6 15.2z"/>
                  </svg>
                </div>
              </div>
              <div className="text">
                <div className="top-text" style={{ fontSize: "1.1rem", fontWeight: "600" }}>
                  <span className="discord-status" style={{ color: "#5865F2" }}>🟣 Join Discord</span>
                </div>
                <div className="bottom-text" style={{ fontSize: "0.85rem", color: "#a09890" }}>
                  <div className="reel-1">discord.gg/sparkybot</div>
                  <div className="reel-1">Click to join</div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div className="container" style={{ maxWidth: "1200px", margin: "4rem auto", padding: "0 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: "800", marginBottom: "0.5rem" }}>
            Everything your server needs
          </h1>
          <p style={{ color: "#a09890", fontSize: "1.2rem", maxWidth: "640px", margin: "0 auto" }}>
            One bot, countless tools. Replace a dozen bots with SparkyBot.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}>
          {features.map((feature, index) => (
            <div key={index} style={{
              background: "rgba(255,255,255,.02)",
              border: "1px solid rgba(255,255,255,.04)",
              borderRadius: "16px",
              padding: "1.5rem",
              transition: "all 0.3s ease",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,.04)";
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.borderColor = "rgba(212,175,55,.2)";
              e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,.02)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,.04)";
              e.currentTarget.style.boxShadow = "none";
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{feature.icon}</div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.4rem", color: "#e8e0d8" }}>{feature.title}</h3>
              <p style={{ color: "#909090", fontSize: "0.95rem", lineHeight: "1.6" }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* News / Updates Section */}
      <div className="container" style={{ maxWidth: "1200px", margin: "3rem auto", padding: "0 1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "700" }}>📰 Latest Updates</h2>
          <a href="/blog" style={{ color: "#d4af37", textDecoration: "none" }}>View all →</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {newsPosts.map((post) => (
            <div key={post.id} style={{
              background: "rgba(255,255,255,.02)",
              border: "1px solid rgba(255,255,255,.06)",
              borderRadius: "16px",
              overflow: "hidden",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,.04)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,.02)";
              e.currentTarget.style.transform = "translateY(0)";
            }}>
              <div style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ color: "#d4af37", fontSize: "0.8rem", fontWeight: "600" }}>UPDATE</span>
                  <span style={{ color: "#808098", fontSize: "0.8rem" }}>{post.date}</span>
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "0.5rem", color: "#e8e0d8" }}>
                  {post.title}
                </h3>
                <p style={{ color: "#a09890", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "1rem" }}>
                  {post.summary}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#808098", fontSize: "0.8rem" }}>by {post.author}</span>
                  <a href={post.link} style={{ color: "#d4af37", textDecoration: "none", fontSize: "0.9rem" }}>
                    Read more →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="footer" style={{
        background: "rgba(10,10,20,.7)",
        borderTop: "1px solid rgba(255,255,255,.03)",
        marginTop: "4rem",
      }}>
        <div className="f-large" style={{ padding: "2rem 0" }}>
          <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem" }}>
              <div className="footer-col">
                <div className="footer-text-header" style={{ color: "#d4af37", fontSize: "1.1rem", fontWeight: "700", marginBottom: "0.75rem" }}>Get Started</div>
                <p style={{ color: "#808098", fontSize: "0.95rem", lineHeight: "1.6" }}>
                  Add SparkyBot to your server and unlock powerful moderation, music, tickets, and more.
                </p>
                <a href="https://invite.sparkybot.bond" target="_blank" rel="noreferrer" className="btn btn-play" style={{
                  display: "inline-block",
                  padding: "0.6rem 1.5rem",
                  borderRadius: "8px",
                  background: "#d4af37",
                  color: "#0d0d1a",
                  fontWeight: "600",
                  textDecoration: "none",
                  marginTop: "0.5rem",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#e8c84a";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#d4af37";
                  e.currentTarget.style.transform = "translateY(0)";
                }}>
                  Invite Now →
                </a>
              </div>
              <div className="footer-col">
                <div className="footer-text-header" style={{ color: "#d4af37", fontSize: "1.1rem", fontWeight: "700", marginBottom: "0.75rem" }}>Links</div>
                <a className="footer-link" href="/commands" style={{ display: "block", color: "#808098", textDecoration: "none", marginBottom: "0.4rem", transition: "color 0.3s" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#d4af37"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#808098"}>
                  Commands
                </a>
                <a className="footer-link" href="/dashboard" style={{ display: "block", color: "#808098", textDecoration: "none", marginBottom: "0.4rem", transition: "color 0.3s" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#d4af37"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#808098"}>
                  Dashboard
                </a>
                <a className="footer-link" href="/reviews" style={{ display: "block", color: "#808098", textDecoration: "none", marginBottom: "0.4rem", transition: "color 0.3s" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#d4af37"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#808098"}>
                  Reviews
                </a>
                <a className="footer-link" href="/faq" style={{ display: "block", color: "#808098", textDecoration: "none", transition: "color 0.3s" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#d4af37"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#808098"}>
                  FAQ
                </a>
              </div>
              <div className="footer-col">
                <div className="footer-text-header" style={{ color: "#d4af37", fontSize: "1.1rem", fontWeight: "700", marginBottom: "0.75rem" }}>Support</div>
                <p style={{ color: "#808098", fontSize: "0.95rem", lineHeight: "1.6" }}>
                  Need help? Join our Discord community for support, updates, and feedback.
                </p>
                <a href="https://discord.gg/sparkybot" target="_blank" rel="noreferrer" className="btn btn-theme other-btn" style={{
                  display: "inline-block",
                  padding: "0.6rem 1.5rem",
                  borderRadius: "8px",
                  background: "rgba(88, 101, 242, 0.2)",
                  color: "#5865F2",
                  fontWeight: "600",
                  textDecoration: "none",
                  border: "1px solid rgba(88, 101, 242, 0.3)",
                  marginTop: "0.5rem",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(88, 101, 242, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(88, 101, 242, 0.2)";
                }}>
                  Join Discord <i className="fas fa-chevron-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="f-small" style={{ borderTop: "1px solid rgba(255,255,255,.03)", padding: "1.5rem 0" }}>
          <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
            <div className="d-flex" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              <div className="f-copyright">
                <div className="f-top-copy"><span>SparkyBot <i className="fa-regular fa-copyright"></i> 2026.</span> All rights reserved.</div>
                <div className="f-bottom-copy" style={{ color: "#606070", fontSize: "0.8rem" }}>Made with ❤️ for Discord communities.</div>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <a href="/terms" style={{ color: "#606070", textDecoration: "none", fontSize: "0.85rem", transition: "color 0.3s" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#d4af37"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#606070"}>
                  Terms
                </a>
                <a href="/privacy" style={{ color: "#606070", textDecoration: "none", fontSize: "0.85rem", transition: "color 0.3s" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#d4af37"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#606070"}>
                  Privacy
                </a>
                <a href="https://github.com/dhanushk56/sparkybot" target="_blank" rel="noreferrer" style={{ color: "#606070", textDecoration: "none", fontSize: "0.85rem", transition: "color 0.3s" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#d4af37"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#606070"}>
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {copySuccess && (
        <div style={{
          position: "fixed",
          bottom: "1.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(10,10,20,.95)",
          border: "1px solid rgba(212,175,55,.3)",
          color: "#e8e0d8",
          padding: ".8rem 1.4rem",
          borderRadius: "12px",
          fontSize: ".9rem",
          zIndex: 200,
          animation: "fadeInUp 0.3s ease",
        }}>
          ✅ Copied to clipboard!
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translate(-50%, 10px); }
          100% { opacity: 1; transform: translate(-50%, 0); }
        }
        .load-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #0a0a14;
          z-index: 9999;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .loader-inner {
          display: flex;
          gap: 0.5rem;
        }
        .loader-inner > div {
          width: 6px;
          height: 24px;
          background: #d4af37;
          border-radius: 4px;
          animation: line-scale 1s ease-in-out infinite;
        }
        .loader-inner > div:nth-child(1) { animation-delay: 0s; }
        .loader-inner > div:nth-child(2) { animation-delay: 0.1s; }
        .loader-inner > div:nth-child(3) { animation-delay: 0.2s; }
        .loader-inner > div:nth-child(4) { animation-delay: 0.3s; }
        .loader-inner > div:nth-child(5) { animation-delay: 0.4s; }
        @keyframes line-scale {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(2.5); }
        }
        @media (max-width: 768px) {
          .logo-ds-flex {
            flex-direction: column;
            gap: 1rem;
          }
          .header {
            height: 300px !important;
          }
          .logo {
            height: 100px !important;
          }
        }
      `}</style>
    </div>
  );
}