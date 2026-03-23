import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Ad {
  id: string;
  user_id: string;
  type: "hire" | "offer";
  urgent: boolean;
  title: string;
  description: string | null;
  skill: string;
  people_count: number;
  start_date: string;
  duration: string;
  location: string;
  rate: string | null;
  created_at: string;
  profiles?: { company_name: string; avatar_url: string | null } | null;
}

const SKILL_ICONS: Record<string, string> = {
  "Elektriker": "⚡",
  "VVS/Rörmokare": "🔧",
  "Snickare": "🪚",
  "Målare": "🎨",
};

const SKILL_BG: Record<string, string> = {
  "Elektriker": "#FEF0E8",
  "VVS/Rörmokare": "#EFF6FF",
  "Snickare": "#F5F3FF",
  "Målare": "#FEF9E7",
};

const PortalBoard = ({ onStartConversation }: { onStartConversation?: (userId: string) => void }) => {
  const { user } = useAuth();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [adType, setAdType] = useState<"hire" | "offer">("hire");
  const [filter, setFilter] = useState<"all" | "hire" | "offer" | "urgent">("all");
  const [form, setForm] = useState({
    title: "", description: "", skill: "Elektriker", people_count: 1,
    start_date: "", duration: "", location: "", rate: "", urgent: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchAds = async () => {
    const { data, error } = await supabase
      .from("ads")
      .select("*, profiles(company_name, avatar_url)")
      .order("created_at", { ascending: false });
    if (error) { console.error(error); }
    else { setAds((data as unknown as Ad[]) || []); }
    setLoading(false);
  };

  useEffect(() => { fetchAds(); }, []);

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.start_date.trim() || !form.duration.trim() || !form.location.trim()) {
      toast.error("Fyll i alla obligatoriska fält");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("ads").insert({
      user_id: user!.id,
      type: adType,
      urgent: form.urgent,
      title: form.title,
      description: form.description || null,
      skill: form.skill,
      people_count: form.people_count,
      start_date: form.start_date,
      duration: form.duration,
      location: form.location,
      rate: form.rate || null,
    });
    setSubmitting(false);
    if (error) { toast.error("Kunde inte publicera annons"); console.error(error); }
    else {
      toast.success("Annons publicerad!");
      setShowModal(false);
      setForm({ title: "", description: "", skill: "Elektriker", people_count: 1, start_date: "", duration: "", location: "", rate: "", urgent: false });
      fetchAds();
    }
  };

  const handleDelete = async (adId: string) => {
    const { error } = await supabase.from("ads").delete().eq("id", adId);
    if (error) toast.error("Kunde inte radera");
    else { toast.success("Annons raderad"); fetchAds(); }
  };

  const filtered = ads.filter(a => {
    if (filter === "hire") return a.type === "hire";
    if (filter === "offer") return a.type === "offer";
    if (filter === "urgent") return a.urgent;
    return true;
  });

  return (
    <div className="max-w-[960px] mx-auto">
      <div className="flex items-start justify-between flex-wrap gap-3.5 mb-5">
        <div>
          <h2 className="font-display text-[26px] font-semibold mb-1">Hyr in & hyr ut personal</h2>
          <p className="text-muted-foreground text-[15px]">Behöver ni extra folk? Eller har ni lediga killar? Annonsera direkt.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-gold text-hero px-6 py-3 text-[13px] font-bold uppercase tracking-wider hover:bg-gold-shine transition-all whitespace-nowrap">
          + Lägg ut annons
        </button>
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {([["all", "Alla annonser"], ["hire", "🟢 Söker personal"], ["offer", "🔵 Erbjuder personal"], ["urgent", "🔴 Akut"]] as const).map(([f, label]) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-sm px-4 py-2 text-[13px] font-semibold transition-all ${filter === f ? "bg-foreground text-primary-foreground" : "bg-transparent text-mid border-[1.5px] border-border"}`}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Laddar annonser...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded p-8 text-center">
          <p className="text-muted-foreground text-sm">Inga annonser än. Var först med att lägga ut en!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(a => {
            const icon = SKILL_ICONS[a.skill] || "✨";
            const bg = SKILL_BG[a.skill] || "#FEF0E8";
            const companyName = a.profiles?.company_name || "Okänt företag";
            const isOwn = a.user_id === user?.id;
            return (
              <div key={a.id} className="bg-card border border-border rounded p-5 flex gap-4 items-start hover:shadow-lg hover:border-border/70 transition-all flex-col md:flex-row">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: bg }}>{icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-sm">{companyName}</span>
                    <span className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[11px] font-bold ${a.type === "hire" ? "bg-green-bg text-green" : "bg-blue-bg text-blue"}`}>
                      {a.type === "hire" ? "🟢 Söker personal" : "🔵 Erbjuder personal"}
                    </span>
                    {a.urgent && <span className="inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[11px] font-bold bg-destructive/10 text-destructive">🔴 Akut</span>}
                  </div>
                  <div className="text-[13px] text-mid mb-2 leading-relaxed">
                    <strong>{a.title}</strong><br />
                    {a.description && <span className="text-muted-foreground text-xs">{a.description}</span>}
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {[`👥 ${a.people_count} pers.`, `🔧 ${a.skill}`, `📅 ${a.start_date}`, `📍 ${a.location}`, a.rate ? `💰 ${a.rate}` : null].filter(Boolean).map((c, j) => (
                      <span key={j} className="inline-flex items-center gap-1 bg-cream rounded-sm px-2.5 py-0.5 text-xs text-mid font-medium">{c}</span>
                    ))}
                  </div>
                </div>
                <div className="flex md:flex-col gap-2 flex-shrink-0">
                  {!isOwn && (
                    <button onClick={() => onStartConversation?.(a.user_id)} className="bg-orange text-card px-4 py-2 rounded-sm text-[13px] font-semibold hover:bg-rust transition-all">Kontakta →</button>
                  )}
                  {isOwn && (
                    <button onClick={() => handleDelete(a.id)} className="bg-transparent text-destructive border-[1.5px] border-destructive/30 px-4 py-2 rounded-sm text-[13px] font-medium hover:bg-destructive/10 transition-all">Radera</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-foreground/50 z-[500] flex items-center justify-center p-5 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-background border-t-4 border-rust p-9 max-w-[520px] w-full max-h-[90vh] overflow-y-auto animate-fade-up relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 bg-border w-8 h-8 rounded-full flex items-center justify-center text-lg hover:bg-border/80">×</button>
            <h2 className="font-display text-2xl font-semibold mb-1.5">Lägg ut annons</h2>
            <p className="text-mid text-sm mb-5 leading-relaxed">Berätta vad ni behöver eller erbjuder.</p>
            <div className="flex gap-2.5 mb-5">
              {([
                { type: "hire" as const, icon: "🙋", title: "Vi söker personal", sub: "Behöver inhyrd kraft" },
                { type: "offer" as const, icon: "🤝", title: "Vi erbjuder personal", sub: "Har lediga grabbar" },
              ]).map(t => (
                <div key={t.type} onClick={() => setAdType(t.type)}
                  className={`flex-1 p-3 rounded-xl border-2 cursor-pointer text-center transition-all ${adType === t.type ? "border-orange bg-orange-bg" : "border-border bg-warm hover:border-orange-shine"}`}>
                  <div className="text-xl mb-1">{t.icon}</div>
                  <div className="text-[13px] font-semibold">{t.title}</div>
                  <div className="text-[11px] text-muted-foreground">{t.sub}</div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold mb-1.5">Rubrik *</label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="t.ex. Söker 3 elektriker för ROT-renovering" className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.urgent} onChange={e => setForm(f => ({ ...f, urgent: e.target.checked }))} id="urgent" />
                <label htmlFor="urgent" className="text-[13px] font-semibold text-destructive">🔴 Markera som akut</label>
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[13px] font-semibold mb-1.5">Antal personer</label>
                  <input type="number" value={form.people_count} onChange={e => setForm(f => ({ ...f, people_count: parseInt(e.target.value) || 1 }))} className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold mb-1.5">Yrkeskompetens</label>
                  <select value={form.skill} onChange={e => setForm(f => ({ ...f, skill: e.target.value }))} className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all">
                    <option>Elektriker</option><option>VVS/Rörmokare</option><option>Snickare</option><option>Målare</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <div><label className="block text-[13px] font-semibold mb-1.5">Startdatum *</label><input type="text" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} placeholder="t.ex. Måndag 24 mars" className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all" /></div>
                <div><label className="block text-[13px] font-semibold mb-1.5">Varaktighet *</label><input type="text" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="t.ex. 3 veckor" className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all" /></div>
              </div>
              <div><label className="block text-[13px] font-semibold mb-1.5">Plats / stad *</label><input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="t.ex. Stockholm, Kista" className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all" /></div>
              <div><label className="block text-[13px] font-semibold mb-1.5">Pris / dagsrate</label><input type="text" value={form.rate} onChange={e => setForm(f => ({ ...f, rate: e.target.value }))} placeholder="t.ex. 2 800 kr/dag" className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all" /></div>
              <div><label className="block text-[13px] font-semibold mb-1.5">Beskrivning</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Vad ska göras?" className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all resize-vertical min-h-[88px]" /></div>
            </div>
            <button onClick={handleSubmit} disabled={submitting} className="w-full mt-5 bg-hero text-primary-foreground py-3.5 text-[13px] font-bold uppercase tracking-wider hover:bg-rust transition-all disabled:opacity-50">
              {submitting ? "Publicerar..." : "Publicera annons →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortalBoard;
