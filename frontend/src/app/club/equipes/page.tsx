"use client";

import { useState, useEffect } from "react";

export interface JoueurRoster {
  id: string;
  numero: number;
  prenom: string;
  nom: string;
  poste: string;
  taille?: string;
  statut: "Titulaire" | "Remplaçant";
  licenceNumero: string;
}

export interface Equipe {
  id: string;
  nom: string;
  categorie: string;
  entraineur: string;
  effectif: number;
  roster: JoueurRoster[];
}

const initialEquipes: Equipe[] = [
  {
    id: "1",
    nom: "Équipe Senior Hommes",
    categorie: "Senior Élite",
    entraineur: "Coach Traoré",
    effectif: 14,
    roster: [
      { id: "p1", numero: 4, prenom: "Moussa", nom: "Ouattara", poste: "Meneur", statut: "Titulaire", licenceNumero: "BF-2024-001", taille: "1.86m" },
      { id: "p2", numero: 7, prenom: "Yacouba", nom: "Kaboré", poste: "Arrière", statut: "Titulaire", licenceNumero: "BF-2024-002", taille: "1.91m" },
      { id: "p3", numero: 10, prenom: "Ibrahim", nom: "Traoré", poste: "Ailier Fort", statut: "Titulaire", licenceNumero: "BF-2024-003", taille: "2.02m" },
      { id: "p4", numero: 15, prenom: "Seydou", nom: "Koné", poste: "Pivot", statut: "Titulaire", licenceNumero: "BF-2024-004", taille: "2.08m" },
      { id: "p5", numero: 8, prenom: "Boukary", nom: "Zongo", poste: "Ailier", statut: "Titulaire", licenceNumero: "BF-2024-005", taille: "1.96m" },
      { id: "p6", numero: 5, prenom: "Oumar", nom: "Diallo", poste: "Meneur", statut: "Remplaçant", licenceNumero: "BF-2024-006", taille: "1.83m" },
      { id: "p7", numero: 12, prenom: "Issa", nom: "Bambara", poste: "Pivot", statut: "Remplaçant", licenceNumero: "BF-2024-007", taille: "2.04m" },
    ],
  },
  {
    id: "2",
    nom: "Sénior Dames",
    categorie: "Senior Élite Dames",
    entraineur: "Mme Ouédraogo",
    effectif: 12,
    roster: [
      { id: "w1", numero: 5, prenom: "Awa", nom: "Kaboré", poste: "Meneuse", statut: "Titulaire", licenceNumero: "BF-2024-W01", taille: "1.74m" },
      { id: "w2", numero: 9, prenom: "Fatimata", nom: "Sanogo", poste: "Arrière", statut: "Titulaire", licenceNumero: "BF-2024-W02", taille: "1.78m" },
      { id: "w3", numero: 11, prenom: "Mariam", nom: "Traoré", poste: "Pivot", statut: "Titulaire", licenceNumero: "BF-2024-W03", taille: "1.92m" },
    ],
  },
  {
    id: "3",
    nom: "Espoirs U20",
    categorie: "U20 National",
    entraineur: "Coach Sawadogo",
    effectif: 15,
    roster: [
      { id: "u1", numero: 6, prenom: "Cheick", nom: "Cissé", poste: "Meneur", statut: "Titulaire", licenceNumero: "BF-2024-U01", taille: "1.85m" },
      { id: "u2", numero: 13, prenom: "Aziz", nom: "Tapsoba", poste: "Ailier", statut: "Titulaire", licenceNumero: "BF-2024-U02", taille: "1.95m" },
    ],
  },
  {
    id: "4",
    nom: "Académie U18",
    categorie: "U18 Régionale",
    entraineur: "Salif Kaboré",
    effectif: 18,
    roster: [
      { id: "a1", numero: 4, prenom: "Hamidou", nom: "Sorgho", poste: "Arrière", statut: "Titulaire", licenceNumero: "BF-2024-A01", taille: "1.88m" },
    ],
  },
];

