package bf.fasohoops.api.controller;

import bf.fasohoops.api.entity.Joueur;
import bf.fasohoops.api.repository.JoueurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/joueurs")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class JoueurController {

    private final JoueurRepository joueurRepository;

    @GetMapping
    public ResponseEntity<List<Joueur>> searchJoueurs(
            @RequestParam(required = false) String poste,
            @RequestParam(required = false) String niveau,
            @RequestParam(required = false) String club,
            @RequestParam(required = false, defaultValue = "false") boolean requestorIsVerified
    ) {
        List<Joueur> joueurs = joueurRepository.searchJoueurs(poste, niveau, club);

        // Apply Minor Protection policy: mask email if player is under 18 and requester is not verified
        List<Joueur> safeJoueurs = joueurs.stream().map(j -> {
            if (j.isMineur() && !requestorIsVerified) {
                j.setEmail("*****@mineur-protege.bf");
            }
            return j;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(safeJoueurs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Joueur> getJoueurById(
            @PathVariable UUID id,
            @RequestParam(required = false, defaultValue = "false") boolean requestorIsVerified
    ) {
        return joueurRepository.findById(id).map(j -> {
            if (j.isMineur() && !requestorIsVerified) {
                j.setEmail("*****@mineur-protege.bf");
            }
            return ResponseEntity.ok(j);
        }).orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/{id}")
    public ResponseEntity<Joueur> updateJoueur(@PathVariable UUID id, @RequestBody Joueur updatedData) {
        return joueurRepository.findById(id).map(j -> {
            if (updatedData.getTaille() != null) j.setTaille(updatedData.getTaille());
            if (updatedData.getPoids() != null) j.setPoids(updatedData.getPoids());
            if (updatedData.getBio() != null) j.setBio(updatedData.getBio());
            if (updatedData.getPhotoUrl() != null) j.setPhotoUrl(updatedData.getPhotoUrl());
            // Add other fields to update as necessary
            return ResponseEntity.ok(joueurRepository.save(j));
        }).orElse(ResponseEntity.notFound().build());
    }
}
