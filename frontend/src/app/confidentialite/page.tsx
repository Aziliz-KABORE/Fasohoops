export default function Confidentialite() {
  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      <h1 className="text-4xl font-black mb-8 text-primary">Politique de Confidentialité</h1>
      
      <section className="space-y-6 text-foreground/80 leading-relaxed">
        <div>
          <h2 className="text-2xl font-bold mb-2">1. Collecte des données</h2>
          <p>
            Dans le cadre de l'utilisation de FasoHoops.BF, nous sommes amenés à collecter des données personnelles (nom, prénom, âge, statistiques sportives, coordonnées) nécessaires au fonctionnement de la plateforme de recrutement.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2">2. Finalité des données</h2>
          <p>
            Les données collectées sont utilisées pour :
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Permettre la mise en relation entre joueurs, clubs et entraîneurs.</li>
            <li>Fournir des statistiques consolidées à la Fédération Burkinabè de Basketball (FEBBA).</li>
            <li>Assurer la sécurité et la modération de la plateforme.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2">3. Protection des mineurs</h2>
          <p>
            Conformément à nos engagements, la création de profil pour les joueurs mineurs requiert un consentement parental explicite. Les données des mineurs bénéficient d'une protection renforcée (chiffrement AES-256) et leur visibilité est restreinte aux comptes vérifiés par la FEBBA (clubs et entraîneurs).
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2">4. Durée de conservation</h2>
          <p>
            Les données sont conservées pour la durée strictement nécessaire à la gestion de la relation avec l'utilisateur et conformément aux obligations légales.
          </p>
        </div>
      </section>
    </div>
  );
}
