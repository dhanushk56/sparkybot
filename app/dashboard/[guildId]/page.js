import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SettingsForm from "@/components/SettingsForm";
import { getCurrentUser } from "@/lib/currentUser";
import { getGuildSettings } from "@/lib/botApi";
import { redirect } from "next/navigation";

export const metadata = { title: "Server Settings — SparkyBot" };

export default async function GuildSettingsPage({ params }) {
  const user = await getCurrentUser();
  if (!user) redirect("/dashboard");

  let settings = null;
  let error = null;
  try {
    settings = await getGuildSettings(user.id, params.guildId);
  } catch (err) {
    error = err.message.includes("403")
      ? "You don't have permission to manage this server."
      : "Couldn't load this server. The bot may be offline or not in this server.";
  }

  return (
    <>
      <Navbar active="/dashboard" user={user} />
      <main className="main">
        <div className="commands-header" style={{ textAlign: "left", padding: "1rem 0" }}>
          <h1 style={{ fontSize: "2rem" }}>
            {settings ? settings.guild.name : "Server Settings"}
          </h1>
          <p>Configure SparkyBot for this server.</p>
        </div>

        {error && (
          <div className="dash-card" style={{ borderColor: "rgba(248,113,113,.3)", color: "#f87171" }}>
            {error}
          </div>
        )}

        {settings && <SettingsForm guildId={params.guildId} initial={settings} />}
      </main>
      <Footer />
    </>
  );
}
