"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface NotificationItem {
  id: string;
  type: "message" | "offre" | "febba" | "candidature";
  titre: string;
  expediteur: string;
  contenu: string;
  date: string;
  nonLu: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    type: "message",
    titre: "Nouveau message direct",
    expediteur: "AS Douanes Basket",
    contenu: "Bonjour ! Nous avons analysé votre profil et nous souhaitons vous inviter à un essai à Ouagadougou.",
    date: "Il y a 10 min",
    nonLu: true,
  },
  {
    id: "notif-2",
    type: "febba",
    titre: "Alerte de Validation FEBBA",
    expediteur: "Comité Fédéral FEBBA",
    contenu: "Votre dossier d'homologation de club a été mis à jour par l'administrateur.",
    date: "Il y a 45 min",
    nonLu: true,
  },
  {
    id: "notif-3",
    type: "offre",
    titre: "Nouvelle Offre de Recrutement",
    expediteur: "Étoile Filante",
    contenu: "Offre publiée : Recherche Pivot d'expérience pour la saison 2026/27.",
    date: "Hier à 16:20",
    nonLu: false,
  },
  {
    id: "notif-4",
    type: "candidature",
    titre: "Mise à jour de Candidature",
    expediteur: "USFA Basket",
    contenu: "Votre candidature pour le poste d'Ailier Fort a été consultée par le staff technique.",
    date: "Il y a 2 jours",
    nonLu: false,
  },
];

export default function NotificationsPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<"tous" | "message" | "offre" | "febba">("tous");
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [sentReplies, setSentReplies] = useState<{ [key: string]: boolean }>({});

  const filtered = notifications.filter((n) => filter === "tous" || n.type === filter);

  const handleSendReply = (id: string, expediteur: string) => {
    if (!replyText[id]?.trim()) return;

    setSentReplies((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, nonLu: false } : n)));
    }, 500);
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, nonLu: false })));
  };

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-10 py-12 min-h-screen">
      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 mb-3">
            Centre d'Alertes & Messages Directs
          </div>
          <h1 className="section-title mb-2">Notifications & Messagerie</h1>
          <p className="text-foreground/60 font-medium">
            Toutes vos alertes directes, messages de clubs et notifications officielles FEBBA.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={markAllRead}
            className="px-4 py-2 rounded-xl bg-card border border-card-border hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-black text-foreground/70 transition-colors"
          >
            Tout marquer comme lu
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-card-border mb-8 overflow-x-auto gap-2">
        {[
          { id: "tous", label: "Toutes les Alertes", badge: notifications.filter((n) => n.nonLu).length },
          { id: "message", label: "Messages Directs", badge: notifications.filter((n) => n.type === "message" && n.nonLu).length },
          { id: "offre", label: "Offres & Candidatures", badge: null },
          { id: "febba", label: "Alertes FEBBA", badge: null },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`pb-4 px-5 text-sm font-black transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              filter === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-foreground/50 hover:text-foreground hover:border-gray-300"
            }`}
          >
            {tab.label}
            {tab.badge !== null && tab.badge > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-black">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="card p-12 text-center text-foreground/40 font-semibold">
            Aucune notification dans cette catégorie.
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              className={`card p-6 transition-all duration-200 hover:shadow-lg ${
                n.nonLu ? "border-primary/40 bg-primary/5" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                      n.type === "message"
                        ? "bg-accent/10 text-accent"
                        : n.type === "febba"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {n.type === "message" ? "💬" : n.type === "febba" ? "🛡️" : "🏀"}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-base">{n.titre}</span>
                      {n.nonLu && (
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-primary mb-2">De : {n.expediteur}</div>
                    <p className="text-sm text-foreground/80 font-medium leading-relaxed max-w-2xl">
                      {n.contenu}
                    </p>
                    <div className="text-[11px] font-semibold text-foreground/40 mt-3">{n.date}</div>
                  </div>
                </div>
              </div>

              {/* Interactive Quick Reply for Message Notifications */}
              {n.type === "message" && (
                <div className="mt-5 pt-4 border-t border-card-border flex flex-col gap-3">
                  {sentReplies[n.id] ? (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                      ✓ Votre réponse a été envoyée directement à {n.expediteur}.
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`Répondre directement à ${n.expediteur}...`}
                        value={replyText[n.id] || ""}
                        onChange={(e) => setReplyText({ ...replyText, [n.id]: e.target.value })}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                      <button
                        onClick={() => handleSendReply(n.id, n.expediteur)}
                        disabled={!replyText[n.id]?.trim()}
                        className="px-4 py-2.5 rounded-xl bg-primary text-white font-black text-xs hover:bg-primary-hover transition-colors disabled:opacity-50"
                      >
                        Envoyer
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
