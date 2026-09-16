import { fetchFromBackend } from "@/lib/apiClient";
import Link from "next/link";

export default async function ClubProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let club = null;
  try {
    club = await fetchFromBackend(`/clubs/${id}`);
  } catch (err) {
    console.error("Erreur chargement club:", err);
  }

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">Club introuvable</h1>
          <Link href="/clubs" className="btn-primary">Retour aux clubs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-10 py-12">
      {/* Header */}
      <div className="card p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 flex items-center justify-center font-black text-4xl text-primary flex-shrink-0">
            {(club.nomStructure || club.nom || "C").charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-3xl font-black">{club.nomStructure || club.nom}</h1>
              {club.statutValidation === "VALIDE" && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                  ✓ Vérifié FEBBA
                </span>
              )}
            </div>
            <p className="text-foreground/60 font-semibold mb-1">{club.ville} · {club.email}</p>
            <p className="text-sm font-medium text-foreground/60 leading-relaxed mt-3 max-w-2xl">{club.historique || "Aucun historique disponible pour ce club."}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          {/* Contact */}
          <div className="card p-6">
            <h2 className="font-black text-lg mb-4">Contact</h2>
            <div className="flex flex-col gap-3 text-sm">
              <a href={`mailto:${club.email}`} className="flex items-center gap-2 text-primary hover:underline font-semibold break-all">
                ✉️ {club.email}
              </a>
              <div className="flex items-center gap-2 text-foreground/70 font-semibold">
                📍 {club.ville}
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-4 text-center">
              <div className="text-2xl font-black text-primary">{club.licenceNumero || "N/A"}</div>
              <div className="text-xs font-bold text-foreground/40 uppercase tracking-widest mt-1">Licence N°</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-sm font-black text-primary">{club.equipesEtCategories || "Non défini"}</div>
              <div className="text-xs font-bold text-foreground/40 uppercase tracking-widest mt-1">Catégories</div>
            </div>
          </div>

          {/* Actions */}
          <div className="card p-6">
            <h2 className="font-black text-lg mb-4">Recrutement</h2>
            <p className="text-sm text-foreground/60 font-medium mb-4">Ce club recherche activement : <strong>{club.besoinsRecrutement || "Aucun besoin spécifique"}</strong></p>
            <div className="flex gap-3">
              <Link href="/recrutement" className="btn-primary text-sm flex-1 text-center">
                Voir toutes les offres
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
