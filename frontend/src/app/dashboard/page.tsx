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
    if (userRole === "ADMIN") {
      fetchFromBackend("/admin/stats").then(setStats).catch(console.error);
    }
  }, [userRole]);

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-10 py-12">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div
            className="relative w-20 h-20 rounded-full border-4 border-white dark:border-gray-900 shadow-xl overflow-hidden group cursor-pointer shrink-0"
            onClick={() => fileInputRef.current?.click()}
          >
            {profileImage ? (
              <Image src={profileImage} alt="Profile" fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white font-black text-2xl">
                {userName.charAt(0)}
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>

          <div>
            <h1 className="section-title mb-1">Tableau de Bord Personnel</h1>
            <p className="text-foreground/60 font-medium text-sm flex items-center gap-2">
              Bienvenue, <span className="font-black text-foreground">{userName}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-black text-xs border border-primary/20">
                Profil : {userRole}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* DASHBOARD JOUEUR */}
      {userRole === "JOUEUR" && (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: "Vues de mon Profil", value: "—", sub: "Connectez-vous pour voir vos stats" },
              { label: "Candidatures Envoyées", value: "—", sub: "Postulez à des offres" },
              { label: "Alertes Clubs", value: "—", sub: "Offres correspondant au poste" },
              { label: "Portfolio Média", value: "0", sub: "Ajoutez vos vidéos" },
            ].map((s) => (
              <div key={s.label} className="card p-6">
                <p className="text-xs font-black uppercase tracking-widest text-foreground/40 mb-2">{s.label}</p>
                <p className="text-3xl font-black mb-1">{s.value}</p>
                <p className="text-xs font-bold text-accent">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 card p-6">
              <h2 className="font-black text-xl mb-4">Mes Candidatures & Opportunités</h2>
              <p className="text-foreground/50 text-sm">Vos candidatures envoyées aux clubs apparaîtront ici.</p>
            </div>

            <div className="card p-6 flex flex-col gap-4">
              <h2 className="font-black text-xl mb-2">Actions Joueur</h2>
              <Link href="/recrutement" className="btn-primary text-sm text-center">Voir les Offres Actives</Link>
              <Link href="/abonnements" className="btn-secondary text-sm text-center">Voir les Abonnements</Link>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD CLUB */}
      {userRole === "CLUB" && (
        <div className="flex flex-col gap-8">
          <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black text-primary uppercase tracking-widest">Compte Club Officiel</span>
              <h2 className="font-black text-2xl mt-1">Espace Recrutement & Management du Club</h2>
              <p className="text-xs text-foreground/60 font-medium">Gérez vos équipes, offres, licences et événements.</p>
            </div>
            <Link href="/club/dashboard" className="btn-primary text-sm font-black whitespace-nowrap">
              Gérer mon Club →
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="card p-6 flex flex-col gap-4">
              <h2 className="font-black text-xl mb-2">Actions Club</h2>
              <Link href="/club/dashboard" className="btn-primary text-sm text-center">Publier une Offre</Link>
              <Link href="/club/dashboard" className="btn-secondary text-sm text-center">Lancer un Événement</Link>
              <Link href="/club/dashboard" className="btn-secondary text-sm text-center">Demande de Licences</Link>
              <Link href="/joueurs" className="btn-secondary text-sm text-center">Rechercher des Joueurs</Link>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD ENTRAINEUR */}
      {userRole === "ENTRAINEUR" && (
        <div className="flex flex-col gap-8">
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Compte Coach & Encadrement</span>
            <h2 className="font-black text-2xl mt-1">Espace Technique & Organisation de Stages</h2>
          </div>
        </div>
      )}

      {/* DASHBOARD AGENT */}
      {userRole === "AGENT" && (
        <div className="flex flex-col gap-8">
          <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Compte Agent Sportif</span>
            <h2 className="font-black text-2xl mt-1">Portefeuille d'Athlètes & Recrutement Pro</h2>
          </div>
        </div>
      )}

      {/* DASHBOARD ADMIN */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: "Clubs Affiliés", value: stats?.totalClubs ?? "—", sub: "Ligues régionales" },
              { label: "Joueurs enregistrés", value: stats?.totalJoueurs ?? "—", sub: "Base nationale" },
              { label: "Événements en attente", value: stats?.evenementsEnAttente ?? "—", sub: "À valider" },
              { label: "Licences en attente", value: stats?.demandesLicenceEnAttente ?? "—", sub: "Demandes clubs" },
            ].map((s) => (
              <div key={s.label} className="card p-6">
                <p className="text-xs font-black uppercase tracking-widest text-foreground/40 mb-2">{s.label}</p>
                <p className="text-3xl font-black mb-1 text-primary">{s.value}</p>
                <p className="text-xs font-bold text-purple-600">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
