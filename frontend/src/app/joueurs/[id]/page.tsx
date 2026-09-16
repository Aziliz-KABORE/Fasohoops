"use client";

import { useState } from "react";
import Link from "next/link";

export default function JoueurProfilePage({ params }: { params: { id: string } }) {
  // Simulation player data (age 17 = Minor under 18)
  const joueur = {
    id: params.id,
    nom: "Moussa Diallo",
    poste: "Arrière",
    club: "JS Koudougou",
    ville: "Koudougou",
    taille: "1.88m",
    poids: "78 kg",
    dateNaissance: "15/10/2008",
    age: 17, // Mineur (<18)
    niveau: "U18 Élite",
    nationalite: "Burkinabè",
    emailOfficiel: "moussa.diallo@fasohoops.bf",
    telephoneOfficiel: "+226 70 12 34 56",
    bio: "Jeune arrière explosif avec un tir à 3 points très fiable. Meilleur marqueur du tournoi U18 de Koudougou 2025. Recherche un club engagé en championnat national Senior/U20.",
    stats: { pts: 21.3, reb: 5.6, ast: 6.1, stl: 2.3, blk: 0.8, fg: "48%", tp: "41%" },
    portfolio: [
      { id: "vid1", titre: "Highlights Tournoi National U18 (2025)", type: "video", url: "https://www.youtube.com/embed/demo" },
      { id: "img1", titre: "Action en match vs AS Douanes", type: "photo", url: "/logo.jpg" },
    ],
    saisons: [
      { annee: "2025/26", equipe: "JS Koudougou U18", pts: 21.3, reb: 5.6, ast: 6.1 },
      { annee: "2024/25", equipe: "JS Koudougou U16", pts: 16.5, reb: 4.2, ast: 5.0 },
    ],
    palmares: ["Meilleur Marqueur Tournoi U18 Koudougou 2025", "Sélectionné Camp FEBBA Bobo-Dioulasso"],
  };

  const isMineur = joueur.age < 18;
  // Simulation: Visitor is not a verified club account by default
  const [userIsVerifiedClub, setUserIsVerifiedClub] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-10 py-12">
      {/* Minor Protection Notice */}
      {isMineur && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🛡️</span>
            <div>
              <div className="font-black text-sm">Profil de Joueur Mineur (Âge : {joueur.age} ans)</div>
              <div className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                Conformément à la politique de protection des mineurs FEBBA, les coordonnées directes sont masquées pour le grand public.
              </div>
            </div>
          </div>
          <button
            onClick={() => setUserIsVerifiedClub(!userIsVerifiedClub)}
            className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors shrink-0"
          >
            {userIsVerifiedClub ? "Masquer (Mode Public)" : "Déverrouiller (Club Homologué)"}
          </button>
        </div>
      )}

      {/* Header Card */}
      <div className="card p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="relative flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-orange-300 flex items-center justify-center text-white font-black text-4xl shadow-xl shadow-primary/30 flex-shrink-0">
            {joueur.nom.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-xs font-black px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{joueur.niveau}</span>
              <span className="text-xs font-semibold text-foreground/50">{joueur.poste}</span>
              {isMineur && (
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  Mineur (Consentement Parental Vériﬁé)
                </span>
              )}
            </div>
            <h1 className="text-4xl font-black mb-1">{joueur.nom}</h1>
            <p className="text-foreground/60 font-semibold">{joueur.club} · {joueur.ville} · {joueur.nationalite}</p>
            <p className="text-sm text-foreground/60 mt-4 max-w-2xl leading-relaxed">{joueur.bio}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/messages" className="btn-primary text-sm text-center">
              💬 Contacter
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Portfolio & Highlights */}
          <div className="card p-6">
            <h2 className="font-black text-xl mb-4">Portfolio & Highlights Vidéo</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-card-border flex flex-col items-center justify-center min-h-[160px] text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl mb-2">▶</div>
                <div className="font-black text-sm">{joueur.portfolio[0].titre}</div>
                <div className="text-[10px] font-bold text-foreground/40 mt-1">Vidéo de match officielle</div>
              </div>
              <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-card-border flex flex-col items-center justify-center min-h-[160px] text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl mb-2">📸</div>
                <div className="font-black text-sm">{joueur.portfolio[1].titre}</div>
                <div className="text-[10px] font-bold text-foreground/40 mt-1">Photo d'action HD</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="card p-6">
            <h2 className="font-black text-xl mb-6">Statistiques — Saison 2025/26</h2>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-4">
                {Object.entries(joueur.stats).map(([k, v]) => (
                  <div key={k} className="text-center">
                    <div className="text-3xl font-semibold text-foreground">{v}</div>
                    <div className="text-[10px] font-bold text-primary mt-1 tracking-widest uppercase">{k}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="card p-6">
            <h2 className="font-black text-xl mb-5">Coordonnées & Informations</h2>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center py-2 border-b border-card-border">
                <span className="text-xs font-bold text-foreground/40 uppercase tracking-wide">E-mail</span>
                <span className="font-mono text-xs font-bold">
                  {isMineur && !userIsVerifiedClub ? "*****@mineur-protege.bf" : joueur.emailOfficiel}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-card-border">
                <span className="text-xs font-bold text-foreground/40 uppercase tracking-wide">Téléphone</span>
                <span className="font-mono text-xs font-bold">
                  {isMineur && !userIsVerifiedClub ? "+226 ** ** ** 56" : joueur.telephoneOfficiel}
                </span>
              </div>
              {[
                { l: "Taille", v: joueur.taille },
                { l: "Poids", v: joueur.poids },
                { l: "Âge / Naissance", v: `${joueur.age} ans (${joueur.dateNaissance})` },
                { l: "Nationalité", v: joueur.nationalite },
                { l: "Poste", v: joueur.poste },
              ].map((i) => (
                <div key={i.l} className="flex justify-between items-center py-2 border-b border-card-border last:border-0">
                  <span className="text-xs font-bold text-foreground/40 uppercase tracking-wide">{i.l}</span>
                  <span className="font-black text-sm">{i.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

