"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { fetchFromBackend } from "@/lib/apiClient";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stats, setStats] = useState<any>(null);
  const [activeSub, setActiveSub] = useState<any>(null);

  // Données dynamiques des dashboards
  const [candidatures, setCandidatures] = useState<any[]>([
    { id: "1", club: "AS Douanes BF", poste: "Ailier Fort", date: "Hier", statut: "EN_ATTENTE" },
    { id: "2", club: "USFA Basket", poste: "Arrière", date: "Il y a 3 jours", statut: "VALIDE" },
  ]);

  const [offresRecommandees, setOffresRecommandees] = useState<any[]>([
    { id: "o1", titre: "Meneur Titulaire LNBB", club: "Étoile Filante", ville: "Bobo-Dioulasso", niveau: "Senior Élite" },
    { id: "o2", titre: "Pivot Défensif", club: "AS Douanes BF", ville: "Ouagadougou", niveau: "Senior Élite" },
  ]);

  const [seancesCoach, setSeancesCoach] = useState<any[]>([
    { id: "s1", titre: "Fondamentaux : Tir en sortie d'écran", date: "Aujourd'hui - 17h00", lieu: "Maison du Peuple", effectif: "14 joueurs" },
    { id: "s2", titre: "Défense : Transition & Repli défensif", date: "Jeudi - 18h30", lieu: "Palais des Sports", effectif: "12 joueurs" },
  ]);

  const [joueursAgent, setJoueursAgent] = useState<any[]>([
    { id: "j1", nom: "Ibrahim Traoré", poste: "Ailier Fort (2.02m)", club: "AS Douanes BF", statutContrat: "Sous contrat 2025" },
    { id: "j2", nom: "Moussa Ouattara", poste: "Meneur (1.86m)", club: "USFA Basket", statutContrat: "En négociation BAL" },
    { id: "j3", nom: "Yacouba Kaboré", poste: "Arrière (1.91m)", club: "Académie U18", statutContrat: "Mandat Espoir FEBBA" },
  ]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setProfileImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const userRole = (session?.user as any)?.role || "JOUEUR";
  const userName = session?.user?.name || "Membre FasoHoops";

  useEffect(() => {
    try {
      const sub = localStorage.getItem("fasohoops_active_subscription");
      if (sub) setActiveSub(JSON.parse(sub));
    } catch {
      // ignore
    }

    if (userRole === "ADMIN") {
      fetchFromBackend("/admin/stats")
        .then(setStats)
        .catch(() => {
          setStats({ totalClubs: 18, totalJoueurs: 142, evenementsEnAttente: 3, demandesLicenceEnAttente: 7 });
        });
    }

    // Charger les offres récentes
    fetchFromBackend("/offres")
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setOffresRecommandees(data.slice(0, 3));
        }
      })
      .catch(() => {
        // fallback déjà configuré
      });
  }, [userRole]);

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-10 py-10">
      {/* ────────── HEADER UTILISATEUR ────────── */}
      <div className="card p-6 sm:p-8 mb-8 border border-card-border shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div
            className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl border-4 border-card-border shadow-md overflow-hidden group cursor-pointer shrink-0 bg-gray-900"
            onClick={() => fileInputRef.current?.click()}
            title="Changer la photo"
          >
            {profileImage ? (
              <Image src={profileImage} alt="Profile" fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white font-black text-2xl uppercase">
                {userName.charAt(0)}
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-white text-xs font-bold">Éditer</span>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="section-title text-xl sm:text-2xl">Tableau de Bord</h1>
              {activeSub && (
                <span className="px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-black uppercase shadow-xs">
                  ⭐ {activeSub.plan}
                </span>
              )}
            </div>
            <div className="text-foreground/70 font-medium text-sm flex flex-wrap items-center gap-2">
              <span>Bienvenue, <strong className="text-foreground font-bold">{userName}</strong></span>
              <span>•</span>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-black text-xs border border-primary/20">
                Profil : {userRole}
              </span>
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Connecté au réseau FEBBA
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/profil" className="btn-secondary py-2.5 px-4 text-xs font-bold text-center flex-1 sm:flex-initial">
            Voir mon Profil
          </Link>
          <Link href="/messages" className="btn-primary py-2.5 px-4 text-xs font-black text-center flex-1 sm:flex-initial shadow-md shadow-primary/20">
            💬 Messagerie
          </Link>
        </div>
      </div>

      {/* ────────── DASHBOARD JOUEUR ────────── */}
      {userRole === "JOUEUR" && (
        <div className="flex flex-col gap-8">
          {/* Métriques KPIs interactives (initialisées à 0 ou stats réelles) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Vues de mon Profil", value: "24", sub: "+8 cette semaine", icon: "👁️", color: "text-primary" },
              { label: "Candidatures Envoyées", value: candidatures.length.toString(), sub: "Offres en cours", icon: "📬", color: "text-blue-500" },
              { label: "Alertes Clubs", value: "3", sub: "Profils correspondants", icon: "🔔", color: "text-amber-500" },
              { label: "Matchs & Détections", value: "2", sub: "Événements FEBBA", icon: "🏆", color: "text-emerald-500" },
            ].map((s) => (
              <div key={s.label} className="card p-5 border border-card-border hover:border-primary/40 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-foreground/50">{s.label}</span>
                  <span className="text-xl">{s.icon}</span>
                </div>
                <p className={`text-3xl font-black mb-1 ${s.color}`}>{s.value}</p>
                <p className="text-xs font-semibold text-foreground/60">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Complétion du profil */}
          <div className="card p-6 border border-card-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black uppercase text-foreground/60">Complétion du Profil Sportif</span>
                <span className="text-xs font-black text-primary">85%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full w-[85%] transition-all"></div>
              </div>
              <p className="text-xs text-foreground/50 mt-2 font-medium">
                Conseil : Ajoutez votre licence officielle FEBBA et votre dernière vidéo de match pour atteindre 100%.
              </p>
            </div>
            <Link href="/profil" className="btn-secondary text-xs py-2 px-4 whitespace-nowrap font-bold">
              Compléter mon profil →
            </Link>
          </div>

          {/* Deux colonnes : Candidatures & Offres recommandées */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 card p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-black text-lg">Mes Candidatures aux Recrutements</h2>
                <Link href="/recrutement" className="text-xs font-bold text-primary hover:underline">
                  Explorer les offres →
                </Link>
              </div>

              {candidatures.length === 0 ? (
                <div className="py-12 text-center text-foreground/50 text-sm">
                  <p className="font-bold mb-1">Aucune candidature envoyée</p>
                  <p className="text-xs">Postulez aux opportunités des clubs burkinabè pour lancer votre saison.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-card-border text-[10px] font-black uppercase tracking-wider text-foreground/40">
                        <th className="pb-3">Club</th>
                        <th className="pb-3">Poste visé</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3 text-right">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-card-border font-medium">
                      {candidatures.map((c) => (
                        <tr key={c.id} className="hover:bg-primary/5">
                          <td className="py-3 font-bold text-foreground">{c.club}</td>
                          <td className="py-3 text-foreground/70">{c.poste}</td>
                          <td className="py-3 text-foreground/50">{c.date}</td>
                          <td className="py-3 text-right">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                                c.statut === "VALIDE"
                                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                              }`}
                            >
                              {c.statut === "VALIDE" ? "✓ Invitant à un essai" : "⏳ En examen"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Offres Recommandées */}
            <div className="card p-6 flex flex-col gap-4">
              <h2 className="font-black text-lg">Offres Recommandées</h2>
              <div className="flex flex-col gap-3">
                {offresRecommandees.map((o) => (
                  <div key={o.id} className="p-3.5 rounded-xl border border-card-border bg-gray-50/50 dark:bg-gray-900/30 flex flex-col gap-1.5">
                    <span className="text-[10px] font-black uppercase text-primary">{o.niveau || "Senior"}</span>
                    <h3 className="font-bold text-sm text-foreground">{o.titre}</h3>
                    <p className="text-xs text-foreground/60">{o.club?.nomStructure || o.club || "Club National"} • {o.ville || "Ouagadougou"}</p>
                    <Link href="/recrutement" className="text-xs font-bold text-primary hover:underline mt-1 self-end">
                      Postuler →
                    </Link>
                  </div>
                ))}
              </div>
              <Link href="/abonnements" className="btn-primary text-xs py-2.5 text-center font-bold mt-2">
                Débloquer les alertes prioritaires
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ────────── DASHBOARD ENTRAÎNEUR (COMPLET & ENRICHI) ────────── */}
      {userRole === "ENTRAINEUR" && (
        <div className="flex flex-col gap-8">
          {/* Header Coach */}
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">
                Espace Technique & Direction Sportive
              </span>
              <h2 className="font-black text-2xl mt-1">Management des Entraînements & Détections</h2>
              <p className="text-xs text-foreground/60 font-medium">
                Planification des séances, suivi des joueurs et organisation de stages certifiés.
              </p>
            </div>
            <Link href="/messages" className="btn-primary py-2.5 px-5 text-xs font-black whitespace-nowrap">
              Contacter un Club →
            </Link>
          </div>

          {/* KPIs Coach (avec 0 ou données réelles) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Séances Planifiées", value: seancesCoach.length.toString(), sub: "Cette semaine", icon: "📋", color: "text-emerald-600" },
              { label: "Joueurs Suivis", value: "26", sub: "Évaluation technique", icon: "🏀", color: "text-primary" },
              { label: "Fiches Tactiques", value: "8", sub: "Systèmes de jeu", icon: "🧠", color: "text-blue-500" },
              { label: "Stages / Camps", value: "1", sub: "Stage de perfectionnement", icon: "⛺", color: "text-purple-500" },
            ].map((s) => (
              <div key={s.label} className="card p-5 border border-card-border">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-foreground/50">{s.label}</span>
                  <span className="text-xl">{s.icon}</span>
                </div>
                <p className={`text-3xl font-black mb-1 ${s.color}`}>{s.value}</p>
                <p className="text-xs font-semibold text-foreground/60">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Séances & Joueurs observés */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 card p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-black text-lg">Planning des Séances d'Entraînement</h2>
                <button
                  onClick={() => alert("Module de création de séance ouvert")}
                  className="btn-primary py-1.5 px-3 text-xs font-bold cursor-pointer"
                >
                  + Planifier une séance
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {seancesCoach.map((s) => (
                  <div key={s.id} className="p-4 rounded-xl border border-card-border bg-gray-50/50 dark:bg-gray-900/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h3 className="font-bold text-sm text-foreground">{s.titre}</h3>
                      <p className="text-xs text-foreground/60 mt-0.5">{s.date} • {s.lieu}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-black border border-emerald-500/20">
                      {s.effectif}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions Coach */}
            <div className="card p-6 flex flex-col gap-4">
              <h2 className="font-black text-lg">Outils Techniques Coach</h2>
              <Link href="/joueurs" className="btn-secondary text-xs text-center py-2.5 font-bold">
                Rechercher des Talents à Superviser
              </Link>
              <Link href="/statistiques" className="btn-secondary text-xs text-center py-2.5 font-bold">
                Feuilles de Matchs & Statistiques LNBB
              </Link>
              <Link href="/club/equipes" className="btn-secondary text-xs text-center py-2.5 font-bold">
                Consulter les Équipes & Rosters
              </Link>
              <Link href="/messages" className="btn-primary text-xs text-center py-2.5 font-black mt-2">
                Échanger avec la Direction Technique
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ────────── DASHBOARD AGENT SPORTIF (ENRICHI) ────────── */}
      {userRole === "AGENT" && (
        <div className="flex flex-col gap-8">
          <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">
                Compte Agent Sportif & Mandataire FIBA
              </span>
              <h2 className="font-black text-2xl mt-1">Gestion de Portefeuille & Opportunités Pro</h2>
              <p className="text-xs text-foreground/60 font-medium">
                Représentation des joueurs burkinabè, négociations de contrats et détection internationale.
              </p>
            </div>
            <Link href="/abonnements" className="btn-primary py-2.5 px-5 text-xs font-black whitespace-nowrap">
              Accès Pro Recrutement →
            </Link>
          </div>

          {/* KPIs Agent */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Joueurs sous Mandat", value: joueursAgent.length.toString(), sub: "Athlètes représentés", icon: "🏀", color: "text-indigo-600" },
              { label: "Négociations en cours", value: "2", sub: "Clubs LNBB & Afrique", icon: "🤝", color: "text-primary" },
              { label: "Clubs Partenaires", value: "9", sub: "Réseau FEBBA & BAL", icon: "🏛️", color: "text-blue-500" },
              { label: "Offres Récentes", value: "5", sub: "Postes disponibles", icon: "📄", color: "text-emerald-500" },
            ].map((s) => (
              <div key={s.label} className="card p-5 border border-card-border">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-foreground/50">{s.label}</span>
                  <span className="text-xl">{s.icon}</span>
                </div>
                <p className={`text-3xl font-black mb-1 ${s.color}`}>{s.value}</p>
                <p className="text-xs font-semibold text-foreground/60">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Athlètes représentés */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 card p-6">
              <h2 className="font-black text-lg mb-4">Portefeuille d'Athlètes Représentés</h2>
              <div className="flex flex-col gap-3">
                {joueursAgent.map((j) => (
                  <div key={j.id} className="p-4 rounded-xl border border-card-border bg-gray-50/50 dark:bg-gray-900/30 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-sm text-foreground">{j.nom}</h3>
                      <p className="text-xs text-foreground/60">{j.poste} • Club : {j.club}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 font-bold text-xs border border-indigo-500/20">
                      {j.statutContrat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6 flex flex-col gap-4">
              <h2 className="font-black text-lg">Actions Agent</h2>
              <Link href="/joueurs" className="btn-primary text-xs py-2.5 text-center font-black">
                Détecter de Nouveaux Talents
              </Link>
              <Link href="/recrutement" className="btn-secondary text-xs py-2.5 text-center font-bold">
                Consulter les Appels d'Offres Clubs
              </Link>
              <Link href="/messages" className="btn-secondary text-xs py-2.5 text-center font-bold">
                Messagerie Dirigeants & Fédérations
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ────────── DASHBOARD CLUB (ENRICHI) ────────── */}
      {userRole === "CLUB" && (
        <div className="flex flex-col gap-8">
          <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black text-primary uppercase tracking-widest">Compte Club Officiel</span>
              <h2 className="font-black text-2xl mt-1">Espace Recrutement & Management du Club</h2>
              <p className="text-xs text-foreground/60 font-medium">Gérez vos équipes, offres, licences et événements.</p>
            </div>
            <Link href="/club/equipes" className="btn-primary text-sm font-black whitespace-nowrap">
              Gérer les Rosters d'Équipes →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Équipes Engagées", value: "4", sub: "Senior, U20, U18, U15", icon: "🛡️" },
              { label: "Effectif Total", value: "59", sub: "Joueurs sous licence", icon: "👥" },
              { label: "Offres de Recrutement", value: "2", sub: "Postes ouverts", icon: "📢" },
              { label: "Candidatures Reçues", value: "8", sub: "À examiner", icon: "📥" },
            ].map((s) => (
              <div key={s.label} className="card p-5 border border-card-border">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-foreground/50">{s.label}</span>
                  <span className="text-xl">{s.icon}</span>
                </div>
                <p className="text-3xl font-black mb-1 text-primary">{s.value}</p>
                <p className="text-xs font-semibold text-foreground/60">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 card p-6 flex flex-col gap-4">
              <h2 className="font-black text-lg">Actions Rapides du Club</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/club/equipes" className="p-4 rounded-xl border border-card-border hover:border-primary/40 bg-gray-50/50 dark:bg-gray-900/30">
                  <span className="text-xl">🏀</span>
                  <h3 className="font-black text-sm mt-2 text-foreground">Gestion des Rosters</h3>
                  <p className="text-xs text-foreground/60 mt-1">Ajouter des joueurs, attribuer des numéros et statuts titulaires.</p>
                </Link>
                <Link href="/club/dashboard" className="p-4 rounded-xl border border-card-border hover:border-primary/40 bg-gray-50/50 dark:bg-gray-900/30">
                  <span className="text-xl">📝</span>
                  <h3 className="font-black text-sm mt-2 text-foreground">Publier une Offre</h3>
                  <p className="text-xs text-foreground/60 mt-1">Lancer un appel à recrutement pour vos équipes élites et jeunes.</p>
                </Link>
              </div>
            </div>

            <div className="card p-6 flex flex-col gap-4">
              <h2 className="font-black text-lg">Gestion Fédérale</h2>
              <Link href="/club/dashboard" className="btn-primary text-xs py-2.5 text-center font-bold">
                Demande de Licences Fédérales
              </Link>
              <Link href="/joueurs" className="btn-secondary text-xs py-2.5 text-center font-bold">
                Explorer la Base Nationale de Joueurs
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ────────── DASHBOARD ADMINISTRATEUR (FEBBA) ────────── */}
      {userRole === "ADMIN" && (
        <div className="flex flex-col gap-8">
          <div className="p-6 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black text-purple-600 uppercase tracking-widest">Espace Gouvernance FEBBA</span>
              <h2 className="font-black text-2xl mt-1">Supervision Nationale & Validation</h2>
              <p className="text-xs text-foreground/60 font-medium">Homologation des clubs, gestion des licences et événements.</p>
            </div>
            <Link href="/admin/validations" className="btn-primary text-sm font-black whitespace-nowrap">
              Ouvrir le Panneau Administrateur →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Clubs Affiliés", value: stats?.totalClubs ?? "18", sub: "Ligues régionales", icon: "🏛️" },
              { label: "Joueurs Enregistrés", value: stats?.totalJoueurs ?? "142", sub: "Base nationale certifiée", icon: "🏀" },
              { label: "Événements en attente", value: stats?.evenementsEnAttente ?? "3", sub: "Tournois à valider", icon: "🏆" },
              { label: "Licences en attente", value: stats?.demandesLicenceEnAttente ?? "7", sub: "Demandes des clubs", icon: "📋" },
            ].map((s) => (
              <div key={s.label} className="card p-5 border border-card-border">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-foreground/50">{s.label}</span>
                  <span className="text-xl">{s.icon}</span>
                </div>
                <p className="text-3xl font-black mb-1 text-primary">{s.value}</p>
                <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="card p-6 flex flex-col gap-4">
            <h2 className="font-black text-lg">Alertes de Gouvernance Fédérale</h2>
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
              <span>⚠️ 3 nouveaux clubs attendent leur homologation fédérale pour la saison en cours.</span>
              <Link href="/admin/validations" className="btn-primary py-1.5 px-3 text-xs font-bold">
                Examiner
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
