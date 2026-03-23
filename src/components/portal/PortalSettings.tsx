import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const PortalSettings = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    email: "",
    phone: "",
    branch: "",
    avatar_url: "",
  });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (data) {
        setForm({
          company_name: data.company_name || "",
          email: data.email || "",
          phone: data.phone || "",
          branch: data.branch || "",
          avatar_url: data.avatar_url || "",
        });
      }
      setLoading(false);
    })();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        company_name: form.company_name,
        email: form.email,
        phone: form.phone || null,
        branch: form.branch || null,
        avatar_url: form.avatar_url || null,
      })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) toast.error("Kunde inte spara");
    else toast.success("Ändringar sparade!");
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Max 2MB"); return; }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (uploadError) { toast.error("Uppladdning misslyckades"); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    setForm(f => ({ ...f, avatar_url: publicUrl }));
    await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("user_id", user.id);
    setUploading(false);
    toast.success("Profilbild uppdaterad!");
  };

  if (loading) return <p className="text-muted-foreground text-sm">Laddar...</p>;

  return (
    <div className="max-w-[860px] mx-auto">
      <h2 className="font-display text-[26px] font-semibold mb-5">Företagsprofil</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Avatar */}
        <div className="bg-card border border-border rounded p-5 md:col-span-2 flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-orange-bg flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden border-2 border-border">
            {form.avatar_url ? (
              <img src={form.avatar_url} alt="Profilbild" className="w-full h-full object-cover" />
            ) : "🏢"}
          </div>
          <div>
            <div className="font-semibold text-[15px] mb-1">Profilbild</div>
            <div className="text-[13px] text-muted-foreground mb-2">Visas för andra företag och kunder</div>
            <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
              className="bg-orange text-card px-4 py-2 rounded-sm text-[13px] font-semibold hover:bg-rust transition-all disabled:opacity-50">
              {uploading ? "Laddar upp..." : "Byt profilbild"}
            </button>
          </div>
        </div>

        <div className="bg-card border border-border rounded p-5">
          <div className="font-semibold text-[15px] mb-1">Företagsinfo</div>
          <div className="text-[13px] text-muted-foreground mb-3">Visas för kunder och andra firmor</div>
          <div className="space-y-3">
            <div>
              <label className="block text-[13px] font-semibold mb-1.5">Företagsnamn</label>
              <input type="text" value={form.company_name} onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))}
                className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all" />
            </div>
            <div>
              <label className="block text-[13px] font-semibold mb-1.5">Bransch</label>
              <input type="text" value={form.branch} onChange={e => setForm(f => ({ ...f, branch: e.target.value }))} placeholder="t.ex. Elektriker"
                className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded p-5">
          <div className="font-semibold text-[15px] mb-1">Kontaktuppgifter</div>
          <div className="text-[13px] text-muted-foreground mb-3">Används för kundkontakt och firmor</div>
          <div className="space-y-3">
            <div>
              <label className="block text-[13px] font-semibold mb-1.5">E-post</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all" />
            </div>
            <div>
              <label className="block text-[13px] font-semibold mb-1.5">Telefon</label>
              <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="08-123 45 67"
                className="w-full px-4 py-3 border-[1.5px] border-border rounded bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all" />
            </div>
          </div>
        </div>
      </div>
      <button onClick={handleSave} disabled={saving}
        className="mt-3.5 bg-hero text-primary-foreground px-8 py-3.5 text-[13px] font-bold uppercase tracking-wider hover:bg-rust transition-all disabled:opacity-50">
        {saving ? "Sparar..." : "Spara ändringar ✓"}
      </button>
    </div>
  );
};

export default PortalSettings;
