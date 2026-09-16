"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import Image from "next/image";

type Role = "JOUEUR" | "CLUB" | "ENTRAINEUR" | "AGENT" | "ADMIN";

// ✅ Les 5 rôles, y compris ADMIN
const ROLES: { value: Role; label: string; desc: string; icon: string }[] = [
  { value: "JOUEUR", label: "Joueur", desc: "Je veux créer mon profil et être recruté", icon: "🏀" },
  { value: "CLUB", label: "Club", desc: "Je recrute des joueurs pour mon équipe", icon: "🏟️" },
  { value: "ENTRAINEUR", label: "Entraîneur", desc: "Je cherche un poste ou je propose mes services", icon: "📋" },
  { value: "AGENT", label: "Agent", desc: "Je gère un portefeuille de joueurs", icon: "💼" },
  { value: "ADMIN", label: "Administrateur", desc: "Je gère la plateforme (FEBB / Ministère)", icon: "🛡️" },
];

export default function InscriptionPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role>("JOUEUR");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ Toggle mot de passe
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Étape 1 : Choix du rôle
  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setStep(2);
  };

  // ✅ Étape 2 : Infos personnelles
  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !nom || !prenom) {
      setError("Tous les champs sont requis");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    setError("");
    setStep(3);
  };

  // ✅ Étape 3 : Envoi
  const handleRegister = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          name: `${prenom} ${nom}`.trim(),
          role: selectedRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de l'inscription");
        setLoading(false);
        return;
      }

      // ✅ Connexion automatique
      const signInRes = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (signInRes?.ok) {
        const session = await getSession();
        const userRole = (session?.user as any)?.role;
        const redirectPath =
          userRole === "ADMIN"
            ? "/admin/validations"
            : userRole === "CLUB"
            ? "/club/dashboard"
            : "/dashboard";
        router.push(redirectPath);
        router.refresh();
      } else {
        setError("Inscription réussie. Connectez-vous manuellement.");
        setLoading(false);
        setTimeout(() => router.push("/connexion"), 2000);
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur serveur");
      setLoading(false);
    }
  };

  // ✅ Inscription Google avec rôle
  const handleGoogleSignUp = async () => {
    document.cookie = `oauth_role=${selectedRole}; Path=/; Max-Age=300; SameSite=Lax`;
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-2xl">
        {/* Indicateur d'étapes */}
        <div className="flex justify-center gap-4 mb-10">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= s ? "bg-orange-500" : "bg-gray-700"
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-xl mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span>{error}</span>
            {error.includes("déjà utilisé") && (
              <a href="/connexion" className="px-4 py-1.5 bg-orange-500 text-white font-bold text-xs rounded-lg hover:bg-orange-600 whitespace-nowrap text-center">
                Se connecter →
              </a>
            )}
          </div>
        )}

        {/* ─────────── ÉTAPE 1 : Choix du rôle ─────────── */}
        {step === 1 && (
          <div>
            <h1 className="text-3xl font-black text-center mb-3">
              Quel est votre profil ?
            </h1>
            <p className="text-gray-400 text-center mb-8">
              Étape 1/3 — Sélectionnez votre profil parmi les 5
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ROLES.map((item) => (
                <button
                  key={item.value}
                  onClick={() => handleRoleSelect(item.value)}
                  className="p-6 rounded-2xl border-2 border-gray-700 hover:border-orange-500 hover:bg-orange-500/10 transition-all text-left"
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="text-xl font-bold mb-1">{item.label}</div>
                  <div className="text-sm text-gray-400">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─────────── ÉTAPE 2 : Informations ─────────── */}
        {step === 2 && (
          <form onSubmit={handleInfoSubmit} className="space-y-5">
            <h1 className="text-3xl font-black text-center mb-3">
              Vos informations
            </h1>
            <p className="text-gray-400 text-center mb-8">
              Étape 2/3 — Remplissez vos informations personnelles
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Prénom"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                autoComplete="given-name"
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-orange-500 focus:outline-none"
              />

              <input
                type="text"
                placeholder="Nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                autoComplete="family-name"
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-orange-500 focus:outline-none"
              />
            </div>

            {/* ✅ Email : pas de valeur prédéfinie */}
            <input
              type="email"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-orange-500 focus:outline-none"
            />

            {/* ✅ Mot de passe avec toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe (min 6 caractères)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-900 border border-gray-700 focus:border-orange-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                aria-label={showPassword ? "Masquer" : "Afficher"}
              >
                {showPassword ? (
                  // Œil barré
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
                  </svg>
                ) : (
                  // Œil ouvert
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                )}
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-xl border border-gray-700 hover:bg-gray-800 transition-all"
              >
                Retour
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold transition-all"
              >
                Suivant
              </button>
            </div>
          </form>
        )}

        {/* ─────────── ÉTAPE 3 : Validation ─────────── */}
        {step === 3 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-black text-center mb-3">
              Validation & Choix de Connexion
            </h1>
            <p className="text-gray-400 text-center">
              Étape 3/3 — Validez vos informations et choisissez votre mode de connexion.
            </p>

            <div className="bg-gray-900 p-5 rounded-xl border border-gray-700">
              <p className="text-sm text-gray-400 mb-2">Récapitulatif :</p>
              <p className="font-bold text-lg">{prenom} {nom}</p>
              <p className="text-gray-400">{email}</p>
              <p className="text-orange-400 font-bold mt-2">
                Rôle : {ROLES.find((r) => r.value === selectedRole)?.label}
              </p>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl text-sm text-orange-200">
              Conformément à la loi burkinabè sur la protection des données
              personnelles, le traitement de votre profil ({ROLES.find((r) => r.value === selectedRole)?.label})
              sera sécurisé et encadré par la FEBB.
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required className="mt-1 w-4 h-4 accent-orange-500" />
              <span className="text-sm">
                J'accepte les Conditions d'utilisation et la Politique de confidentialité de FasoHoops.BF.
              </span>
            </label>

            <button
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full py-3 rounded-xl border-2 border-gray-700 hover:border-orange-500 flex items-center justify-center gap-3 font-bold transition-all disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              S'inscrire avec Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative text-center">
                <span className="bg-gray-950 px-3 text-sm text-gray-500">ou avec email</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 rounded-xl border border-gray-700 hover:bg-gray-800 transition-all"
              >
                Retour
              </button>
              <button
                onClick={handleRegister}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold transition-all disabled:opacity-50"
              >
                {loading ? "Création..." : "Créer mon compte"}
              </button>
            </div>

            <p className="text-center text-sm text-gray-500">
              Déjà inscrit ?{" "}
              <a href="/connexion" className="text-orange-500 font-bold hover:underline">
                Se connecter
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}