package bf.fasohoops.api.controller;

import bf.fasohoops.api.entity.Club;
import bf.fasohoops.api.repository.ClubRepository;
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
public class AdminController {

    private final ClubRepository clubRepository;

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

    @GetMapping("/stats-nationales")
    public ResponseEntity<Map<String, Object>> getStatistiquesNationales() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalJoueursInscrits", 1450);
        stats.put("totalClubsAffilies", 42);
        stats.put("totalLicencesActives", 1280);
        stats.put("repartitionRegions", Map.of("Centre (Ouagadougou)", 680, "Hauts-Bassins (Bobo)", 420, "Autres ligues", 350));
        stats.put("repartitionCategories", Map.of("U15", 300, "U18", 520, "U20", 380, "Senior", 250));
        return ResponseEntity.ok(stats);
    }
}
