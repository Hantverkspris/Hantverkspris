import { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Conversation {
  id: string;
  otherUserId: string;
  otherCompanyName: string;
  otherAvatarUrl: string | null;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface CompanyResult {
  user_id: string;
  company_name: string;
  avatar_url: string | null;
  branch: string | null;
}

const PortalMessages = ({ targetUserId }: { targetUserId?: string | null }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CompanyResult[]>([]);
  const [searching, setSearching] = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    const { data: participations } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", user.id);

    if (!participations?.length) { setLoading(false); return; }

    const convIds = participations.map(p => p.conversation_id);

    const { data: allParticipants } = await supabase
      .from("conversation_participants")
      .select("conversation_id, user_id")
      .in("conversation_id", convIds);

    const otherUserIds = [...new Set(allParticipants?.filter(p => p.user_id !== user.id).map(p => p.user_id) || [])];
    
    const { data: profiles } = otherUserIds.length > 0
      ? await supabase.from("profiles").select("user_id, company_name, avatar_url").in("user_id", otherUserIds)
      : { data: [] };

    const { data: lastMessages } = await supabase
      .from("messages")
      .select("conversation_id, content, created_at")
      .in("conversation_id", convIds)
      .order("created_at", { ascending: false });

    const convs: Conversation[] = convIds.map(cid => {
      const other = allParticipants?.find(p => p.conversation_id === cid && p.user_id !== user.id);
      const lastMsg = lastMessages?.find(m => m.conversation_id === cid);
      const profile = profiles?.find(p => p.user_id === other?.user_id);
      return {
        id: cid,
        otherUserId: other?.user_id || "",
        otherCompanyName: profile?.company_name || "Okänt företag",
        otherAvatarUrl: profile?.avatar_url || null,
        lastMessage: lastMsg?.content || "Inga meddelanden ännu",
        lastMessageTime: lastMsg?.created_at ? new Date(lastMsg.created_at).toLocaleDateString("sv-SE", { day: "numeric", month: "short" }) : "",
        unreadCount: 0,
      };
    });

    setConversations(convs);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  // Search companies
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) { setSearchResults([]); return; }
    setSearching(true);
    const { data } = await supabase
      .from("profiles")
      .select("user_id, company_name, avatar_url, branch")
      .neq("user_id", user?.id || "")
      .ilike("company_name", `%${query.trim()}%`)
      .limit(8);
    setSearchResults((data as CompanyResult[]) || []);
    setSearching(false);
  };

  const startConversationWith = async (otherUserId: string) => {
    if (!user) return;
    const existing = conversations.find(c => c.otherUserId === otherUserId);
    if (existing) {
      setActiveConvId(existing.id);
      setSearchQuery("");
      setSearchResults([]);
      return;
    }
    const { data: conv, error: convError } = await supabase.from("conversations").insert({}).select().single();
    if (convError || !conv) { toast.error("Kunde inte starta konversation"); return; }
    await supabase.from("conversation_participants").insert([
      { conversation_id: conv.id, user_id: user.id },
      { conversation_id: conv.id, user_id: otherUserId },
    ]);
    await fetchConversations();
    setActiveConvId(conv.id);
    setSearchQuery("");
    setSearchResults([]);
  };

  // Start conversation with target user if provided
  useEffect(() => {
    if (!targetUserId || !user || loading) return;
    startConversationWith(targetUserId);
  }, [targetUserId, user, loading]);

  // Fetch messages for active conversation
  useEffect(() => {
    if (!activeConvId) return;
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", activeConvId)
        .order("created_at", { ascending: true });
      setMessages(data || []);
    };
    fetchMessages();

    const channel = supabase
      .channel(`messages-${activeConvId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${activeConvId}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeConvId]);

  useEffect(() => {
    msgsRef.current?.scrollTo(0, msgsRef.current.scrollHeight);
  }, [messages]);

  const sendMsg = async () => {
    if (!input.trim() || !activeConvId || !user) return;
    const content = input.trim();
    setInput("");
    const { error } = await supabase.from("messages").insert({
      conversation_id: activeConvId,
      sender_id: user.id,
      content,
    });
    if (error) { toast.error("Kunde inte skicka meddelande"); setInput(content); }
  };

  const activeConv = conversations.find(c => c.id === activeConvId);

  return (
    <div className="max-w-[860px] mx-auto">
      <h2 className="font-display text-[26px] font-semibold mb-4">Chatt med andra firmor</h2>
      {loading ? (
        <p className="text-muted-foreground text-sm">Laddar...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[230px_1fr] gap-3.5">
          <div>
            {/* Search for companies */}
            <div className="mb-3 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                placeholder="🔍 Sök företag…"
                className="w-full px-3 py-2 border-[1.5px] border-border rounded-sm bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all"
              />
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-card border border-border rounded shadow-lg z-10 mt-1 max-h-[200px] overflow-y-auto">
                  {searchResults.map(r => (
                    <button
                      key={r.user_id}
                      onClick={() => startConversationWith(r.user_id)}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-cream transition-all border-b border-border last:border-b-0"
                    >
                      <div className="w-7 h-7 rounded-full bg-orange-bg flex items-center justify-center text-xs flex-shrink-0 overflow-hidden">
                        {r.avatar_url ? <img src={r.avatar_url} alt="" className="w-full h-full object-cover" /> : "🏢"}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-foreground truncate">{r.company_name}</div>
                        {r.branch && <div className="text-[11px] text-muted-foreground">{r.branch}</div>}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {searching && <div className="absolute top-full left-0 right-0 bg-card border border-border rounded shadow-lg z-10 mt-1 p-3 text-xs text-muted-foreground">Söker...</div>}
            </div>

            <div className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-2.5">Konversationer</div>
            {conversations.length === 0 ? (
              <p className="text-xs text-muted-foreground">Inga konversationer än. Sök efter ett företag ovan för att starta en chatt!</p>
            ) : conversations.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveConvId(c.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded text-left mb-1 transition-all ${activeConvId === c.id ? "bg-cream" : "hover:bg-cream"}`}
              >
                <div className="w-8 h-8 rounded-full bg-orange-bg flex items-center justify-center text-sm flex-shrink-0 overflow-hidden">
                  {c.otherAvatarUrl ? <img src={c.otherAvatarUrl} alt="" className="w-full h-full object-cover" /> : "🏢"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-foreground">{c.otherCompanyName}</div>
                  <div className="text-xs text-muted-foreground truncate">{c.lastMessage}</div>
                </div>
              </button>
            ))}
          </div>
          <div className="bg-card border border-border rounded overflow-hidden">
            {activeConv ? (
              <>
                <div className="px-5 py-3.5 border-b border-border flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-orange-bg flex items-center justify-center text-[15px] overflow-hidden">
                    {activeConv.otherAvatarUrl ? <img src={activeConv.otherAvatarUrl} alt="" className="w-full h-full object-cover" /> : "🏢"}
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold">{activeConv.otherCompanyName}</div>
                  </div>
                </div>
                <div ref={msgsRef} className="h-[270px] overflow-y-auto p-4 flex flex-col gap-2.5">
                  {messages.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center mt-10">Skriv ett meddelande för att starta konversationen!</p>
                  ) : messages.map(m => {
                    const mine = m.sender_id === user?.id;
                    return (
                      <div key={m.id} className={`max-w-[75%] flex flex-col gap-0.5 ${mine ? "self-end items-end" : "self-start items-start"}`}>
                        <div className={`px-3.5 py-2.5 text-sm leading-relaxed ${mine ? "bg-orange text-card rounded-2xl rounded-br-sm" : "bg-cream text-foreground rounded-2xl rounded-bl-sm"}`}>
                          {m.content}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {new Date(m.created_at).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-2 p-3 border-t border-border">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMsg()}
                    placeholder="Skriv ett meddelande…"
                    className="flex-1 px-4 py-2.5 border-[1.5px] border-border rounded-sm bg-cream text-sm outline-none focus:border-orange focus:bg-card transition-all"
                  />
                  <button onClick={sendMsg} className="bg-orange border-none rounded-sm w-9 h-9 flex items-center justify-center text-card text-sm hover:bg-rust transition-all flex-shrink-0">
                    →
                  </button>
                </div>
              </>
            ) : (
              <div className="h-[340px] flex items-center justify-center text-muted-foreground text-sm">
                Välj en konversation eller sök efter ett företag
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortalMessages;
