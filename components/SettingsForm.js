import { getCurrentUser } from "@/lib/currentUser";
import { getGuildSettings } from "@/lib/botApi";
import SettingsForm from "@/components/SettingsForm";

export default async function DashboardPage({ params }) {
  const user = await getCurrentUser();
  if (!user) {
    return <div>Please log in.</div>;
  }

  const guildId = params.guildId;
  const settings = await getGuildSettings(user.id, guildId);

  return (
    <SettingsForm
      guildId={guildId}
      initial={settings}
    />
  );
}
