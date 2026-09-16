package bf.fasohoops.api.controller;

import bf.fasohoops.api.entity.Notification;
import bf.fasohoops.api.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable UUID userId) {
        return ResponseEntity.ok(notificationRepository.findByUtilisateurIdOrderByDateCreationDesc(userId));
    }

    @PostMapping("/{id}/marquer-lue")
    public ResponseEntity<Void> marquerCommeLue(@PathVariable UUID id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setLue(true);
            notificationRepository.save(n);
        });
        return ResponseEntity.ok().build();
    }
}
