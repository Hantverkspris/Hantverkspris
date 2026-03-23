import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PortalBoard from "@/components/portal/PortalBoard";
import PortalPrices from "@/components/portal/PortalPrices";
import PortalRequests from "@/components/portal/PortalRequests";
import PortalMessages from "@/components/portal/PortalMessages";
import PortalSettings from "@/components/portal/PortalSettings";

const tabs = [
  { id: "board", label: "📋 Personalannonsering" },
  { id: "prices", label: "💰 Mina priser" },
  { id: "requests", label: "📩 Kundförfrågningar" },
  { id: "messages", label: "💬 Meddelanden" },
  { id: "settings", label: "⚙️ Inställningar" },
];

const Portal = () => {
  const [activeTab, setActiveTab] = useState("board");
  const [messageTarget, setMessageTarget] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ company_name: string; avatar_url: string | null } | null>(null);
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("company_name, avatar_url").eq("user_id", user.id).single()
      .then(({ data }) => { if (data) setProfile(data); });
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F2EBE0" }}>
        <p className="text-mid">Laddar...</p>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleStartConversation = (userId: string) => {
    setMessageTarget(userId);
    setActiveTab("messages");
  };

  return (
    <div className="min-h-screen" style={{ background: "#F2EBE0" }}>
      <div className="bg-background border-b-[3px] border-hero px-6 md:px-9 py-3 flex items-center justify-between flex-wrap gap-2.5">
        <div className="flex items-center gap-3.5">
          <div className="font-display text-lg font-bold cursor-pointer" onClick={() => navigate("/")}>
            Hantverks<span className="text-orange">pris</span>
          </div>
          <span className="text-[13px] text-muted-foreground">Företagsportal</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-orange-bg flex items-center justify-center text-sm overflow-hidden">
            {profile?.avatar_url ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" /> : "⚡"}
          </div>
          <span className="text-[13px] font-semibold">{profile?.company_name || user.email}</span>
          <button onClick={handleLogout} className="bg-transparent text-mid border-[1.5px] border-border rounded-sm px-4 py-2 text-[13px] font-medium hover:border-mid hover:text-foreground transition-all">
            Logga ut
          </button>
        </div>
      </div>

      <div className="bg-card border-b border-border flex overflow-x-auto px-4 md:px-9">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => { setActiveTab(t.id); if (t.id !== "messages") setMessageTarget(null); }}
            className={`px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-[2.5px] transition-all ${
              activeTab === t.id
                ? "text-rust border-rust font-semibold"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-6 md:p-9">
        {activeTab === "board" && <PortalBoard onStartConversation={handleStartConversation} />}
        {activeTab === "prices" && <PortalPrices />}
        {activeTab === "requests" && <PortalRequests />}
        {activeTab === "messages" && <PortalMessages targetUserId={messageTarget} />}
        {activeTab === "settings" && <PortalSettings />}
      </div>
    </div>
  );
};

export default Portal;
