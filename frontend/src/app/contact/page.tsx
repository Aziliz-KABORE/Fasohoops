"use client";
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "Problème technique", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-10 py-12">
      <div className="mb-10">
        <h1 className="section-title mb-3">Nous Contacter</h1>
        <p className="text-foreground/60 font-medium max-w-xl">Vous avez une question, une suggestion ou besoin d'assistance ? L'équipe FasoHoops.BF vous répond sous 24h.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Left — Contact info */}
        <div className="flex flex-col gap-6">
          {[
            {
              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>,
              label: "Email", value: "contact@fasohoops.bf", href: "mailto:contact@fasohoops.bf"
            },
            {
              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>,
              label: "Téléphone", value: "+226 25 30 XX XX (Secrétariat FEBBA)", href: null
            },
            {
              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>,
              label: "Adresse", value: "Fédération Burkinabè de Basketball\nStade du 4 Août, 01 BP 1344\nOuagadougou 01, Burkina Faso", href: null
            },
          ].map((item) => (
            <div key={item.label} className="card p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">{item.icon}</div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-foreground/40 mb-0.5">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="font-semibold text-primary hover:underline text-sm">{item.value}</a>
                ) : (
                  <p className="font-semibold text-foreground/80 text-sm whitespace-pre-line">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right — Form */}
        <div className="card p-8">
          {sent ? (
            <div className="flex flex-col items-center justify-center gap-5 py-10 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              </div>
              <div>
                <h3 className="font-black text-xl mb-2">Message envoyé !</h3>
                <p className="text-foreground/60 font-medium text-sm">Nous vous répondrons sous 24h à l'adresse <strong>{form.email}</strong>.</p>
              </div>
              <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "Problème technique", message: "" }); }} className="btn-secondary">
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-foreground/50">Nom complet</label>
                <input
                  type="text" id="name" name="name" value={form.name} onChange={handleChange}
                  autoComplete="new-password" placeholder=""
                  required className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-email" className="text-xs font-black uppercase tracking-widest text-foreground/50">Adresse email</label>
                <input
                  type="email" id="contact-email" name="email" value={form.email} onChange={handleChange}
                  autoComplete="new-password" placeholder=""
                  required className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-xs font-black uppercase tracking-widest text-foreground/50">Sujet</label>
                <select
                  id="subject" name="subject" value={form.subject} onChange={handleChange}
                  className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option>Problème technique</option>
                  <option>Question sur les licences</option>
                  <option>Partenariat</option>
                  <option>Autre</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-xs font-black uppercase tracking-widest text-foreground/50">Message</label>
                <textarea
                  id="message" name="message" value={form.message} onChange={handleChange}
                  rows={4} placeholder=""
                  required className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-card-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? "Envoi en cours..." : "Envoyer le message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
