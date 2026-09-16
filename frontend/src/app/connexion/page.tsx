"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import Image from "next/image";

export default function ConnexionPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Connexion Google
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err) {
      console.error("Erreur Google:", err);
      setError("Erreur de connexion avec Google");
      setLoading(false);
    }
  };

  // ✅ Connexion Email
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const cleanEmail = email.trim().toLowerCase();
    console.log("🔐 Tentative de connexion:", cleanEmail);

    try {
      const res = await signIn("credentials", {
        email: cleanEmail,
        password,
        redirect: false,
      });

      console.log("📬 Réponse signIn:", res);

      if (!res?.ok) {
        setError(
          "Email ou mot de passe incorrect. Si vous avez créé votre compte avec Google, utilisez le bouton Google."
        );
        setLoading(false);
        return;
      }

      // ✅ Redirection selon le rôle
      const session = await getSession();
      console.log("👤 Session après connexion:", session);

      const role = (session?.user as any)?.role;
      console.log("🎭 Rôle détecté:", role);

      const redirectPath =
        role === "ADMIN"
          ? "/admin/validations"
          : role === "CLUB"
          ? "/club/dashboard"
          : "/dashboard";

      console.log("➡️ Redirection vers:", redirectPath);
      router.push(redirectPath);
      router.refresh();
    } catch (err) {
      console.error("❌ Erreur connexion:", err);
      setError("Erreur de connexion");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-5 shadow-xl border-4 border-primary/20">
            <Image
              src="/logo.jpg"
              alt="FasoHoops Logo"
              width={80}
              height={80}
              className="object-cover w-full h-full"
              sizes="80px"
            />
          </div>
          <h1 className="text-3xl font-black mb-2">
            Bienvenue sur FasoHoops.BF
          </h1>
          <p className="text-foreground/60 font-medium">
            Connectez-vous pour accéder à votre espace.
          </p>
        </div>

        <div className="card p-8 flex flex-col gap-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-gray-200 hover:border-primary/40 transition-all font-bold text-sm disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuer avec Google
          </button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-card-border"></div>
            </div>
            <div className="relative text-center">
              <span className="bg-card px-3 text-xs font-semibold text-foreground/40">
                ou avec votre email
              </span>
            </div>
          </div>

          {/* ✅ autoComplete="off" sur le form empêche l'auto-remplissage */}
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-xs font-black uppercase tracking-widest text-foreground/50"
              >
                Adresse e-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
                autoComplete="off"
                required
                className="px-4 py-3.5 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-xs font-black uppercase tracking-widest text-foreground/50"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  className="w-full px-4 py-3.5 pr-12 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Masquer" : "Afficher"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  )}
                </button>
              </div>
              <a
                href="/mot-de-passe"
                className="text-xs font-semibold text-primary hover:underline self-end mt-1"
              >
                Mot de passe oublié ?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 disabled:opacity-50"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-foreground/50 font-medium mt-6">
          Pas encore de compte ?{" "}
          <a href="/inscription" className="text-primary font-bold hover:underline">
            S&apos;inscrire gratuitement
          </a>
        </p>
      </div>
    </div>
  );
}