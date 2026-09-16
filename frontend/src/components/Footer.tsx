import Link from "next/link";

const footerLinks = {
  Plateforme: [
    { href: "/joueurs", label: "Explorer les joueurs" },
    { href: "/clubs", label: "Annuaire des clubs" },
    { href: "/evenements", label: "Calendrier & Événements" },
    { href: "/recrutement", label: "Offres de recrutement" },
  ],
  Compte: [
    { href: "/inscription", label: "Créer un compte" },
    { href: "/connexion", label: "Se connecter" },
    { href: "/dashboard", label: "Tableau de bord" },
    { href: "/messages", label: "Messagerie" },
  ],
  Juridique: [
    { href: "/mentions-legales", label: "Mentions légales" },
    { href: "/confidentialite", label: "Politique de confidentialité" },
    { href: "/rgpd", label: "Protection des données" },
    { href: "/contact", label: "Nous contacter" },
  ],
};

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#080f1c]">
      <div className="max-w-7xl mx-auto px-5 sm:px-10 pt-14 pb-8">
        
        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand */}
          <div className="md:col-span-1 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12 overflow-hidden rounded-full border-2 border-primary/20 shadow-md">
                <img src="/logo.jpg" alt="FasoHoops Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-base font-black tracking-tight">FasoHoops</span>
                <span className="text-[10px] font-bold text-primary tracking-widest">.BF</span>
              </div>
            </Link>
            <p className="text-sm text-foreground/60 leading-relaxed">
              La plateforme nationale de recrutement de basketball du Burkina Faso, en partenariat avec la <strong className="text-foreground/80">FEBBA</strong>.
            </p>
            {/* Burkina flag colors stripe */}
            <div className="flex rounded-full overflow-hidden w-16 h-1.5">
              <div className="flex-1 bg-red-600"></div>
              <div className="flex-1 bg-green-600"></div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="flex flex-col gap-4">
              <h4 className="text-xs font-black tracking-widest text-foreground/40 uppercase">{section}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-foreground/70 hover:text-primary transition-colors font-medium"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-foreground/40 font-medium text-center sm:text-left">
            &copy; {new Date().getFullYear()} FasoHoops.BF — Tous droits réservés. Partenaire officiel de la FEBBA.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-foreground/40 font-medium">Fait avec</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-xs text-foreground/40 font-medium">au Burkina Faso</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
