import { motion } from "framer-motion";

const features = [
  { icon: "🧠", title: "Inga besök krävs", desc: "Du behöver inte boka ett kostnadsbesök bara för att ta reda på om du har råd. Svaret kommer direkt." },
  { icon: "💸", title: "ROT-avdrag automatiskt", desc: "Vi räknar alltid ut vad du betalar efter ROT. Inga överraskningar — du ser slutsiffran direkt." },
  { icon: "📊", title: "Riktiga marknadsdata", desc: "Priserna baseras på intervjuer med 195 hantverkare i Sverige 2026 — inte gissningar." },
  { icon: "📸", title: "Bilder & mått välkomna", desc: "Ladda upp foton och ange mått. Ju mer info, desto träffsäkrare uppskattning." },
  { icon: "⚡", title: "2 minuter, inte 2 veckor", desc: "Hela processen tar under 2 minuter. Snabbare än att ringa och vänta i telefonkö." },
  { icon: "🔒", title: "Helt gratis för dig", desc: "Inga dolda avgifter. Verktyget är och förblir gratis för privatpersoner." },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

const HowItWorks = () => (
  <section id="hur" className="py-20 md:py-28 px-6 md:px-[72px]" style={{ background: "#F2EBE0" }}>
    <div className="max-w-[1080px] mx-auto">
      <div className="flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase text-orange font-bold mb-3">
        <span className="w-5 h-0.5 bg-orange rounded" />
        Hur det fungerar
      </div>
      <h2 className="font-display text-[clamp(32px,4.5vw,56px)] font-black tracking-tight leading-[1.05] mb-4 italic">
        Enkelt för kunden.<br />Lönsamt för firman.
      </h2>
      <p className="text-mid text-[17px] leading-relaxed max-w-[520px] mb-12">
        Hantverkspris tar bort den vanligaste orsaken till att hantverksjobb aldrig blir av.
      </p>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t-[3px] border-l-[3px] border-hero mt-12"
      >
        {features.map((f, i) => (
          <motion.div key={i} variants={cardVariants} className="bg-card border border-border rounded p-6 hover:bg-gold-bg hover:shadow-md transition-all group">
            <div className="text-[26px] mb-3 group-hover:scale-110 transition-transform">{f.icon}</div>
            <h3 className="font-display text-[19px] font-bold mb-2">{f.title}</h3>
            <p className="text-mid text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default HowItWorks;