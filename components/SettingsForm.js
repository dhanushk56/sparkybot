import SettingsForm from "@/components/SettingsForm";

export default async function DashboardPage({ params }) {
  const user = await getCurrentUser(); // your auth function
  const guildId = params.guildId;
  const settings = await fetchSettings(guildId);

  return (
    <SettingsForm 
      guildId={guildId} 
      initial={settings} 
      userId={user?.id}   // ← This must be a valid Discord snowflake ID
    />
  );
}