import Footer from "@/components/Footer";

export const metadata = { title: "Privacy Policy — SparkyBot" };

export default async function PrivacyPage() {
  return (
    <>
      <main className="main">
        <div className="policy-content">
          <h2 style={{ color: "#e8e0d8", marginBottom: "1.5rem" }}>Privacy Policy</h2>
          <p><strong>Last updated:</strong> July 2026</p>
          <p>SparkyBot (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) respects your privacy. This Privacy Policy explains how we collect, use, and protect your data.</p>
          <ol>
            <li><strong>Data We Collect:</strong> We collect server IDs, user IDs, message content (for logging and auto-moderation), configuration settings, and economy/leveling data.</li>
            <li><strong>How We Use Data:</strong> Data is used solely to provide the Bot&apos;s functionality, including moderation, logging, economy, and user preferences.</li>
            <li><strong>Data Storage:</strong> Data is stored securely in JSON files or databases. No data is shared with third parties except as required by law.</li>
            <li><strong>Your Rights:</strong> You may request deletion of your data at any time by contacting us through our support server.</li>
            <li><strong>Data Retention:</strong> We retain data for as long as the Bot is in your server. You can remove data by using the <code>//adminreset</code> command or by kicking the Bot.</li>
            <li><strong>Children&apos;s Privacy:</strong> The Bot is not intended for children under 13. We do not knowingly collect data from children.</li>
            <li><strong>Changes to Policy:</strong> We may update this Privacy Policy from time to time. Continued use of the Bot constitutes acceptance of the updated Policy.</li>
            <li><strong>Contact:</strong> For privacy concerns, please join our support server.</li>
          </ol>
          <p>By using SparkyBot, you consent to the collection and use of your data as described in this Privacy Policy.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
