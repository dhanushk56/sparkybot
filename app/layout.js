import "./globals.css";

export const metadata = {
  title: "SparkyBot",
  description: "Moderation, tickets, economy, giveaways, logging, and more — all in one free, reliable bot.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%A4%96%3C/text%3E%3C/svg%3E",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="bg-grid" />
        <div className="glow-1" />
        <div className="glow-2" />
        {children}
      </body>
    </html>
  );
}
