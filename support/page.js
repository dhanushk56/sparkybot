import Link from "next/link";

// Replace with your actual support server invite
const SUPPORT_SERVER = "https://discord.gg/your-invite";
const EMAIL = "support@sparkybot.com";

export default function SupportPage() {
  return (
    <main className="main" style={{ maxWidth: "700px", margin: "0 auto" }}>
      <div className="hero" style={{ padding: "2rem 0" }}>
        <h1>💬 Support</h1>
        <p style={{ color: "#a09890" }}>
          Need help? We're here for you. Choose an option below.
        </p>
      </div>

      <div className="dash-card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "2rem" }}>🛡️</span>
          <div>
            <h3 style={{ color: "#e8e0d8", margin: 0 }}>Join our Discord Server</h3>
            <p style={{ color: "#808098", margin: "0.25rem 0 0 0", fontSize: "0.9rem" }}>
              Get live help from the community and developers.
            </p>
          </div>
        </div>
        <a href={SUPPORT_SERVER} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          Join Support Server
        </a>
      </div>

      <div className="dash-card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "2rem" }}>📧</span>
          <div>
            <h3 style={{ color: "#e8e0d8", margin: 0 }}>Email Us</h3>
            <p style={{ color: "#808098", margin: "0.25rem 0 0 0", fontSize: "0.9rem" }}>
              For business inquiries or direct support.
            </p>
          </div>
        </div>
        <a href={`mailto:${EMAIL}`} className="btn btn-secondary">
          Send Email
        </a>
      </div>

      <div className="dash-card">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "2rem" }}>📖</span>
          <div>
            <h3 style={{ color: "#e8e0d8", margin: 0 }}>Documentation</h3>
            <p style={{ color: "#808098", margin: "0.25rem 0 0 0", fontSize: "0.9rem" }}>
              Check the docs for detailed setup and commands.
            </p>
          </div>
        </div>
        <Link href="/commands" className="btn btn-secondary">
          View Commands
        </Link>
      </div>
    </main>
  );
}
