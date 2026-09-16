package bf.fasohoops.api.repository;

import bf.fasohoops.api.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {
    
    @Query("SELECT m FROM Message m WHERE (m.expediteur.id = :userId AND m.destinataire.id = :contactId) OR (m.expediteur.id = :contactId AND m.destinataire.id = :userId) ORDER BY m.dateEnvoi ASC")
    List<Message> findConversation(@Param("userId") UUID userId, @Param("contactId") UUID contactId);

    @Query("SELECT DISTINCT u.id FROM AbstractUser u JOIN Message m ON (m.expediteur.id = u.id OR m.destinataire.id = u.id) WHERE (m.expediteur.id = :userId OR m.destinataire.id = :userId) AND u.id != :userId")
    List<UUID> findContactIdsForUser(@Param("userId") UUID userId);
}
