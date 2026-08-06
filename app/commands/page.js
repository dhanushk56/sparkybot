import Footer from "@/components/Footer";
import CommandsTable from "@/components/CommandsTable";
import { getCurrentUser } from "@/lib/currentUser";

export const metadata = { title: "Commands — SparkyBot" };

export default async function CommandsPage() {
  const user = await getCurrentUser();
  return (
    <>
      <main className="main">
        <div className="commands-header">
          <h1>📋 All Commands</h1>
          <p>Default prefix: <code>//</code> — slash commands also available.</p>
        </div>
        <CommandsTable />
      </main>
      <Footer />
    </>
  );
}
