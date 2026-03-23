import { useState } from "react";

const cards = [
  { icon: "💰", title: "Sätt era egna priser", desc: "Fyll i era timpriser och fasta kostnader. Kundernas uppskattningar baseras på era faktiska priser.", plan: "Bas · 499 kr/mån" },
  { icon: "📩", title: "Ta emot förfrågningar", desc: "Kunder skickar färdiga förfrågningar med beskrivning, bilder och uppskattning direkt till er inkorg.", plan: "Proffs · 899 kr/mån" },
  { icon: "🤝", title: "Hyr in & hyr ut personal", desc: "Annonsera när ni behöver extra folk — eller erbjud era killar till andra firmor när ni har ledigt.", plan: "Proffs · 899 kr/mån" },
];

const ForCompanies = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <section id="firmor" className="py-20 md:py-28 px-6 md:px-[72px] bg-hero-dark text-primary-foreground">
        <div className="max-w-[1080px] mx-auto">
          <div className="flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase text-orange-shine font-bold mb-3">
            <span className="w-5 h-0.5 bg-orange-shine rounded" />
            För hantverksfirmor
          </div>
          <h2 className="font-display text-[clamp(32px,4.5vw,56px)] font-black tracking-tight leading-[1.05] mb-4 italic">
            Få fler kunder som redan bestämt sig.
          </h2>
          <p className="text-primary-foreground/60 text-[17px] leading-relaxed max-w-[520px] mb-12">
            Kunder som räknat ut priset och skickat en förfrågan är 3× mer benägna att boka.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t-[3px] border-l-[3px] border-gold mt-11">
            {cards.map((c, i) => (
              <div key={i} className="bg-primary-foreground/[0.06] border border-primary-foreground/10 rounded p-6 hover:bg-gold/[0.08] transition-all">
                <div className="text-2xl mb-3">{c.icon}</div>
                <h3 className="font-display text-[17px] font-semibold mb-1.5">{c.title}</h3>
                <p className="text-[13px] text-primary-foreground/50 leading-relaxed">{c.desc}</p>
                <span className="inline-block mt-3 bg-orange rounded-sm px-3 py-1 text-[11px] font-bold text-primary-foreground">{c.plan}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button onClick={() => setShowModal(true)} className="bg-gold text-hero px-10 py-4 text-base font-bold uppercase tracking-wider hover:bg-gold-shine transition-all">
              Bli pilotföretag — gratis i 2 månader →
            </button>
            <p className="mt-3 text-[13px] text-primary-foreground/35">Inga kortuppgifter krävs · Avsluta när som helst</p>
          </div>
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 bg-foreground/50 z-[500] flex items-center justify-center p-5 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-background border-t-4 border-rust p-9 max-w-[520px] w-full max-h-[90vh] overflow-y-auto animate-fade-up relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 bg-border w-8 h-8 rounded-full flex items-center justify-center text-lg hover:bg-border/80">×</button>
            <h2 className="font-display text-2xl font-semibold mb-1.5">Bli pilotföretag</h2>
            <p className="text-mid text-sm mb-5 leading-relaxed">Gratis de första 2 månaderna. Vi sätter upp allt — ni behöver bara sätta era priser.</p>
            <div className="space-y-4 mb-4">
              <div><label className="block text-[13px] font-semibold mb-1.5">Företagsnamn</label><input type="text" placeholder="Svensson El AB" className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all" /></div>
              <div><label className="block text-[13px] font-semibold mb-1.5">Kontaktperson</label><input type="text" placeholder="Erik Svensson" className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all" /></div>
              <div className="grid grid-cols-2 gap-3.5">
                <div><label className="block text-[13px] font-semibold mb-1.5">E-post</label><input type="email" placeholder="erik@svenssone.se" className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all" /></div>
                <div><label className="block text-[13px] font-semibold mb-1.5">Telefon</label><input type="tel" placeholder="070-123 45 67" className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all" /></div>
              </div>
              <div><label className="block text-[13px] font-semibold mb-1.5">Bransch</label>
                <select className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all">
                  <option>⚡ Elektriker</option><option>🔧 VVS / Rörmokare</option><option>🪚 Snickeri / Bygg</option><option>🎨 Måleri</option><option>Annan</option>
                </select>
              </div>
            </div>
            <div className="bg-orange-bg border border-orange/30 rounded p-3.5 flex gap-3 items-start mb-4">
              <span className="text-base flex-shrink-0">🎁</span>
              <p className="text-[13px] text-mid leading-relaxed"><strong className="text-foreground">2 månader helt gratis.</strong> Ingen kortinfo krävs. Vi hör av oss inom 24h för onboarding.</p>
            </div>
            <button onClick={() => setShowModal(false)} className="w-full bg-gold text-hero py-3.5 text-[13px] font-bold uppercase tracking-wider hover:bg-gold-shine transition-all">
              Anmäl oss som pilotföretag →
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ForCompanies;
