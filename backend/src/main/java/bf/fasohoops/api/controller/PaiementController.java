package bf.fasohoops.api.controller;

import bf.fasohoops.api.services.CinetPayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/paiement")
@RequiredArgsConstructor
public class PaiementController {

    private final CinetPayService cinetPayService;

    @PostMapping("/initier")
    public ResponseEntity<?> initierPaiement(@RequestBody Map<String, Object> body) {
        String plan = (String) body.getOrDefault("plan", "STARTER");
        int montant = body.containsKey("montant") ? ((Number) body.get("montant")).intValue() : 5000;
        String telephone = (String) body.getOrDefault("telephone", "+22670000000");
        String userEmail = (String) body.getOrDefault("userEmail", "client@fasohoops.bf");

        Map<String, Object> paiement = cinetPayService.initierPaiement(plan, montant, telephone, userEmail);
        return ResponseEntity.ok(paiement);
    }

    @PostMapping("/webhook")
    public ResponseEntity<Map<String, String>> recevoirNotification(
            @RequestBody(required = false) String payload,
            @RequestHeader(value = "X-Token", required = false) String token) {

        Map<String, String> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "Notification de paiement reçue et traitée avec succès");
        return ResponseEntity.ok(response);
    }
}
