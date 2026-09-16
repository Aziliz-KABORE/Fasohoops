import { getClubsFromBackend } from "@/lib/apiClient";

// Données de fallback si le backend n'est pas disponible
const CLUBS_FALLBACK = [
  { id: "1", nomStructure: "AS Douanes BF", email: "asdouanes@burkina.bf", ville: "Ouagadougou", statutValidation: "VALIDE", equipesEtCategories: "Senior + Formation", besoinsRecrutement: "Ailier Fort et Pivot" },
  { id: "2", nomStructure: "USFA Basket", email: "usfa@burkina.bf", ville: "Ouagadougou", statutValidation: "VALIDE", equipesEtCategories: "Senior + U18", besoinsRecrutement: "Meneur d'expérience" },
  { id: "3", nomStructure: "Étoile Filante BF", email: "etoile@burkina.bf", ville: "Bobo-Dioulasso", statutValidation: "VALIDE", equipesEtCategories: "Senior, U18, U15", besoinsRecrutement: "Pivot et Joueurs U18" },
];

async function getClubs() {
  try {
    const clubs = await getClubsFromBackend();
    return { clubs, fromBackend: true };
  } catch {
    console.warn("⚠️ Backend Spring Boot inaccessible, affichage des données locales.");
    return { clubs: CLUBS_FALLBACK, fromBackend: false };
  }
}

export default async function ClubsPage() {
  const { clubs, fromBackend } = await getClubs();

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-10 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 mb-4">
          {clubs.length} clubs vérifiés
          {fromBackend && <span className="ml-1 text-green-500">● Live</span>}
        </div>
        <h1 className="section-title mb-3">Annuaire des Clubs</h1>
        <p className="text-foreground/60 max-w-xl font-medium">
          Découvrez les clubs de basketball du Burkina Faso, leurs effectifs et leurs offres de recrutement.
        </p>
        {!fromBackend && (
          <p className="mt-2 text-xs text-yellow-600 dark:text-yellow-400 font-medium">
            ⚠️ Backend hors ligne — données de démonstration affichées.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((c: any) => (
          <div key={c.id} className="card p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center font-black text-2xl text-primary">
                {(c.nomStructure || c.nom || "C").charAt(0)}
              </div>
              <div>
                <h3 className="font-black text-xl leading-tight">{c.nomStructure || c.nom}</h3>
                <p className="text-xs text-foreground/50 font-semibold mt-0.5">
                  {c.ville} · {c.email}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-foreground/60 border border-card-border">
                {c.equipesEtCategories || c.categorie || "Senior"}
              </span>
              {c.statutValidation === "VALIDE" && (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                  ✓ FEBBA Validé
                </span>
              )}
            </div>
            {c.besoinsRecrutement && (
              <p className="text-xs text-foreground/60 font-medium">
                🎯 Recherche : {c.besoinsRecrutement}
              </p>
            )}
            <a href={`/clubs/${c.id}`} className="btn-secondary text-sm text-center w-full">
              Voir le profil du club
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
