package bf.fasohoops.api.controller;

import bf.fasohoops.api.entity.Club;
import bf.fasohoops.api.entity.Offre;
import bf.fasohoops.api.repository.ClubRepository;
import bf.fasohoops.api.repository.OffreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/offres")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class OffreController {

    private final OffreRepository offreRepository;
    private final ClubRepository clubRepository;

    @GetMapping
    public ResponseEntity<List<Offre>> getAllOffres(
            @RequestParam(required = false) String poste,
            @RequestParam(required = false) String niveau,
            @RequestParam(required = false) String ville
    ) {
        List<Offre> offres = offreRepository.findAll();

        List<Offre> filtered = offres.stream()
                .filter(o -> poste == null || poste.equalsIgnoreCase("Tous") || (o.getPosteRecherche() != null && o.getPosteRecherche().equalsIgnoreCase(poste)))
                .filter(o -> niveau == null || niveau.equalsIgnoreCase("Tous") || (o.getNiveau() != null && o.getNiveau().equalsIgnoreCase(niveau)))
                .filter(o -> ville == null || ville.equalsIgnoreCase("Toutes") || (o.getVille() != null && o.getVille().equalsIgnoreCase(ville)))
                .collect(Collectors.toList());

        return ResponseEntity.ok(filtered);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Offre> getOffreById(@PathVariable UUID id) {
        return offreRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> creerOffre(@RequestBody Offre offre, @RequestParam(required = false) UUID clubId) {
        if (clubId != null) {
            Club club = clubRepository.findById(clubId).orElse(null);
            if (club == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Club introuvable"));
            }
            if (!"VALIDE".equalsIgnoreCase(club.getStatutValidation())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Le club n'est pas encore validé par la FEBBA."));
            }
            offre.setClub(club);
        } else if (offre.getClub() == null) {
            // Assigner au premier club valide par défaut si non spécifié
            List<Club> clubs = clubRepository.findByStatutValidation("VALIDE");
            if (!clubs.isEmpty()) {
                offre.setClub(clubs.get(0));
            }
        }

        Offre saved = offreRepository.save(offre);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
