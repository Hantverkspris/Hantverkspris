import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/portal");
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Inloggad!");
      navigate("/portal");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      toast.error("Ange ett företagsnamn");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { company_name: companyName },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Konto skapat! Kontrollera din e-post för verifiering.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "#F0E4D4" }}>
      <button
        onClick={() => navigate("/")}
        className="fixed top-5 left-5 z-10 bg-foreground/[0.06] border-none rounded-sm px-5 py-2 text-[13px] font-medium text-mid hover:bg-foreground/10 transition-all"
      >
        ← Tillbaka
      </button>
      <div className="bg-background border border-border border-t-4 border-t-rust p-10 w-full max-w-[420px]">
        <div className="font-display text-xl font-bold mb-1.5">
          Hantverks<span className="text-orange">pris</span>
        </div>
        <h2 className="font-display text-[26px] font-semibold mb-1.5">
          {isSignUp ? "Skapa konto" : "Välkommen tillbaka"}
        </h2>
        <p className="text-mid text-sm mb-6 leading-relaxed">
          {isSignUp
            ? "Registrera ditt företag för att hantera priser, förfrågningar och samarbeten."
            : "Logga in till företagsportalen för att hantera priser, förfrågningar och samarbeten med andra firmor."}
        </p>
        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-[13px] font-semibold mb-1.5">Företagsnamn</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ert Företag AB"
                className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-[13px] font-semibold mb-1.5">E-post</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="info@ertforetag.se"
              className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold mb-1.5">Lösenord</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-hero py-3.5 text-[13px] font-bold uppercase tracking-wider hover:bg-gold-shine transition-all mt-2 disabled:opacity-50"
          >
            {loading ? "Vänta..." : isSignUp ? "Skapa konto →" : "Logga in →"}
          </button>
        </form>
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">eller</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full bg-foreground text-primary-foreground py-3 text-[13px] font-bold uppercase tracking-wider hover:bg-mid transition-all"
        >
          {isSignUp ? "🔑 Logga in istället" : "🆕 Skapa nytt företagskonto"}
        </button>
      </div>
    </div>
  );
};

export default Login;
