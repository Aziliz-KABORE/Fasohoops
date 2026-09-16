package bf.fasohoops.api.controller;

import bf.fasohoops.api.entity.Message;
import bf.fasohoops.api.entity.AbstractUser;
import bf.fasohoops.api.repository.MessageRepository;
import bf.fasohoops.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.HashMap;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class MessageController {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    // Récupérer la liste des contacts (personnes avec qui l'utilisateur a discuté)
    @GetMapping("/contacts/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getContacts(@PathVariable UUID userId) {
        List<UUID> contactIds = messageRepository.findContactIdsForUser(userId);
        
        List<Map<String, Object>> contacts = contactIds.stream().map(id -> {
            AbstractUser user = userRepository.findById(id).orElse(null);
            if (user != null) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", user.getId());
                map.put("nom", user.getEmail()); // Simplifié pour le moment, on ajustera avec le vrai nom
                map.put("role", user.getRole());
                return map;
            }
            return null;
        }).filter(c -> c != null).collect(Collectors.toList());

        return ResponseEntity.ok(contacts);
    }

    // Récupérer une conversation entre deux utilisateurs
    @GetMapping("/conversation")
    public ResponseEntity<List<Message>> getConversation(@RequestParam UUID userId, @RequestParam UUID contactId) {
        List<Message> messages = messageRepository.findConversation(userId, contactId);
        // Marquer comme lus les messages du contact vers le user
        boolean updated = false;
        for (Message m : messages) {
            if (m.getExpediteur().getId().equals(contactId) && !m.isLu()) {
                m.setLu(true);
                updated = true;
            }
        }
        if (updated) {
            messageRepository.saveAll(messages);
        }
        return ResponseEntity.ok(messages);
    }

    // Envoyer un message
    @PostMapping
    public ResponseEntity<Message> sendMessage(@RequestBody Map<String, String> payload) {
        UUID expediteurId = UUID.fromString(payload.get("expediteurId"));
        UUID destinataireId = UUID.fromString(payload.get("destinataireId"));
        String contenu = payload.get("contenu");

        AbstractUser expediteur = userRepository.findById(expediteurId).orElseThrow();
        AbstractUser destinataire = userRepository.findById(destinataireId).orElseThrow();

        Message msg = new Message();
        msg.setExpediteur(expediteur);
        msg.setDestinataire(destinataire);
        msg.setContenu(contenu);
        
        return ResponseEntity.ok(messageRepository.save(msg));
    }
}
