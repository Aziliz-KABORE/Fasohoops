"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { fetchFromBackend } from "@/lib/apiClient";

export default function ProfilPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSubscription, setActiveSubscription] = useState<any>(null);

  useEffect(() => {
    // Vérifier l'abonnement actif dans localStorage
    try {
      const storedSub = localStorage.getItem("fasohoops_active_subscription");
      if (storedSub) {
        setActiveSubscription(JSON.parse(storedSub));
      }
    } catch {
      // ignore
    }

    if (session?.user) {
      const userId = (session.user as any).id;
      if (userId) {
        fetchFromBackend(`/joueurs/${userId}`)
          .then((data) => {
            setProfile(data);
            setLoading(false);
          })
          .catch(() => {
            // Fallback : afficher les infos de la session
            setProfile({
              nom: session.user?.name?.split(" ").slice(1).join(" ") || session.user?.name || "Membre",
              prenom: session.user?.name?.split(" ")[0] || "",
              poste: "Ailier / Arrière",
              taille: 1.98,
              poids: 92,
              clubActuel: "Agent Libre",
              bio: "Passionné de basketball burkinabè, en quête d'opportunités en première division LNBB et compétitions régionales FEBBA.",
              photoUrl: session.user?.image,
              licenceNumero: "BF-LIC-" + Math.floor(1000 + Math.random() * 9000),
            });
            setLoading(false);
          });
      } else {
        setProfile({
          nom: session.user?.name || "Membre",
          prenom: "",
          poste: "Joueur Senior",
          taille: 1.95,
          poids: 88,
          clubActuel: "Agent Libre",
          bio: "Bienvenue sur mon profil FasoHoops !",
          photoUrl: session.user?.image,
          licenceNumero: "BF-LIC-EN-COURS",
        });
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/60 font-medium">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center card p-10 max-w-md mx-auto shadow-xl">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl mx-auto mb-4">
            🏀
          </div>
          <p className="text-2xl font-black mb-3">Accès réservé</p>
          <p className="text-foreground/60 text-sm mb-6">
            Connectez-vous pour accéder et gérer votre profil athlète ou encadrant.
          </p>
          <Link href="/connexion" className="btn-primary">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const displayName =
    profile.prenom && profile.nom
      ? `${profile.prenom} ${profile.nom}`.trim()
      : profile.nom || session.user?.name || "Membre FasoHoops";
  const photoUrl = profile.photoUrl || session.user?.image;
  const userRole = (session?.user as any)?.role || "JOUEUR";

  const videos = ["https://www.youtube.com/embed/ScMzIvxBSi4"];
  const photos = [
    "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80",
    "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=500&q=80",
    "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=500&q=80",
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
      {/* ────────── HEADER PROFIL MODERNE ────────── */}
      <div className="card overflow-hidden mb-8 border border-card-border shadow-xl">
        {/* Bannière Hero haute résolution avec dégradé athlétique */}
        <div className="relative h-48 sm:h-56 bg-gradient-to-r from-gray-950 via-gray-900 to-orange-950 overflow-hidden">
          {/* Motifs de terrain de basket stylisés */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ff6600_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="absolute top-4 right-4 flex gap-2">
            <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-black flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              FEBBA Officiel
            </span>
            {activeSubscription && (
              <span className="px-3 py-1 rounded-full bg-primary text-white text-xs font-black shadow-md uppercase">
                ⭐ {activeSubscription.plan}
              </span>
            )}
          </div>
        </div>

        {/* Corps du header avec Avatar décalé et Nom parfaitement lisible */}
        <div className="px-6 sm:px-10 pb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
            {/* Avatar avec cercle lumineux */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden ring-4 ring-white dark:ring-gray-900 shadow-2xl bg-gray-900 flex-shrink-0">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={displayName}
                  width={144}
                  height={144}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-primary to-amber-500 flex items-center justify-center text-4xl sm:text-5xl font-black text-white uppercase">
                  {displayName.charAt(0)}
                </div>
              )}
            </div>

            {/* Actions principales */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                href="/messages"
                className="btn-secondary flex-1 sm:flex-initial py-2.5 px-4 text-xs font-black text-center"
              >
                💬 Messagerie
              </Link>
              <Link
                href="/abonnements"
                className="btn-primary flex-1 sm:flex-initial py-2.5 px-5 text-xs font-black text-center shadow-md shadow-primary/20"
              >
                ⭐ Mettre en avant
              </Link>
            </div>
          </div>

          {/* Informations Nominatives avec contraste parfait */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
                {displayName}
              </h1>
              <span className="px-3 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-black uppercase">
                {userRole}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-bold">
                ✓ Profil Certifié
              </span>
            </div>

            <p className="text-foreground/70 font-semibold text-sm sm:text-base flex items-center gap-2">
              <span>{profile.poste || "Poste non spécifié"}</span>
              <span>•</span>
              <span className="text-primary font-bold">{profile.clubActuel || "Agent Libre"}</span>
              <span>•</span>
              <span className="text-foreground/50 text-xs">Licence: {profile.licenceNumero || "BF-2025"}</span>
            </p>

            {/* Badges attributs physiques */}
            <div className="flex flex-wrap gap-2.5 mt-3 pt-4 border-t border-card-border/80">
              {profile.taille && (
                <span className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800/80 text-foreground font-semibold text-xs flex items-center gap-1.5">
                  <span className="text-sm">📏</span>
                  <span>Taille : <strong>{profile.taille} m</strong></span>
                </span>
              )}
              {profile.poids && (
                <span className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800/80 text-foreground font-semibold text-xs flex items-center gap-1.5">
                  <span className="text-sm">⚖️</span>
                  <span>Poids : <strong>{profile.poids} kg</strong></span>
                </span>
              )}
              <span className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800/80 text-foreground font-semibold text-xs flex items-center gap-1.5">
                <span className="text-sm">📍</span>
                <span>Ville : <strong>Ouagadougou, BF</strong></span>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800/80 text-foreground font-semibold text-xs flex items-center gap-1.5">
                <span className="text-sm">🇧🇫</span>
                <span>Nationalité : <strong>Burkinabè</strong></span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ────────── CONTENU DU PROFIL (GRILLE) ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne gauche : Bio & Stats du joueur */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="card p-6">
            <h2 className="text-xs font-black uppercase tracking-widest text-foreground/50 mb-3">
              Biographie Sportive
            </h2>
            <p className="text-sm text-foreground/80 leading-relaxed font-medium">
              {profile.bio || "Aucune biographie renseignée pour le moment."}
            </p>
          </div>

          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-foreground/50">
                Moyennes Saison LNBB
              </h2>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                Saison 2024-2025
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { val: "18.4", label: "Points / match", icon: "🔥" },
                { val: "7.2", label: "Rebonds / match", icon: "🛡️" },
                { val: "3.1", label: "Passes décisives", icon: "🎯" },
                { val: "22.1", label: "Évaluation FIBA", icon: "⭐" },
              ].map((s) => (
                <div key={s.label} className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-card-border">
                  <div className="flex items-center gap-1.5 text-base mb-1">
                    <span>{s.icon}</span>
                    <span className="text-2xl font-black text-foreground">{s.val}</span>
                  </div>
                  <p className="text-[10px] uppercase font-bold text-foreground/50">{s.label}</p>
                </div>
              ))}
            </div>

            <Link
              href="/statistiques"
              className="block text-center mt-5 text-xs font-bold text-primary hover:underline"
            >
              Consulter la feuille de match complète →
            </Link>
          </div>
        </div>

        {/* Colonne droite : Portfolio, Vidéos & Photos */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="card p-6 sm:p-8">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
              <span>Highlights & Portfolio Média</span>
              <span className="text-xs font-normal text-foreground/50">(Vidéos & Photos d&apos;action)</span>
            </h2>

            {/* Vidéo Highlights */}
            <div className="mb-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-foreground/50 mb-3">
                Vidéo Récente (Mix Matchs & Détections)
              </h3>
              <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-lg" style={{ paddingTop: "56.25%" }}>
                <iframe
                  src={videos[0]}
                  title="Vidéo Highlights Basket"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                ></iframe>
              </div>
            </div>

            {/* Photos de match */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-foreground/50 mb-3">
                Galerie en Match Officiel
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {photos.map((photo, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 group shadow-sm border border-card-border">
                    <img
                      src={photo}
                      alt={`Action basket ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 text-white text-xs font-bold">
                      Match LNBB #{idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
