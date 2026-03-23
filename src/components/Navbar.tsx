import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  onScrollTo?: (id: string) => void;
}

const Navbar = ({ onScrollTo }: NavbarProps) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (hash: string) => {
    setMenuOpen(false);
    if (onScrollTo) {
      onScrollTo(hash);
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const links = [
    { id: "verktyget", label: "Beräkna pris" },
    { id: "hur", label: "Hur det fungerar" },
    { id: "firmor", label: "För företag" },
    { id: "kontakt", label: "Kontakt" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-6 md:px-12 py-3.5 bg-background/95 backdrop-blur-md border-b-[3px] border-foreground">
        <div
          className="font-display text-2xl font-black tracking-tight cursor-pointer uppercase"
          onClick={() => navigate("/")}
        >
          Hantverks<span className="text-rust">pris</span>
        </div>
        <div className="hidden md:flex gap-7 items-center">
          {links.map(l => (
            <button key={l.id} onClick={() => handleNav(l.id)} className="text-sm font-medium text-mid hover:text-foreground transition-colors">
              {l.label}
            </button>
          ))}
        </div>
        <div className="hidden md:flex gap-2.5">
          <button
            onClick={() => navigate("/login")}
            className="bg-transparent text-hero border-2 border-hero rounded-sm px-5 py-2 text-[13px] font-semibold uppercase tracking-wider hover:border-mid hover:text-foreground transition-all"
          >
            🏢 Logga in
          </button>
          <button
            onClick={() => handleNav("verktyget")}
            className="bg-hero text-primary-foreground border-none rounded-sm px-5 py-2.5 text-[13px] font-bold uppercase tracking-wider hover:bg-rust transition-all"
          >
            Beräkna mitt jobb
          </button>
        </div>
        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center text-foreground"
          aria-label={menuOpen ? "Stäng meny" : "Öppna meny"}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[199] bg-background/98 backdrop-blur-lg pt-[70px] flex flex-col items-center justify-center gap-2 animate-fade-up">
          {links.map(l => (
            <button key={l.id} onClick={() => handleNav(l.id)} className="text-lg font-semibold text-foreground py-3 px-6 hover:text-rust transition-colors">
              {l.label}
            </button>
          ))}
          <div className="h-px w-16 bg-border my-3" />
          <button onClick={() => { setMenuOpen(false); navigate("/login"); }}
            className="bg-hero text-primary-foreground rounded-sm px-8 py-3 text-[14px] font-bold uppercase tracking-wider">
            🏢 Logga in
          </button>
          <button onClick={() => handleNav("verktyget")}
            className="bg-gold text-hero rounded-sm px-8 py-3 text-[14px] font-bold uppercase tracking-wider">
            Beräkna mitt jobb
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;