import { motion } from "framer-motion";

const ContactSection = () => (
  <section id="kontakt" className="py-20 md:py-28 px-6 md:px-[72px] bg-card border-t-[3px] border-hero">
    <div className="max-w-[1080px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase text-orange font-bold mb-3">
            <span className="w-5 h-0.5 bg-orange rounded" />
            Kontakt
          </div>
          <h2 className="font-display text-[clamp(32px,4.5vw,56px)] font-black tracking-tight leading-[1.05] mb-4 italic">
            Vi svarar inom 24 timmar
          </h2>
          <p className="text-mid text-[17px] leading-relaxed max-w-[520px] mb-8">
            Frågor om prisuppskattningen, vill bli pilotföretag eller bara vill säga hej — hör av dig.
          </p>
          {[
            { icon: "✉️", title: "kontakt@hantverkspris.se", sub: "Mejla oss direkt" },
            { icon: "📍", title: "Stockholm, Sverige", sub: "Vi jobbar i hela landet" },
            { icon: "⏱", title: "Svarstid under 24h", sub: "Vardagar 8–18" },
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-orange-bg flex items-center justify-center text-[15px] flex-shrink-0">{c.icon}</div>
              <div className="text-sm text-mid">
                <strong className="block text-foreground text-[15px]">{c.title}</strong>
                {c.sub}
              </div>
            </div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card border border-border rounded p-8 shadow-sm"
        >
          <h3 className="font-display text-xl font-semibold mb-1.5">Skicka ett meddelande</h3>
          <p className="text-mid text-sm mb-6">Vi återkommer snart.</p>
          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <div>
              <label htmlFor="contact-name" className="block text-[13px] font-semibold mb-1.5">Ditt namn</label>
              <input id="contact-name" type="text" placeholder="Anna Svensson" className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all" />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-[13px] font-semibold mb-1.5">E-post</label>
              <input id="contact-email" type="email" placeholder="anna@email.se" className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all" />
            </div>
            <div>
              <label htmlFor="contact-subject" className="block text-[13px] font-semibold mb-1.5">Gäller</label>
              <select id="contact-subject" className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all">
                <option>Fråga om prisuppskattningen</option><option>Bli pilotföretag</option><option>Samarbete / partnerskap</option><option>Annat</option>
              </select>
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-[13px] font-semibold mb-1.5">Meddelande</label>
              <textarea id="contact-message" placeholder="Berätta lite mer…" className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all resize-vertical min-h-[88px]" />
            </div>
            <button type="submit" className="w-full bg-hero text-primary-foreground py-3.5 text-[13px] font-bold uppercase tracking-wider hover:bg-rust transition-all">
              Skicka meddelande →
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  </section>
);

export default ContactSection;