export default function ClubEquipesPage() {
  const [equipes, setEquipes] = useState<Equipe[]>(initialEquipes);
  const [nom, setNom] = useState("");
  const [categorie, setCategorie] = useState("U18 Régionale");
  const [entraineur, setEntraineur] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  // Roster modal states
  const [selectedEquipe, setSelectedEquipe] = useState<Equipe | null>(null);
  const [nouveauJoueurPrenom, setNouveauJoueurPrenom] = useState("");
  const [nouveauJoueurNom, setNouveauJoueurNom] = useState("");
  const [nouveauJoueurNumero, setNouveauJoueurNumero] = useState<number>(10);
  const [nouveauJoueurPoste, setNouveauJoueurPoste] = useState("Meneur");
  const [nouveauJoueurTaille, setNouveauJoueurTaille] = useState("1.90m");
  const [nouveauJoueurStatut, setNouveauJoueurStatut] = useState<"Titulaire" | "Remplaçant">("Remplaçant");

  // Charger depuis le localStorage si disponible
  useEffect(() => {
    try {
      const saved = localStorage.getItem("fasohoops_club_equipes");
      if (saved) {
        setEquipes(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveEquipes = (updated: Equipe[]) => {
    setEquipes(updated);
    try {
      localStorage.setItem("fasohoops_club_equipes", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleAddEquipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !entraineur) return;

    const newEq: Equipe = {
      id: Date.now().toString(),
      nom,
      categorie,
      entraineur,
      effectif: 0,
      roster: [],
    };

    const updated = [...equipes, newEq];
    saveEquipes(updated);
    setNom("");
    setEntraineur("");
    setNotification(`✅ L'équipe "${nom}" (${categorie}) a été ajoutée avec succès.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenRoster = (eq: Equipe) => {
    setSelectedEquipe(eq);
  };

  const handleAddPlayerToRoster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipe || !nouveauJoueurPrenom || !nouveauJoueurNom) return;

    const newPlayer: JoueurRoster = {
      id: "p-" + Date.now(),
      numero: Number(nouveauJoueurNumero),
      prenom: nouveauJoueurPrenom.trim(),
      nom: nouveauJoueurNom.trim(),
      poste: nouveauJoueurPoste,
      taille: nouveauJoueurTaille,
      statut: nouveauJoueurStatut,
      licenceNumero: `BF-2025-${Math.floor(100 + Math.random() * 900)}`,
    };

    const updatedRoster = [...(selectedEquipe.roster || []), newPlayer];
    const updatedEquipe: Equipe = {
      ...selectedEquipe,
      roster: updatedRoster,
      effectif: updatedRoster.length,
    };

    const updatedEquipes = equipes.map((eq) =>
      eq.id === selectedEquipe.id ? updatedEquipe : eq
    );

    saveEquipes(updatedEquipes);
    setSelectedEquipe(updatedEquipe);
    setNouveauJoueurPrenom("");
    setNouveauJoueurNom("");
    setNotification(`✅ ${newPlayer.prenom} ${newPlayer.nom} (#${newPlayer.numero}) a été ajouté au roster.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleToggleStatut = (joueurId: string) => {
    if (!selectedEquipe) return;

    const updatedRoster = selectedEquipe.roster.map((j) => {
      if (j.id === joueurId) {
        return {
          ...j,
          statut: j.statut === "Titulaire" ? "Remplaçant" : ("Titulaire" as "Titulaire" | "Remplaçant"),
        };
      }
      return j;
    });

    const updatedEquipe = { ...selectedEquipe, roster: updatedRoster };
    const updatedEquipes = equipes.map((eq) =>
      eq.id === selectedEquipe.id ? updatedEquipe : eq
    );

    saveEquipes(updatedEquipes);
    setSelectedEquipe(updatedEquipe);
  };

  const handleRemovePlayer = (joueurId: string) => {
    if (!selectedEquipe) return;

    const updatedRoster = selectedEquipe.roster.filter((j) => j.id !== joueurId);
    const updatedEquipe = {
      ...selectedEquipe,
      roster: updatedRoster,
      effectif: updatedRoster.length,
    };
    const updatedEquipes = equipes.map((eq) =>
      eq.id === selectedEquipe.id ? updatedEquipe : eq
    );

    saveEquipes(updatedEquipes);
    setSelectedEquipe(updatedEquipe);
    setNotification("Joueur retiré du roster.");
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-10 py-12">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 mb-3">
            🏟️ Gestion du Club & Effectifs
          </div>
          <h1 className="section-title mb-2">Gestion des Équipes & Rosters</h1>
          <p className="text-foreground/60 font-medium text-sm">
            Structuration des effectifs du club (Senior, U20, U18, U15, Académie), numéros de maillots et licences.
          </p>
        </div>
      </div>

      {notification && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-sm font-bold border border-emerald-500/20 animate-fade-in flex justify-between items-center">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-emerald-700 dark:text-emerald-300 font-black">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Existing Teams list */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="card p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-black text-xl">Équipes Engagées ({equipes.length})</h2>
                <p className="text-xs text-foreground/50 font-medium">Cliquez sur « Gérer roster » pour administrer l'effectif</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {equipes.map((eq) => (
                <div
                  key={eq.id}
                  className="p-5 rounded-2xl border border-card-border bg-gray-50/50 dark:bg-gray-900/30 flex flex-col justify-between hover:border-primary/40 transition-all group"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {eq.categorie}
                      </span>
                      <span className="text-xs font-bold text-foreground/60">
                        {eq.roster ? eq.roster.length : eq.effectif} joueurs
                      </span>
                    </div>
                    <h3 className="font-black text-lg mt-3 text-foreground group-hover:text-primary transition-colors">
                      {eq.nom}
                    </h3>
                    <p className="text-xs text-foreground/60 font-medium mt-1">
                      Entraîneur : <strong>{eq.entraineur}</strong>
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-card-border flex items-center justify-between text-xs font-bold">
                    <span className="text-foreground/50">
                      Titulaires : {eq.roster ? eq.roster.filter(p => p.statut === "Titulaire").length : 5}
                    </span>
                    <button
                      onClick={() => handleOpenRoster(eq)}
                      className="text-primary hover:underline font-black flex items-center gap-1 cursor-pointer"
                    >
                      <span>Gérer roster</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Team form */}
        <div className="card p-6 h-fit">
          <h2 className="font-black text-xl mb-1">Créer une Équipe</h2>
          <p className="text-xs text-foreground/50 mb-5 font-medium">Enregistrer une nouvelle section du club</p>

          <form onSubmit={handleAddEquipe} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-foreground/50">
                Nom de l'équipe
              </label>
              <input
                type="text"
                placeholder="ex: Cadets U15 A"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-foreground/50">
                Catégorie d'Âge
              </label>
              <select
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
                className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option>Senior Élite</option>
                <option>Senior Élite Dames</option>
                <option>U20 National</option>
                <option>U18 Régionale</option>
                <option>U15 Cadets</option>
                <option>École de Basket (U12)</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-foreground/50">
                Entraîneur Responsable
              </label>
              <input
                type="text"
                placeholder="ex: Coach Diallo"
                value={entraineur}
                onChange={(e) => setEntraineur(e.target.value)}
                required
                className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <button type="submit" className="btn-primary mt-2 py-3 font-black text-sm">
              Ajouter l'équipe au club
            </button>
          </form>
        </div>
      </div>

      {/* ────────── MODAL INTERACTIF DE GESTION DU ROSTER ────────── */}
      {selectedEquipe && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center px-4"
          onClick={() => setSelectedEquipe(null)}
        >
          <div
            className="card max-w-4xl w-full p-6 sm:p-8 max-h-[90vh] flex flex-col shadow-2xl border border-card-border animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header du modal */}
            <div className="flex justify-between items-start pb-5 border-b border-card-border mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {selectedEquipe.categorie}
                  </span>
                  <span className="text-xs font-bold text-foreground/50">
                    Entraîneur : {selectedEquipe.entraineur}
                  </span>
                </div>
                <h2 className="text-2xl font-black mt-1 text-foreground">
                  Roster : {selectedEquipe.nom}
                </h2>
                <p className="text-xs text-foreground/60 font-medium">
                  Effectif officiel : {selectedEquipe.roster ? selectedEquipe.roster.length : 0} joueurs enregistrés
                </p>
              </div>

              <button
                onClick={() => setSelectedEquipe(null)}
                className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-foreground/60 hover:text-foreground flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Contenu : Formulaire d'ajout + Tableau des joueurs */}
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-6">
              {/* Formulaire ajout rapide de joueur */}
              <form
                onSubmit={handleAddPlayerToRoster}
                className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col gap-3"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase tracking-wider text-primary">
                    + Ajouter un joueur au roster
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                  <div className="col-span-1">
                    <label className="text-[10px] font-bold uppercase text-foreground/50">N°</label>
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={nouveauJoueurNumero}
                      onChange={(e) => setNouveauJoueurNumero(Number(e.target.value))}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-card-border text-sm font-black text-center"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-2">
                    <label className="text-[10px] font-bold uppercase text-foreground/50">Prénom & Nom</label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Prénom"
                        value={nouveauJoueurPrenom}
                        onChange={(e) => setNouveauJoueurPrenom(e.target.value)}
                        required
                        className="w-1/2 px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-card-border text-xs font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Nom"
                        value={nouveauJoueurNom}
                        onChange={(e) => setNouveauJoueurNom(e.target.value)}
                        required
                        className="w-1/2 px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-card-border text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="col-span-1 sm:col-span-1">
                    <label className="text-[10px] font-bold uppercase text-foreground/50">Poste</label>
                    <select
                      value={nouveauJoueurPoste}
                      onChange={(e) => setNouveauJoueurPoste(e.target.value)}
                      className="w-full px-2 py-2 rounded-xl bg-white dark:bg-gray-800 border border-card-border text-xs font-semibold"
                    >
                      <option>Meneur</option>
                      <option>Arrière</option>
                      <option>Ailier</option>
                      <option>Ailier Fort</option>
                      <option>Pivot</option>
                    </select>
                  </div>

                  <div className="col-span-1 sm:col-span-1">
                    <label className="text-[10px] font-bold uppercase text-foreground/50">Rôle</label>
                    <select
                      value={nouveauJoueurStatut}
                      onChange={(e) => setNouveauJoueurStatut(e.target.value as any)}
                      className="w-full px-2 py-2 rounded-xl bg-white dark:bg-gray-800 border border-card-border text-xs font-semibold"
                    >
                      <option value="Titulaire">Titulaire</option>
                      <option value="Remplaçant">Remplaçant</option>
                    </select>
                  </div>

                  <div className="col-span-1 sm:col-span-1 flex items-end">
                    <button
                      type="submit"
                      className="w-full btn-primary py-2 px-3 text-xs font-black shadow-sm"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </form>

              {/* Tableau du Roster */}
              <div className="border border-card-border rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800/80 text-[11px] font-black uppercase tracking-wider text-foreground/50 border-b border-card-border">
                      <th className="py-3 px-4">N°</th>
                      <th className="py-3 px-4">Joueur</th>
                      <th className="py-3 px-4">Poste</th>
                      <th className="py-3 px-4">Taille</th>
                      <th className="py-3 px-4">Licence FEBBA</th>
                      <th className="py-3 px-4">Statut</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-card-border text-xs font-medium">
                    {!selectedEquipe.roster || selectedEquipe.roster.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-foreground/40 font-medium">
                          Aucun joueur dans cet effectif. Ajoutez votre premier joueur ci-dessus !
                        </td>
                      </tr>
                    ) : (
                      selectedEquipe.roster.map((j) => (
                        <tr key={j.id} className="hover:bg-primary/5 transition-colors">
                          <td className="py-3.5 px-4 font-black text-sm text-primary">
                            #{j.numero}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-foreground">
                            {j.prenom} {j.nom}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-foreground/70">
                            {j.poste}
                          </td>
                          <td className="py-3.5 px-4 text-foreground/60">
                            {j.taille || "—"}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-foreground/60">
                            {j.licenceNumero}
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleStatut(j.id)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer transition-all border ${
                                j.statut === "Titulaire"
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20"
                                  : "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20"
                              }`}
                              title="Cliquer pour basculer Titulaire / Remplaçant"
                            >
                              {j.statut} ⟳
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleRemovePlayer(j.id)}
                              className="text-red-500 hover:text-red-700 font-bold p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30"
                              title="Retirer du roster"
                            >
                              ✕ Retirer
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pied du modal */}
            <div className="pt-4 border-t border-card-border mt-4 flex justify-between items-center">
              <span className="text-xs text-foreground/50">
                Toutes les modifications sont synchronisées avec le club.
              </span>
              <button
                onClick={() => setSelectedEquipe(null)}
                className="btn-primary py-2 px-5 text-xs font-black"
              >
                Terminer & Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
