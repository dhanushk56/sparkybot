import Link from "next/link";

export const metadata = { title: "Plans" };

const DISCORD_SERVER = "https://support.sparkybot.bond";

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    tagline: "Everything you need to get going.",
    highlight: false,
    cta: "Get Started",
    ctaHref: "/invite",
    external: false,
    perks: [
      "Perk coming soon",
      "Perk coming soon",
      "Perk coming soon",
    ],
  },
  {
    name: "Pro",
    price: "$4.99",
    period: "/ month",
    tagline: "For servers that want more headroom.",
    highlight: true,
    cta: "Upgrade to Pro",
    ctaHref: "/support",
    external: true,
    perks: [
      "Perk coming soon",
      "Perk coming soon",
      "Perk coming soon",
      "Perk coming soon",
    ],
  },
  {
    name: "Ultimate",
    price: "$9.99",
    period: "/ month",
    tagline: "The full Sparky Bot experience.",
    highlight: false,
    cta: "Upgrade to Ultimate",
    ctaHref: "/support",
    external: true,
    perks: [
      "Perk coming soon",
      "Perk coming soon",
      "Perk coming soon",
      "Perk coming soon",
      "Perk coming soon",
    ],
  },
];

export default function PremiumPage() {
  return (
    <>
      <section className="min-h-[60vh] flex items-center justify-center relative overflow-hidden bg-[#050507] pt-32 pb-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,215,0,0.08),transparent_44%),radial-gradient(circle_at_86%_90%,rgba(255,140,0,0.06),transparent_52%)]"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-primary font-mono text-sm mb-6 uppercase tracking-widest shadow-[0_0_20px_rgba(255,215,0,0.15)]">
            <i className="fas fa-crown"></i> Premium
          </div>
          <h1 className="text-4xl lg:text-5xl font-orbitron font-bold mb-6 text-white">
            Pick the plan that <span className="gradient-text">fits your server</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
            Plan perks are still being finalized — pricing and features below are placeholders for now.
          </p>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden bg-black border-t border-white/[0.02]">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col h-full rounded-2xl p-8 backdrop-blur-2xl border transition-all duration-500 hover:-translate-y-1 ${
                  plan.highlight
                    ? "bg-[#0c0a04]/80 border-gold-primary/50 shadow-[0_0_50px_rgba(255,215,0,0.12)] md:scale-[1.04]"
                    : "bg-black/40 border-gold-primary/20 hover:border-gold-primary/40"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-gold-primary to-gold-secondary text-black text-xs font-bold uppercase tracking-widest shadow-[0_4px_14px_rgba(255,215,0,0.4)]">
                    Most Popular
                  </div>
                )}

                <h3 className="text-2xl font-orbitron font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{plan.tagline}</p>

                <div className="flex items-end gap-1.5 mb-6">
                  <span className="text-4xl font-orbitron font-black text-gold-primary">{plan.price}</span>
                  <span className="text-gray-500 text-sm mb-1">{plan.period}</span>
                </div>

                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.perks.map((perk, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <i className="fas fa-check text-gold-primary mt-0.5"></i>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>

                {plan.external ? (
                  <a
                    href={plan.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={plan.highlight ? "btn-primary text-center" : "btn-secondary text-center"}
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <Link
                    href={plan.ctaHref}
                    className={plan.highlight ? "btn-primary text-center" : "btn-secondary text-center"}
                  >
                    {plan.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 text-sm mt-12 max-w-lg mx-auto">
            Questions about Premium? <Link href="/contact" className="text-gold-primary hover:underline">Contact us</Link> or{" "}
            <a href={DISCORD_SERVER} target="_blank" rel="noopener noreferrer" className="text-gold-primary hover:underline">join our Discord server</a>.
          </p>
        </div>
      </section>
    </>
  );
}
