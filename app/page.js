import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatusWidget from "@/components/StatusWidget";
import { getCurrentUser } from "@/lib/currentUser";

const INVITE_URL =
  "https://discord.com/oauth2/authorize?client_id=1528780547411804382&scope=bot+applications.commands&permissions=1099800112246";

const FEATURES = [
  ["⚔️", "Advanced Moderation", "Kick, ban, mute, warn, jail, purge, lockdown, and slowmode – all with detailed logging."],
  ["🎟️", "Ticket System", "Complete support tickets with transcripts, categories, claim/close, and staff roles."],
  ["💰", "Economy & Leveling", "Currency, shop, daily rewards, XP, and leveling with role rewards and leaderboards."],
  ["🎉", "Giveaways", "Create and manage giveaways with role requirements, multiple winners, and rerolls."],
  ["📄", "Applications", "Staff applications with custom questions, review flows, and automatic role assignment."],
  ["🎵", "Music System", "YouTube, SoundCloud, and Spotify support — queue, shuffle, loop, 24/7 mode, and live lyrics."],
  ["🛡️", "Anti-Nuke Protection", "Automatically detect and stop mass-deletes, bans, role changes, channel creations, and webhooks."],
  ["🌐", "Translation", "Translate messages, detect languages, and auto-translate channels with 100+ languages."],
  ["🎭", "Reaction Roles", "Assign roles via reactions with multiple modes, exclusive groups, and full customization."],
  ["🔊", "Join-to-Create", "Let members create private voice channels with automatic cleanup, naming, and full control."],
  ["📝", "Logging", "Comprehensive audit logs for messages, members, channels, roles, and moderation actions – 20+ events."],
  ["📨", "Invite Tracking", "Track invites, detect fake accounts, view leaderboards, and message statistics."],
  ["🔐", "Verification", "Image captcha verification with private channels, timeout, and custom roles."],
  ["👋", "Welcome & Auto-role", "Welcome/goodbye messages with embeds, DMs, and auto-roles for new members."],
  ["▶️", "YouTube Notifications", "Track YouTube channels and get notified on new uploads with keyword filters and custom messages."],
  ["🔒", "Forum Lock", "Automatically lock forum posts after a set time with logging."],
  ["🖥️", "Web Dashboard", "Manage prefixes, welcome messages and automod straight from your browser — no commands needed."],
];

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <>
      <Navbar active="/" user={user} />
      <main className="main">
        <section className="hero">
          <div className="badge">🚀 All-in-One Discord Bot</div>
          <h1>
            Power up your Discord
            <br />
            with <span className="highlight">SparkyBot</span>
          </h1>
          <p>Moderation, tickets, economy, giveaways, logging, and more — all in one free, reliable bot.</p>
          <div className="hero-buttons">
            <a href={INVITE_URL} target="_blank" rel="noreferrer" className="btn btn-primary">✨ Add to Discord</a>
            <a href="https://github.com/dhanushk56/sparky-bot-documentation.git" target="_blank" rel="noreferrer" className="btn btn-secondary">📖 Docs</a>
            <a href="https://discord.gg/sEJ6FwHGJw" target="_blank" rel="noreferrer" className="btn btn-secondary">💬 Support</a>
          </div>
        </section>

        <StatusWidget />

        <section>
          <h2 className="section-title">Everything your server needs</h2>
          <p className="section-sub">One bot, countless tools. Replace a dozen bots with SparkyBot.</p>
          <div className="features-grid">
            {FEATURES.map(([icon, title, desc]) => (
              <div className="feature-card" key={title}>
                <span className="feature-icon">{icon}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
