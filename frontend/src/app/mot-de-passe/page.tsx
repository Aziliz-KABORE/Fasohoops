"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function MotDePassePage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block w-20 h-20 rounded-full overflow-hidden mx-auto mb-5 shadow-xl border-4 border-primary/20 hover:scale-105 transition-transform">
            <Image src="/logo.jpg" alt="FasoHoops Logo" width={80} height={80} className="object-cover w-full h-full" />
          </Link>
          <h1 className="text-3xl font-black mb-2">Mot de passe oublié</h1>
          <p className="text-foreground/60 font-medium">Réinitialisez l'accès à votre compte.</p>
        </div>

        <div className="card p-8 flex flex-col gap-5">
          {isSubmitted ? (
            <div className="text-center flex flex-col gap-4 py-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 mx-auto flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">E-mail envoyé</h3>
                <p className="text-sm text-foreground/60">Si un compte existe pour <strong>{email}</strong>, un lien de réinitialisation vous a été envoyé.</p>
              </div>
              <Link href="/connexion" className="btn-secondary mt-4 w-full">Retour à la connexion</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-foreground/50">Adresse e-mail</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="px-4 py-3.5 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
              </div>
              <button type="submit" className="btn-primary w-full mt-2">
                Envoyer le lien
              </button>
            </form>
          )}
        </div>
        
        {!isSubmitted && (
          <div className="text-center mt-6">
            <Link href="/connexion" className="text-sm font-semibold text-foreground/50 hover:text-foreground transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              Retour à la connexion
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
