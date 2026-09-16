"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getEvenementsValides, fetchFromBackend } from "@/lib/apiClient";
import Link from "next/link";

const typeColors: Record<string, string> = {
  "DETECTION": "bg-primary/10 text-primary border-primary/20",
  "TOURNOI": "bg-accent/10 text-accent border-accent/20",
  "STAGE": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  "CHAMPIONNAT": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  "AUTRE": "bg-gray-100 dark:bg-gray-800 text-foreground/60 border-card-border",
};

export default function EvenementsPage() {
  const { data: session } = useSession();
  const [evenementsData, setEvenementsData] = useState<any[]>([]);
  const [inscrit, setInscrit] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvenements() {
      try {
        const evts = await getEvenementsValides();
        setEvenementsData(evts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadEvenements();
  }, []);

  const handleInscription = (event: any) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const confirmInscription = async () => {
    if (!session?.user) {
        window.location.href = "/connexion";
        return;
    }
    
    if (selectedEvent) {
      try {
        const joueurId = (session.user as any).id;
        await fetchFromBackend("/candidatures", {
          method: "POST",
          body: JSON.stringify({
            joueur: { id: joueurId },
            evenement: { id: selectedEvent.id },
            message: "Inscription via plateforme",
          }),
        });
        setInscrit(selectedEvent.id);
      } catch (err) {
        console.error(err);
        alert("Erreur lors de l'inscription à l'événement.");
      }
    }
    setShowModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-10 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 mb-4">
          {evenementsData.length} événements vérifiés FEBBA
        </div>
        <h1 className="section-title mb-3">Événements & Détections</h1>
        <p className="text-foreground/60 max-w-xl font-medium">
          Tous les événements listés sont officiellement organisés ou reconnus par la FEBBA.
          Inscrivez-vous directement via la plateforme.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20">Chargement des événements...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {evenementsData.length === 0 ? (
            <div className="col-span-2 text-center p-10 bg-gray-50 rounded-xl">
              Aucun événement disponible pour le moment.
            </div>
          ) : (
            evenementsData.map((e) => {
              // Mock places for UI since backend doesn't have it yet
              const places = 50;
              const inscrits = Math.floor(Math.random() * 40);
              const pct = Math.round((inscrits / places) * 100);
              const full = inscrits >= places;
              const isInscrit = inscrit === e.id;

              return (
                <div key={e.id} className="card p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-black text-xl leading-tight">{e.titre}</h3>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border whitespace-nowrap flex-shrink-0 ${typeColors[e.type] || typeColors["AUTRE"]}`}>
                      {e.type}
                    </span>
                  </div>

                  <p className="text-sm text-foreground/60 leading-relaxed line-clamp-2">{e.description}</p>

                  <div className="flex flex-col gap-2 text-sm text-foreground/60 font-semibold">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5"/></svg>
                      {new Date(e.dateDebut || e.dateCreation).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
                      {e.lieu || "Lieu à définir"}
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>
                      Organisé par <span className="text-foreground font-bold ml-1">{e.createur?.nom || "FEBBA"}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-foreground/50">{inscrits} / {places} inscrits</span>
                      <span className={full ? "text-red-500" : "text-primary"}>{full ? "Complet" : `${100 - pct}% disponible`}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-800">
                      <div className={`h-1.5 rounded-full transition-all ${full ? "bg-red-500" : "bg-primary"}`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>

                  {isInscrit ? (
                    <div className="w-full py-3 rounded-xl text-sm font-bold text-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                      Inscrit avec succès !
                    </div>
                  ) : (
                    <button
                      disabled={full}
                      onClick={() => handleInscription(e)}
                      className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${full ? "bg-gray-100 dark:bg-gray-800 text-foreground/30 cursor-not-allowed" : "btn-primary"}`}
                    >
                      {full ? "Complet — Liste d'attente" : "S'inscrire à l'événement"}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modal d'inscription */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4" onClick={() => setShowModal(false)}>
          <div className="card max-w-lg w-full p-8" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-black mb-2">Confirmer l'inscription</h2>
            <p className="text-foreground/60 font-medium mb-6">{selectedEvent.titre}</p>

            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-foreground/40 mb-3">Critères d'éligibilité</h3>
              <ul className="space-y-2">
                 <li className="flex items-start gap-2 text-sm font-medium text-foreground/80">
                   <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5"></span>
                   Être licencié FEBBA
                 </li>
              </ul>
            </div>

            {!session && (
                <p className="text-xs text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mb-6">
                ⚠️ Vous devez être connecté pour finaliser votre inscription. Votre demande sera enregistrée et traitée par l'organisateur.
                </p>
            )}

            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Annuler</button>
              {session ? (
                 <button onClick={confirmInscription} className="btn-primary flex-1 text-center">
                    Confirmer l'inscription
                 </button>
              ) : (
                <Link href="/connexion" className="btn-primary flex-1 text-center flex items-center justify-center">
                    Me connecter
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
