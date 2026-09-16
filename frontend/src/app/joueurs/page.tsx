"use client";
import { useState } from "react";

const positions = ["Tous les postes", "Meneur", "Arrière", "Ailier", "Ailier Fort", "Pivot"];
const niveaux = ["Tous les niveaux", "U14", "U16", "U18", "Senior", "Pro", "Élite"];
const villes = ["Toutes les villes", "Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Banfora", "Ouahigouya"];

const joueurs = [
  { id: 1, nom: "Koné Traoré", poste: "Ailier Fort", ville: "Ouagadougou", club: "AS Douanes", niveau: "Élite", taille: "2.01m", age: 18, stats: { pts: 24.5, reb: 11.2, ast: 3.4 } },
  { id: 2, nom: "Ibrahim Ouédraogo", poste: "Meneur", ville: "Ouagadougou", club: "USFA Basket", niveau: "Pro", taille: "1.85m", age: 22, stats: { pts: 19.8, reb: 4.5, ast: 8.7 } },
  { id: 3, nom: "Salif Kaboré", poste: "Pivot", ville: "Bobo-Dioulasso", club: "Étoile Filante", niveau: "Élite", taille: "2.10m", age: 20, stats: { pts: 17.2, reb: 14.1, ast: 1.2 } },
  { id: 4, nom: "Moussa Diallo", poste: "Arrière", ville: "Koudougou", club: "JS Koudougou", niveau: "U18", taille: "1.88m", age: 17, stats: { pts: 21.3, reb: 5.6, ast: 6.1 } },
  { id: 5, nom: "Adama Sawadogo", poste: "Ailier", ville: "Ouagadougou", club: "AS Police", niveau: "Senior", taille: "1.96m", age: 24, stats: { pts: 16.8, reb: 7.3, ast: 4.5 } },
  { id: 6, nom: "Boukary Compaoré", poste: "Meneur", ville: "Banfora", club: "US Banfora", niveau: "U16", taille: "1.78m", age: 15, stats: { pts: 18.4, reb: 3.2, ast: 7.9 } },
];

export default function JoueursPage() {
  const [search, setSearch] = useState("");
  const [poste, setPoste] = useState("Tous les postes");
  const [niveau, setNiveau] = useState("Tous les niveaux");
  const [ville, setVille] = useState("Toutes les villes");

  const filtered = joueurs.filter((j) => {
    const matchSearch = j.nom.toLowerCase().includes(search.toLowerCase()) || j.club.toLowerCase().includes(search.toLowerCase());
    const matchPoste = poste === "Tous les postes" || j.poste === poste;
    const matchNiveau = niveau === "Tous les niveaux" || j.niveau === niveau;
    const matchVille = ville === "Toutes les villes" || j.ville === ville;
    return matchSearch && matchPoste && matchNiveau && matchVille;
  });

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-10 py-12">
      
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 mb-4">
          {joueurs.length} joueurs inscrits
        </div>
        <h1 className="section-title mb-3">Explorez les Talents</h1>
        <p className="text-foreground/60 max-w-xl font-medium">Trouvez le profil idéal grâce à nos filtres avancés.</p>
      </div>

      {/* Search + Filters */}
      <div className="card p-5 mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z"/>
          </svg>
          <input
            type="text"
            placeholder="Rechercher un joueur, un club..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <select value={poste} onChange={(e) => setPoste(e.target.value)} className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40">
          {positions.map((p) => <option key={p}>{p}</option>)}
        </select>
        <select value={niveau} onChange={(e) => setNiveau(e.target.value)} className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40">
          {niveaux.map((n) => <option key={n}>{n}</option>)}
        </select>
        <select value={ville} onChange={(e) => setVille(e.target.value)} className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40">
          {villes.map((v) => <option key={v}>{v}</option>)}
        </select>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-foreground/40 font-semibold">Aucun joueur trouvé pour ces critères.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((j) => (
            <a key={j.id} href={`/joueurs/${j.id}`} className="card p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-orange-300 flex items-center justify-center text-white font-black text-xl group-hover:scale-110 transition-transform">
                    {j.nom.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-lg leading-tight">{j.nom}</h3>
                    <p className="text-xs text-foreground/50 font-semibold">{j.poste}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${j.niveau === 'Élite' ? 'bg-primary/10 text-primary border-primary/20' : j.niveau === 'Pro' ? 'bg-accent/10 text-accent border-accent/20' : 'bg-gray-100 dark:bg-gray-800 text-foreground/60 border-card-border'}`}>
                  {j.niveau}
                </span>
              </div>
              <div className="flex gap-2 text-xs text-foreground/50 font-semibold">
                <span>{j.club}</span><span>·</span><span>{j.ville}</span><span>·</span><span>{j.taille}</span><span>·</span><span>{j.age} ans</span>
              </div>
              <div className="flex gap-4 pt-4 border-t border-card-border">
                {Object.entries(j.stats).map(([k, v]) => (
                  <div key={k} className="text-center">
                    <div className="text-xl font-semibold text-foreground">{v}</div>
                    <div className="text-[10px] font-bold text-foreground/40 tracking-widest uppercase">{k}</div>
                  </div>
                ))}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
