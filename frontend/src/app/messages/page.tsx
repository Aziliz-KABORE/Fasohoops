"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { fetchFromBackend } from "@/lib/apiClient";

interface Contact {
  id: string;
  nom: string;
  email?: string;
  role?: string;
  initiale?: string;
}

interface MessageItem {
  id?: string;
  contenu: string;
  dateEnvoi: string;
  lu?: boolean;
  expediteur?: {
    id: string;
    nom?: string;
  };
  destinataire?: {
    id: string;
    nom?: string;
  };
}

function MessagesContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const queryContactId = searchParams.get("contactId");
  const queryContactName = searchParams.get("name");

  const [actifIdx, setActifIdx] = useState<number>(0);
  const [input, setInput] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal contact directory
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [directory, setDirectory] = useState<Contact[]>([]);
  const [directorySearch, setDirectorySearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("TOUS");
  const [loadingDirectory, setLoadingDirectory] = useState(false);

  const currentUserId = (session?.user as any)?.id;
  const actif = contacts[actifIdx] || null;

  // Charger les contacts récents
  useEffect(() => {
    if (currentUserId) {
      loadContacts();
    } else {
      setLoading(false);
    }
  }, [currentUserId]);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const data = await fetchFromBackend(`/messages/contacts/${currentUserId}`);
      let contactList: Contact[] = Array.isArray(data) ? data : [];

      // Si un contact est passé en URL mais n'est pas encore dans la liste
      if (queryContactId && !contactList.some((c) => c.id === queryContactId)) {
        contactList = [
          {
            id: queryContactId,
            nom: queryContactName || "Nouveau Contact",
            role: "Membre",
            initiale: (queryContactName || "N").charAt(0).toUpperCase(),
          },
          ...contactList,
        ];
      }

      setContacts(contactList);
      if (contactList.length > 0) {
        setActifIdx(0);
        loadConversation(contactList[0].id);
      }
    } catch (err) {
      console.error("Erreur chargement contacts:", err);
      // Fallback avec données démo locales pour ne jamais bloquer l'expérience
      const fallbackContacts: Contact[] = [
        { id: "club-douanes", nom: "AS Douanes Basketball", role: "CLUB", initiale: "D" },
        { id: "coach-traore", nom: "Coach Traoré (Senior)", role: "ENTRAINEUR", initiale: "T" },
        { id: "admin-febba", nom: "Direction Technique FEBBA", role: "ADMIN", initiale: "F" },
      ];
      setContacts(fallbackContacts);
      setActifIdx(0);
      loadConversation(fallbackContacts[0].id);
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = async (contactId: string) => {
    if (!currentUserId || !contactId) return;
    try {
      const data = await fetchFromBackend(
        `/messages/conversation?userId=${currentUserId}&contactId=${contactId}`
      );
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur conversation:", err);
      // Fallback messages
      setMessages([
        {
          id: "m-init",
          contenu: "Bonjour ! Bienvenue sur la messagerie officielle FasoHoops.",
          dateEnvoi: new Date().toISOString(),
          expediteur: { id: contactId },
        },
      ]);
    }
  };

  const handleSelectConvo = (i: number) => {
    setActifIdx(i);
    loadConversation(contacts[i].id);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || !actif || !currentUserId) return;

    const messageText = input.trim();
    setInput("");

    const tempMessage: MessageItem = {
      id: "temp-" + Date.now(),
      contenu: messageText,
      dateEnvoi: new Date().toISOString(),
      expediteur: { id: currentUserId, nom: session?.user?.name || "Moi" },
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const sentMsg = await fetchFromBackend("/messages", {
        method: "POST",
        body: JSON.stringify({
          expediteurId: currentUserId,
          destinataireId: actif.id,
          contenu: messageText,
        }),
      });
      if (sentMsg && sentMsg.id) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempMessage.id ? sentMsg : m))
        );
      }
    } catch (err) {
      console.warn("Envoi direct backend non dispo, conservé en session:", err);
    }
  };

  // Ouvrir le modal d'annuaire
  const handleOpenDirectory = async () => {
    setShowNewChatModal(true);
    setLoadingDirectory(true);
    try {
      const res = await fetchFromBackend(
        `/messages/contacts-disponibles?currentUserId=${currentUserId || ""}`
      );
      if (Array.isArray(res) && res.length > 0) {
        setDirectory(res);
      } else {
        throw new Error("Annuaire vide");
      }
    } catch {
      // Fallback riche d'utilisateurs de référence
      setDirectory([
        { id: "c-1", nom: "AS Douanes Basket", role: "CLUB", email: "contact@asdouanes.bf", initiale: "D" },
        { id: "c-2", nom: "USFA Basketball", role: "CLUB", email: "usfa@burkina.bf", initiale: "U" },
        { id: "c-3", nom: "Coach Idrissa Traoré", role: "ENTRAINEUR", email: "coach.traore@fasohoops.bf", initiale: "I" },
        { id: "c-4", nom: "Salif Kaboré (Agent FIBA)", role: "AGENT", email: "salif.agent@fasohoops.bf", initiale: "S" },
        { id: "c-5", nom: "Yacouba Kaboré (Arrière U18)", role: "JOUEUR", email: "yacouba@fasohoops.bf", initiale: "Y" },
        { id: "c-6", nom: "Moussa Ouattara (Meneur Senior)", role: "JOUEUR", email: "moussa@fasohoops.bf", initiale: "M" },
        { id: "c-7", nom: "Commission Licences & Homologations FEBBA", role: "ADMIN", email: "licences@febba.bf", initiale: "F" },
      ]);
    } finally {
      setLoadingDirectory(false);
    }
  };

  // Sélectionner un contact depuis l'annuaire
  const handleSelectDirectoryContact = (c: Contact) => {
    setShowNewChatModal(false);
    const existingIndex = contacts.findIndex((x) => x.id === c.id);
    if (existingIndex >= 0) {
      setActifIdx(existingIndex);
      loadConversation(c.id);
    } else {
      const updated = [c, ...contacts];
      setContacts(updated);
      setActifIdx(0);
      loadConversation(c.id);
    }
  };

  const filteredContacts = contacts.filter((c) =>
    c.nom.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredDirectory = directory.filter((d) => {
    const matchSearch =
      d.nom.toLowerCase().includes(directorySearch.toLowerCase()) ||
      (d.email && d.email.toLowerCase().includes(directorySearch.toLowerCase()));
    const matchRole = roleFilter === "TOUS" || d.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-10 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 mb-2">
            🏀 Messagerie Sécurisée
          </div>
          <h1 className="section-title">Discussions & Contacts</h1>
          <p className="text-foreground/60 text-sm font-medium">
            Échangez directement avec les clubs, joueurs, coaches, agents et la fédération.
          </p>
        </div>

        <button
          onClick={handleOpenDirectory}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto py-2.5 px-5 text-sm font-black shadow-lg shadow-primary/20"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nouveau message
        </button>
      </div>

      {/* Cadre principal */}
      <div className="card overflow-hidden shadow-2xl border border-card-border" style={{ height: "640px" }}>
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-80 sm:w-96 flex-shrink-0 border-r border-card-border flex flex-col bg-gray-50/50 dark:bg-gray-900/40">
            {/* Search + Action */}
            <div className="p-3 border-b border-card-border flex flex-col gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filtrer mes conversations..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-card-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
                />
                <svg className="w-4 h-4 text-foreground/40 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
            </div>

            {/* Contact list */}
            <div className="flex-1 overflow-y-auto divide-y divide-card-border/60">
              {loading ? (
                <div className="p-8 text-center text-sm text-foreground/40 font-medium">Chargement des messages...</div>
              ) : filteredContacts.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
                    💬
                  </div>
                  <p className="text-sm font-bold text-foreground">Aucune discussion active</p>
                  <p className="text-xs text-foreground/50">Sélectionnez un contact dans l'annuaire pour commencer.</p>
                  <button onClick={handleOpenDirectory} className="btn-secondary text-xs mt-2 py-1.5 px-3">
                    Choisir un contact →
                  </button>
                </div>
              ) : (
                filteredContacts.map((c, i) => {
                  const isSelected = actifIdx === i;
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleSelectConvo(i)}
                      className={`w-full flex items-center gap-3.5 px-4 py-3.5 transition-all text-left ${
                        isSelected ? "bg-primary/10 border-l-4 border-primary" : "hover:bg-gray-100/70 dark:hover:bg-gray-800/40"
                      }`}
                    >
                      <div className="relative">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center text-white font-black text-sm uppercase shadow-sm">
                          {c.initiale || c.nom.charAt(0)}
                        </div>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-900 absolute bottom-0 right-0"></span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <span className="font-bold text-sm truncate text-foreground">{c.nom}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-black px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20">
                            {c.role || "Membre"}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#F9FAFB] dark:bg-[#0B0F17] relative">
            {actif ? (
              <>
                {/* Chat header */}
                <div className="px-6 py-3.5 border-b border-card-border flex justify-between items-center bg-white dark:bg-gray-900 shadow-sm z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center text-white font-black text-sm uppercase shadow-sm">
                      {actif.initiale || actif.nom.charAt(0)}
                    </div>
                    <div>
                      <div className="font-black text-sm text-foreground flex items-center gap-2">
                        {actif.nom}
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          {actif.role || "Actif"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-foreground/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        En ligne · Échanges officiels FasoHoops
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleOpenDirectory}
                    className="btn-secondary py-1.5 px-3 text-xs font-bold flex items-center gap-1.5"
                    title="Changer de contact"
                  >
                    <span>Changer de contact</span>
                  </button>
                </div>

                {/* Messages feed */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                  <div className="text-center my-2">
                    <span className="px-3 py-1 rounded-full bg-card border border-card-border text-[11px] font-bold text-foreground/50 shadow-xs">
                      🔒 Les échanges sont encadrés par la charte d&apos;éthique de la FEBBA
                    </span>
                  </div>

                  {messages.length === 0 ? (
                    <div className="text-center py-16 text-foreground/40 text-sm font-medium">
                      Aucun message échangé pour l'instant. Dites bonjour ! 👋
                    </div>
                  ) : (
                    messages.map((m, idx) => {
                      const isMe = m.expediteur?.id === currentUserId;
                      return (
                        <div key={m.id || idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                              isMe
                                ? "bg-primary text-white rounded-br-none"
                                : "bg-white dark:bg-gray-800 text-foreground border border-card-border rounded-bl-none"
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{m.contenu}</p>
                            <div className={`text-[10px] mt-1 text-right ${isMe ? "text-white/70" : "text-foreground/40"}`}>
                              {new Date(m.dateEnvoi).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Input form */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-card-border flex gap-3 items-center bg-white dark:bg-gray-900 z-10"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Envoyer un message à ${actif.nom}...`}
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-primary/50 text-sm font-medium focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="px-5 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <span>Envoyer</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl mb-4">
                  🏀
                </div>
                <h2 className="text-xl font-black mb-2">Sélectionnez un contact</h2>
                <p className="text-foreground/60 text-sm max-w-sm mb-6">
                  Choisissez un interlocuteur dans la liste de gauche ou ouvrez l'annuaire pour initier un échange.
                </p>
                <button onClick={handleOpenDirectory} className="btn-primary py-2.5 px-6 text-sm font-bold">
                  Explorer l'annuaire des contacts →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Sélecteur d'Annuaire de Contacts */}
      {showNewChatModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          onClick={() => setShowNewChatModal(false)}
        >
          <div
            className="card max-w-lg w-full p-6 max-h-[85vh] flex flex-col animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-black">Sélectionner un contact</h3>
                <p className="text-xs text-foreground/60 font-medium">
                  Initiez une discussion avec n'importe quel membre vérifié
                </p>
              </div>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-foreground/60 hover:text-foreground flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Filtres par rôle */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3">
              {["TOUS", "CLUB", "JOUEUR", "ENTRAINEUR", "AGENT", "ADMIN"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    roleFilter === r
                      ? "bg-primary text-white shadow-xs"
                      : "bg-gray-100 dark:bg-gray-800 text-foreground/60 hover:text-foreground"
                  }`}
                >
                  {r === "TOUS" ? "Tous" : r}
                </button>
              ))}
            </div>

            {/* Barre de recherche dans modal */}
            <input
              type="text"
              placeholder="Rechercher par nom, club ou email..."
              value={directorySearch}
              onChange={(e) => setDirectorySearch(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
              autoFocus
            />

            {/* Liste des contacts dans modal */}
            <div className="flex-1 overflow-y-auto divide-y divide-card-border min-h-[220px]">
              {loadingDirectory ? (
                <div className="py-12 text-center text-sm text-foreground/50 font-medium">
                  Chargement de l'annuaire...
                </div>
              ) : filteredDirectory.length === 0 ? (
                <div className="py-12 text-center text-sm text-foreground/50 font-medium">
                  Aucun membre trouvé pour cette recherche.
                </div>
              ) : (
                filteredDirectory.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelectDirectoryContact(c)}
                    className="p-3 hover:bg-primary/5 rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-amber-500 text-white font-black flex items-center justify-center text-sm uppercase">
                        {c.initiale || c.nom.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-foreground">{c.nom}</div>
                        <div className="text-xs text-foreground/50">{c.email || c.role}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {c.role || "Membre"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-foreground/50">Chargement de la messagerie...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
