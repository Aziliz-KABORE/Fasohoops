export default function Home() {
  const stats = [
    { value: "500+", label: "Joueurs inscrits" },
    { value: "42", label: "Clubs vérifiés" },
    { value: "18", label: "Provinces couvertes" },
    { value: "100%", label: "Basketball BF" },
  ];

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
      title: "Profil Joueur Complet",
      desc: "Créez votre portfolio digital avec vidéos, statistiques et historique de clubs. Soyez visible auprès des recruteurs.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
        </svg>
      ),
      title: "Moteur de Recherche Avancé",
      desc: "Filtrez les talents par poste, taille, âge, niveau, ville et statistiques. Trouvez exactement le profil qu'il vous faut.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      ),
      title: "Messagerie Temps Réel",
      desc: "Communiquez directement avec les clubs, agents et entraîneurs via une messagerie sécurisée et instantanée.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
      title: "Événements & Détections",
      desc: "Gérez les inscriptions aux tournois, détections et stages. Recevez des notifications et suivez le calendrier FEBBA.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6.75v6.75" />
        </svg>
      ),
      title: "Statistiques & Analytics",
      desc: "Consultez vos performances, l'évolution de votre profil et les tendances du recrutement basketball au Burkina.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      title: "Sécurité & Conformité",
      desc: "Protection des données des mineurs conforme à la loi burkinabè. Consentement parental intégré et profils certifiés.",
    },
  ];

  const topPlayers = [
    { name: "Koné Traoré", poste: "Ailier Fort", club: "AS Douanes Basket", stats: { pts: 24.5, reb: 11.2, ast: 3.4 }, niveau: "Élite" },
    { name: "Ibrahim Ouédraogo", poste: "Meneur", club: "USFA Basket", stats: { pts: 19.8, reb: 4.5, ast: 8.7 }, niveau: "Pro" },
    { name: "Salif Kaboré", poste: "Pivot", club: "Étoile Filante", stats: { pts: 17.2, reb: 14.1, ast: 1.2 }, niveau: "Élite" },
  ];

  return (
    <div className="flex flex-col">

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden">
        {/* BG Glow */}
        <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-primary/10 dark:bg-primary/5 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-accent/10 dark:bg-accent/5 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4 pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-5 sm:px-10 pt-16 pb-20 lg:pt-24 lg:pb-28 flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Left */}
          <div className="lg:w-[55%] flex flex-col gap-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-bold border border-accent/20 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Partenaire Officiel FEBBA — Burkina Faso
            </div>

            <h1 className="section-title text-6xl sm:text-7xl">
              Découvrez le prochain<br />
              <span className="gradient-text">talent élite</span><br />
              du basketball BF.
            </h1>

            <p className="text-lg text-foreground/70 max-w-lg leading-relaxed font-medium">
              FasoHoops.BF connecte joueurs, clubs, entraîneurs et recruteurs dans un seul écosystème numérique conçu pour le basketball burkinabè.
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <a href="/joueurs" className="btn-primary text-sm">
                Explorer les Talents
              </a>
              <a href="/inscription" className="btn-secondary text-sm">
                Créer mon Profil Gratuit
              </a>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-black text-primary">{s.value}</div>
                  <div className="text-xs font-semibold text-foreground/50 leading-tight mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Clean Aesthetic Visual */}
          <div className="lg:w-[45%] w-full relative flex justify-center items-center">
            {/* Glowing backgrounds */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-accent/30 blur-3xl rounded-full pointer-events-none transform -rotate-12 scale-110"></div>
            
            <div className="relative z-10 w-full max-w-sm animate-float">
              {/* Main Abstract Card */}
              <div className="card shadow-2xl overflow-hidden bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/50 dark:border-white/10 p-8 flex flex-col items-center justify-center gap-6 text-center h-[320px] rounded-3xl relative">
                
                {/* Decorative elements inside */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/20 blur-2xl rounded-full translate-y-1/2 -translate-x-1/2"></div>

                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center shadow-lg shadow-primary/30 mb-2 relative z-10">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                
                <h3 className="text-3xl font-black text-foreground relative z-10 leading-tight">
                  L'Élite du <br/>Basketball
                </h3>
                <p className="text-sm font-semibold text-foreground/70 relative z-10 max-w-xs">
                  La plateforme de référence pour propulser votre carrière.
                </p>
              </div>

              {/* Small floating badge */}
              <div className="absolute -bottom-6 -left-6 card shadow-xl bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-white/50 dark:border-white/10 px-5 py-4 flex items-center gap-3 rounded-2xl">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-sm font-black text-foreground">50+ Clubs Actifs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PARTNERS STRIP ===== */}
      <section className="border-y border-gray-200 dark:border-gray-800 py-8 bg-gray-50 dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-5 sm:px-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-12">
          <p className="text-xs font-black tracking-widest uppercase text-foreground/30 whitespace-nowrap">Partenaires officiels</p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
            {["FEBBA", "AS Douanes BF", "USFA Basket", "Étoile Filante", "Ouaga Sport"].map((p) => (
              <span key={p} className="text-sm font-black text-foreground/30 hover:text-primary transition-colors cursor-default">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-24 max-w-7xl mx-auto px-5 sm:px-10 w-full">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 mb-5">
            Fonctionnalités
          </div>
          <h2 className="section-title">Tout ce dont vous avez<br />besoin, en un seul endroit.</h2>
          <p className="text-foreground/60 mt-4 max-w-xl mx-auto font-medium">Une suite d'outils puissants pour les joueurs, clubs, entraîneurs et agents du basketball burkinabè.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="card p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                {f.icon}
              </div>
              <h3 className="text-lg font-black">{f.title}</h3>
              <p className="text-sm text-foreground/60 leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TOP PLAYERS ===== */}
      <section className="py-24 bg-surface border-y border-card-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-bold border border-accent/20 mb-4">Top Prospects</div>
              <h2 className="section-title">Talents à suivre<br />cette saison.</h2>
            </div>
            <a href="/joueurs" className="btn-secondary text-sm self-start sm:self-auto">Voir tous les joueurs</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topPlayers.map((p, i) => (
              <div key={i} className="card p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-orange-300 flex items-center justify-center text-white font-black text-xl">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-black text-lg">{p.name}</h3>
                      <p className="text-xs text-foreground/50 font-semibold">{p.poste}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{p.niveau}</span>
                </div>
                <p className="text-xs text-foreground/50 font-semibold">{p.club}</p>
                <div className="flex gap-4 pt-4 border-t border-card-border">
                  {Object.entries(p.stats).map(([k, v]) => (
                    <div key={k} className="text-center">
                      <div className="text-2xl font-black">{v}</div>
                      <div className="text-[10px] font-black text-foreground/40 tracking-widest uppercase">{k}</div>
                    </div>
                  ))}
                </div>
                <a href={`/joueurs/${i + 1}`} className="btn-secondary text-sm w-full text-center text-xs">
                  Voir le profil
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24 max-w-7xl mx-auto px-5 sm:px-10 w-full">
        <div className="card p-12 sm:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 mb-6">
              Rejoignez FasoHoops.BF
            </div>
            <h2 className="section-title mb-4">Prêt à faire décoller<br />votre carrière ?</h2>
            <p className="text-foreground/60 max-w-lg mx-auto font-medium mb-8">
              Que vous soyez joueur, club, entraîneur ou agent, FasoHoops.BF vous offre les outils pour évoluer au plus haut niveau du basketball burkinabè.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="/inscription" className="btn-primary">S'inscrire Gratuitement</a>
              <a href="/connexion" className="btn-secondary">Se Connecter</a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
