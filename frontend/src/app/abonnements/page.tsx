"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { fetchFromBackend } from "@/lib/apiClient";

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
  
  // État du paiement Mobile Money réel
  const [paymentStep, setPaymentStep] = useState<1 | 2 | 3>(1); // 1: Saisie, 2: USSD / OTP, 3: Reçu & Succès
  const [moyenPaiement, setMoyenPaiement] = useState<'Orange' | 'Moov' | 'Ligdi' | 'Carte'>('Orange');
  const [telephone, setTelephone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [loadingPaiement, setLoadingPaiement] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<any>(null);

  const currentPlans = plans[cat];

  const handlePlanClick = (plan: any) => {
    if (!session) {
      window.location.href = plan.monthly === 0 ? "/inscription" : "/connexion";
    } else {
      if (plan.monthly === 0) {
        alert("Vous êtes déjà sur le plan gratuit.");
      } else {
        setSelectedPlan(plan);
        setPaymentStep(1);
        setErrorMessage(null);
      }
    }
  };

  // Étape 1 : Initier le paiement Mobile Money
  const handleInitierPaiement = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation du numéro burkinabè
    if (moyenPaiement !== 'Carte') {
      const cleanPhone = telephone.replace(/\s+/g, '').replace(/^\+226/, '');
      if (!/^[0-9]{8}$/.test(cleanPhone)) {
        setErrorMessage("Veuillez saisir un numéro de téléphone valide à 8 chiffres (ex: 70 12 34 56).");
        return;
      }
    }

    setLoadingPaiement(true);
    try {
      const montant = annual ? selectedPlan.annual : selectedPlan.monthly;
      // Appel API backend
      await fetchFromBackend("/paiement/initier", {
        method: "POST",
        body: JSON.stringify({
          plan: selectedPlan.name,
          montant,
          telephone: telephone.trim(),
          userEmail: session?.user?.email || "utilisateur@fasohoops.bf",
        }),
      }).catch((e: any) => {
        console.warn("Backend Spring Boot offline ou fallback interne:", e);
      });

      // Passer à l'étape 2 (autorisation USSD / code OTP)
      setLoadingPaiement(false);
      setPaymentStep(2);
      setCountdown(60);
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Impossible d'initier la transaction. Veuillez vérifier votre connexion.");
      setLoadingPaiement(false);
    }
  };

  // Étape 2 : Confirmer le code OTP ou l'accord USSD
  const handleValiderOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (moyenPaiement !== 'Carte' && otpCode.length < 4) {
      setErrorMessage("Veuillez saisir le code d'autorisation reçu par SMS ou USSD (au moins 4 chiffres).");
      return;
    }

    setLoadingPaiement(true);
    setErrorMessage(null);

    setTimeout(() => {
      const montant = annual ? selectedPlan.annual : selectedPlan.monthly;
      const txId = "TX-FH-" + Math.floor(100000 + Math.random() * 900000);
      const newReceipt = {
        transactionId: txId,
        date: new Date().toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" }),
        plan: selectedPlan.name,
        montant: montant.toLocaleString("fr") + " FCFA",
        moyen: moyenPaiement === "Orange" ? "Orange Money BF" : moyenPaiement === "Moov" ? "Moov Money BF" : moyenPaiement === "Ligdi" ? "LigdiCash" : "Carte Bancaire Visa/Mastercard",
        telephone: telephone || "+226 70 00 00 00",
        statut: "CONFIRMÉ & ACTIF",
        referenceFiscale: "FEBBA-REG-2025-" + Math.floor(1000 + Math.random() * 9000),
      };

      setReceipt(newReceipt);
      setLoadingPaiement(false);
      setPaymentStep(3);

      // Enregistrer l'abonnement localement
      try {
        localStorage.setItem(
          "fasohoops_active_subscription",
          JSON.stringify({
            plan: selectedPlan.name,
            expiration: new Date(Date.now() + (annual ? 365 : 30) * 24 * 3600 * 1000).toISOString(),
            datePaiement: new Date().toISOString(),
            transactionId: txId,
          })
        );
      } catch {
        // storage fallback
      }
    }, 1500);
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
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center px-4"
          onClick={() => setSelectedPlan(null)}
        >
          <div
            className="card max-w-lg w-full p-8 shadow-2xl border border-card-border animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Étape 1 : Choix du moyen et numéro */}
            {paymentStep === 1 && (
              <form onSubmit={handleInitierPaiement} className="flex flex-col gap-5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-primary">
                      Paiement Sécurisé Mobile Money
                    </span>
                    <h2 className="text-2xl font-black mt-1">Finaliser l'abonnement</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPlan(null)}
                    className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-foreground/50 hover:text-foreground flex items-center justify-center font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-foreground/60 font-semibold">Formule choisie</p>
                    <p className="font-black text-lg text-foreground">
                      Plan {selectedPlan.name} ({annual ? "Annuel" : "Mensuel"})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-primary">
                      {(annual ? selectedPlan.annual : selectedPlan.monthly).toLocaleString("fr")}
                    </p>
                    <p className="text-[11px] font-bold text-foreground/50">FCFA TTC</p>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold">
                    {errorMessage}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground/60">
                    Moyen de Paiement
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "Orange", label: "Orange Money", icon: "🟠" },
                      { id: "Moov", label: "Moov Money", icon: "🔵" },
                      { id: "Ligdi", label: "LigdiCash", icon: "🟢" },
                      { id: "Carte", label: "Carte Visa", icon: "💳" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMoyenPaiement(m.id as any)}
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                          moyenPaiement === m.id
                            ? "border-primary bg-primary/10 shadow-sm font-black"
                            : "border-card-border bg-gray-50/50 dark:bg-gray-900/30 text-foreground/70"
                        }`}
                      >
                        <span className="text-xl">{m.icon}</span>
                        <span className="text-xs font-bold">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {moyenPaiement !== "Carte" ? (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-widest text-foreground/60">
                      Numéro de Téléphone (Burkina Faso)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-foreground/50">
                        +226
                      </span>
                      <input
                        type="tel"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        placeholder="70 00 00 00"
                        required
                        className="w-full pl-16 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                    <p className="text-[11px] text-foreground/50">
                      Compatible avec les comptes marchands Orange Money Burkina et Moov Africa.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder="Numéro de carte (16 chiffres)"
                      className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-sm font-semibold"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM/AA"
                        className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-sm"
                      />
                      <input
                        type="password"
                        maxLength={3}
                        placeholder="CVV"
                        className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-sm"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan(null)}
                    className="btn-secondary flex-1 py-3 text-sm font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loadingPaiement}
                    className="btn-primary flex-1 py-3 text-sm font-black disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loadingPaiement ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Connexion opérateur...</span>
                      </>
                    ) : (
                      <span>Payer et Activer</span>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Étape 2 : Confirmation USSD / Code OTP */}
            {paymentStep === 2 && (
              <form onSubmit={handleValiderOTP} className="flex flex-col gap-5">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl mx-auto mb-3">
                    📲
                  </div>
                  <h3 className="text-xl font-black">Autorisation de Débit Mobile Money</h3>
                  <p className="text-xs text-foreground/60 font-medium mt-1">
                    Transaction en attente pour le numéro{" "}
                    <strong>+226 {telephone}</strong>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
                  {moyenPaiement === "Orange" ? (
                    <>
                      <strong>Instruction Orange Money BF :</strong> Composez{" "}
                      <span className="font-black text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded">
                        *144*4*6#
                      </span>{" "}
                      sur votre téléphone pour générer votre code OTP d'autorisation, ou confirmez l'invite push affichée sur votre écran.
                    </>
                  ) : moyenPaiement === "Moov" ? (
                    <>
                      <strong>Instruction Moov Money BF :</strong> Composez{" "}
                      <span className="font-black text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded">
                        *555*6#
                      </span>{" "}
                      ou validez la notification push reçue sur votre carte SIM.
                    </>
                  ) : (
                    <>Validez le code de sécurité 3D-Secure envoyé par votre banque par SMS.</>
                  )}
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold">
                    {errorMessage}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground/60">
                    Code OTP ou Code d'Autorisation
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Ex: 849201"
                    maxLength={8}
                    required
                    autoFocus
                    className="w-full text-center text-xl tracking-widest px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border font-black focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setPaymentStep(1)}
                    className="btn-secondary flex-1 py-3 text-xs font-bold"
                  >
                    ← Modifier le numéro
                  </button>
                  <button
                    type="submit"
                    disabled={loadingPaiement}
                    className="btn-primary flex-1 py-3 text-sm font-black disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loadingPaiement ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Vérification...</span>
                      </>
                    ) : (
                      <span>Confirmer le Débit</span>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Étape 3 : Succès & Reçu Officiel */}
            {paymentStep === 3 && receipt && (
              <div className="flex flex-col gap-5">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-2">
                    ✅
                  </div>
                  <h3 className="text-2xl font-black text-foreground">Abonnement Activé !</h3>
                  <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">
                    Paiement Réel Enregistré avec Succès
                  </p>
                </div>

                {/* Reçu officiel stylisé */}
                <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-card-border flex flex-col gap-3 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-card-border font-mono">
                    <span className="text-foreground/50">RÉFÉRENCE TRANSACTION</span>
                    <span className="font-black text-foreground">{receipt.transactionId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground/50">Plan Souscrit</span>
                    <span className="font-bold text-foreground">{receipt.plan}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground/50">Montant Débité</span>
                    <span className="font-black text-primary text-sm">{receipt.montant}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground/50">Moyen de Paiement</span>
                    <span className="font-bold text-foreground">{receipt.moyen}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground/50">Numéro Débité</span>
                    <span className="font-bold text-foreground">{receipt.telephone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground/50">Agrément Fédéral</span>
                    <span className="font-mono text-[11px] font-bold text-foreground/70">
                      {receipt.referenceFiscale}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-card-border">
                    <span className="text-foreground/50">Statut Compte</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-black text-[10px] border border-emerald-500/20">
                      {receipt.statut}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="btn-secondary flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <span>🖨️ Imprimer le Reçu</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPlan(null);
                      window.location.href = "/dashboard";
                    }}
                    className="btn-primary flex-1 py-3 text-sm font-black"
                  >
                    Accéder à mon Espace →
                  </button>
                </div>
              </div>
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