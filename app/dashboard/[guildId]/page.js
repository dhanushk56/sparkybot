import SettingsForm from "@/components/SettingsForm";
import { getCurrentUser } from "@/lib/currentUser";

export default async function DashboardPage({ params }) {
  const user = await getCurrentUser();
  const guildId = params.guildId;
  const settings = await fetchSettings(guildId); // your existing fetch

  // ✅ Convert to string if you pass it
  const userId = user?.id?.toString();

  return (
    <SettingsForm
      guildId={guildId}
      initial={settings}
      userId={userId}   // optional – API uses session
    />
  );
}
