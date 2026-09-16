export default function MentionsLegales() {
  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      <h1 className="text-4xl font-black mb-8 text-primary">Mentions Légales</h1>
      
      <section className="space-y-6 text-foreground/80 leading-relaxed">
        <div>
          <h2 className="text-2xl font-bold mb-2">1. Éditeur du site</h2>
          <p>
            Le site <strong>FasoHoops.BF</strong> est édité par l'équipe projet FasoHoops en partenariat officiel avec la <strong>Fédération Burkinabè de Basketball (FEBBA)</strong>.
          </p>
          <p className="mt-2">
            Adresse : Ouagadougou, Burkina Faso<br />
            Email : contact@fasohoops.bf
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2">2. Hébergement</h2>
          <p>
            Ce site est hébergé par Vercel Inc.<br />
            Adresse : 340 S Lemon Ave #4133 Walnut, CA 91789, USA.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2">3. Propriété intellectuelle</h2>
          <p>
            L'ensemble des éléments figurant sur ce site (textes, images, logos, vidéos) est protégé par les dispositions du Code de la Propriété Intellectuelle. Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de l'éditeur.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2">4. Responsabilité</h2>
          <p>
            L'éditeur s'efforce de fournir sur le site des informations aussi précises que possible. Toutefois, il ne pourra être tenu responsable des omissions, des inexactitudes et des carences dans la mise à jour, qu'elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.
          </p>
        </div>
      </section>
    </div>
  );
}
