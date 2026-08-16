import Link from "next/link";

export const metadata = { title: "Partners — SparkyBot" };

const partners = [
  {
    name: "Elysia Cloud",
    tag: "Featured Partner",
    banner:
      "https://cdn.phototourl.com/free/2026-08-16-f59e91c5-fbe0-45cb-bbee-795a205cad53.png",
    description:
      "Elysia Cloud is a fast, affordable, and reliable cloud hosting provider. They deliver high-performance hosting solutions designed for all consumers, combining powerful infrastructure, dependable service, and competitive pricing — built to make quality cloud hosting accessible without compromising on speed or reliability.",
    website: "https://www.elysiacloud.com/",
    discord: "https://discord.gg/f3DD5KhNb3",
  },
];

export default function PartnersPage() {
  return (
    <div className="landing-root">
      <section className="min-h-[40vh] flex items-center relative overflow-hidden bg-[#050507] pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-gold-primary/5 via-dark-bg to-gold-secondary/[0.03]"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-10 -right-20 w-96 h-96 bg-gold-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-gold-secondary/[0.06] rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-primary font-mono text-sm mb-6 uppercase tracking-widest shadow-[0_0_20px_rgba(255,215,0,0.15)]">
            <i className="fas fa-star"></i> Special
          </div>
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-5">
            Our <span className="gradient-text">Partners</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Trusted services we recommend alongside SparkyBot to help you run your community and infrastructure.
          </p>
        </div>
      </section>

      <section className="pb-24 relative bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.05)_0%,transparent_50%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {partners.map((partner, i) => (
              <div key={i} className="relative group">
                <div className="relative overflow-hidden bg-black/40 backdrop-blur-2xl border border-gold-primary/20 rounded-2xl transition-all duration-500 group-hover:border-gold-primary/40 group-hover:-translate-y-1">
                  <div className="relative">
                    <img
                      src={partner.banner}
                      alt={`${partner.name} banner`}
                      className="w-full h-44 object-cover"
                    />
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gold-primary text-black text-xs font-bold uppercase tracking-wide shadow-[0_4px_16px_rgba(255,215,0,0.4)]">
                      {partner.tag}
                    </span>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-orbitron font-bold text-white mb-3">
                      {partner.name}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                      {partner.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                      >
                        <i className="fas fa-globe"></i> Website
                      </a>
                      <a
                        href={partner.discord}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary flex-1 flex items-center justify-center gap-2"
                      >
                        <i className="fab fa-discord"></i> Discord
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-gray-500 text-sm mb-4">Want to partner with SparkyBot?</p>
            <Link href="/support" className="btn-secondary inline-flex items-center gap-2 px-8 py-4">
              <i className="fas fa-handshake"></i> Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
