"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getInstitutionLabel, isInstitutionalRole } from "@/lib/permissions";
import { fetchFromBackend } from "@/lib/apiClient";

export default function AdminValidationsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"validations" | "licences" | "stats" | "evenements">("validations");
  const [clubs, setClubs] = useState<any[]>([]);
  const [licences, setLicences] = useState<any[]>([]);
  const [evenements, setEvenements] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const institutionRole = (session?.user as { role?: string } | undefined)?.role ?? "ADMIN";

  useEffect(() => {
    const userRole = (session?.user as { role?: string } | undefined)?.role;
    if (session && !isInstitutionalRole(userRole)) {
      router.replace("/dashboard");
    } else {
      loadAdminData();
    }
  }, [session, router]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [clubsData, statsData, licencesData, evtsData] = await Promise.all([
        fetchFromBackend("/admin/validations/clubs"),
        fetchFromBackend("/admin/stats"),
        fetchFromBackend("/admin/licences/en-attente"),
        fetchFromBackend("/evenements"), // Tous les événements validés ou non, on filtrera côté client ou backend
      ]);
      setClubs(clubsData);
      setStats(statsData);
      setLicences(licencesData);
      setEvenements(evtsData);
    } catch (error) {
      console.error("Erreur chargement données admin:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprouver = async (id: string, nom: string) => {
    try {
      await fetchFromBackend(`/admin/validations/clubs/${id}/approuver`, { method: "POST" });
      setClubs((prev) => prev.filter((c) => c.id !== id));
      setNotification(`✅ Le compte du club "${nom}" a été validé officiellement par la FEBBA.`);
      setTimeout(() => setNotification(null), 4000);
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefuser = async (id: string, nom: string) => {
    try {
      await fetchFromBackend(`/admin/validations/clubs/${id}/refuser`, { method: "POST" });
      setClubs((prev) => prev.filter((c) => c.id !== id));
      setNotification(`❌ Le compte du club "${nom}" a été refusé.`);
      setTimeout(() => setNotification(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleValiderLicence = async (id: string) => {
    try {
      await fetchFromBackend(`/admin/licences/${id}/valider`, { method: "PUT" });
      setNotification(`✅ Licence validée.`);
      setTimeout(() => setNotification(null), 4000);
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-10 py-12">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black border border-emerald-500/20 mb-3">
            Espace institutionnel · {getInstitutionLabel(institutionRole)}
          </div>
          <h1 className="section-title mb-2">Administration & Gouvernance</h1>
          <p className="text-foreground/60 font-medium">Validation des licences, homologation des clubs et événements.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-4 py-2 rounded-xl bg-card border border-card-border text-xs font-black text-foreground/70 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Connecté
          </span>
        </div>
      </div>

      {notification && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm font-bold animate-fade-in flex items-center justify-between">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-emerald-600 hover:text-emerald-800 font-black">✕</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-foreground/50 font-semibold">Chargement des données...</div>
      ) : (
        <>
          <div className="flex border-b border-card-border mb-8 overflow-x-auto gap-2">
            {[
              { id: "validations", label: "Homologations Clubs", badge: clubs.length },
              { id: "licences", label: "Licences en attente", badge: licences.length },
              { id: "evenements", label: "Événements/Dépôts", badge: evenements.filter(e => e.statut === "EN_ATTENTE").length },
              { id: "stats", label: "Statistiques Globales", badge: null },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-4 px-5 text-sm font-black transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-foreground/50 hover:text-foreground hover:border-gray-300"
                }`}
              >
                {tab.label}
                {tab.badge !== null && tab.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-black">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {activeTab === "validations" && (
            <div className="flex flex-col gap-6">
              <div className="card p-6">
                <h2 className="font-black text-xl mb-1">Clubs en attente de validation</h2>
                {clubs.length === 0 ? (
                  <p className="text-foreground/50 font-medium py-4">Aucun club en attente.</p>
                ) : (
                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-card-border text-[11px] font-black uppercase tracking-wider text-foreground/40">
                          <th className="pb-3 px-3">Structure / Nom</th>
                          <th className="pb-3 px-3">Ville</th>
                          <th className="pb-3 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-card-border text-sm">
                        {clubs.map((c) => (
                          <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                            <td className="py-4 px-3 font-black">{c.nomStructure || c.nom}</td>
                            <td className="py-4 px-3 font-medium text-foreground/70">{c.ville}</td>
                            <td className="py-4 px-3 text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => handleApprouver(c.id, c.nomStructure || c.nom)} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700">Approuver</button>
                                <button onClick={() => handleRefuser(c.id, c.nomStructure || c.nom)} className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs hover:bg-red-700">Refuser</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "licences" && (
            <div className="card p-6">
              <h2 className="font-black text-xl mb-4">Demandes de Licences par Club</h2>
              {licences.length === 0 ? (
                <p className="text-foreground/50 font-medium">Aucune demande de licence en attente.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {licences.map((l) => (
                    <div key={l.id} className="p-4 rounded-2xl border border-card-border bg-gray-50 dark:bg-gray-900/30">
                      <div className="font-black text-base">{l.club?.nomStructure}</div>
                      <div className="text-xs font-semibold text-primary mt-1">Saison : {l.saison}</div>
                      <div className="text-sm text-foreground/70 mt-2">Joueurs prévus : {l.nombreJoueurs}</div>
                      <div className="text-xs text-foreground/50 italic mt-1">"{l.commentaireClub}"</div>
                      <div className="mt-4 pt-4 border-t border-card-border flex justify-end">
                        <button onClick={() => handleValiderLicence(l.id)} className="btn-primary py-1.5 px-4 text-xs">Valider la demande</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "evenements" && (
            <div className="card p-6">
              <h2 className="font-black text-xl mb-4">Événements & Dépôts de Candidature</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {evenements.map((e) => (
                  <div key={e.id} className="p-4 rounded-2xl border border-card-border">
                    <div className="flex justify-between items-start">
                      <div className="font-black text-lg">{e.titre}</div>
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full ${e.statut === "VALIDE" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{e.statut}</span>
                    </div>
                    <div className="text-xs text-primary font-bold mt-1 uppercase">{e.type}</div>
                    <div className="text-sm mt-2 text-foreground/70 line-clamp-2">{e.description}</div>
                    <div className="text-xs mt-3 opacity-60">Lieu: {e.lieu}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "stats" && stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { title: "Clubs Affiliés FEBBA", value: stats.totalClubs || "0", sub: "Au niveau national" },
                { title: "Licenciés Nationaux", value: stats.totalJoueurs || "0", sub: "Joueurs enregistrés" },
                { title: "Événements en attente", value: stats.evenementsEnAttente || "0", sub: "Tournois et Dépôts" },
                { title: "Licences en attente", value: stats.demandesLicenceEnAttente || "0", sub: "À valider" },
              ].map((s) => (
                <div key={s.title} className="card p-6">
                  <div className="text-xs font-black uppercase text-foreground/40 tracking-wider mb-2">{s.title}</div>
                  <div className="text-3xl font-black mb-1 text-primary">{s.value}</div>
                  <div className="text-[11px] font-semibold text-foreground/50">{s.sub}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
