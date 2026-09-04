package bf.fasohoops.api.controller;

import bf.fasohoops.api.entity.Club;
import bf.fasohoops.api.entity.Offre;
import bf.fasohoops.api.repository.ClubRepository;
import bf.fasohoops.api.repository.OffreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/clubs")
@RequiredArgsConstructor
public class ClubController {

    private final ClubRepository clubRepository;
    private final OffreRepository offreRepository;

    @GetMapping
    public ResponseEntity<List<Club>> getAllClubs() {
        return ResponseEntity.ok(clubRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Club> getClubById(@PathVariable UUID id) {
        return clubRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/offres")
    public ResponseEntity<?> publierOffre(@PathVariable UUID id, @RequestBody Offre offre) {
        Club club = clubRepository.findById(id).orElse(null);
        if (club == null) {
            return ResponseEntity.notFound().build();
        }

        // FEBBA Validation rule: Club must be validated to publish offers
        if (!"VALIDE".equalsIgnoreCase(club.getStatutValidation())) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Votre compte club n'est pas encore validé par la FEBBA. Vous ne pouvez pas encore publier d'offre.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(err);
        }

        offre.setClub(club);
        Offre saved = offreRepository.save(offre);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}/equipes")
    public ResponseEntity<Club> updateEquipes(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        return clubRepository.findById(id).map(club -> {
            if (body.containsKey("equipesEtCategories")) {
                club.setEquipesEtCategories(body.get("equipesEtCategories"));
            }
            return ResponseEntity.ok(clubRepository.save(club));
        }).orElse(ResponseEntity.notFound().build());
    }
}
