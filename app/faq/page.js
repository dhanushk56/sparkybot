export const metadata = { title: "FAQ — SparkyBot" };

const faqs = [
  {
    q: "What is SparkyBot?",
    a: "SparkyBot is a multi-purpose Discord bot designed to enhance your server with moderation, ticketing, leveling, music, and much more.",
  },
  {
    q: "How do I invite SparkyBot to my server?",
    a: "Click Invite in the navigation and follow the Discord authorization flow to add the bot to your server.",
  },
  {
    q: "Is SparkyBot free?",
    a: "Yes. SparkyBot is free to use with no hidden charges.",
  },
  {
    q: "How can I configure SparkyBot?",
    a: "Use the Dashboard to configure all settings for your server.",
  },
  {
    q: "What are the system requirements?",
    a: "Only a Discord server with Manage Server permissions is needed. The bot runs in the cloud.",
  },
  {
    q: "How do I report a bug or suggest a feature?",
    a: "Reach out through the Support page or join our community server.",
  },
];

export default function FAQPage() {
  return (
    <main className="main">
      <div className="commands-header">
        <h1>Frequently Asked Questions</h1>
        <p>Answers to common questions about setting up and using SparkyBot.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {faqs.map((item, i) => (
          <div key={i} className="dash-card">
            <h3 style={{ margin: "0 0 0.35rem 0", color: "var(--db-text)", fontSize: "1rem" }}>{item.q}</h3>
            <p style={{ margin: 0, color: "var(--db-muted)", fontSize: "0.92rem", lineHeight: 1.6 }}>{item.a}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
