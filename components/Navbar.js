import Link from "next/link";

const INVITE_URL =
  "https://discord.com/oauth2/authorize?client_id=1528780547411804382&scope=bot+applications.commands&permissions=1099800112246";

export default function Navbar({ active, user }) {
  const link = (href, label) => (
    <Link href={href} className={active === href ? "active" : ""}>
      {label}
    </Link>
  );

  return (
    <nav className="navbar">
      <div className="logo">
        🤖 <span>SparkyBot</span>
      </div>
      <div className="nav-links">
        {link("/", "Home")}
        {link("/commands", "Commands")}
        {link("/dashboard", "Dashboard")}
        <a href="https://discord.gg/sEJ6FwHGJw" target="_blank" rel="noreferrer">Support</a>
        <a href="https://github.com/dhanushk56/sparky-bot-documentation.git" target="_blank" rel="noreferrer">Docs</a>
      </div>
      <div style={{ display: "flex", gap: ".75rem", alignItems: "center" }}>
        {user ? (
          <Link href="/dashboard" className="btn btn-secondary">
            {user.username}
          </Link>
        ) : (
          <a href="/api/auth/login" className="btn btn-secondary">
            Login
          </a>
        )}
        <a href={INVITE_URL} target="_blank" rel="noreferrer" className="btn btn-primary">
          Invite
        </a>
      </div>
    </nav>
  );
}
