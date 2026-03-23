import { motion } from "framer-motion";

interface HeroProps {
  onScrollTo: (id: string) => void;
}

const Hero = ({ onScrollTo }: HeroProps) => {
  return (
    <section className="min-h-screen bg-hero text-primary-foreground flex flex-col relative overflow-hidden pt-[70px]">
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 50% at 85% 20%, rgba(232,168,74,0.12) 0%, transparent 60%)"
      }} />
      <div className="grain-overlay" />

      <div className="relative z-[2] flex-1 flex flex-col items-start justify-end text-left p-8 md:p-[clamp(32px,5vw,72px)] max-w-[1100px] w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-rust/20 border border-rust/35 rounded-sm px-4 py-1.5 text-xs text-orange-shine uppercase tracking-widest font-semibold mb-7"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange-shine animate-pulse-dot" />
          Nytt · Baserat på 195 hantverkare
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}
          className="font-display text-[clamp(42px,8vw,110px)] font-black leading-[0.95] tracking-tighter max-w-[760px] mb-7 italic"
        >
          Vet vad jobbet kostar — <em className="text-orange-shine not-italic">innan</em> vi ens träffas
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.16 }}
          className="text-[16px] md:text-[17px] text-primary-foreground/70 max-w-[480px] leading-relaxed mb-10 border-l-[3px] border-gold pl-4"
        >
          Beskriv ditt projekt och få en prisuppskattning direkt. Med ROT-avdrag inräknat. Baserat på aktuella priser från 195 hantverkare 2026.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.24 }}
          className="flex gap-3 flex-wrap"
        >
          <button onClick={() => onScrollTo("verktyget")} className="bg-gold text-hero border-none rounded-sm px-7 md:px-9 py-3.5 md:py-4 text-[14px] md:text-[15px] font-bold uppercase tracking-wider hover:bg-gold-shine transition-all shadow-lg shadow-gold/20">
            Räkna ut mitt jobb →
          </button>
          <button onClick={() => onScrollTo("firmor")} className="bg-transparent text-primary-foreground/80 border-2 border-primary-foreground/35 rounded-sm px-7 md:px-9 py-3.5 md:py-4 text-[14px] md:text-[15px] font-semibold uppercase tracking-wider hover:border-primary-foreground/50 hover:text-primary-foreground transition-all">
            Jag är ett företag
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.32 }}
        className="relative z-[2] flex flex-wrap border-t border-primary-foreground/[0.08]"
      >
        {[
          { n: "762 kr", l: "Snitt elektriker/tim 2026" },
          { n: "2 min", l: "Tid för uppskattning" },
          { n: "±15%", l: "Träffsäkerhet" },
          { n: "0 kr", l: "Kostar att använda" },
        ].map((s, i) => (
          <div key={i} className="flex-1 min-w-[50%] md:min-w-0 text-center py-5 md:py-6 px-2.5 border-r border-primary-foreground/[0.08] last:border-r-0">
            <div className="font-display text-3xl md:text-4xl font-black text-gold italic">{s.n}</div>
            <div className="text-[10px] md:text-[11px] text-primary-foreground/45 mt-1 uppercase tracking-widest">{s.l}</div>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default Hero;