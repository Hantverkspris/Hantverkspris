import { motion } from "framer-motion";
import { useState } from "react";

const tags = ["⚡ Elektriker", "🔧 VVS", "🪚 Snickeri", "🎨 Måleri", "🏠 Privatperson"];

const SignupSection = () => {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (t: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });
  };

  const handleSubmit = () => {
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section id="signup" className="py-20 md:py-28 px-6 md:px-[72px] bg-background border-t-[3px] border-hero">
      <div className="max-w-[1080px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border rounded p-8 md:p-12 max-w-[640px] mx-auto text-center shadow-sm"
        >
          <div className="flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase text-orange font-bold mb-3.5 justify-center">
            <span className="w-5 h-0.5 bg-orange rounded" />
            Håll dig uppdaterad
          </div>
          <h2 className="font-display text-[clamp(28px,4vw,48px)] font-black tracking-tight leading-[1.05] mb-4 italic">
            Vill du veta när vi lanserar?
          </h2>
          <p className="text-mid text-base leading-relaxed mb-6">Lämna din e-post så hör vi av oss. Inga spam — bara det viktiga.</p>
          
          {submitted ? (
            <div className="bg-green-bg border border-green/20 rounded p-4 text-green text-sm font-semibold">
              ✅ Tack! Vi hör av oss snart.
            </div>
          ) : (
            <>
              <div className="flex gap-2.5 flex-wrap mb-3.5">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  placeholder="din@email.se"
                  className="flex-1 min-w-[180px] px-4 py-3 border-[1.5px] border-border rounded bg-cream text-[15px] outline-none focus:border-orange focus:bg-card transition-all"
                />
                <button onClick={handleSubmit} className="bg-gold text-hero rounded-sm px-6 py-3 text-[15px] font-bold hover:bg-gold-shine transition-all shadow-sm">
                  Anmäl mig
                </button>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {tags.map(t => (
                  <span
                    key={t}
                    onClick={() => toggleTag(t)}
                    className={`border rounded-sm px-3.5 py-1 text-xs cursor-pointer transition-all select-none ${
                      selectedTags.has(t) ? "bg-orange-bg border-orange text-orange" : "bg-cream border-border text-muted-foreground hover:bg-orange-bg hover:border-orange hover:text-orange"
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default SignupSection;