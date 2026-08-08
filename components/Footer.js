import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-dark-card via-dark-bg to-dark-card border-t border-dark-border overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-gold-primary/5 via-transparent to-gold-secondary/5"></div>
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-primary to-gold-secondary flex items-center justify-center text-black font-orbitron font-black text-lg">
                S
              </div>
              <span className="text-2xl font-orbitron font-bold bg-gradient-to-r from-gold-primary to-gold-secondary bg-clip-text text-transparent">
                SparkyBot
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              The ultimate multipurpose Discord bot engineered for modern servers with advanced features and reliable performance.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-orbitron font-bold text-lg text-gold-primary">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-gray-400 hover:text-gold-primary transition" href="/dashboard">Dashboard</Link></li>
              <li><Link className="text-gray-400 hover:text-gold-primary transition" href="/invite">Add Bot</Link></li>
              <li><Link className="text-gray-400 hover:text-gold-primary transition" href="/commands">Commands</Link></li>
              <li><Link className="text-gray-400 hover:text-gold-primary transition" href="/support">Support Server</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-orbitron font-bold text-lg text-gold-primary">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-gray-400 hover:text-gold-primary transition" href="/terms">Terms of Use</Link></li>
              <li><Link className="text-gray-400 hover:text-gold-primary transition" href="/privacy">Privacy Policy</Link></li>
              <li><Link className="text-gray-400 hover:text-gold-primary transition" href="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-orbitron font-bold text-lg text-gold-primary">Statistics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Servers:</span><span className="font-semibold">0</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Users:</span><span className="font-semibold">0</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Uptime:</span><span className="font-semibold text-green-400">99.9%</span></div>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-border pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 <span className="font-orbitron font-bold text-gold-primary">SparkyBot</span> Development. All rights reserved.
            | <Link className="text-gray-400 hover:text-gold-primary transition" href="/terms">Terms</Link>
            | <Link className="text-gray-400 hover:text-gold-primary transition" href="/privacy">Privacy</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
