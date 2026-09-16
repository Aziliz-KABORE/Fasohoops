package bf.fasohoops.api.controller;

import bf.fasohoops.api.entity.Club;
import bf.fasohoops.api.entity.Evenement;
import bf.fasohoops.api.entity.DemandeLicence;
import bf.fasohoops.api.repository.ClubRepository;
import bf.fasohoops.api.repository.JoueurRepository;
import bf.fasohoops.api.repository.EvenementRepository;
import bf.fasohoops.api.repository.DemandeLicenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class AdminController {

    private final ClubRepository clubRepository;
    private final JoueurRepository joueurRepository;
    private final EvenementRepository evenementRepository;
    private final DemandeLicenceRepository licenceRepository;

    @GetMapping("/validations/clubs")
    public ResponseEntity<List<Club>> getPendingClubs() {
        return ResponseEntity.ok(clubRepository.findByStatutValidation("EN_ATTENTE"));
    }

    @PostMapping("/validations/clubs/{id}/approuver")
    public ResponseEntity<Map<String, String>> approuverClub(@PathVariable UUID id) {
        return clubRepository.findById(id).map(club -> {
            club.setStatutValidation("VALIDE");
            clubRepository.save(club);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Le compte club a été validé avec succès par la FEBBA.");
            response.put("statut", "VALIDE");
            return ResponseEntity.ok(response);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/validations/clubs/{id}/refuser")
    public ResponseEntity<Map<String, String>> refuserClub(@PathVariable UUID id) {
        return clubRepository.findById(id).map(club -> {
            club.setStatutValidation("REFUSE");
            clubRepository.save(club);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Le compte club a été refusé.");
            response.put("statut", "REFUSE");
            return ResponseEntity.ok(response);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalClubs", clubRepository.count());
        stats.put("totalJoueurs", joueurRepository.count());
        stats.put("demandesLicenceEnAttente", licenceRepository.findByStatut("EN_ATTENTE").size());
        stats.put("evenementsEnAttente", evenementRepository.findByStatut("EN_ATTENTE").size());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/licences/en-attente")
    public ResponseEntity<List<DemandeLicence>> getLicencesEnAttente() {
        return ResponseEntity.ok(licenceRepository.findByStatut("EN_ATTENTE"));
    }

    @PutMapping("/licences/{id}/valider")
    public ResponseEntity<DemandeLicence> validerLicence(@PathVariable UUID id) {
        DemandeLicence licence = licenceRepository.findById(id).orElseThrow();
        licence.setStatut("VALIDE");
        return ResponseEntity.ok(licenceRepository.save(licence));
    }
    
    @PutMapping("/evenements/{id}/valider")
    public ResponseEntity<Evenement> validerEvenement(@PathVariable UUID id) {
        Evenement evt = evenementRepository.findById(id).orElseThrow();
        evt.setStatut("VALIDE");
        return ResponseEntity.ok(evenementRepository.save(evt));
    }
}
