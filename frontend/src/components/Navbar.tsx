"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { isInstitutionalRole } from "@/lib/permissions";

const navLinks = [
  { href: "/joueurs", label: "Joueurs" },
  { href: "/clubs", label: "Clubs" },
  { href: "/evenements", label: "Événements" },
  { href: "/recrutement", label: "Recrutement" },
];

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user as { role?: string } | undefined)?.role;
  const canAccessInstitutionalSpace = isInstitutionalRole(userRole);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (stored === "dark" || (!stored && prefersDark)) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleTheme = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-5 sm:px-10 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-primary/20 shadow-md flex-shrink-0 group-hover:border-primary/50 transition-all duration-300">
            <Image src="/logo.jpg" alt="FasoHoops Logo" fill className="object-cover" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-black tracking-tight text-foreground">FasoHoops</span>
            <span className="text-[9px] font-bold text-primary tracking-widest">.BF</span>
          </div>
        </Link>

        {/* Desktop Nav — main links only */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                pathname === l.href
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-foreground/70 hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Changer le thème"
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-10H21M3 12H2m15.36-6.36l-.7.7M7.34 17.66l-.7.7m11.32 0l-.7-.7M7.34 7.34l-.7-.7M17 12a5 5 0 11-10 0 5 5 0 0110 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
              </svg>
            )}
          </button>

          {/* Messages icon */}
          <Link
            href="/messages"
            className="hidden md:flex w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Messages"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
          </Link>

          {/* Auth: logged in → profile dropdown, logged out → Connexion + Inscription */}
          {session?.user ? (
            <div className="relative hidden md:block" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xs overflow-hidden">
                  {session.user.image ? (
                    <Image src={session.user.image} alt="Profile" width={28} height={28} className="rounded-full object-cover" />
                  ) : (
                    (session.user.name?.[0] || session.user.email?.[0] || "U").toUpperCase()
                  )}
                </div>
                <span className="text-sm font-semibold text-foreground/80 max-w-[100px] truncate">
                  {session.user.name?.split(" ")[0] || "Mon compte"}
                </span>
                <svg className={`w-3.5 h-3.5 text-foreground/40 transition-transform ${profileOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 card rounded-2xl shadow-2xl border border-card-border overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-card-border">
                    <p className="text-xs font-black text-foreground/80 truncate">{session.user.name || "Utilisateur"}</p>
                    <p className="text-[10px] text-foreground/40 font-medium truncate">{session.user.email}</p>
                  </div>
                  <div className="py-1">
                    {(() => {
                      const userRole = (session?.user as any)?.role || "JOUEUR";
                      let roleItems = [
                        { href: "/dashboard", label: "Tableau de bord", icon: "▣" },
                        { href: "/profil", label: "Mon profil", icon: "👤" },
                        { href: "/notifications", label: "Notifications & Alertes", icon: "🔔" },
                      ];

                      if (userRole === "ADMIN") {
                        roleItems = [
                          { href: "/dashboard", label: "Dashboard Admin FEBBA", icon: "▣" },
                          ...(canAccessInstitutionalSpace ? [{ href: "/admin/validations", label: "Espace institutionnel", icon: "🛡️" }] : []),
                          { href: "/notifications", label: "Notifications & Alertes", icon: "🔔" },
                        ];
                      } else if (userRole === "CLUB") {
                        roleItems = [
                          { href: "/dashboard", label: "Dashboard Club", icon: "▣" },
                          { href: "/club/dashboard", label: "Publier une Offre", icon: "🏛" },
                          { href: "/club/equipes", label: "Mes Équipes & Roster", icon: "📊" },
                          { href: "/notifications", label: "Notifications & Alertes", icon: "🔔" },
                        ];
                      } else if (userRole === "ENTRAINEUR") {
                        roleItems = [
                          { href: "/dashboard", label: "Dashboard Coach", icon: "📋" },
                          { href: "/evenements", label: "Stages & Détections", icon: "🏀" },
                          { href: "/notifications", label: "Notifications & Alertes", icon: "🔔" },
                        ];
                      } else if (userRole === "AGENT") {
                        roleItems = [
                          { href: "/dashboard", label: "Dashboard Agent", icon: "🤝" },
                          { href: "/joueurs", label: "Recrutement Athlètes", icon: "🔍" },
                          { href: "/notifications", label: "Notifications & Alertes", icon: "🔔" },
                        ];
                      }

                      return roleItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                        >
                          <span className="text-base">{item.icon}</span>
                          {item.label}
                        </Link>
                      ));
                    })()}
                  </div>


                  <div className="border-t border-card-border py-1">
                    <button
                      onClick={() => { setProfileOpen(false); signOut({ callbackUrl: "/" }); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <span>🚪</span>
                      Se déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/connexion" className="hidden md:block text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors px-3 py-2">
                Connexion
              </Link>
              <Link href="/inscription" className="hidden md:inline-flex bg-primary text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-primary-hover shadow-md shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200">
                S&apos;inscrire
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Menu mobile"
          >
            <span className={`w-4 h-0.5 bg-foreground rounded-full transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-4 h-0.5 bg-foreground rounded-full transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`w-4 h-0.5 bg-foreground rounded-full transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f172a] px-5 py-4 flex flex-col gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="py-3 px-4 rounded-xl text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/messages" onClick={() => setMenuOpen(false)} className="py-3 px-4 rounded-xl text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            Messages
          </Link>
          {session?.user ? (
            <>
              <Link href="/profil" onClick={() => setMenuOpen(false)} className="py-3 px-4 rounded-xl text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Mon profil</Link>
              <Link href="/statistiques" onClick={() => setMenuOpen(false)} className="py-3 px-4 rounded-xl text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Statistiques</Link>
              <Link href="/abonnements" onClick={() => setMenuOpen(false)} className="py-3 px-4 rounded-xl text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Abonnements</Link>
              <button
                onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                className="py-3 px-4 rounded-xl text-sm font-semibold text-red-500 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Se déconnecter
              </button>
            </>
          ) : (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800 flex gap-3">
              <Link href="/connexion" className="flex-1 text-center py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                Connexion
              </Link>
              <Link href="/inscription" className="flex-1 text-center py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors">
                S&apos;inscrire
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
