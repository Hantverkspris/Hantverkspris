const PortalPrices = () => (
  <div className="max-w-[860px] mx-auto">
    <h2 className="font-display text-[26px] font-semibold mb-1">Era timpriser & standardjobb</h2>
    <p className="text-muted-foreground text-[15px] mb-6">Dessa priser används när kunder beräknar sin uppskattning via Hantverkspris.</p>

    <div className="bg-card border border-border rounded p-8 mb-4">
      <h3 className="font-display text-xl font-semibold mb-1.5">Grundpriser</h3>
      <p className="text-mid text-sm mb-6">Jämförelsepriser från Byggahus.se 2026 visas bredvid.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {[
          { label: "Timpris (inkl. moms)", val: "850", hint: "Marknadssnitt: 762 kr" },
          { label: "Startavgift / resekostnad", val: "500", hint: "Typiskt: 400–500 kr" },
          { label: "Minimibelopp", val: "1500", hint: "Vanligtvis 1–2 tim" },
        ].map((f, i) => (
          <div key={i}>
            <label className="block text-[13px] font-semibold mb-1.5">{f.label}</label>
            <input type="number" defaultValue={f.val} className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all" />
            <div className="text-[11px] text-muted-foreground mt-1">{f.hint}</div>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-card border border-border rounded p-8 mb-4">
      <h3 className="font-display text-xl font-semibold mb-1.5">Fasta priser på vanliga arbeten</h3>
      <p className="text-mid text-sm mb-6">Kunden ser dessa direkt i sin uppskattning.</p>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="text-left p-2.5 text-xs tracking-widest uppercase text-muted-foreground border-b-2 border-border">Tjänst</th>
            <th className="text-left p-2.5 text-xs tracking-widest uppercase text-muted-foreground border-b-2 border-border">Ert pris (inkl. moms)</th>
            <th className="text-left p-2.5 text-xs tracking-widest uppercase text-muted-foreground border-b-2 border-border">Marknadssnitt 2026</th>
          </tr>
        </thead>
        <tbody>
          {[
            { name: "🔌 Flytta uttag", market: "800–2000 kr" },
            { name: "💡 Lampinstallation", market: "300–700 kr/pkt" },
            { name: "🚗 Laddbox EV", market: "8000–20 000 kr" },
            { name: "🛡️ Jordfelsbrytare", market: "ca 2 500 kr" },
          ].map((r, i) => (
            <tr key={i} className="hover:bg-cream">
              <td className="p-2.5 border-b border-border">{r.name}</td>
              <td className="p-2.5 border-b border-border">
                <input type="text" placeholder="t.ex. 1 800 kr" className="px-2.5 py-1.5 border-[1.5px] border-border rounded bg-cream text-[13px] w-[140px] outline-none focus:border-orange focus:bg-card transition-all" />
              </td>
              <td className="p-2.5 border-b border-border text-[13px] text-muted-foreground">{r.market}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="mt-4 bg-hero text-primary-foreground px-8 py-3.5 text-[13px] font-bold uppercase tracking-wider hover:bg-rust transition-all">
        Spara priser ✓
      </button>
    </div>

    <div className="bg-blue-bg border border-blue/20 rounded p-3.5 flex gap-3 items-start">
      <span className="text-base flex-shrink-0 mt-0.5">📊</span>
      <p className="text-[13px] text-mid leading-relaxed">
        <strong className="text-foreground">Marknaddata 2026:</strong> Elektriker 669–1000 kr/tim (snitt 762), Rörmokare 638–1048 kr (snitt 843), Snickare 462–828 kr (snitt 633). Källa: Byggahus.se.
      </p>
    </div>
  </div>
);

export default PortalPrices;
