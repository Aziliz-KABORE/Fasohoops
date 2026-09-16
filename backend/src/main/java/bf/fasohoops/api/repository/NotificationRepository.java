package bf.fasohoops.api.repository;

import bf.fasohoops.api.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findByUtilisateurIdOrderByDateCreationDesc(UUID utilisateurId);
}
