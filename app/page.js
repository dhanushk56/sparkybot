"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
  const [stats, setStats] = useState({ servers: 0, users: 0 });
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        setIsOnline(data.status === "online" || data.uptime > 0);
        setStats({ servers: data.servers || 0, users: data.users || 0 });
      })
      .catch(() => setIsOnline(false));
  }, []);

  const features = [
    { icon: "🛡️", title: "Advanced Moderation", desc: "Kick, ban, mute, warn, jail, purge, lockdown, and slowmode – all with detailed logging." },
    { icon: "🎫", title: "Ticket System", desc: "Complete support tickets with transcripts, categories, claim/close, and staff roles." },
    { icon: "💰", title: "Economy & Leveling", desc: "Currency, shop, daily rewards, XP, and leveling with role rewards and leaderboards." },
    { icon: "🎁", title: "Giveaways", desc: "Create and manage giveaways with role requirements, multiple winners, and rerolls." },
    { icon: "📋", title: "Applications", desc: "Staff applications with custom questions, review flows, and automatic role assignment." },
    { icon: "🎵", title: "Music System", desc: "YouTube, SoundCloud, and Spotify support — queue, shuffle, loop, 24/7 mode, and live lyrics." },
    { icon: "🧨", title: "Anti-Nuke Protection", desc: "Automatically detect and stop mass-deletes, bans, role changes, channel creations, and webhooks." },
    { icon: "🌐", title: "Translation", desc: "Translate messages, detect languages, and auto-translate channels with 100+ languages." },
    { icon: "🎭", title: "Reaction Roles", desc: "Assign roles via reactions with multiple modes, exclusive groups, and full customization." },
    { icon: "🔊", title: "Join-to-Create", desc: "Let members create private voice channels with automatic cleanup, naming, and full control." },
    { icon: "📜", title: "Logging", desc: "Comprehensive audit logs for messages, members, channels, roles, and moderation actions – 20+ events." },
    { icon: "📨", title: "Invite Tracking", desc: "Track invites, detect fake accounts, view leaderboards, and message statistics." },
    { icon: "✅", title: "Verification", desc: "Image captcha verification with private channels, timeout, and custom roles." },
    { icon: "🚪", title: "Welcome & Auto-role", desc: "Welcome/goodbye messages with embeds, DMs, and auto-roles for new members." },
    { icon: "📹", title: "YouTube Notifications", desc: "Track YouTube channels and get notified on new uploads with keyword filters and custom messages." },
    { icon: "🔒", title: "Forum Lock", desc: "Automatically lock forum posts after a set time with logging." },
    { icon: "💻", title: "Web Dashboard", desc: "Manage prefixes, welcome messages and automod straight from your browser — no commands needed." },
  ];

  return (
    <div className="landing-root">
      {/* ==================== HERO ==================== */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050507]">
        <div className="absolute inset-0 bg-gradient-to-br from-gold-primary/10 via-dark-bg to-gold-secondary/5"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-20 -right-20 w-96 h-96 bg-gold-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -left-20 w-80 h-80 bg-gold-secondary/15 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>

        <div className="container mx-auto px-4 relative z-10 pt-32 lg:pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="hero-content space-y-8 text-center lg:text-left">
              <div className="space-y-6">
                <div>
                  <div className="w-24 h-24 lg:w-24 lg:h-24 mx-auto lg:mx-0 mb-4 rounded-full bg-gradient-to-br from-gold-primary to-gold-secondary flex items-center justify-center text-black font-orbitron font-black text-4xl drop-shadow-[0_0_20px_rgba(255,215,0,0.7)]">
                    S
                  </div>
                  <h1 className="text-6xl md:text-7xl lg:text-8xl font-orbitron font-black mb-6 bg-gradient-to-r from-gold-primary via-gold-primary to-gold-secondary bg-clip-text text-transparent">
                    SparkyBot
                  </h1>
                </div>
                <h2 className="text-2xl lg:text-3xl font-semibold font-orbitron text-gold-primary mb-6 text-center lg:text-left">
                  The Swiss Army Knife for Discord
                </h2>
                <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed text-center lg:text-left">
                  A feature-rich multipurpose bot with economy, moderation, fun, and automation – all managed via an intuitive dashboard.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
                <Link href="/invite" className="btn-primary group w-full sm:w-auto flex items-center justify-center gap-2">
                  <i className="fab fa-discord text-xl"></i> Add to Discord
                </Link>
                <Link href="/dashboard" className="btn-secondary group w-full sm:w-auto flex items-center justify-center gap-2">
                  <i className="fas fa-cog text-xl"></i> Go to Dashboard
                </Link>
              </div>
            </div>
            <div className="hero-image flex justify-center lg:justify-end">
              <div className="floating-container-clean">
                <img
                  src="/img/dashboard-preview.png"
                  alt="SparkyBot Dashboard Preview"
                  className="w-full max-w-lg h-auto drop-shadow-2xl rounded-3xl border border-white/10"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
          <span className="text-gray-400 text-sm mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-gold-primary/50 rounded-full flex justify-center relative">
            <div className="w-1 h-3 bg-gold-primary rounded-full mt-2 animate-[scrollDot_2s_infinite]"></div>
          </div>
        </div>
      </section>

      {/* ==================== CORE CAPABILITIES ==================== */}
      <section className="pt-24 pb-12 relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.05)_0%,transparent_50%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-primary font-mono text-sm mb-6 uppercase tracking-widest shadow-[0_0_20px_rgba(255,215,0,0.15)]">
              <i className="fas fa-bolt"></i> Core Capabilities
            </div>
            <h2 className="text-4xl lg:text-6xl font-orbitron font-black mb-6 text-white">
              Everything Your <br /><span className="gradient-text">Server Needs</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              From moderation to economy, SparkyBot has you covered with enterprise-grade features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.slice(0, 9).map((feature, index) => (
              <div key={index} className="relative group [perspective:1000px] h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-gold-primary to-gold-secondary rounded-[2rem] blur opacity-15 group-hover:opacity-25 transition duration-500"></div>
                <div className="relative h-full overflow-hidden bg-black/40 backdrop-blur-2xl border border-gold-primary/20 rounded-[2rem] p-8 transition-all duration-500 group-hover:bg-[#0a0a0a]/80 group-hover:border-gold-primary/40 group-hover:-translate-y-1 hover:scale-[1.02]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold-primary/10 rounded-full blur-[50px] pointer-events-none group-hover:bg-gold-primary/20 transition-all duration-500"></div>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-orbitron font-bold text-white mb-3 group-hover:text-gold-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300 relative z-10">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SECURITY ==================== */}
      <section className="py-24 relative overflow-hidden bg-[#03060a] border-t border-white/[0.02]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.05)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-primary font-mono text-sm mb-6 uppercase tracking-widest">
              <i className="fas fa-shield-alt"></i> Defense in Depth
            </div>
            <h2 className="text-4xl lg:text-6xl font-orbitron font-black text-white mb-6">
              Military-Grade <br /><span className="gradient-text">Security Architecture</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: "🛡️", title: "Instant Anti-Nuke", desc: "Detects and halts unauthorized mass-deletions, bans, and token raids in milliseconds." },
              { icon: "⚡", title: "Adaptive Limit System", desc: "Set strict action thresholds for admins to prevent compromised accounts from dealing damage." },
              { icon: "🚨", title: "Emergency Lockdown Mode", desc: "One-click global server freeze that revokes risky permissions and pauses invites until the threat passes." },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-gold-primary to-gold-secondary rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
                <div className="relative bg-black/40 backdrop-blur-2xl border border-gold-primary/20 rounded-[2rem] p-8 text-center group-hover:border-gold-primary/40 transition-all duration-500 group-hover:-translate-y-1">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-orbitron font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== AUTOMATION ==================== */}
      <section className="py-24 relative bg-[#050507] border-t border-white/[0.02]">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-primary font-mono text-sm mb-6 uppercase tracking-widest">
              <i className="fas fa-cogs"></i> Automation
            </div>
            <h2 className="text-4xl lg:text-6xl font-orbitron font-black text-white mb-6">
              Automate <span className="gradient-text">Everything</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Free your staff from repetitive tasks. SparkyBot handles the heavy lifting.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              { icon: "🤖", title: "Auto Moderation", desc: "Enable automated rule enforcement to block spam, abuse, and unsafe content in real time." },
              { icon: "🎭", title: "Autorole", desc: "Assign join-time roles automatically for faster server setup and seamless member onboarding." },
              { icon: "💬", title: "Auto Responder", desc: "Automatically reply or react to triggers with saved responses to improve channel interactions." },
              { icon: "🚪", title: "Welcomer", desc: "Personalize welcome messages with custom configuration, built-in and reusable templates." },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-gold-primary to-gold-secondary rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
                <div className="relative bg-black/40 backdrop-blur-2xl border border-gold-primary/20 rounded-[2rem] p-8 group-hover:border-gold-primary/40 transition-all duration-500 group-hover:-translate-y-1">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-orbitron font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== STATISTICS ==================== */}
      <section className="py-16 relative bg-[#03060a] border-t border-white/[0.02]">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div className="relative group">
              <div className="bg-black/40 backdrop-blur-2xl border border-gold-primary/20 rounded-[2rem] p-8 group-hover:border-gold-primary/40 transition-all duration-500">
                <div className="text-4xl font-orbitron font-black text-gold-primary mb-2">{stats.servers || 0}</div>
                <p className="text-gray-400 text-sm uppercase tracking-wider">Active Servers</p>
              </div>
            </div>
            <div className="relative group">
              <div className="bg-black/40 backdrop-blur-2xl border border-gold-primary/20 rounded-[2rem] p-8 group-hover:border-gold-primary/40 transition-all duration-500">
                <div className="text-4xl font-orbitron font-black text-gold-primary mb-2">{stats.users || 0}</div>
                <p className="text-gray-400 text-sm uppercase tracking-wider">Global Users</p>
              </div>
            </div>
            <div className="relative group">
              <div className="bg-black/40 backdrop-blur-2xl border border-gold-primary/20 rounded-[2rem] p-8 group-hover:border-gold-primary/40 transition-all duration-500">
                <div className="text-4xl font-orbitron font-black text-gold-primary mb-2">99.9%</div>
                <p className="text-gray-400 text-sm uppercase tracking-wider">System Uptime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="py-24 relative overflow-hidden bg-[#050507] border-t border-white/[0.02]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.05)_0%,transparent_60%)] pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="mb-10 inline-block relative group">
            <div className="absolute inset-0 bg-gold-primary/20 blur-[60px] pointer-events-none group-hover:bg-gold-primary/40 transition-colors duration-700"></div>
            <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-gold-primary to-gold-secondary flex items-center justify-center text-black font-orbitron font-black text-6xl drop-shadow-[0_0_30px_rgba(255,215,0,0.3)] z-10 hover:scale-110 transition-transform duration-700">
              S
            </div>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-orbitron font-black text-white mb-6">
            Secure your server.<br />
            <span className="gradient-text">In minutes.</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of communities trusting SparkyBot for their moderation, security, and automation needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 items-center justify-center">
            <Link href="/invite" className="btn-primary group flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto">
              <i className="fab fa-discord text-xl"></i> Add to Discord
            </Link>
            <Link href="/dashboard" className="btn-secondary group flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto">
              <i className="fas fa-desktop text-xl"></i> Open Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
