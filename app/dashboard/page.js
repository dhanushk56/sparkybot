import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentUser } from "@/lib/currentUser";
import { getMutualGuildIds } from "@/lib/botApi";
import { guildIconUrl } from "@/lib/discord";
import Link from "next/link";

export const metadata = { title: "Dashboard — SparkyBot" };

const INVITE_BASE =
  "https://discord.com/oauth2/authorize?client_id=1528780547411804382&scope=bot+applications.commands&permissions=1099800112246";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <>
        <Navbar active="/dashboard" user={null} />
        <main className="main">
          <div className="hero">
            <div className="badge">🔐 Members only</div>
            <h1>Manage your servers</h1>
            <p>Log in with Discord to configure SparkyBot for the servers you manage.</p>
            <div className="hero-buttons">
              <a href="/api/auth/login" className="btn btn-primary">Login with Discord</a>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  let mutualIds = [];
  let apiError = null;
  try {
    mutualIds = await getMutualGuildIds(user.id);
  } catch (err) {
    apiError = "Could not reach the bot right now. It may be offline or not configured yet.";
  }

  const managed = user.guilds.filter((g) => mutualIds.includes(g.id));
  const notInvited = user.guilds.filter((g) => !mutualIds.includes(g.id));

  return (
    <>
      <Navbar active="/dashboard" user={user} />
      <main className="main">
        <div className="commands-header">
          <h1>Your servers</h1>
          <p>Pick a server to configure SparkyBot.</p>
        </div>

        {apiError && (
          <div className="dash-card" style={{ borderColor: "rgba(248,113,113,.3)", color: "#f87171" }}>
            {apiError}
          </div>
        )}

        {managed.length > 0 && (
          <>
            <h3 style={{ margin: "1.5rem 0 1rem", color: "#e8e0d8" }}>Manage</h3>
            <div className="dash-grid">
              {managed.map((g) => (
                <Link key={g.id} href={`/dashboard/${g.id}`} className="guild-card">
                  <GuildAvatar guild={g} />
                  <div>
                    <div className="guild-name">{g.name}</div>
                    <div className="guild-status">
                      <span className="pill pill-active">● Active</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {notInvited.length > 0 && (
          <>
            <h3 style={{ margin: "2rem 0 1rem", color: "#e8e0d8" }}>Invite SparkyBot</h3>
            <div className="dash-grid">
              {notInvited.map((g) => (
                <a
                  key={g.id}
                  href={`${INVITE_BASE}&guild_id=${g.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="guild-card"
                >
                  <GuildAvatar guild={g} />
                  <div>
                    <div className="guild-name">{g.name}</div>
                    <div className="guild-status">
                      <span className="pill pill-inactive">○ Not invited</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}

        {managed.length === 0 && notInvited.length === 0 && !apiError && (
          <div className="dash-card">
            You don&apos;t manage any servers on this Discord account.
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function GuildAvatar({ guild }) {
  const icon = guildIconUrl(guild);
  if (icon) {
    return <img src={icon} alt="" className="guild-avatar" width={48} height={48} />;
  }
  return <div className="guild-avatar">{guild.name.slice(0, 2).toUpperCase()}</div>;
}
