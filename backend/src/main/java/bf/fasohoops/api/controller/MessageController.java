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
                String fullName = ((user.getPrenom() != null ? user.getPrenom() : "") + " " + (user.getNom() != null ? user.getNom() : "")).trim();
                if (fullName.isBlank()) fullName = user.getEmail();
                map.put("nom", fullName);
                map.put("email", user.getEmail());
                map.put("role", user.getRole() != null ? user.getRole().name() : "JOUEUR");
                map.put("initiale", fullName.length() > 0 ? fullName.substring(0, 1).toUpperCase() : "?");
                return map;
            }
            return null;
        }).filter(c -> c != null).collect(Collectors.toList());

        return ResponseEntity.ok(contacts);
    }

    // Récupérer l'annuaire des membres pour initier une nouvelle conversation
    @GetMapping("/contacts-disponibles")
    public ResponseEntity<List<Map<String, Object>>> getAvailableContacts(@RequestParam(required = false) UUID currentUserId) {
        List<AbstractUser> allUsers = userRepository.findAll();
        List<Map<String, Object>> directory = allUsers.stream()
            .filter(u -> currentUserId == null || !u.getId().equals(currentUserId))
            .map(u -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", u.getId());
                String fullName = ((u.getPrenom() != null ? u.getPrenom() : "") + " " + (u.getNom() != null ? u.getNom() : "")).trim();
                if (fullName.isBlank()) fullName = u.getEmail();
                map.put("nom", fullName);
                map.put("email", u.getEmail());
                map.put("role", u.getRole() != null ? u.getRole().name() : "JOUEUR");
                map.put("initiale", fullName.length() > 0 ? fullName.substring(0, 1).toUpperCase() : "?");
                return map;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(directory);
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
