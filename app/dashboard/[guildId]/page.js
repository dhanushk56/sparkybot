import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/currentUser";
import { getGuildSettings } from "@/lib/botApi";
import SettingsForm from "@/components/SettingsForm";

export default async function DashboardPage({ params }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const guildId = params.guildId;

  // ✅ Fetch settings using the correct function
  const settings = await getGuildSettings(user.id, guildId);

  return (
    <SettingsForm
      guildId={guildId}
      initial={settings}
    />
  );
}
