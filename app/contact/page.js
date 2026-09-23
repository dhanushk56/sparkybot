import Link from "next/link";

export const metadata = { title: "Legal - Contact Us" };

// This is intentionally the same content as the old standalone Support
// page -- Contact Us now *is* that page, just reachable from the Legal
// dropdown instead of its own top-level nav item.
const SUPPORT_SERVER = "https://support.sparkybot.bond";
const EMAIL = "dhanushkarri0@gmail.com";

export default function ContactPage() {
  return (
    <main className="main" style={{ maxWidth: "700px", margin: "0 auto" }}>
      <div className="hero" style={{ padding: "2rem 0" }}>
        <h1>Contact Us</h1>
        <p style={{ color: "#a09890" }}>
          Have a question or need help? Choose an option below.
        </p>
      </div>

      <div className="dash-card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
          <i className="fas fa-shield-halved" style={{ fontSize: "1.5rem", color: "var(--db-gold)" }}></i>
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
          <i className="fas fa-envelope" style={{ fontSize: "1.5rem", color: "var(--db-gold)" }}></i>
          <div>
            <h3 style={{ color: "#e8e0d8", margin: 0 }}>Email Us</h3>
            <p style={{ color: "#808098", margin: "0.25rem 0 0 0", fontSize: "0.9rem" }}>
              For business, legal, or privacy inquiries, or direct support.
            </p>
          </div>
        </div>
        <a href={`mailto:${EMAIL}`} className="btn btn-secondary">
          Send Email
        </a>
      </div>

      <div className="dash-card">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
          <i className="fas fa-book" style={{ fontSize: "1.5rem", color: "var(--db-gold)" }}></i>
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

      <p style={{ color: "var(--db-faint)", fontSize: "0.85rem", textAlign: "center", marginTop: "1.5rem" }}>
        See also our <a href="/privacy" style={{ color: "var(--db-gold)" }}>Privacy Policy</a> and{" "}
        <a href="/terms" style={{ color: "var(--db-gold)" }}>Terms of Service</a>.
      </p>
    </main>
  );
}
