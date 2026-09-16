package bf.fasohoops.api.controller;

import bf.fasohoops.api.entity.DemandeLicence;
import bf.fasohoops.api.repository.DemandeLicenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/licences")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class DemandeLicenceController {

    private final DemandeLicenceRepository licenceRepository;

    @GetMapping("/club/{clubId}")
    public ResponseEntity<List<DemandeLicence>> getDemandesParClub(@PathVariable UUID clubId) {
        return ResponseEntity.ok(licenceRepository.findByClubId(clubId));
    }

    @PostMapping
    public ResponseEntity<DemandeLicence> creerDemande(@RequestBody DemandeLicence demande) {
        demande.setStatut("EN_ATTENTE");
        demande.setDateDemande(LocalDateTime.now());
        return ResponseEntity.ok(licenceRepository.save(demande));
    }
}
