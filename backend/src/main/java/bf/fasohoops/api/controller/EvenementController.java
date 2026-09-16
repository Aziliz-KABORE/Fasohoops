package bf.fasohoops.api.controller;

import bf.fasohoops.api.entity.Evenement;
import bf.fasohoops.api.repository.EvenementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/evenements")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class EvenementController {

    private final EvenementRepository evenementRepository;

    @GetMapping
    public ResponseEntity<List<Evenement>> getEvenementsValides() {
        return ResponseEntity.ok(evenementRepository.findByStatut("VALIDE"));
    }

    @PostMapping
    public ResponseEntity<Evenement> createEvenement(@RequestBody Evenement evenement) {
        evenement.setStatut("EN_ATTENTE"); // L'admin doit valider
        evenement.setDateCreation(LocalDateTime.now());
        return ResponseEntity.ok(evenementRepository.save(evenement));
    }
}
