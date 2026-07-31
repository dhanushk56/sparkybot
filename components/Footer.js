import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="links">
        <Link href="/terms">Terms</Link>
        <Link href="/privacy">Privacy</Link>
        <a href="https://discord.gg/sEJ6FwHGJw" target="_blank" rel="noreferrer">Support</a>
        <a href="https://github.com/dhanushk56/sparky-bot-documentation.git" target="_blank" rel="noreferrer">GitHub</a>
      </div>
      <div>© 2026 SparkyBot. Built with ❤️ for Discord communities.</div>
    </footer>
  );
}
