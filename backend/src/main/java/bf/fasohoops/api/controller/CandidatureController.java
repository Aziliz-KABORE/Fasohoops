package bf.fasohoops.api.controller;

import bf.fasohoops.api.entity.Candidature;
import bf.fasohoops.api.repository.CandidatureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/candidatures")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class CandidatureController {

    private final CandidatureRepository candidatureRepository;

    @GetMapping("/joueur/{joueurId}")
    public ResponseEntity<List<Candidature>> getCandidaturesParJoueur(@PathVariable UUID joueurId) {
        return ResponseEntity.ok(candidatureRepository.findByJoueurId(joueurId));
    }

    @PostMapping
    public ResponseEntity<Candidature> postuler(@RequestBody Candidature candidature) {
        candidature.setStatut("EN_ATTENTE");
        candidature.setDateCandidature(LocalDateTime.now());
        return ResponseEntity.ok(candidatureRepository.save(candidature));
    }
}
