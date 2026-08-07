import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "SparkyBot – The Ultimate Discord Bot",
  description: "A feature-rich multipurpose Discord bot with economy, moderation, fun, and automation – all managed via an intuitive dashboard.",
  keywords: "sparkybot,discord bot,best discord bot,multipurpose discord bot,discord moderation bot,discord economy bot,discord fun bot",
  authors: [{ name: "SparkyBot Development" }],
  openGraph: {
    title: "SparkyBot – The Ultimate Discord Bot",
    description: "A feature-rich multipurpose Discord bot with economy, moderation, fun, and automation.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-dark-bg text-white overflow-x-hidden selection:bg-gold-primary selection:text-black font-inter antialiased">
        <Navbar />
        <main className="pt-0">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
