import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-hero-dark text-primary-foreground/40 py-10 px-6">
      <div className="max-w-[1080px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
          <div>
            <div className="font-display text-xl font-black text-primary-foreground/70 uppercase mb-1">
              Hantverks<span className="text-gold">pris</span>
            </div>
            <p className="text-[13px] text-primary-foreground/35">Rätt pris, rätt från start</p>
          </div>
          <div className="flex gap-6 flex-wrap">
            {[
              { label: "Beräkna pris", action: () => document.getElementById("verktyget")?.scrollIntoView({ behavior: "smooth" }) },
              { label: "Hur det fungerar", action: () => document.getElementById("hur")?.scrollIntoView({ behavior: "smooth" }) },
              { label: "För företag", action: () => document.getElementById("firmor")?.scrollIntoView({ behavior: "smooth" }) },
              { label: "Kontakt", action: () => document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" }) },
              { label: "Företagsportal", action: () => navigate("/login") },
            ].map((l, i) => (
              <button key={i} onClick={l.action} className="text-primary-foreground/45 text-[13px] hover:text-primary-foreground/75 transition-colors">
                {l.label}
              </button>
            ))}
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 pt-6 flex flex-col md:flex-row md:justify-between gap-2 text-[12px]">
          <p><strong className="text-primary-foreground/60">© 2026 Hantverkspris</strong> — Alla rättigheter förbehållna</p>
          <p className="text-primary-foreground/30">Priser baserade på Byggahus.se marknadsundersökning, april 2026 · 195 hantverkare</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;