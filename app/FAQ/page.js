export default function FAQPage() {
  const faqs = [
    {
      q: "What is SparkyBot?",
      a: "SparkyBot is a multi-purpose Discord bot designed to enhance your server with moderation, ticketing, leveling, music, and much more.",
    },
    {
      q: "How do I invite SparkyBot to my server?",
      a: 'Click the "Invite" link in the navbar (under Bot) and follow the OAuth flow to add the bot to your server.',
    },
    {
      q: "Is SparkyBot free?",
      a: "Yes! SparkyBot is completely free to use with no hidden charges.",
    },
    {
      q: "How can I configure SparkyBot?",
      a: "Use the Dashboard (under Bot) to configure all settings for your server.",
    },
    {
      q: "What are the system requirements?",
      a: "Only a Discord server with Manage Server permissions is needed. The bot runs in the cloud.",
    },
    {
      q: "How do I report a bug or suggest a feature?",
      a: "You can use the support links or join our community server (link in Support).",
    },
  ];

  return (
    <div style={{ maxWidth: "800px", margin: "3rem auto", padding: "0 1.5rem", color: "#e8e0d8" }}>
      <h1 style={{ marginBottom: "2rem" }}>❓ Frequently Asked Questions</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {faqs.map((item, i) => (
          <div key={i} style={{ background: "#1e1f22", border: "1px solid #2b2d31", borderRadius: "8px", padding: "1rem 1.25rem" }}>
            <h3 style={{ margin: "0 0 0.25rem 0", color: "#e8e0d8" }}>{item.q}</h3>
            <p style={{ margin: 0, color: "#b5b5b5" }}>{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
