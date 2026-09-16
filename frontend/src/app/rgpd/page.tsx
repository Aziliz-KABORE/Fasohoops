export default function RGPD() {
  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      <h1 className="text-4xl font-black mb-8 text-primary">Protection des données (RGPD)</h1>
      
      <section className="space-y-6 text-foreground/80 leading-relaxed">
        <div>
          <h2 className="text-2xl font-bold mb-2">Engagements RGPD</h2>
          <p>
            Bien que basée au Burkina Faso, FasoHoops.BF s'inspire des meilleurs standards internationaux de protection des données, notamment le Règlement Général sur la Protection des Données (RGPD) européen, pour garantir la sécurité et la confidentialité de vos informations.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2">Vos droits</h2>
          <p>
            Conformément à la réglementation, vous disposez des droits suivants concernant vos données personnelles :
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Droit d'accès : vous pouvez demander à consulter les données que nous possédons sur vous.</li>
            <li>Droit de rectification : vous pouvez modifier vos données depuis votre tableau de bord.</li>
            <li>Droit à l'effacement ("droit à l'oubli") : vous pouvez demander la suppression de votre compte et de vos données.</li>
            <li>Droit à la limitation du traitement et à la portabilité de vos données.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2">Exercer vos droits</h2>
          <p>
            Pour exercer ces droits, vous pouvez nous contacter directement à l'adresse email suivante : <strong>dpo@fasohoops.bf</strong>. Nous nous engageons à vous répondre dans un délai d'un mois.
          </p>
        </div>
      </section>
    </div>
  );
}
