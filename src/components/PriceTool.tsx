import { useState, useCallback } from "react";
import { JOBS, calculateEstimate, fmt } from "@/lib/priceData";

const PriceTool = () => {
  const [step, setStep] = useState(1);
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  const [customJob, setCustomJob] = useState("");
  const [desc, setDesc] = useState("");
  const [propType, setPropType] = useState("");
  const [propAge, setPropAge] = useState("");
  const [region, setRegion] = useState("stockholm");
  const [numRooms, setNumRooms] = useState(1);
  const [measurements, setMeasurements] = useState<{ label: string; value: string }[]>([{ label: "", value: "" }]);
  const [result, setResult] = useState<ReturnType<typeof calculateEstimate> | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const toggleJob = (id: string) => {
    setSelectedJobs(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const addMeasurement = () => setMeasurements(prev => [...prev, { label: "", value: "" }]);

  const goStep = useCallback((n: number) => {
    setStep(n);
    document.getElementById("verktyget")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const calcAndShow = () => {
    const res = calculateEstimate({
      selectedJobs,
      customJob,
      region,
      propAge,
      numRooms,
      measurements: measurements.map(m => parseFloat(m.value)),
    });
    setResult(res);
    goStep(4);
  };

  return (
    <>
      <section id="verktyget" className="py-20 md:py-28 px-6 md:px-[72px] bg-card border-t-[6px] border-hero">
        <div className="max-w-[1080px] mx-auto">
          <div className="flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase text-orange font-bold mb-3">
            <span className="w-5 h-0.5 bg-orange rounded" />
            Prisuppskattning
          </div>
          <h2 className="font-display text-[clamp(32px,4.5vw,56px)] font-black tracking-tight leading-[1.05] mb-4 italic">
            Beräkna ditt projekt
          </h2>
          <p className="text-mid text-[17px] leading-relaxed max-w-[520px] mb-12">
            Fyll i informationen nedan — ju mer du berättar, desto träffsäkrare uppskattning.
          </p>

          {/* Progress */}
          <div className="h-[3px] bg-border rounded mb-6 overflow-hidden">
            <div className="h-full bg-orange rounded transition-all duration-400" style={{ width: `${(step / 4) * 100}%` }} />
          </div>

          {/* Tabs */}
          <div className="flex bg-cream border border-border rounded p-1 overflow-x-auto mb-6">
            {[
              { n: 1, label: "Jobbtyp" },
              { n: 2, label: "Beskrivning" },
              { n: 3, label: "Bilder & mått" },
              { n: 4, label: "Uppskattning" },
            ].map(t => (
              <button
                key={t.n}
                onClick={() => goStep(t.n)}
                className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-lg text-[13px] font-medium flex items-center gap-1.5 justify-center whitespace-nowrap transition-all ${
                  step === t.n ? "bg-card text-foreground font-semibold shadow-sm" : "text-muted-foreground"
                }`}
              >
                <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-bold ${
                  step === t.n ? "bg-orange text-card" : step > t.n ? "bg-green text-card" : "bg-border"
                }`}>
                  {step > t.n ? "✓" : t.n}
                </span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Step 1: Job type */}
          {step === 1 && (
            <div className="animate-fade-up">
              <div className="bg-card border border-border rounded p-8 mb-4">
                <h3 className="font-display text-xl font-semibold mb-1.5">Vad behöver du hjälp med?</h3>
                <p className="text-mid text-sm leading-relaxed mb-6">Välj en eller flera kategorier. Priser från Byggahus.se 2026.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 mb-5">
                  {JOBS.map(j => (
                    <div
                      key={j.id}
                      onClick={() => toggleJob(j.id)}
                      className={`border-2 rounded p-3 cursor-pointer transition-all text-center select-none ${
                        selectedJobs.has(j.id)
                          ? "border-orange bg-orange-bg"
                          : "border-border bg-cream hover:border-orange-shine hover:bg-orange-bg"
                      }`}
                    >
                      <div className="text-2xl mb-1.5">{j.icon}</div>
                      <div className="text-[13px] font-semibold">{j.name}</div>
                      <div className="text-[11px] text-green font-medium mt-0.5">{j.note}</div>
                    </div>
                  ))}
                </div>
                <div className="mb-0">
                  <label className="block text-[13px] font-semibold mb-1.5">
                    Något annat? <span className="font-normal text-muted-foreground text-xs ml-1">Beskriv kortfattat</span>
                  </label>
                  <input
                    type="text"
                    value={customJob}
                    onChange={e => setCustomJob(e.target.value)}
                    placeholder="t.ex. Installation av laddbox, byte av elcentral…"
                    className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all"
                  />
                </div>
              </div>
              <button onClick={() => goStep(2)} className="bg-hero text-primary-foreground px-8 py-3.5 text-[13px] font-bold uppercase tracking-wider hover:bg-rust transition-all">
                Nästa steg →
              </button>
            </div>
          )}

          {/* Step 2: Description */}
          {step === 2 && (
            <div className="animate-fade-up">
              <div className="bg-card border border-border rounded p-8 mb-4">
                <h3 className="font-display text-xl font-semibold mb-1.5">Berätta om projektet</h3>
                <p className="text-mid text-sm leading-relaxed mb-6">Skriv precis som du pratar — inga facktermer nödvändiga!</p>
                <div className="mb-4">
                  <label className="block text-[13px] font-semibold mb-1.5">Beskriv vad du vill ha gjort</label>
                  <textarea
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    placeholder="t.ex. Jag vill flytta ett uttag i vardagsrummet ca 3 meter. Huset är från 70-talet…"
                    className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all resize-vertical min-h-[88px]"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[13px] font-semibold mb-1.5">Fastighetstyp</label>
                    <select value={propType} onChange={e => setPropType(e.target.value)} className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all">
                      <option value="">Välj…</option>
                      <option>Villa / hus</option>
                      <option>Lägenhet</option>
                      <option>Kontor / lokal</option>
                      <option>Fritidshus</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold mb-1.5">Fastighetens ålder</label>
                    <select value={propAge} onChange={e => setPropAge(e.target.value)} className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all">
                      <option value="">Välj…</option>
                      <option value="ny">Nybyggd (efter 2000)</option>
                      <option value="modern">Modern (1970–2000)</option>
                      <option value="aldre">Äldre (1940–1970)</option>
                      <option value="gammal">Gammalt (före 1940)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold mb-1.5">Stad / region</label>
                    <select value={region} onChange={e => setRegion(e.target.value)} className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all">
                      <option value="stockholm">Stockholm (+15%)</option>
                      <option value="goteborg">Göteborg</option>
                      <option value="malmo">Malmö</option>
                      <option value="orebro">Örebro / mindre städer (−10%)</option>
                      <option value="norrland">Norrland (−5%)</option>
                      <option value="other">Annan ort</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold mb-1.5">Antal rum berörda</label>
                    <input
                      type="number"
                      value={numRooms}
                      onChange={e => setNumRooms(parseInt(e.target.value) || 1)}
                      placeholder="1"
                      min={1}
                      max={20}
                      className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2.5 mt-5">
                <button onClick={() => goStep(1)} className="bg-transparent text-mid border-2 border-border px-8 py-3.5 text-[13px] font-medium hover:border-mid hover:text-foreground transition-all">
                  ← Tillbaka
                </button>
                <button onClick={() => goStep(3)} className="bg-hero text-primary-foreground px-8 py-3.5 text-[13px] font-bold uppercase tracking-wider hover:bg-rust transition-all">
                  Nästa steg →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Images & measurements */}
          {step === 3 && (
            <div className="animate-fade-up">
              <div className="bg-card border border-border rounded p-8 mb-4">
                <h3 className="font-display text-xl font-semibold mb-1.5">Bilder & mått</h3>
                <p className="text-mid text-sm leading-relaxed mb-6">En bild gör uppskattningen mer träffsäker. Ange gärna mått om du har dem.</p>
                <div className="border-2 border-dashed border-border rounded p-8 text-center bg-cream hover:border-orange hover:bg-orange-bg transition-all cursor-pointer">
                  <div className="text-3xl mb-2">📸</div>
                  <div className="font-semibold text-[15px] mb-1">Klicka eller dra hit bilder</div>
                  <div className="text-muted-foreground text-[13px]">JPG, PNG, HEIC · Upp till 10 bilder</div>
                </div>
                <div className="mt-5">
                  <label className="block text-[13px] font-semibold mb-1.5">
                    Relevanta mått <span className="font-normal text-muted-foreground text-xs ml-1">Valfritt</span>
                  </label>
                  {measurements.map((m, i) => (
                    <div key={i} className="grid grid-cols-2 gap-3.5 mb-2.5">
                      <input
                        type="text"
                        placeholder="Vad mäter du? (t.ex. kabellängd)"
                        value={m.label}
                        onChange={e => {
                          const next = [...measurements];
                          next[i] = { ...next[i], label: e.target.value };
                          setMeasurements(next);
                        }}
                        className="px-3.5 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all"
                      />
                      <input
                        type="number"
                        placeholder="Meter / antal"
                        value={m.value}
                        onChange={e => {
                          const next = [...measurements];
                          next[i] = { ...next[i], value: e.target.value };
                          setMeasurements(next);
                        }}
                        className="px-3.5 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all"
                      />
                    </div>
                  ))}
                  <button onClick={addMeasurement} className="text-orange text-[13px] font-semibold hover:underline">
                    + Lägg till mått
                  </button>
                </div>
              </div>
              <div className="bg-green-bg border border-green/20 rounded p-3.5 flex gap-3 items-start">
                <span className="text-base flex-shrink-0 mt-0.5">💡</span>
                <p className="text-[13px] text-mid leading-relaxed"><strong className="text-foreground">Tips:</strong> Kabelns längd och antal punkter påverkar priset mest. Ungefärliga mått räcker!</p>
              </div>
              <div className="flex gap-2.5 mt-5">
                <button onClick={() => goStep(2)} className="bg-transparent text-mid border-2 border-border px-8 py-3.5 text-[13px] font-medium hover:border-mid hover:text-foreground transition-all">
                  ← Tillbaka
                </button>
                <button onClick={calcAndShow} className="bg-hero text-primary-foreground px-8 py-3.5 text-[13px] font-bold uppercase tracking-wider hover:bg-rust transition-all">
                  Räkna ut nu →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Result */}
          {step === 4 && result && (
            <div className="animate-fade-up">
              {/* Result header */}
              <div className="bg-hero text-primary-foreground rounded p-10 relative overflow-hidden mb-4">
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: "radial-gradient(ellipse 55% 65% at 80% 20%, rgba(232,168,74,0.18) 0%, transparent 60%)"
                }} />
                <div className="relative">
                  <div className="text-[11px] tracking-[0.12em] uppercase text-gold-shine font-bold mb-2.5">Uppskattad kostnad · inkl. moms</div>
                  <div className="font-display text-[clamp(34px,6vw,60px)] font-black tracking-tight italic mb-1.5">
                    {fmt(result.low)} – {fmt(result.high)} kr
                  </div>
                  <div className="text-primary-foreground/40 text-[13px] mb-5">Baserat på marknadsdata 2026 · Byggahus.se</div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center bg-primary-foreground/[0.07] rounded-lg px-4 py-2.5">
                      <span className="text-sm text-primary-foreground/65">🔧 Arbete</span>
                      <span className="text-[15px] font-semibold">{fmt(result.labor)} kr</span>
                    </div>
                    <div className="flex justify-between items-center bg-primary-foreground/[0.07] rounded-lg px-4 py-2.5">
                      <span className="text-sm text-primary-foreground/65">📦 Material</span>
                      <span className="text-[15px] font-semibold">{fmt(result.material)} kr</span>
                    </div>
                    <div className="flex justify-between items-center bg-primary-foreground/[0.07] rounded-lg px-4 py-2.5">
                      <span className="text-sm text-primary-foreground/65">🚗 Startavgift</span>
                      <span className="text-[15px] font-semibold">{fmt(result.travel)} kr</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ROT section */}
              <div className="bg-card border border-border rounded p-8 mb-4">
                <div className="inline-flex items-center gap-1.5 bg-green-bg rounded px-3 py-1 text-xs text-green font-bold mb-3.5">🌿 ROT-avdrag inräknat</div>
                <h3 className="font-display text-xl font-semibold mb-1.5">Vad du faktiskt betalar</h3>
                <p className="text-mid text-sm leading-relaxed mb-6">Som privatperson får du dra av 30% av arbetskostnaden — upp till 50 000 kr/år.</p>
                <div className="flex flex-col gap-2 mb-3.5">
                  <div className="flex justify-between items-center bg-cream rounded-lg px-4 py-2.5">
                    <span className="text-sm font-medium">Totalkostnad (inkl. moms)</span>
                    <span className="text-base font-bold">{fmt(result.subtotal)} kr</span>
                  </div>
                  <div className="flex justify-between items-center bg-green/[0.12] border border-green/30 rounded-lg px-4 py-2.5">
                    <span className="text-sm font-medium text-green">− ROT-avdrag (30% av arbete)</span>
                    <span className="text-base font-bold text-orange">− {fmt(result.rot)} kr</span>
                  </div>
                  <div className="flex justify-between items-center bg-foreground text-primary-foreground rounded-lg px-4 py-2.5">
                    <span className="text-[15px] font-semibold">Du betalar ungefär</span>
                    <span className="font-display text-3xl font-bold text-orange-shine">{fmt(result.afterRot)} kr</span>
                  </div>
                </div>
                <div className="bg-green-bg border border-green/20 rounded p-3.5 flex gap-3 items-start">
                  <span className="text-base flex-shrink-0 mt-0.5">ℹ️</span>
                  <p className="text-[13px] text-mid leading-relaxed">Detta är en <strong className="text-foreground">uppskattning</strong>. Slutpriset fastställs av hantverkaren efter besiktning.</p>
                </div>
              </div>

              {/* Market prices */}
              <div className="bg-cream border border-border rounded p-8 mb-4">
                <h3 className="font-display text-[17px] font-semibold mb-1.5">📊 Aktuella timpriser 2026</h3>
                <p className="text-muted-foreground text-[13px] mb-3">Intervjuer med 195 hantverkare · Byggahus.se april 2026</p>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-2.5 text-xs tracking-widest uppercase text-muted-foreground border-b-2 border-border">Yrkeskategori</th>
                      <th className="text-left p-2.5 text-xs tracking-widest uppercase text-muted-foreground border-b-2 border-border">Min</th>
                      <th className="text-left p-2.5 text-xs tracking-widest uppercase text-muted-foreground border-b-2 border-border">Snitt</th>
                      <th className="text-left p-2.5 text-xs tracking-widest uppercase text-muted-foreground border-b-2 border-border">Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { cat: "⚡ Elektriker", min: "669 kr", avg: "762 kr", max: "1 000 kr" },
                      { cat: "🔧 Rörmokare / VVS", min: "638 kr", avg: "843 kr", max: "1 048 kr" },
                      { cat: "🪚 Snickare", min: "462 kr", avg: "633 kr", max: "828 kr" },
                      { cat: "🎨 Målare", min: "430 kr", avg: "570 kr", max: "750 kr" },
                    ].map((r, i) => (
                      <tr key={i} className="hover:bg-cream">
                        <td className="p-2.5 border-b border-border">{r.cat}</td>
                        <td className="p-2.5 border-b border-border">{r.min}</td>
                        <td className="p-2.5 border-b border-border font-bold">{r.avg}</td>
                        <td className="p-2.5 border-b border-border">{r.max}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-2.5 mt-5 flex-wrap">
                <button onClick={() => goStep(3)} className="bg-transparent text-mid border-2 border-border px-8 py-3.5 text-[13px] font-medium hover:border-mid hover:text-foreground transition-all">
                  ← Ändra
                </button>
                <button onClick={() => setShowQuoteModal(true)} className="bg-gold text-hero px-8 py-3.5 text-[13px] font-bold uppercase tracking-wider hover:bg-gold-shine transition-all">
                  📩 Skicka förfrågan
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quote Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-foreground/50 z-[500] flex items-center justify-center p-5 backdrop-blur-sm" onClick={() => setShowQuoteModal(false)}>
          <div className="bg-background border-t-4 border-rust p-9 max-w-[520px] w-full max-h-[90vh] overflow-y-auto animate-fade-up relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowQuoteModal(false)} className="absolute top-4 right-4 bg-border w-8 h-8 rounded-full flex items-center justify-center text-lg hover:bg-border/80">×</button>
            <h2 className="font-display text-2xl font-semibold mb-1.5">Skicka förfrågan</h2>
            <p className="text-mid text-sm mb-5 leading-relaxed">Din uppskattning och beskrivning skickas direkt till hantverkaren.</p>
            <div className="mb-4">
              <label className="block text-[13px] font-semibold mb-1.5">Ditt namn</label>
              <input type="text" placeholder="Anna Svensson" className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-3.5 mb-4">
              <div>
                <label className="block text-[13px] font-semibold mb-1.5">E-post</label>
                <input type="email" placeholder="anna@email.se" className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold mb-1.5">Telefon</label>
                <input type="tel" placeholder="070-123 45 67" className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all" />
              </div>
            </div>
            <div className="bg-green-bg border border-green/20 rounded p-3.5 flex gap-3 items-start mb-4">
              <span className="text-base flex-shrink-0">✅</span>
              <p className="text-[13px] text-mid leading-relaxed">Uppskattning och beskrivning inkluderas automatiskt.</p>
            </div>
            <button onClick={() => setShowQuoteModal(false)} className="w-full bg-hero text-primary-foreground py-3.5 text-[13px] font-bold uppercase tracking-wider hover:bg-rust transition-all">
              Skicka förfrågan →
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PriceTool;
