import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  // ... your metadata
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </head>
      <body className="bg-dark-bg text-white overflow-x-hidden selection:bg-gold-primary selection:text-black font-inter antialiased">
        <Navbar />
        <main className="pt-0">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
