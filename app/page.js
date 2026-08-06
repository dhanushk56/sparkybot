"use client";

import { useState, useEffect } from "react";

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

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

  const logoUrl =
    "https://cdn.discordapp.com/attachments/1524887612479770713/1534971345224470579/file_000000008b2481fda22d4ceb4daad3e4.png?ex=6a7610f7&is=6a74bf77&hm=bc71ae5176091024349ad00224763446fda9ba66c99c068cd82c9486bf161756&";
  const bannerUrl =
    "https://cdn.discordapp.com/attachments/1524887612479770713/1534971593443250308/1786036117833.png?ex=6a761132&is=6a74bfb2&hm=641a5071b3bea41a8f9e7a769976b6a9071dc521915d70e8a851d3e65ff92b88&";

  if (loading) {
    return (
      <div className="load-wrapper">
        <div className="loader">
          <div className="loader-inner line-scale">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <style jsx>{`
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
          .loader-inner > div:nth-child(1) {
            animation-delay: 0s;
          }
          .loader-inner > div:nth-child(2) {
            animation-delay: 0.1s;
          }
          .loader-inner > div:nth-child(3) {
            animation-delay: 0.2s;
          }
          .loader-inner > div:nth-child(4) {
            animation-delay: 0.3s;
          }
          .loader-inner > div:nth-child(5) {
            animation-delay: 0.4s;
          }
          @keyframes line-scale {
            0%,
            100% {
              transform: scaleY(1);
            }
            50% {
              transform: scaleY(2.5);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        color: "#e8e0d8",
        overflowX: "hidden",
        position: "relative",
        background: `url(${logoUrl}) no-repeat center center fixed`,
        backgroundSize: "700px",
        backgroundOpacity: 0.08,
      }}
    >
      {/* Subtle background overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(10,10,20,0.92) 40%, rgba(10,10,20,0.96) 70%, #0a0a14 100%)",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Navbar */}
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
            <a
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
            </a>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "2rem",
                flexWrap: "wrap",
                marginLeft: "auto",
              }}
            >
              <a
                href="/"
                style={{
                  color: "#d4af37",
                  fontSize: ".95rem",
                  textDecoration: "none",
                }}
              >
                Home
              </a>
              <a
                href="/commands"
                style={{
                  color: "#a09890",
                  fontSize: ".95rem",
                  textDecoration: "none",
                  transition: "color .3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#d4af37")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "#a09890")
                }
              >
                Commands
              </a>
              <a
                href="/dashboard"
                style={{
                  color: "#a09890",
                  fontSize: ".95rem",
                  textDecoration: "none",
                  transition: "color .3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#d4af37")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "#a09890")
                }
              >
                Dashboard
              </a>
              <a
                href="/reviews"
                style={{
                  color: "#a09890",
                  fontSize: ".95rem",
                  textDecoration: "none",
                  transition: "color .3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#d4af37")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "#a09890")
                }
              >
                Reviews
              </a>
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
                  e.currentTarget.style.transform =
                    "translateY(-2px) scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 28px rgba(212,175,55,.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#d4af37";
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(212,175,55,.3)";
                }}
              >
                ✨ Invite
              </a>
            </div>
          </div>
        </nav>

        {/* Header with Banner */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <div
            style={{
              height: "475px",
              background: `url('${bannerUrl}') no-repeat center center`,
              backgroundSize: "cover",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(rgba(0,0,0,0.3), rgba(10,10,20,0.7))",
                zIndex: 2,
              }}
            />
          </div>
        </div>

        {/* Status Boxes */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "2rem",
            marginTop: "-60px",
            position: "relative",
            zIndex: 3,
            flexWrap: "wrap",
            padding: "0 1rem",
          }}
        >
          {/* Bot Status */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                background: "rgba(10,10,20,.8)",
                backdropFilter: "blur(10px)",
                padding: "0.75rem 1.5rem",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,.06)",
                transition: "all .3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(10,10,20,.95)";
                e.currentTarget.style.borderColor =
                  "rgba(212,175,55,.3)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(10,10,20,.8)";
                e.currentTarget.style.borderColor =
                  "rgba(255,255,255,.06)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  style={{ width: "32px", height: "32px", fill: "#d4af37" }}
                >
                  <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm88.3 339.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7-4.7 16.7-12.3 20.9s-16.8 4.1-24.3-.5l-144-88c-7.1-4.4-11.5-12.1-11.5-20.5s4.4-16.1 11.5-20.5l144-88c7.4-4.5 16.7-4.7 24.3-.5 7.6 4.2 12.3 12.3 12.3 20.9v144c0 8.7-4.7 16.7-12.3 20.9z" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                  <span style={{ color: "#4ade80" }}>🟢 Online</span>
                </div>
                <div style={{ fontSize: "0.85rem", color: "#a09890" }}>
                  sparkybot.bond
                </div>
              </div>
            </div>
          </div>

          {/* Logo */}
          <div
            style={{
              animation: "float 4s ease-in-out infinite",
            }}
          >
            <a href="/">
              <img
                alt="SparkyBot"
                src={logoUrl}
                style={{
                  height: "150px",
                  maxWidth: "100%",
                  filter: "drop-shadow(0 0 30px rgba(212,175,55,0.15))",
                  transition:
                    "transform 0.5s cubic-bezier(.22,1,.36,1)",
                }}
              />
            </a>
          </div>

          {/* Support Button */}
          <a
            href="https://support.sparkybot.bond"
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                background: "rgba(10,10,20,.8)",
                backdropFilter: "blur(10px)",
                padding: "0.75rem 1.5rem",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,.06)",
                transition: "all .3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(10,10,20,.95)";
                e.currentTarget.style.borderColor =
                  "rgba(88,101,242,.4)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(10,10,20,.8)";
                e.currentTarget.style.borderColor =
                  "rgba(255,255,255,.06)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  style={{ width: "32px", height: "32px", fill: "#5865F2" }}
                >
                  <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm88.3 339.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7-4.7 16.7-12.3 20.9s-16.8 4.1-24.3-.5l-144-88c-7.1-4.4-11.5-12.1-11.5-20.5s4.4-16.1 11.5-20.5l144-88c7.4-4.5 16.7-4.7 24.3-.5 7.6 4.2 12.3 12.3 12.3 20.9v144c0 8.7-4.7 16.7-12.3 20.9z" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                  <span style={{ color: "#5865F2" }}>🟣 Click to join</span>
                </div>
                <div style={{ fontSize: "0.85rem", color: "#a09890" }}>
                  support.sparkybot.bond
                </div>
              </div>
            </div>
          </a>
        </div>

        {/* Features Section */}
        <div
          style={{
            maxWidth: "1200px",
            margin: "4rem auto",
            padding: "0 1.5rem",
            animation: "fadeInUp 0.8s ease forwards",
            animationDelay: "0.15s",
            opacity: 0,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h1
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: 800,
                marginBottom: "0.5rem",
                color: "#e8e0d8",
              }}
            >
              Everything your server needs
            </h1>
            <p
              style={{
                color: "#a09890",
                fontSize: "1.2rem",
                maxWidth: "640px",
                margin: "0 auto",
              }}
            >
              One bot, countless tools. Replace a dozen bots with SparkyBot.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  background: "rgba(255,255,255,.02)",
                  border: "1px solid rgba(255,255,255,.04)",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  transition: "all .5s cubic-bezier(.22,1,.36,1)",
                  cursor: "default",
                  animation: "fadeInUp 0.8s ease forwards",
                  animationDelay: `${0.1 + index * 0.04}s`,
                  opacity: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255,255,255,.04)";
                  e.currentTarget.style.transform =
                    "translateY(-8px) scale(1.01)";
                  e.currentTarget.style.borderColor =
                    "rgba(212,175,55,.2)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 60px rgba(0,0,0,.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255,255,255,.02)";
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.borderColor =
                    "rgba(255,255,255,.04)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
                  {feature.icon}
                </div>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    marginBottom: "0.4rem",
                    color: "#e8e0d8",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    color: "#909090",
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                  }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            background: "rgba(10,10,20,.7)",
            borderTop: "1px solid rgba(255,255,255,.03)",
            marginTop: "4rem",
            padding: "2rem 0",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 1.5rem",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "2rem",
              }}
            >
              <div>
                <div
                  style={{
                    color: "#d4af37",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    marginBottom: "0.75rem",
                  }}
                >
                  Get Started
                </div>
                <p
                  style={{
                    color: "#808098",
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                  }}
                >
                  Add SparkyBot to your server and unlock powerful
                  moderation, music, tickets, and more.
                </p>
                <a
                  href="https://invite.sparkybot.bond"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-block",
                    padding: "0.6rem 1.5rem",
                    borderRadius: "8px",
                    background: "#d4af37",
                    color: "#0d0d1a",
                    fontWeight: 600,
                    textDecoration: "none",
                    marginTop: "0.5rem",
                    transition: "all .3s cubic-bezier(.22,1,.36,1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#e8c84a";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#d4af37";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Invite Now →
                </a>
              </div>
              <div>
                <div
                  style={{
                    color: "#d4af37",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    marginBottom: "0.75rem",
                  }}
                >
                  Links
                </div>
                <a
                  href="/commands"
                  style={{
                    display: "block",
                    color: "#808098",
                    textDecoration: "none",
                    marginBottom: "0.4rem",
                    transition: "color .3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#d4af37")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#808098")
                  }
                >
                  Commands
                </a>
                <a
                  href="/dashboard"
                  style={{
                    display: "block",
                    color: "#808098",
                    textDecoration: "none",
                    marginBottom: "0.4rem",
                    transition: "color .3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#d4af37")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#808098")
                  }
                >
                  Dashboard
                </a>
                <a
                  href="/reviews"
                  style={{
                    display: "block",
                    color: "#808098",
                    textDecoration: "none",
                    marginBottom: "0.4rem",
                    transition: "color .3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#d4af37")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#808098")
                  }
                >
                  Reviews
                </a>
                <a
                  href="/faq"
                  style={{
                    display: "block",
                    color: "#808098",
                    textDecoration: "none",
                    transition: "color .3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#d4af37")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#808098")
                  }
                >
                  FAQ
                </a>
              </div>
              <div>
                <div
                  style={{
                    color: "#d4af37",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    marginBottom: "0.75rem",
                  }}
                >
                  Support
                </div>
                <p
                  style={{
                    color: "#808098",
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                  }}
                >
                  Need help? Join our support community for assistance,
                  updates, and feedback.
                </p>
                <a
                  href="https://support.sparkybot.bond"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-block",
                    padding: "0.6rem 1.5rem",
                    borderRadius: "8px",
                    background: "rgba(88,101,242,0.2)",
                    color: "#5865F2",
                    fontWeight: 600,
                    textDecoration: "none",
                    border: "1px solid rgba(88,101,242,0.3)",
                    marginTop: "0.5rem",
                    transition: "all .3s cubic-bezier(.22,1,.36,1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "rgba(88,101,242,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "rgba(88,101,242,0.2)";
                  }}
                >
                  Visit Support →
                </a>
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,.03)",
              padding: "1.5rem 0",
              marginTop: "2rem",
            }}
          >
            <div
              style={{
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "0 1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <div>
                <div>
                  <span>SparkyBot <i className="fa-regular fa-copyright"></i> 2026.</span> All rights reserved.
                </div>
                <div style={{ color: "#606070", fontSize: "0.8rem" }}>
                  Made with ❤️ for Discord communities.
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <a
                  href="/terms"
                  style={{
                    color: "#606070",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                    transition: "color .3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#d4af37")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#606070")
                  }
                >
                  Terms
                </a>
                <a
                  href="/privacy"
                  style={{
                    color: "#606070",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                    transition: "color .3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#d4af37")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#606070")
                  }
                >
                  Privacy
                </a>
                <a
                  href="https://github.com/dhanushk56/sparkybot"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#606070",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                    transition: "color .3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#d4af37")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#606070")
                  }
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes line-scale {
          0%,
          100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(2.5);
          }
        }
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0px);
          }
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