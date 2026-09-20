import CommandsTable from "@/components/CommandsTable";
import { getCurrentUser } from "@/lib/currentUser";
import { ALL_COMMANDS } from "@/data/commands";

export const metadata = { title: "Commands — SparkyBot" };

export default async function CommandsPage() {
  const user = await getCurrentUser();
  return (
    <>
      <main className="main">
        <div className="commands-header">
          <h1>All Commands</h1>
          <p>Default prefix: <code>//</code> — every command is also available as a slash command. Switch tabs, search, or filter by module below.</p>
        </div>
        <CommandsTable commands={ALL_COMMANDS} />
      </main>
    </>
  );
}
