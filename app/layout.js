import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "SparkyBot",
  description: "The Ultimate Discord Bot",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: "#0a0a14", color: "#e8e0d8" }}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}