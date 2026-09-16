"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { fetchFromBackend } from "@/lib/apiClient";

export default function MessagesPage() {
  const { data: session } = useSession();
  const [actifIdx, setActifIdx] = useState(0);
  const [input, setInput] = useState("");
  const [contacts, setContacts] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const actif = contacts[actifIdx];

  useEffect(() => {
      if (session?.user?.id) {
          fetchFromBackend(`/messages/contacts/${session.user.id}`)
              .then(data => {
                  setContacts(data);
                  setLoading(false);
                  if (data.length > 0) {
                      loadConversation(data[0].id);
                  }
              })
              .catch(err => {
                  console.error(err);
                  setLoading(false);
              });
      }
  }, [session]);

  const loadConversation = (contactId: string) => {
      if (session?.user?.id) {
          fetchFromBackend(`/messages/conversation?userId=${session.user.id}&contactId=${contactId}`)
              .then(data => setMessages(data))
              .catch(err => console.error(err));
      }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || !actif || !session?.user?.id) return;

    try {
        const msg = await fetchFromBackend("/messages", {
            method: "POST",
            body: JSON.stringify({
                expediteurId: session.user.id,
                destinataireId: actif.id,
                contenu: input.trim()
            })
        });
        setMessages([...messages, msg]);
        setInput("");
    } catch (err) {
        console.error(err);
    }
  };

  const handleSelectConvo = (i: number) => {
    setActifIdx(i);
    loadConversation(contacts[i].id);
  };

  const handleDeleteConvo = () => {
    // Non implémenté en backend pour l'instant
    alert("Suppression non implémentée.");
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-10 py-12">
      <div className="mb-8">
        <h1 className="section-title mb-2">Messagerie</h1>
        <p className="text-foreground/60 font-medium">Communiquez avec les clubs, entraîneurs et agents en temps réel.</p>
      </div>

      <div className="card overflow-hidden" style={{ height: "620px" }}>
        <div className="flex h-full">

          {/* Sidebar */}
          <div className="w-80 flex-shrink-0 border-r border-card-border flex flex-col bg-gray-50/50 dark:bg-gray-900/10">
            <div className="p-4 border-b border-card-border">
              <input
                type="text"
                placeholder="Rechercher une conversation..."
                className="w-full px-4 py-2.5 rounded-full bg-white dark:bg-gray-800 border border-card-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                 <div className="p-6 text-center text-sm text-foreground/40 font-medium">Chargement...</div>
              ) : contacts.length === 0 ? (
                <div className="p-6 text-center text-sm text-foreground/40 font-medium">Aucun contact</div>
              ) : (
                contacts.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectConvo(i)}
                    className={`w-full flex items-center gap-4 px-4 py-3 border-b border-card-border transition-colors text-left ${
                      actifIdx === i ? "bg-primary/5" : "hover:bg-gray-100 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-orange-300 flex items-center justify-center text-white font-black flex-shrink-0 text-lg uppercase">
                      {c.nom ? c.nom.charAt(0) : "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-sm truncate text-foreground">{c.nom}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className={`text-xs truncate font-medium text-foreground/60`}>{c.role}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#EFEAE2] dark:bg-[#0B141A] relative">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: "url('https://static.whatsapp.net/rsrc.php/v3/yl/r/gi_DckOUM5a.png')" }}></div>
            
            {actif ? (
              <>
                {/* Header */}
                <div className="px-6 py-3 border-b border-card-border flex justify-between items-center bg-white dark:bg-gray-900 shadow-sm relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-300 flex items-center justify-center text-white font-black">
                      {actif.initiale}
                    </div>
                    <div>
                      <div className="font-black text-sm">{actif.nom}</div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-foreground/50">en ligne</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={handleDeleteConvo} className="p-2 text-foreground/40 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors" title="Supprimer la discussion">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {messages.map((m, i) => {
                const isMe = m.expediteur?.id === session?.user?.id;
                return (
                <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs sm:max-w-sm lg:max-w-md px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed ${
                      isMe
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-gray-100 dark:bg-gray-800 text-foreground rounded-bl-md"
                    }`}
                  >
                    {m.contenu}
                    <div className={`text-[10px] mt-1.5 ${isMe ? "text-white/60" : "text-foreground/40"}`}>
                      {new Date(m.dateEnvoi).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              )})}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="px-6 py-4 border-t border-card-border flex gap-3 flex-shrink-0 relative z-10 bg-white dark:bg-gray-900 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Écrire un message..."
                className="flex-1 px-4 py-3 rounded-full bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-card-border text-sm font-medium focus:outline-none focus:ring-0"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-md shadow-primary/30 hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 relative z-10">
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400 mb-6">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-xl font-black mb-2">FasoHoops Messagerie</h2>
              <p className="text-sm font-medium text-foreground/50 max-w-sm">
                Sélectionnez une conversation dans la liste de gauche pour lire et envoyer des messages.
              </p>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
