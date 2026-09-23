export const metadata = { title: "Legal - Contact Us" };

const SUPPORT_SERVER = "https://support.sparkybot.bond";
const EMAIL = "dhanushkarri0@gmail.com";

export default function ContactPage() {
  return (
    <main className="main" style={{ maxWidth: "700px", margin: "0 auto" }}>
      <div className="hero" style={{ padding: "2rem 0" }}>
        <h1>Contact Us</h1>
        <p style={{ color: "#a09890" }}>
          Legal, privacy, or business inquiries — here's how to reach the SparkyBot team directly.
        </p>
      </div>

      <div className="dash-card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
          <i className="fas fa-envelope" style={{ fontSize: "1.5rem", color: "var(--db-gold)" }}></i>
          <div>
            <h3 style={{ color: "#e8e0d8", margin: 0 }}>Email Us</h3>
            <p style={{ color: "#808098", margin: "0.25rem 0 0 0", fontSize: "0.9rem" }}>
              For privacy requests, legal matters, partnerships, or anything that needs a written response.
            </p>
          </div>
        </div>
        <a href={`mailto:${EMAIL}`} className="btn btn-primary">
          Send Email
        </a>
      </div>

      <div className="dash-card">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
          <i className="fas fa-shield-halved" style={{ fontSize: "1.5rem", color: "var(--db-gold)" }}></i>
          <div>
            <h3 style={{ color: "#e8e0d8", margin: 0 }}>Join our Discord Server</h3>
            <p style={{ color: "#808098", margin: "0.25rem 0 0 0", fontSize: "0.9rem" }}>
              For faster, live responses to general questions — see our Support page for this option.
            </p>
          </div>
        </div>
        <a href={SUPPORT_SERVER} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
          Join Support Server
        </a>
      </div>

      <p style={{ color: "var(--db-faint)", fontSize: "0.85rem", textAlign: "center", marginTop: "1.5rem" }}>
        See also our <a href="/privacy" style={{ color: "var(--db-gold)" }}>Privacy Policy</a> and{" "}
        <a href="/terms" style={{ color: "var(--db-gold)" }}>Terms of Service</a>.
      </p>
    </main>
  );
}
