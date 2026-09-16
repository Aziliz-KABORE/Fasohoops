"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const CHECK = (
  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);
const CROSS = (
  <svg className="w-4 h-4 text-foreground/20 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const categories = ["Joueurs", "Clubs", "Entraîneurs & Agents"] as const;
type Cat = (typeof categories)[number];

const plans: Record<Cat, { name: string; monthly: number; annual: number; color: string; badge?: string; features: { text: string; included: boolean }[] }[]> = {
  "Joueurs": [
    {
      name: "Gratuit",
      monthly: 0,
      annual: 0,
      color: "border-card-border",
      features: [
        { text: "Profil joueur basique", included: true },
        { text: "Apparition dans les recherches", included: true },
        { text: "Postuler à 3 offres/mois", included: true },
        { text: "Messagerie (5 msg/jour)", included: true },
        { text: "Profil mis en avant", included: false },
        { text: "Statistiques détaillées", included: false },
        { text: "Candidatures illimitées", included: false },
        { text: "Badge Vérifié FEBBA", included: false },
      ],
    },
    {
      name: "Pro",
      monthly: 2500,
      annual: 25000,
      color: "border-primary",
      badge: "Populaire",
      features: [
        { text: "Profil joueur complet + vidéo", included: true },
        { text: "Apparition prioritaire dans les recherches", included: true },
        { text: "Candidatures illimitées", included: true },
        { text: "Messagerie illimitée", included: true },
        { text: "Profil mis en avant", included: true },
        { text: "Statistiques détaillées", included: true },
        { text: "Badge Vérifié FEBBA", included: false },
        { text: "Coaching carrière mensuel", included: false },
      ],
    },
    {
      name: "Élite",
      monthly: 5000,
      annual: 50000,
      color: "border-accent",
      badge: "Premium",
      features: [
        { text: "Tout le plan Pro", included: true },
        { text: "Badge Vérifié FEBBA officiel", included: true },
        { text: "Coaching carrière mensuel", included: true },
        { text: "Mise en relation avec agents", included: true },
        { text: "Accès aux offres en avant-première", included: true },
        { text: "Rapport de performance mensuel", included: true },
        { text: "Support prioritaire", included: true },
        { text: "Profil Top 10 garanti", included: true },
      ],
    },
  ],
  "Clubs": [
    {
      name: "Découverte",
      monthly: 0,
      annual: 0,
      color: "border-card-border",
      features: [
        { text: "Page club basique", included: true },
        { text: "Publier 1 offre active", included: true },
        { text: "Accès à 20 profils/mois", included: true },
        { text: "Messagerie de base", included: true },
        { text: "Badge Vérifié FEBBA", included: false },
        { text: "Offres illimitées", included: false },
        { text: "Accès base de données complète", included: false },
        { text: "Tableau de bord analytique", included: false },
      ],
    },
    {
      name: "Professionnel",
      monthly: 15000,
      annual: 150000,
      color: "border-primary",
      badge: "Recommandé",
      features: [
        { text: "Page club premium + logo", included: true },
        { text: "Jusqu'à 5 offres actives", included: true },
        { text: "Accès complet à la base joueurs", included: true },
        { text: "Messagerie illimitée", included: true },
        { text: "Badge Vérifié FEBBA", included: true },
        { text: "Tableau de bord analytique", included: true },
        { text: "Offres illimitées", included: false },
        { text: "Gestion multi-administrateurs", included: false },
      ],
    },
    {
      name: "Fédéral",
      monthly: 35000,
      annual: 350000,
      color: "border-accent",
      badge: "Enterprise",
      features: [
        { text: "Tout le plan Professionnel", included: true },
        { text: "Offres illimitées", included: true },
        { text: "Gestion multi-administrateurs", included: true },
        { text: "Intégration API FEBBA", included: true },
        { text: "Rapport mensuel sur les recrutements", included: true },
        { text: "Support dédié 24/7", included: true },
        { text: "Formation à l'outil incluse", included: true },
        { text: "Visibilité nationale garantie", included: true },
      ],
    },
  ],
  "Entraîneurs & Agents": [
    {
      name: "Libre",
      monthly: 0,
      annual: 0,
      color: "border-card-border",
      features: [
        { text: "Profil entraîneur/agent", included: true },
        { text: "Visible dans les recherches", included: true },
        { text: "Contact avec 5 joueurs/mois", included: true },
        { text: "Messagerie basique", included: true },
        { text: "Réseau étendu", included: false },
        { text: "Badge certifié", included: false },
        { text: "Contacts illimités", included: false },
        { text: "Accès aux événements pros", included: false },
      ],
    },
    {
      name: "Réseau",
      monthly: 8000,
      annual: 80000,
      color: "border-primary",
      badge: "Populaire",
      features: [
        { text: "Profil complet certifié", included: true },
        { text: "Contact illimité avec les joueurs", included: true },
        { text: "Messagerie illimitée", included: true },
        { text: "Badge certifié FEBBA", included: true },
        { text: "Accès aux événements pros", included: true },
        { text: "Réseau club partenaires", included: true },
        { text: "Tableau de bord agents", included: false },
        { text: "Commission négociée", included: false },
      ],
    },
    {
      name: "Expert",
      monthly: 20000,
      annual: 200000,
      color: "border-accent",
      badge: "Premium",
      features: [
        { text: "Tout le plan Réseau", included: true },
        { text: "Tableau de bord agents avancé", included: true },
        { text: "Gestion de carrière multi-joueurs", included: true },
        { text: "Mise en relation internationale", included: true },
        { text: "Contrats modèles inclus", included: true },
        { text: "Accès clubs africains partenaires", included: true },
        { text: "Support juridique sportif", included: true },
        { text: "Rapport mensuel sur les contrats", included: true },
      ],
    },
  ],
};

const colorBorder: Record<string, string> = {
  "border-primary": "border-primary shadow-xl shadow-primary/10",
  "border-accent": "border-accent shadow-xl shadow-accent/10",
  "border-card-border": "border-card-border",
};
const badgeColor: Record<string, string> = {
  Populaire: "bg-primary/10 text-primary border-primary/20",
  Recommandé: "bg-primary/10 text-primary border-primary/20",
  Premium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Enterprise: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
};

export default function OffresPage() {
  const { data: session } = useSession();
  const [cat, setCat] = useState<Cat>("Joueurs");
  const [annual, setAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  
  // Payment states
  const [moyenPaiement, setMoyenPaiement] = useState('Orange');
  const [telephone, setTelephone] = useState('');
  const [loadingPaiement, setLoadingPaiement] = useState(false);
  const [paiementSuccess, setPaiementSuccess] = useState(false);

  const currentPlans = plans[cat];

  const handlePlanClick = (plan: any) => {
      if (!session) {
          window.location.href = plan.monthly === 0 ? "/inscription" : "/connexion";
      } else {
          if (plan.monthly === 0) {
              alert("Vous êtes déjà sur le plan gratuit.");
          } else {
              setSelectedPlan(plan);
          }
      }
  }

  const lancerPaiement = async () => {
    setLoadingPaiement(true);
    try {
        // En vrai, cela irait vers CinetPay / Orange Money API
        // Ici on simule une requête interne pour débloquer l'abonnement
        await fetchFromBackend(`/joueurs/${session?.user?.id}`, {
            method: "PUT",
            body: JSON.stringify({ role: "PREMIUM" }) // Simulation
        });
        setPaiementSuccess(true);
        setTimeout(() => {
            setPaiementSuccess(false);
            setSelectedPlan(null);
            alert("Abonnement activé avec succès !");
            window.location.reload();
        }, 2000);
    } catch (err) {
        console.error(err);
        alert("Erreur de paiement.");
    } finally {
        setLoadingPaiement(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-10 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 mb-5">
          Offres & Abonnements
        </div>
        <h1 className="section-title mb-4">
          Choisissez le plan<br />
          <span className="gradient-text">qui vous correspond.</span>
        </h1>
        <p className="text-foreground/60 max-w-xl mx-auto font-medium">
          Des formules adaptées à chaque acteur du basketball burkinabè. Commencez gratuitement, évoluez à votre rythme.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="flex bg-gray-100 dark:bg-gray-900 rounded-2xl p-1.5 gap-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                cat === c
                  ? "bg-white dark:bg-gray-800 text-primary shadow-md"
                  : "text-foreground/50 hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center gap-4 mb-10">
        <span className={`text-sm font-bold transition-colors ${!annual ? "text-foreground" : "text-foreground/40"}`}>Mensuel</span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${annual ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"}`}
        >
          <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${annual ? "translate-x-6" : ""}`} />
        </button>
        <span className={`text-sm font-bold transition-colors flex items-center gap-2 ${annual ? "text-foreground" : "text-foreground/40"}`}>
          Annuel
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800">
            -17%
          </span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {currentPlans.map((plan) => (
          <div
            key={plan.name}
            className={`card border-2 p-8 flex flex-col gap-6 relative transition-all duration-300 hover:-translate-y-1 ${colorBorder[plan.color]}`}
          >
            {plan.badge && (
              <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black px-3 py-1 rounded-full border whitespace-nowrap ${badgeColor[plan.badge]}`}>
                {plan.badge}
              </span>
            )}

            <div>
              <h3 className="text-xl font-black mb-1">{plan.name}</h3>
              <div className="flex items-end gap-1.5">
                <span className="text-4xl font-black text-primary">
                  {annual ? plan.annual.toLocaleString("fr") : plan.monthly.toLocaleString("fr")}
                </span>
                <span className="text-sm font-semibold text-foreground/50 mb-1.5">
                  FCFA{annual ? "/an" : "/mois"}
                </span>
              </div>
              {annual && plan.annual > 0 && (
                <p className="text-xs text-green-600 dark:text-green-400 font-semibold mt-1">
                  Économisez {(plan.monthly * 12 - plan.annual).toLocaleString("fr")} FCFA/an
                </p>
              )}
            </div>

            <ul className="flex flex-col gap-2.5 flex-1">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm font-medium">
                  {f.included ? CHECK : CROSS}
                  <span className={f.included ? "text-foreground/80" : "text-foreground/30"}>{f.text}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePlanClick(plan)}
              className={`w-full text-center py-3 rounded-xl font-bold text-sm transition-all ${
                plan.color === "border-primary"
                  ? "btn-primary"
                  : plan.color === "border-accent"
                  ? "bg-accent text-white hover:opacity-90"
                  : "btn-secondary"
              }`}
            >
              {!session 
                ? (plan.monthly === 0 ? "Commencer gratuitement" : "S'inscrire pour payer")
                : (plan.monthly === 0 ? "Plan actuel" : "Mettre à niveau (Payer)")
              }
            </button>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4" onClick={() => setSelectedPlan(null)}>
          <div className="card max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-black mb-2">Finaliser l'abonnement</h2>
            <p className="text-foreground/60 font-medium mb-6">Plan sélectionné : <strong>{selectedPlan.name}</strong> ({annual ? selectedPlan.annual : selectedPlan.monthly} FCFA)</p>
            
            {paiementSuccess ? (
                <div className="p-4 bg-green-50 text-green-700 rounded-xl font-bold text-center">
                    ✅ Paiement validé avec succès !
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-4 mb-6">
                    <label className="text-xs font-black uppercase tracking-widest text-foreground/50">Moyen de paiement</label>
                    <select 
                        value={moyenPaiement} 
                        onChange={(e) => setMoyenPaiement(e.target.value)}
                        className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                        <option value="Orange">Orange Money</option>
                        <option value="Moov">Moov Money</option>
                        <option value="Ligdi">LigdiCash</option>
                        <option value="Carte">Carte Bancaire</option>
                    </select>

                    {moyenPaiement !== 'Carte' && (
                        <>
                        <label className="text-xs font-black uppercase tracking-widest text-foreground/50">Numéro de téléphone</label>
                        <input 
                            type="tel" 
                            value={telephone} 
                            onChange={(e) => setTelephone(e.target.value)} 
                            placeholder="Ex: 70 00 00 00" 
                            className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                        </>
                    )}
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setSelectedPlan(null)} className="btn-secondary flex-1">Annuler</button>
                        <button onClick={lancerPaiement} disabled={loadingPaiement} className="btn-primary flex-1">
                            {loadingPaiement ? "Traitement..." : "Payer et Activer"}
                        </button>
                    </div>
                </>
            )}
          </div>
        </div>
      )}

      <div className="card p-8 text-center">
        <h2 className="text-2xl font-black mb-3">Des questions sur nos offres ?</h2>
        <p className="text-foreground/60 font-medium max-w-lg mx-auto mb-6">
          Notre équipe est disponible pour vous aider à choisir le plan adapté à vos besoins et à votre budget.
        </p>
        <Link href="/contact" className="btn-secondary">Contacter l'équipe</Link>
      </div>
    </div>
  );
}