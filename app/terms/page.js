import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentUser } from "@/lib/currentUser";

export const metadata = { title: "Terms of Service — SparkyBot" };

export default async function TermsPage() {
  const user = await getCurrentUser();
  return (
    <>
      <Navbar active="/terms" user={user} />
      <main className="main">
        <div className="policy-content">
          <h2 style={{ color: "#e8e0d8", marginBottom: "1.5rem" }}>Terms of Service</h2>
          <p><strong>Last updated:</strong> July 2026</p>
          <p>By using SparkyBot (the &quot;Bot&quot;), you agree to the following terms:</p>
          <ol>
            <li><strong>Acceptance of Terms:</strong> By inviting the Bot to your server, you accept these Terms of Service.</li>
            <li><strong>Use of the Bot:</strong> You agree to use the Bot in compliance with Discord&apos;s Terms of Service and Community Guidelines.</li>
            <li><strong>Data Collection:</strong> The Bot collects minimal data (server IDs, user IDs, configuration settings) to provide its services. No personal data is shared with third parties.</li>
            <li><strong>Prohibited Uses:</strong> You may not use the Bot for any illegal, abusive, or harmful purposes, including harassment, spam, or distribution of malicious content.</li>
            <li><strong>Availability:</strong> While we strive to keep the Bot online, we do not guarantee 100% uptime. We reserve the right to modify, suspend, or discontinue the Bot at any time.</li>
            <li><strong>Changes to Terms:</strong> We may update these Terms at any time. Continued use of the Bot constitutes acceptance of the updated Terms.</li>
            <li><strong>Contact:</strong> For questions about these Terms, please join our support server.</li>
          </ol>
          <p>By using SparkyBot, you acknowledge that you have read and understood these Terms of Service.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
