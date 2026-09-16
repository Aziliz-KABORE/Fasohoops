package bf.fasohoops.api.config;

import bf.fasohoops.api.entity.*;
import bf.fasohoops.api.repository.ClubRepository;
import bf.fasohoops.api.repository.JoueurRepository;
import bf.fasohoops.api.repository.OffreRepository;
import bf.fasohoops.api.repository.UserRepository;
import bf.fasohoops.api.repository.EvenementRepository;
import bf.fasohoops.api.repository.DemandeLicenceRepository;
import bf.fasohoops.api.repository.CandidatureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ClubRepository clubRepository;
    private final JoueurRepository joueurRepository;
    private final OffreRepository offreRepository;
    private final EvenementRepository evenementRepository;
    private final DemandeLicenceRepository demandeLicenceRepository;
    private final CandidatureRepository candidatureRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            System.out.println("🏀 Base de données FasoHoops déjà initialisée avec des données.");
            return;
        }

        System.out.println("🏀 Amorce de la base de données FasoHoops (Clubs, Joueurs, Offres burkinabè)...");

        // 1. Initialisation des Clubs
        Club douanes = new Club();
        douanes.setEmail("asdouanes@burkina.bf");
        douanes.setMotDePasse(passwordEncoder.encode("club123"));
        douanes.setNom("AS Douanes");
        douanes.setPrenom("Bureau");
        douanes.setRole(Role.CLUB);
        douanes.setNomStructure("AS Douanes BF");
        douanes.setVille("Ouagadougou");
        douanes.setHistorique("Fondé en 1968, octuple champion national de première division.");
        douanes.setBesoinsRecrutement("Ailier Fort Senior et Pivot");
        douanes.setLicenceNumero("BF-CLUB-001");
        douanes.setStatutValidation("VALIDE");
        douanes.setEquipesEtCategories("Senior, U20, U18, U15");
        clubRepository.save(douanes);

        Club usfa = new Club();
        usfa.setEmail("usfa@burkina.bf");
        usfa.setMotDePasse(passwordEncoder.encode("club123"));
        usfa.setNom("USFA Basket");
        usfa.setPrenom("Direction");
        usfa.setRole(Role.CLUB);
        usfa.setNomStructure("USFA Basket");
        usfa.setVille("Ouagadougou");
        usfa.setHistorique("Club omnisports des forces armées, 5x Champion National.");
        usfa.setBesoinsRecrutement("Meneur d'expérience et Arrière shooteur");
        usfa.setLicenceNumero("BF-CLUB-002");
        usfa.setStatutValidation("VALIDE");
        usfa.setEquipesEtCategories("Senior + U18");
        clubRepository.save(usfa);

        Club etoile = new Club();
        etoile.setEmail("etoile@burkina.bf");
        etoile.setMotDePasse(passwordEncoder.encode("club123"));
        etoile.setNom("Étoile Filante");
        etoile.setPrenom("Direction");
        etoile.setRole(Role.CLUB);
        etoile.setNomStructure("Étoile Filante BF");
        etoile.setVille("Bobo-Dioulasso");
        etoile.setHistorique("Club historique de Bobo-Dioulasso, réputé pour sa formation de jeunes.");
        etoile.setBesoinsRecrutement("Pivot et Joueurs U18");
        etoile.setLicenceNumero("BF-CLUB-003");
        etoile.setStatutValidation("VALIDE");
        etoile.setEquipesEtCategories("Senior, U18, U15");
        clubRepository.save(etoile);

        // 2. Initialisation des Joueurs
        Joueur j1 = new Joueur();
        j1.setEmail("ibrahim.traore@fasohoops.bf");
        j1.setMotDePasse(passwordEncoder.encode("joueur123"));
        j1.setNom("Traoré");
        j1.setPrenom("Ibrahim");
        j1.setRole(Role.JOUEUR);
        j1.setPoste("Ailier Fort");
        j1.setTaille(2.02f);
        j1.setPoids(98.0f);
        j1.setDateNaissance(LocalDate.of(2001, 4, 15));
        j1.setNiveau("Senior");
        j1.setClubActuel("AS Douanes BF");
        j1.setLicenceNumero("BF-LIC-2024-001");
        joueurRepository.save(j1);

        Joueur j2 = new Joueur();
        j2.setEmail("moussa.ouattara@fasohoops.bf");
        j2.setMotDePasse(passwordEncoder.encode("joueur123"));
        j2.setNom("Ouattara");
        j2.setPrenom("Moussa");
        j2.setRole(Role.JOUEUR);
        j2.setPoste("Meneur");
        j2.setTaille(1.86f);
        j2.setPoids(79.0f);
        j2.setDateNaissance(LocalDate.of(2003, 11, 20));
        j2.setNiveau("Senior");
        j2.setClubActuel("USFA Basket");
        j2.setLicenceNumero("BF-LIC-2024-002");
        joueurRepository.save(j2);

        // Joueur Mineur pour tester la politique de protection des mineurs
        Joueur j3 = new Joueur();
        j3.setEmail("jeune.kaboro@fasohoops.bf");
        j3.setMotDePasse(passwordEncoder.encode("joueur123"));
        j3.setNom("Kaboré");
        j3.setPrenom("Yacouba");
        j3.setRole(Role.JOUEUR);
        j3.setPoste("Arrière");
        j3.setTaille(1.91f);
        j3.setPoids(75.0f);
        j3.setDateNaissance(LocalDate.now().minusYears(16)); // 16 ans
        j3.setNiveau("U18");
        j3.setClubActuel("Centre Formation Bobo");
        j3.setLicenceNumero("BF-LIC-2024-003");
        joueurRepository.save(j3);

        // 3. Initialisation des Offres de Recrutement
        Offre o1 = new Offre();
        o1.setTitre("Recrutement Ailier Fort Senior - LNBB");
        o1.setPosteRecherche("Ailier Fort");
        o1.setNiveau("Senior");
        o1.setDescription("Recherchons un Ailier Fort dynamique pour renforcer l'effectif en vue de la saison LNBB. Jeu intérieur et transition rapide requis.");
        o1.setVille("Ouagadougou");
        o1.setClub(douanes);
        o1.setStatut("ACTIVE");
        o1.setDatePublication(LocalDateTime.now().minusDays(2));
        o1.setDateExpiration(LocalDateTime.now().plusMonths(2));
        offreRepository.save(o1);

        Offre o2 = new Offre();
        o2.setTitre("Meneur de Jeu Expérimenté");
        o2.setPosteRecherche("Meneur");
        o2.setNiveau("Pro");
        o2.setDescription("L'USFA recrute un meneur leader, avec excellente vision de jeu et capacité d'organisation offensive.");
        o2.setVille("Ouagadougou");
        o2.setClub(usfa);
        o2.setStatut("ACTIVE");
        o2.setDatePublication(LocalDateTime.now().minusDays(5));
        o2.setDateExpiration(LocalDateTime.now().plusMonths(3));
        offreRepository.save(o2);

        Offre o3 = new Offre();
        o3.setTitre("Pivot Défensif / Protection de Cercle");
        o3.setPosteRecherche("Pivot");
        o3.setNiveau("Senior");
        o3.setDescription("Étoile Filante recrute un pivot dominant pour protéger le cercle et capter les rebonds clés.");
        o3.setVille("Bobo-Dioulasso");
        o3.setClub(etoile);
        o3.setStatut("ACTIVE");
        o3.setDatePublication(LocalDateTime.now().minusDays(7));
        o3.setDateExpiration(LocalDateTime.now().plusMonths(1));
        offreRepository.save(o3);

        // 4. Initialisation d'un Administrateur (FEBBA)
        Admin admin = new Admin();
        admin.setEmail("admin@febba.bf");
        admin.setMotDePasse(passwordEncoder.encode("admin123"));
        admin.setNom("FEBBA");
        admin.setPrenom("Admin");
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);

        // 5. Initialisation des Evénements
        Evenement evt1 = new Evenement();
        evt1.setTitre("Tournoi Inter-Ligues 2024");
        evt1.setDescription("Le grand tournoi annuel de la FEBBA.");
        evt1.setType("TOURNOI");
        evt1.setStatut("VALIDE");
        evt1.setLieu("Palais des Sports de Ouaga");
        evt1.setDateDebut(LocalDateTime.now().plusDays(10));
        evt1.setDateFin(LocalDateTime.now().plusDays(15));
        evt1.setCreateur(admin);
        evenementRepository.save(evt1);

        // 6. Demandes de licences
        DemandeLicence dl1 = new DemandeLicence();
        dl1.setClub(douanes);
        dl1.setSaison("2024-2025");
        dl1.setNombreJoueurs(15);
        dl1.setStatut("EN_ATTENTE");
        dl1.setCommentaireClub("Veuillez valider nos licences seniors");
        demandeLicenceRepository.save(dl1);

        // 7. Candidatures
        Candidature c1 = new Candidature();
        c1.setJoueur(j1);
        c1.setEvenement(evt1);
        c1.setMessage("Je souhaite participer avec mon équipe au tournoi.");
        c1.setStatut("EN_ATTENTE");
        candidatureRepository.save(c1);

        System.out.println("✅ Données de référence FasoHoops amorcées avec succès dans la base de données !");
    }
}
