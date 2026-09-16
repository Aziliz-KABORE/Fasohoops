"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getOffresFromBackend, fetchFromBackend } from "@/lib/apiClient";

const postes = ["Tous", "Meneur", "Arrière", "Ailier", "Ailier Fort", "Pivot"] as const;
const niveaux = ["Tous", "Jeunes", "Junior", "Senior", "Pro"] as const;
const villes = ["Toutes", "Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Banfora", "Kaya"];

// Données de fallback si le backend est hors ligne
const OFFRES_FALLBACK = [
  {
    id: "00000000-0000-0000-0000-000000000001", titre: "Recrutement Ailier Fort Senior - LNBB",
    posteRecherche: "Ailier Fort", niveau: "Senior", ville: "Ouagadougou",
    description: "Recherchons un Ailier Fort dynamique pour renforcer notre effectif en vue de la saison LNBB.",
    statut: "ACTIVE", club: { nomStructure: "AS Douanes BF" },
    dateExpiration: "2024-09-30", datePublication: null,
  }
];

type Offre = any;

export default function RecrutementPage() {
  const { data: session } = useSession();
  const [posteFilter, setPosteFilter] = useState("Tous");
  const [niveauFilter, setNiveauFilter] = useState("Tous");
  const [villeFilter, setVilleFilter] = useState("Toutes");
  const [search, setSearch] = useState("");
  const [selectedOffre, setSelectedOffre] = useState<Offre | null>(null);
  const [offres, setOffres] = useState<Offre[]>(OFFRES_FALLBACK);
  const [fromBackend, setFromBackend] = useState(false);
  const [loading, setLoading] = useState(true);

  // Formulaire candidature
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [candidatureSuccess, setCandidatureSuccess] = useState(false);

  useEffect(() => {
    async function loadOffres() {
      try {
        const data = await getOffresFromBackend({ poste: posteFilter, niveau: niveauFilter, ville: villeFilter });
        setOffres(data as Offre[]);
        setFromBackend(true);
      } catch {
        setOffres(OFFRES_FALLBACK);
        setFromBackend(false);
      } finally {
        setLoading(false);
      }
    }
    loadOffres();
  }, [posteFilter, niveauFilter, villeFilter]);

  const handlePostuler = async () => {
    if (!session || !session.user) return;
    setSubmitting(true);
    try {
      const joueurId = (session.user as any).id;
      if (!joueurId) {
        alert("Vous devez être connecté en tant que joueur.");
        return;
      }
      await fetchFromBackend("/candidatures", {
        method: "POST",
        body: JSON.stringify({
          joueur: { id: joueurId },
          offre: { id: selectedOffre?.id },
          message: message,
        }),
      });
      setCandidatureSuccess(true);
      setTimeout(() => {
        setCandidatureSuccess(false);
        setSelectedOffre(null);
        setMessage("");
      }, 3000);
    } catch (err) {
      alert("Erreur lors de la candidature");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = offres.filter((o) => {
    const clubName = (o as any).club?.nomStructure || (o as any).club || "";
    const poste = (o as any).posteRecherche || (o as any).poste || "";
    if (search && !clubName.toLowerCase().includes(search.toLowerCase()) && !poste.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-10 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 mb-5">
          🏀 Offres de Recrutement
          {fromBackend && <span className="ml-1 text-green-500">● Live</span>}
        </div>
        <h1 className="section-title mb-4">
          Trouvez votre<br />
          <span className="gradient-text">prochain club.</span>
        </h1>
        <p className="text-foreground/60 max-w-xl mx-auto font-medium">
          Toutes les offres de recrutement du basketball burkinabè. Postulez directement depuis votre profil.
        </p>
      </div>

      {/* Search + filters */}
      <div className="card p-5 mb-8 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Rechercher un club, un poste..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <div className="flex flex-wrap gap-3">
          <select
            value={villeFilter}
            onChange={(e) => setVilleFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold border border-card-border bg-white dark:bg-gray-900 text-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {villes.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-foreground/40 font-medium">Chargement des offres...</div>
      ) : (
        <>
          <p className="text-sm text-foreground/50 font-medium mb-5">{filtered.length} offre(s) trouvée(s)</p>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className={`flex flex-col gap-4 ${selectedOffre ? "lg:w-1/2" : "w-full"}`}>
              {filtered.length === 0 ? (
                <div className="card p-12 text-center">
                  <p className="font-bold text-foreground/60">Aucune offre ne correspond à votre recherche</p>
                </div>
              ) : (
                filtered.map((offre: any) => (
                  <div
                    key={offre.id}
                    onClick={() => {
                        setSelectedOffre(offre);
                        setCandidatureSuccess(false);
                    }}
                    className={`card p-6 cursor-pointer hover:-translate-y-0.5 transition-all duration-200 hover:shadow-xl ${
                      selectedOffre?.id === offre.id ? "border-2 border-primary shadow-xl shadow-primary/10" : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
                        🏀
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <h3 className="font-black text-base">{offre.posteRecherche || offre.poste}</h3>
                            <p className="text-sm text-foreground/60 font-medium">
                              {offre.club?.nomStructure || offre.club}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-foreground/60 mt-2 line-clamp-2 font-medium leading-relaxed">
                          {offre.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Detail panel */}
            {selectedOffre && (
              <div className="lg:w-1/2 lg:sticky lg:top-24 lg:self-start">
                <div className="card p-8 flex flex-col gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl flex-shrink-0">
                      🏀
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h2 className="font-black text-xl">{(selectedOffre as any).posteRecherche || (selectedOffre as any).poste}</h2>
                          <p className="text-foreground/60 font-semibold">{(selectedOffre as any).club?.nomStructure || (selectedOffre as any).club}</p>
                        </div>
                        <button
                          onClick={() => setSelectedOffre(null)}
                          className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-foreground/50 hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-widest text-foreground/40 mb-3">Description</h3>
                    <p className="text-sm text-foreground/70 font-medium leading-relaxed">{selectedOffre.description}</p>
                  </div>
                  
                  {candidatureSuccess ? (
                    <div className="p-4 bg-green-50 text-green-700 rounded-xl font-bold text-center">
                        ✅ Candidature envoyée au club !
                    </div>
                  ) : (
                    <div className="mt-2">
                        {!session ? (
                            <Link href="/connexion" className="btn-primary flex w-full justify-center text-sm py-3">
                                Connectez-vous pour postuler
                            </Link>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <textarea 
                                    className="w-full p-3 border border-card-border rounded-xl text-sm" 
                                    rows={3} 
                                    placeholder="Un petit mot pour le club..."
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                ></textarea>
                                <button onClick={handlePostuler} disabled={submitting} className="btn-primary text-sm py-3">
                                    {submitting ? "Envoi..." : "Envoyer ma candidature"}
                                </button>
                            </div>
                        )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
