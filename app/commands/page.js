import CommandsTable from "@/components/CommandsTable";
import { getCurrentUser } from "@/lib/currentUser";
import { ALL_COMMANDS } from "@/data/commands";

export const metadata = { title: "Bot Commands" };

export default async function CommandsPage() {
  const user = await getCurrentUser();
  return (
    <main className="main">
      <div className="commands-header">
        <h1>All Commands</h1>
        <p>
          Default prefix: <code>//</code> — slash commands also available.
          Pick a cog on the left, or search for a command.
        </p>
      </div>
      <CommandsTable commands={ALL_COMMANDS} />
    </main>
  );
}
