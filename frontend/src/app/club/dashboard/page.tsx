"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchFromBackend } from "@/lib/apiClient";

export default function ClubDashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [club, setClub] = useState<any>(null);
  const [demandes, setDemandes] = useState<any[]>([]);
  const [evenements, setEvenements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [titreOffre, setTitreOffre] = useState("");
  const [poste, setPoste] = useState("Ailier Fort");
  const [niveau, setNiveau] = useState("Senior Élite");
  const [description, setDescription] = useState("");
  
  const [evtTitre, setEvtTitre] = useState("");
  const [evtType, setEvtType] = useState("DETECTION");
  const [evtLieu, setEvtLieu] = useState("");
  const [evtDesc, setEvtDesc] = useState("");

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const userRole = (session?.user as any)?.role;
    if (session && userRole !== "CLUB" && userRole !== "ADMIN") {
      router.replace("/dashboard");
    } else if (session) {
      loadClubData();
    }
  }, [session, router]);

  const loadClubData = async () => {
    try {
      const clubId = (session?.user as any)?.id;
      if (!clubId) return;

      const [clubData, licencesData] = await Promise.all([
        fetchFromBackend(`/clubs/${clubId}`),
        fetchFromBackend(`/licences/club/${clubId}`)
      ]);
      setClub(clubData);
      setDemandes(licencesData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublierOffre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!club || club.statutValidation !== "VALIDE") {
      setNotification("Votre compte n'a pas encore été approuvé par la FEBBA.");
      return;
    }
    try {
      await fetchFromBackend(`/clubs/${club.id}/offres`, {
        method: "POST",
        body: JSON.stringify({
          titre: titreOffre,
          posteRecherche: poste,
          niveau,
          description,
          ville: club.ville,
        })
      });
      setNotification(`✅ L'offre a été publiée avec succès !`);
      setTitreOffre(""); setDescription("");
      setTimeout(() => setNotification(null), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLancerEvenement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!club || club.statutValidation !== "VALIDE") return;
    try {
      await fetchFromBackend(`/evenements`, {
        method: "POST",
        body: JSON.stringify({
          titre: evtTitre,
          type: evtType,
          lieu: evtLieu,
          description: evtDesc,
          createur: { id: club.id }
        })
      });
      setNotification(`✅ Événement soumis ! En attente de validation FEBBA.`);
      setEvtTitre(""); setEvtLieu(""); setEvtDesc("");
      setTimeout(() => setNotification(null), 5000);
    } catch(err) {
      console.error(err);
    }
  };

  const handleDemanderLicences = async () => {
    if (!club || club.statutValidation !== "VALIDE") return;
    try {
      await fetchFromBackend(`/licences`, {
        method: "POST",
        body: JSON.stringify({
          club: { id: club.id },
          saison: "2024-2025",
          nombreJoueurs: 12,
          commentaireClub: "Demande globale pour la nouvelle saison"
        })
      });
      setNotification("✅ Demande globale de licences envoyée à la FEBBA.");
      setTimeout(() => setNotification(null), 5000);
      loadClubData();
    } catch(err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-20">Chargement...</div>;

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-10 py-12">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="section-title">Espace Représentant Club</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-black border ${club?.statutValidation === "VALIDE" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" : "bg-amber-500/10 text-amber-600 border-amber-500/30"}`}>
              {club?.statutValidation === "VALIDE" ? "✅ Club Homologué FEBBA" : "⏳ Validation FEBBA en cours"}
            </span>
          </div>
          <p className="text-foreground/60 font-medium">Gestion du recrutement, événements, licences et candidatures.</p>
        </div>
      </div>

      {club?.statutValidation !== "VALIDE" && (
        <div className="mb-8 p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-4">
          <div className="text-2xl">⚠️</div>
          <div>
            <div className="font-black text-base">Compte Club en cours de vérification fédérale</div>
            <p className="text-xs font-medium mt-1 leading-relaxed text-amber-800 dark:text-amber-300">
              La FEBBA doit valider votre licence avant que vous puissiez publier des offres ou lancer des événements.
            </p>
          </div>
        </div>
      )}

      {notification && (
        <div className="mb-8 p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-bold">
          {notification}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          <div className="card p-8">
            <h2 className="font-black text-2xl mb-4">Lancer un Événement (Détection/Tournoi)</h2>
            <form onSubmit={handleLancerEvenement} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Titre de l'événement" value={evtTitre} onChange={(e) => setEvtTitre(e.target.value)} className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-primary/40 border-none" />
                <select value={evtType} onChange={(e) => setEvtType(e.target.value)} className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 text-sm border-none">
                  <option value="DETECTION">Détection Jeunes Talents</option>
                  <option value="TOURNOI">Tournoi Local</option>
                  <option value="STAGE">Stage de Perfectionnement</option>
                </select>
              </div>
              <input type="text" placeholder="Lieu" value={evtLieu} onChange={(e) => setEvtLieu(e.target.value)} className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 text-sm border-none" />
              <textarea placeholder="Description" rows={3} value={evtDesc} onChange={(e) => setEvtDesc(e.target.value)} className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 text-sm border-none" />
              <button type="submit" disabled={club?.statutValidation !== "VALIDE"} className="btn-primary py-3">Soumettre pour validation FEBBA</button>
            </form>
          </div>

          <div className="card p-8">
            <h2 className="font-black text-2xl mb-4">Publier une Offre de Recrutement</h2>
            <form onSubmit={handlePublierOffre} className="flex flex-col gap-4">
              <input type="text" placeholder="Titre de l'offre" value={titreOffre} onChange={(e) => setTitreOffre(e.target.value)} className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 text-sm border-none" />
              <div className="grid grid-cols-2 gap-4">
                <select value={poste} onChange={(e) => setPoste(e.target.value)} className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 text-sm border-none">
                  <option>Meneur</option><option>Arrière</option><option>Ailier</option><option>Ailier Fort</option><option>Pivot</option>
                </select>
                <select value={niveau} onChange={(e) => setNiveau(e.target.value)} className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 text-sm border-none">
                  <option>Senior Élite</option><option>U20 National</option><option>U18 Espoir</option>
                </select>
              </div>
              <textarea placeholder="Description du besoin" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 text-sm border-none" />
              <button type="submit" disabled={club?.statutValidation !== "VALIDE"} className="btn-primary py-3">Publier l'offre</button>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="card p-6">
            <h3 className="font-black text-xl mb-4">Licences Fédérales</h3>
            <div className="flex flex-col gap-3">
              <button onClick={handleDemanderLicences} disabled={club?.statutValidation !== "VALIDE"} className="btn-primary text-sm py-2 text-center w-full">
                📥 Lancer une Demande Globale de Licences
              </button>
            </div>
            {demandes.length > 0 && (
              <div className="mt-4 pt-4 border-t border-card-border">
                <h4 className="text-xs font-bold uppercase mb-2">Historique des demandes</h4>
                {demandes.map(d => (
                  <div key={d.id} className="text-sm bg-gray-50 dark:bg-gray-900 p-2 rounded-xl mb-2 flex justify-between">
                    <span>Saison {d.saison}</span>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${d.statut === "VALIDE" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{d.statut}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
