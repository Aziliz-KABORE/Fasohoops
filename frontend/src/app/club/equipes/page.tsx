"use client";

import { useState } from "react";

interface Equipe {
  id: string;
  nom: string;
  categorie: string;
  entraineur: string;
  effectif: number;
}

const initialEquipes: Equipe[] = [
  { id: "1", nom: "Équipe Senior Hommes", categorie: "Senior Élite", entraineur: "Coach Traoré", effectif: 14 },
  { id: "2", nom: "Sénior Dames", categorie: "Senior Élite Dames", entraineur: "Mme Ouédraogo", effectif: 12 },
  { id: "3", nom: "Espoirs U20", categorie: "U20 National", entraineur: "Coach Sawadogo", effectif: 15 },
  { id: "4", nom: "Académie U18", categorie: "U18 Régionale", entraineur: "Salif Kaboré", effectif: 18 },
];

export default function ClubEquipesPage() {
  const [equipes, setEquipes] = useState<Equipe[]>(initialEquipes);
  const [nom, setNom] = useState("");
  const [categorie, setCategorie] = useState("U18 Régionale");
  const [entraineur, setEntraineur] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  const handleAddEquipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !entraineur) return;

    const newEq: Equipe = {
      id: Date.now().toString(),
      nom,
      categorie,
      entraineur,
      effectif: 0,
    };

    setEquipes([...equipes, newEq]);
    setNom("");
    setEntraineur("");
    setNotification(`L'équipe "${nom}" (${categorie}) a été ajoutée avec succès.`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-10 py-12">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 mb-3">
            Gestion du Club
          </div>
          <h1 className="section-title mb-2">Gestion des Équipes & Catégories</h1>
          <p className="text-foreground/60 font-medium">Structuration des effectifs du club (Senior, U20, U18, U15, Académie).</p>
        </div>
      </div>

      {notification && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200 text-sm font-bold border border-emerald-200">
          {notification}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Existing Teams list */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="card p-6">
            <h2 className="font-black text-xl mb-6">Équipes Engagées ({equipes.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {equipes.map((eq) => (
                <div key={eq.id} className="p-5 rounded-2xl border border-card-border bg-gray-50/50 dark:bg-gray-900/30 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {eq.categorie}
                    </span>
                    <h3 className="font-black text-lg mt-3">{eq.nom}</h3>
                    <p className="text-xs text-foreground/50 font-medium mt-1">Entraîneur principal : {eq.entraineur}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-card-border flex items-center justify-between text-xs font-bold text-foreground/70">
                    <span>Effectif : {eq.effectif} joueurs</span>
                    <button className="text-primary hover:underline font-black">Gérer roster →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Team form */}
        <div className="card p-6 h-fit">
          <h2 className="font-black text-xl mb-4">Créer une Équipe</h2>
          <form onSubmit={handleAddEquipe} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-foreground/50">Nom de l'équipe</label>
              <input
                type="text"
                placeholder="ex: Cadets U15 A"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-foreground/50">Catégorie d'Âge</label>
              <select
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
                className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option>Senior Élite</option>
                <option>Senior Dames</option>
                <option>U20 National</option>
                <option>U18 Régionale</option>
                <option>U15 Cadets</option>
                <option>École de Basket (U12)</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-foreground/50">Entraîneur Responsable</label>
              <input
                type="text"
                placeholder="ex: Coach Diallo"
                value={entraineur}
                onChange={(e) => setEntraineur(e.target.value)}
                className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <button type="submit" className="btn-primary mt-2">
              Ajouter l'équipe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
